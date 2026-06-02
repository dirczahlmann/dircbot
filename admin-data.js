// netlify/functions/admin-data.js (v2)
//
// CHANGES FROM v1:
//   + new view=pending-signups endpoint: reads existing dircbot-tester-signup form
//     so admin can see who has applied but not yet got a personal code
//   + ENV var DIRCBOT_SIGNUP_FORM_ID (in addition to existing ones)
//
// Views:
//   ?view=overview         → stats + tester list
//   ?view=chats&email=…    → chat history for one tester
//   ?view=export           → JSON dump of everything
//   ?view=pending-signups  → applicants from dircbot-tester-signup (NEW)
//
// ENV: NETLIFY_API_TOKEN, DIRC_CODES_FORM_ID, DIRC_MESSAGES_FORM_ID,
//      ADMIN_DASHBOARD_KEY, DIRCBOT_SIGNUP_FORM_ID (NEW)

const NETLIFY_API_BASE = 'https://api.netlify.com/api/v1';

// Anthropic prices per 1M tokens (Stand 2026, USD)
const MODEL_PRICES = {
  'claude-haiku-4-5': { input: 1.00, output: 5.00 },
  'claude-haiku-4-5-20251001': { input: 1.00, output: 5.00 },
  'claude-sonnet-4-6': { input: 3.00, output: 15.00 },
  'claude-opus-4-7': { input: 15.00, output: 75.00 },
  'claude-opus-4-8': { input: 15.00, output: 75.00 },
  'haiku': { input: 1.00, output: 5.00 },
  'sonnet': { input: 3.00, output: 15.00 },
  'opus': { input: 15.00, output: 75.00 },
  'gpt-4o': { input: 2.50, output: 10.00 },
  'unknown': { input: 3.00, output: 15.00 },
};

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const params = event.queryStringParameters || {};
    const adminKey = params.key || (event.headers.authorization || '').replace('Bearer ', '');

    if (!adminKey || adminKey !== process.env.ADMIN_DASHBOARD_KEY) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Unauthorized — admin key required' }),
      };
    }

    const view = params.view || 'overview';

    if (view === 'overview') {
      return await getOverview(headers);
    }
    if (view === 'chats') {
      return await getChats(params.email, headers);
    }
    if (view === 'export') {
      return await exportAll(headers);
    }
    if (view === 'pending-signups') {
      return await getPendingSignups(headers);
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Unknown view. Use ?view=overview|chats|export|pending-signups' }),
    };
  } catch (err) {
    console.error('admin-data error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

// ============ NEW: pending-signups — applicants without personal codes yet ============
async function getPendingSignups(headers) {
  const token = process.env.NETLIFY_API_TOKEN;
  const signupFormId = process.env.DIRCBOT_SIGNUP_FORM_ID;

  if (!token || !signupFormId) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        pending: [],
        note: 'DIRCBOT_SIGNUP_FORM_ID not configured — set this ENV var to enable pending-signups view',
      }),
    };
  }

  try {
    const url = `${NETLIFY_API_BASE}/forms/${signupFormId}/submissions?per_page=200`;
    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resp.ok) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ pending: [], error: `Netlify API ${resp.status}` }),
      };
    }

    const submissions = await resp.json();

    // Normalize each submission to a uniform shape
    const pending = submissions.map(s => {
      const d = s.data || {};
      return {
        id: s.id,
        firstName: d.first_name || d.firstName || d.name || '',
        lastName: d.last_name || d.lastName || '',
        email: d.email || '',
        telegram: normalizeTelegram(d.telegram || d.telegram_handle || ''),
        instagram: d.instagram || '',
        interest: d.primary_interest || d.interest || '',
        country: d.country || '',
        challenge: d.challenge || '',
        motivation: d.motivation || '',
        consent_privacy: d.consent_privacy || '',
        consent_ai: d.consent_ai || '',
        consent_affiliate: d.consent_affiliate || '',
        consent_marketing: d.consent_marketing || '',
        created_at: d.created_at || s.created_at || '',
        // Convenience: full name for UI
        name: `${(d.first_name || d.firstName || '').trim()} ${(d.last_name || d.lastName || '').trim()}`.trim(),
      };
    });

    // Sort newest first
    pending.sort((a, b) => {
      const da = new Date(a.created_at || 0).getTime();
      const db = new Date(b.created_at || 0).getTime();
      return db - da;
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ pending, total: pending.length }),
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ pending: [], error: err.message }),
    };
  }
}

// Ensure telegram handle starts with @ if not empty
function normalizeTelegram(raw) {
  const t = (raw || '').toString().trim();
  if (!t) return '';
  // Already has @ or looks like a URL → leave as-is
  if (t.startsWith('@') || t.startsWith('http')) return t;
  return '@' + t.replace(/^[@\s]+/, '');
}

// ============ Overview ============
async function getOverview(headers) {
  const [codes, messages] = await Promise.all([
    fetchAll('DIRC_CODES_FORM_ID'),
    fetchAll('DIRC_MESSAGES_FORM_ID'),
  ]);

  const messagesByEmail = {};
  let totalCost = 0;
  const costByModel = { haiku: 0, sonnet: 0, opus: 0, other: 0 };
  let messagesLast24h = 0;
  let messagesLast7d = 0;

  const now = Date.now();
  const ms24h = 24 * 60 * 60 * 1000;
  const ms7d = 7 * ms24h;

  for (const m of messages) {
    const email = (m.email || '').toLowerCase();
    if (!messagesByEmail[email]) messagesByEmail[email] = [];
    messagesByEmail[email].push(m);

    const cost = calculateCost(m);
    totalCost += cost;

    const label = (m.model_label || '').toLowerCase();
    if (label.includes('haiku')) costByModel.haiku += cost;
    else if (label.includes('sonnet')) costByModel.sonnet += cost;
    else if (label.includes('opus')) costByModel.opus += cost;
    else costByModel.other += cost;

    const ts = parseDate(m.timestamp);
    if (ts && (now - ts) < ms24h) messagesLast24h++;
    if (ts && (now - ts) < ms7d) messagesLast7d++;
  }

  const testers = codes.map(c => {
    const email = (c.email || '').toLowerCase();
    const userMessages = messagesByEmail[email] || [];
    const userCost = userMessages.reduce((sum, m) => sum + calculateCost(m), 0);
    const lastMsg = userMessages.length > 0
      ? userMessages.reduce((latest, m) => {
          const ts = parseDate(m.timestamp);
          return (ts && (!latest || ts > latest)) ? ts : latest;
        }, null)
      : null;

    return {
      code: c.code,
      name: c.name,
      lastName: c.lastName || '',
      email: c.email,
      telegram: c.telegram || '',
      interest: c.interest || '',
      country: c.country || '',
      language: c.language || 'de',
      status: c.status || 'active',
      source: c.source || 'personal',
      created: c.created,
      messageLimit: parseInt(c.messageLimit || '500', 10),
      messageCount: userMessages.length,
      totalCost: roundCost(userCost),
      lastActivity: lastMsg ? new Date(lastMsg).toISOString() : null,
    };
  });

  testers.sort((a, b) => {
    if (!a.lastActivity) return 1;
    if (!b.lastActivity) return -1;
    return new Date(b.lastActivity) - new Date(a.lastActivity);
  });

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      stats: {
        totalTesters: testers.length,
        activeTesters: testers.filter(t => t.status === 'active').length,
        totalMessages: messages.length,
        messagesLast24h,
        messagesLast7d,
        totalCost: roundCost(totalCost),
        costByModel: {
          haiku: roundCost(costByModel.haiku),
          sonnet: roundCost(costByModel.sonnet),
          opus: roundCost(costByModel.opus),
          other: roundCost(costByModel.other),
        },
      },
      testers,
    }),
  };
}

async function getChats(email, headers) {
  if (!email) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'email parameter required' }),
    };
  }

  const messages = await fetchAll('DIRC_MESSAGES_FORM_ID');
  const normalized = email.toLowerCase();
  const userMessages = messages
    .filter(m => (m.email || '').toLowerCase() === normalized)
    .map(m => ({
      timestamp: m.timestamp,
      model: m.model_label,
      question: m.question,
      answer: m.answer,
      tokens_in: parseInt(m.tokens_in || '0', 10),
      tokens_out: parseInt(m.tokens_out || '0', 10),
      cost: roundCost(calculateCost(m)),
    }))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      email,
      messages: userMessages,
      totalMessages: userMessages.length,
      totalCost: roundCost(userMessages.reduce((sum, m) => sum + m.cost, 0)),
    }),
  };
}

async function exportAll(headers) {
  const [codes, messages] = await Promise.all([
    fetchAll('DIRC_CODES_FORM_ID'),
    fetchAll('DIRC_MESSAGES_FORM_ID'),
  ]);

  return {
    statusCode: 200,
    headers: {
      ...headers,
      'Content-Disposition': `attachment; filename="dircbot-export-${new Date().toISOString().slice(0,10)}.json"`,
    },
    body: JSON.stringify({
      exportedAt: new Date().toISOString(),
      codes,
      messages,
    }, null, 2),
  };
}

async function fetchAll(envFormIdName) {
  const token = process.env.NETLIFY_API_TOKEN;
  const formId = process.env[envFormIdName];
  if (!token || !formId) {
    console.error('Missing ENV:', envFormIdName);
    return [];
  }

  const url = `${NETLIFY_API_BASE}/forms/${formId}/submissions?per_page=1000`;
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) {
    console.error('Netlify API error for', envFormIdName, ':', resp.status);
    return [];
  }
  const submissions = await resp.json();
  return submissions.map(s => s.data || {});
}

function calculateCost(m) {
  const label = (m.model_label || 'unknown').toLowerCase();
  let price = MODEL_PRICES[label];
  if (!price) {
    for (const key of Object.keys(MODEL_PRICES)) {
      if (label.includes(key)) {
        price = MODEL_PRICES[key];
        break;
      }
    }
  }
  if (!price) price = MODEL_PRICES['unknown'];

  const tin = parseInt(m.tokens_in || '0', 10);
  const tout = parseInt(m.tokens_out || '0', 10);
  return (tin * price.input + tout * price.output) / 1_000_000;
}

function roundCost(n) {
  return Math.round(n * 10000) / 10000;
}

function parseDate(s) {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d.getTime();
}
