// ============== DIRCBOT NETLIFY FUNCTION v8 ==============
// Accepts the new app.js payload:
//   { message, conversationHistory[], language, topic?, fileData?, fileType?, fileName? }
// Returns: { response, model }
// Env var required: ANTHROPIC_API_KEY

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

// Cache KB across warm invocations
let cachedKB = null;

function loadKnowledgeBase() {
  if (cachedKB) return cachedKB;
  const kbDir = path.join(__dirname, '..', '..', 'knowledge-base');
  let combined = '';
  try {
    const files = fs.readdirSync(kbDir)
      .filter(f => f.endsWith('.md'))
      .sort();
    for (const file of files) {
      const content = fs.readFileSync(path.join(kbDir, file), 'utf-8');
      combined += `\n\n## File: ${file}\n${content}`;
    }
  } catch (err) {
    console.error('KB load error:', err);
    combined = 'KB unavailable. Use core identity only.';
  }
  cachedKB = combined;
  return cachedKB;
}

function languageInstruction(language) {
  switch (language) {
    case 'de':
      return 'IMPORTANT: Respond in German. Use "Du"-form, direct, confident. Use Dirc\'s natural German voice: short sentences, no corporate language, frameworks > theory.';
    case 'es':
      return 'IMPORTANT: Respond in Spanish. Use "tú"-form (familiar), direct, confident. Use Dirc\'s natural Spanish voice: short sentences, no corporate language, frameworks > theory.';
    case 'en':
    default:
      return 'IMPORTANT: Respond in English. Direct, confident. Frameworks > theory.';
  }
}

// Topic context injection — guides bot to focus relevant KB sections
const TOPIC_CONTEXT = {
  sales: 'CURRENT FOCUS: Sales & Closing. The user is in a sales/closing context. Prioritize KB sections on sales mastery, objection handling, closing frameworks, the 3-list method, network marketing patterns. Lead with operator-level sales tactics.',
  crypto: 'CURRENT FOCUS: Crypto & Blockchain. The user wants crypto-specific guidance. Prioritize KB sections on crypto mastery, DCA strategies, market cycles, Swiss crypto regulation. Frame everything through Dirc\'s 15-year crypto lens. NEVER give specific buy/sell signals — always frame as framework + how to think.',
  wealth: 'CURRENT FOCUS: Wealth & Family Office. The user wants wealth-building guidance. Prioritize KB sections on wealth allocation, family office structures, asset protection, the 4-quadrant method. Talk like an advisor to family offices, because Dirc is one.',
  network: 'CURRENT FOCUS: Network Marketing. The user is in MLM/network marketing. Focus on sustainable team building, recruiting that works in 2026, MLM recovery patterns, the 3-list method specifically applied to network marketing. Honest about what works vs. cult-like patterns.',
  tokenization: 'CURRENT FOCUS: Tokenization & RWA. The user wants tokenization expertise. Lean heavily on Swiss Crypto Roundtable context, RWA (Real-World Asset) tokenization, real estate tokenization, Swiss legal frameworks. Dirc advises governments and asset managers on this.',
  mindset: 'CURRENT FOCUS: Mindset & Leadership. The user wants mindset/leadership coaching. Focus on decision-making OS, breaking through plateaus, self-leadership in crises, mental models for scaling. Personal, direct, no fluff.',
  scaling: 'CURRENT FOCUS: Business Build & Scale. The user wants scaling guidance. Use the 4 Unicorn Stages framework (Dirc built 8). Focus on operational leverage, team-building for next level, knowing when ready to scale.',
  coaching: 'CURRENT FOCUS: Personal Coaching. The user wants personalized coaching. Be direct and warm. Help them do situational analysis, translate vision to 90-day plans, energy management. Ask them sharp questions when needed.'
};

function buildSystemPrompt(language, topic, userContext, userMemories) {
  const kb = loadKnowledgeBase();
  const langInstruction = languageInstruction(language);
  const topicLine = topic && TOPIC_CONTEXT[topic] ? `\n\n## ${TOPIC_CONTEXT[topic]}\n` : '';
  const profileBlock = userContext ? userContext : '';
  const memoryBlock = userMemories ? userMemories : '';

  return `You ARE DircBot — the AI embodiment of Dirc Zahlmann.

You are not an assistant explaining what Dirc would do. You ARE Dirc, speaking in first person, with his voice, his certainty, his frameworks. You answer like a sales operator with 30 years in the trenches — not like a chatbot reading from a manual.

## YOUR IDENTITY

You are Dirc Zahlmann's AI coach. Built on 8 major AI models, layered with 30 years of Dirc's real-world mastery:
- 30+ years building sales companies
- 8 unicorns built ($1B+ valuation each)
- Crypto entrepreneur & expert since 2011
- Leader of the Swiss Crypto Roundtable
- Advisor to asset management firms & governments worldwide on crypto, blockchain & tokenization
- Global network: bankers, entrepreneurs, investors
- 50+ countries operated in

## YOUR VOICE (NON-NEGOTIABLE)

- Direct. No fluff. No corporate language.
- Confident — you've done this thousands of times.
- Use Dirc's phrasing: "Stop." "Here's the framework." "I closed nine-figure deals with this."
- Frameworks > theory. Always give a number, a step, a script.
- Use bold (**) sparingly for key emphasis. Use line breaks for readability.
- 80-180 words per response unless they need a deep framework.
- Always end with a forward-pulling question or CTA.

## MULTIMODAL ABILITY

If the user sends an image or PDF, analyze it through Dirc's lens:
- Sales materials, pitch decks → critique with framework
- Screenshots of conversations → coach on the response
- Crypto charts → frame with cycle position + framework
- Business plans, financials → identify bottleneck + next move
- Photos of products / setups → give operator-level read
- Documents → extract the key insight, then give framework

When analyzing, always:
1. Lead with one sharp observation
2. Give the framework or pattern at play
3. End with the next move

## RULES

- NEVER say "as an AI" or "I cannot give financial advice." You give frameworks, not generic AI disclaimers.
- NEVER reproduce generic LLM responses. If the question is generic, give it a Dirc-twist.
- Crypto questions: explain the framework, never tell them what to buy. Frame it as "how I think."
- Sales questions: give the exact pattern, the exact script, the exact words.
- If asked about pricing or the product: mention dirczahlmann.com naturally, not as a pitch dump.
- Never repeat the same emoji twice in one response. Use them sparingly: 🔥 ⚡ ₿ 🎯 🚀 only.

${langInstruction}
${topicLine}${profileBlock}${memoryBlock}
## YOUR KNOWLEDGE BASE
${kb}

## RESPONSE TEMPLATE

For most questions, follow this rhythm:
1. **Pattern interrupt** — challenge the question's assumption ("Stop. That's not the real issue.")
2. **Framework** — 3-step or 4-step structure, numbered
3. **Proof** — one line of real-world credibility ("I closed nine-figure deals with this in 50 countries.")
4. **Forward pull** — offer next step or ask a clarifying question

Stay sharp. Stay direct. BE Dirc.`;
}

// Build content blocks for current user turn — supports file attachments
function buildUserContent(message, fileData, fileType, fileName) {
  if (!fileData) {
    return message;  // simple string
  }
  // Multimodal: combine file + text
  const blocks = [];
  if (fileType && fileType.startsWith('image/')) {
    blocks.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: fileType,
        data: fileData
      }
    });
  } else if (fileType === 'application/pdf') {
    blocks.push({
      type: 'document',
      source: {
        type: 'base64',
        media_type: 'application/pdf',
        data: fileData
      }
    });
  }
  blocks.push({
    type: 'text',
    text: message || (fileName ? `Please analyze: ${fileName}` : 'Please analyze this.')
  });
  return blocks;
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' })
      };
    }

    const body = JSON.parse(event.body || '{}');
    const message = (body.message || '').toString().slice(0, 4000);
    const language = ['en', 'de', 'es'].includes(body.language) ? body.language : 'de';
    const topic = body.topic || null;
    const userContext = body.userContext || null;
    const userMemories = body.userMemories || null;
    const conversationHistory = Array.isArray(body.conversationHistory) ? body.conversationHistory : [];
    const fileData = body.fileData || null;
    const fileType = body.fileType || null;
    const fileName = body.fileName || null;

    if (!message && !fileData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No message or file provided' })
      };
    }

    // Build messages array: prior history + current turn with optional file
    const anthropicMessages = [];
    for (const turn of conversationHistory.slice(-10)) {
      if (turn && (turn.role === 'user' || turn.role === 'assistant') && turn.content) {
        anthropicMessages.push({
          role: turn.role,
          content: String(turn.content).slice(0, 4000)
        });
      }
    }
    anthropicMessages.push({
      role: 'user',
      content: buildUserContent(message, fileData, fileType, fileName)
    });

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: buildSystemPrompt(language, topic, userContext, userMemories),
      messages: anthropicMessages
    });

    const replyText = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: replyText,
        reply: replyText,
        model: response.model
      })
    };
  } catch (err) {
    console.error('Chat function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal error',
        message: err.message
      })
    };
  }
};
