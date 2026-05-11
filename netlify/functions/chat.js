// ============== DIRCBOT NETLIFY FUNCTION ==============
// Calls Claude API with full knowledge base.
// Supports: text, images (PNG/JPG/GIF/WebP), PDFs.
// Languages: English, German, Spanish.
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
      return 'IMPORTANT: Respond in Spanish. Use "tú"-form (familiar), direct, confident. Use Dirc\'s natural Spanish voice: short sentences, no corporate language, frameworks > theory. Adapt cultural references appropriately.';
    case 'en':
    default:
      return 'IMPORTANT: Respond in English. Direct, confident. Frameworks > theory.';
  }
}

function buildSystemPrompt(language) {
  const kb = loadKnowledgeBase();
  const langInstruction = languageInstruction(language);

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
- If asked about pricing or the product: mention n3xus.de presale naturally, not as a pitch dump.
- Never repeat the same emoji twice in one response. Use them sparingly: 🔥 ⚡ ₿ 🎯 🚀 only.

${langInstruction}

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
    const messages = body.messages || [];
    const language = ['en','de','es'].includes(body.language) ? body.language : 'de';

    if (!messages.length) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No messages provided' })
      };
    }

    // Pass through messages as-is — content can be string or array of blocks
    const anthropicMessages = messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role, content: m.content }));

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: buildSystemPrompt(language),
      messages: anthropicMessages
    });

    const reply = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply })
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
