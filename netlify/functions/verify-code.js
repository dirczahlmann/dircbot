// netlify/functions/verify-code.js (v2)
//
// CHANGES FROM v1:
//   + create accepts: name, email, lastName, telegram, interest, country, language
//   + All passed fields are written to dirc-codes form for context preservation
//   + verify response now includes lastName, telegram, interest, country, language
//   + Language auto-detection from country if not explicitly passed
//
// Two modes:
// 1. action=verify  → checks if a code is valid (for bot login)
// 2. action=create  → creates a new unique tester code (admin invite/migrate)
//
// Data source: Netlify Forms "dirc-codes"
// ENV: NETLIFY_API_TOKEN, DIRC_CODES_FORM_ID, ADMIN_DASHBOARD_KEY

const NETLIFY_API_BASE = 'https://api.netlify.com/api/v1';

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
    const body = event.body ? JSON.parse(event.body) : {};
    const action = body.action || event.queryStringParameters?.action;

    if (action === 'verify') {
      return await verifyCode(body, headers);
    }
    if (action === 'create') {
      return await createCode(body, headers);
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Unknown action. Use action=verify or action=create.' }),
    };
  } catch (err) {
    console.error('verify-code error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Internal error' }),
    };
  }
};

// ============ VERIFY: check existing code ============
async function verifyCode(body, headers) {
  const { code } = body;
  if (!code || typeof code !== 'string') {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ valid: false, reason: 'No code provided' }),
    };
  }

  const codes = await fetchAllCodes();
  const normalized = code.trim().toUpperCase();
  const match = codes.find(c => (c.code || '').trim().toUpperCase() === normalized);

  if (!match) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ valid: false, reason: 'Code not found' }),
    };
  }

  if (match.status === 'paused' || match.status === 'expired' || match.status === 'revoked') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        valid: false,
        reason: `Code is ${match.status}`,
        status: match.status,
      }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      valid: true,
      code: match.code,
      name: match.name || 'Tester',
      lastName: match.lastName || '',
      email: match.email || '',
      telegram: match.telegram || '',
      interest: match.interest || '',
      country: match.country || '',
      language: match.language || 'de',
      source: match.source || 'personal',
      messageLimit: parseInt(match.messageLimit || '500', 10),
      status: match.status || 'active',
    }),
  };
}

// ============ CREATE: generate new unique code ============
async function createCode(body, headers) {
  const { adminKey, email, name } = body;

  if (!adminKey || adminKey !== process.env.ADMIN_DASHBOARD_KEY) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: 'Unauthorized — admin key required' }),
    };
  }

  if (!email || !name) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'email and name are required' }),
    };
  }

  // Optional context from existing tester-signup migration
  const lastName = (body.lastName || '').toString().trim();
  const telegram = (body.telegram || '').toString().trim();
  const interest = (body.interest || '').toString().trim();
  const country = (body.country || '').toString().trim();
  const language = guessLanguage(body.language, country);

  // Check for existing code on this email
  const codes = await fetchAllCodes();
  const existing = codes.find(c => (c.email || '').toLowerCase() === email.toLowerCase());
  if (existing) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: false,
        reason: 'Email already has a code',
        existingCode: existing.code,
      }),
    };
  }

  // Generate confusion-safe code: DIRC-XXXX-XXXX (no 0/O/1/I)
  const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const seg = () => Array.from({ length: 4 }, () =>
    ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  ).join('');
  const newCode = `DIRC-${seg()}-${seg()}`;

  // Write to dirc-codes form
  const formData = new URLSearchParams({
    'form-name': 'dirc-codes',
    code: newCode,
    email: email,
    name: name,
    lastName: lastName,
    telegram: telegram,
    interest: interest,
    country: country,
    language: language,
    status: 'active',
    source: 'personal',
    created: new Date().toISOString(),
    messageLimit: '500',
  });

  const siteUrl = process.env.URL || process.env.DEPLOY_URL || 'https://dircbot.netlify.app';
  const submitResp = await fetch(`${siteUrl}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  });

  if (!submitResp.ok && submitResp.status !== 200) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to register code in Netlify Forms' }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      code: newCode,
      email,
      name,
      lastName,
      telegram,
      interest,
      country,
      language,
      created: new Date().toISOString(),
    }),
  };
}

// Language detection: prefer explicit, fallback to country heuristic
function guessLanguage(explicit, country) {
  if (explicit && ['de', 'en', 'es'].includes(explicit.toLowerCase())) {
    return explicit.toLowerCase();
  }
  const c = (country || '').toLowerCase();
  if (!c) return 'de'; // default = de (majority of testers)

  // German-speaking
  if (/deutschland|österreich|osterreich|schweiz|austria|switzerland|germany|de\b|at\b|ch\b/.test(c)) return 'de';
  // Spanish-speaking
  if (/españa|espana|spain|mexico|méxico|argentina|chile|colombia|peru|perú|venezuela|es\b|mx\b/.test(c)) return 'es';
  // Everything else (Finland, Canada, UAE, Paris, Georgien, Italien, etc.) → en
  return 'en';
}

// ============ Helper: load all codes from Netlify Forms API ============
async function fetchAllCodes() {
  const token = process.env.NETLIFY_API_TOKEN;
  const formId = process.env.DIRC_CODES_FORM_ID;

  if (!token || !formId) {
    console.error('Missing ENV: NETLIFY_API_TOKEN or DIRC_CODES_FORM_ID');
    return [];
  }

  const url = `${NETLIFY_API_BASE}/forms/${formId}/submissions?per_page=1000`;
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!resp.ok) {
    console.error('Netlify API error:', resp.status, await resp.text());
    return [];
  }

  const submissions = await resp.json();
  return submissions.map(s => s.data || {});
}
