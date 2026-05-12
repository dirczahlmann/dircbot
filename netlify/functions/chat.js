// ============== DIRCBOT NETLIFY FUNCTION v8 ==============
// Accepts the new app.js payload:
//   { message, conversationHistory[], language, topic?, fileData?, fileType?, fileName? }
// Returns: { response, model }
// Env var required: ANTHROPIC_API_KEY

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

// Lazy require of @netlify/blobs (may not exist in local dev without netlify dev)
let getStoreFn = null;
let connectLambdaFn = null;
try {
  const blobs = require('@netlify/blobs');
  getStoreFn = blobs.getStore;
  connectLambdaFn = blobs.connectLambda;
} catch (e) { /* netlify-blobs unavailable */ }

// Track whether we've initialised Blobs context for this Lambda execution
let blobsInitialised = false;
function ensureBlobsContext(event) {
  if (blobsInitialised) return true;
  if (!getStoreFn) return false;
  if (connectLambdaFn) {
    try {
      connectLambdaFn(event);
      blobsInitialised = true;
      return true;
    } catch (e) {
      // fall through to manual config
    }
  }
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  if (siteID && token) {
    blobsInitialised = true;
    return true; // we'll pass siteID/token at getStore call time
  }
  return false;
}

function getBlobStore() {
  if (!getStoreFn) return null;
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  if (siteID && token) {
    return getStoreFn({ name: 'dircbot-kb', siteID, token });
  }
  return getStoreFn({ name: 'dircbot-kb' });
}

// Cache KB across warm invocations
let cachedKB = null;
let kbStats = null; // metadata: per-file token estimates, useful for admin
let kbCacheExpiry = 0; // refresh blob KB every 30s so admin uploads show up

// Rough token estimate: ~4 chars per token for english/german text (Anthropic's tokenizer ratio)
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

// Hard budget: don't let total KB exceed 80k tokens (leaves 120k+ for chat history, output, system base)
const KB_TOKEN_BUDGET = 80000;

let pdfParsePromise = null;
async function loadKnowledgeBase() {
  const now = Date.now();
  // Cache valid for 30s — so newly-uploaded files via admin UI propagate quickly without overwhelming Blobs API
  if (cachedKB && now < kbCacheExpiry) return cachedKB;
  if (pdfParsePromise && now < kbCacheExpiry) return pdfParsePromise;

  pdfParsePromise = (async () => {
    const kbDir = path.join(__dirname, '..', '..', 'knowledge-base');
    const pdfDir = path.join(kbDir, 'pdfs');
    let combined = '';
    let perFile = [];

    // === 1. Markdown files from repo (existing flow, immutable per deploy) ===
    try {
      const files = fs.readdirSync(kbDir)
        .filter(f => f.endsWith('.md'))
        .sort();
      for (const file of files) {
        const content = fs.readFileSync(path.join(kbDir, file), 'utf-8');
        const tokens = estimateTokens(content);
        combined += `\n\n## File: ${file}\n${content}`;
        perFile.push({ file: file, type: 'md', source: 'repo', tokens: tokens, chars: content.length });
      }
    } catch (err) {
      console.error('KB markdown load error:', err);
    }

    // === 2. PDF files from repo (legacy, kept for back-compat) ===
    let pdfParse = null;
    try { pdfParse = require('pdf-parse'); } catch (e) {
      console.warn('pdf-parse not available, PDFs from repo will be skipped:', e.message);
    }

    if (pdfParse && fs.existsSync(pdfDir)) {
      try {
        const pdfFiles = fs.readdirSync(pdfDir)
          .filter(f => f.toLowerCase().endsWith('.pdf'))
          .sort();
        let usedTokens = estimateTokens(combined);
        for (const file of pdfFiles) {
          if (usedTokens >= KB_TOKEN_BUDGET) {
            perFile.push({ file: file, type: 'pdf', source: 'repo', skipped: true, reason: 'budget' });
            continue;
          }
          try {
            const buf = fs.readFileSync(path.join(pdfDir, file));
            const data = await pdfParse(buf);
            const text = (data.text || '').trim();
            if (!text) {
              perFile.push({ file: file, type: 'pdf', source: 'repo', skipped: true, reason: 'empty' });
              continue;
            }
            const fileTokens = estimateTokens(text);
            const remainingBudget = KB_TOKEN_BUDGET - usedTokens;
            let textToAdd = text;
            if (fileTokens > remainingBudget) {
              textToAdd = text.slice(0, remainingBudget * 4) + '\n\n[...truncated due to KB budget...]';
            }
            const niceTitle = file.replace(/\.pdf$/i, '').replace(/[_-]+/g, ' ');
            combined += `\n\n## PDF: ${niceTitle} (${data.numpages || '?'} pages)\n${textToAdd}`;
            usedTokens = estimateTokens(combined);
            perFile.push({
              file: file, type: 'pdf', source: 'repo',
              tokens: estimateTokens(textToAdd), chars: textToAdd.length, pages: data.numpages
            });
          } catch (pdfErr) {
            perFile.push({ file: file, type: 'pdf', source: 'repo', skipped: true, reason: pdfErr.message });
          }
        }
      } catch (err) {
        console.error('KB repo PDF load error:', err);
      }
    }

    // === 3. Files from Netlify Blobs (uploaded via admin UI, the canonical store) ===
    if (getStoreFn && blobsInitialised) {
      try {
        const store = getBlobStore();
        const indexRaw = await store.get('__index', { type: 'json' });
        const index = Array.isArray(indexRaw) ? indexRaw : [];
        let usedTokens = estimateTokens(combined);
        // Sort by upload time (oldest first) for deterministic ordering
        const active = index.filter(f => f.active !== false).sort((a, b) => (a.uploadedAt || 0) - (b.uploadedAt || 0));
        for (const entry of active) {
          if (usedTokens >= KB_TOKEN_BUDGET) {
            perFile.push({ file: entry.fileName, type: entry.type, source: 'blob', skipped: true, reason: 'budget' });
            continue;
          }
          try {
            const content = await store.get(entry.id);
            if (!content) {
              perFile.push({ file: entry.fileName, type: entry.type, source: 'blob', skipped: true, reason: 'missing content' });
              continue;
            }
            const remainingBudget = KB_TOKEN_BUDGET - usedTokens;
            const fileTokens = estimateTokens(content);
            let textToAdd = content;
            if (fileTokens > remainingBudget) {
              textToAdd = content.slice(0, remainingBudget * 4) + '\n\n[...truncated due to KB budget...]';
            }
            combined += `\n\n## ${entry.type === 'pdf' ? 'PDF' : 'KB'}: ${entry.title || entry.fileName}\n${textToAdd}`;
            usedTokens = estimateTokens(combined);
            perFile.push({
              file: entry.fileName, type: entry.type, source: 'blob',
              tokens: estimateTokens(textToAdd), title: entry.title, id: entry.id
            });
          } catch (blobErr) {
            console.warn(`Blob fetch error for ${entry.id}:`, blobErr.message);
            perFile.push({ file: entry.fileName, source: 'blob', skipped: true, reason: blobErr.message });
          }
        }
      } catch (err) {
        // Blobs not yet provisioned for this site — that's fine, just skip
        console.warn('Blob KB unavailable (first time? blobs not yet initialised):', err.message);
      }
    }

    if (!combined) combined = 'KB unavailable. Use core identity only.';

    cachedKB = combined;
    kbCacheExpiry = Date.now() + 30000; // 30s cache (lets admin uploads propagate quickly)
    kbStats = {
      totalTokens: estimateTokens(combined),
      totalChars: combined.length,
      files: perFile,
      loadedAt: Date.now()
    };
    return cachedKB;
  })();

  return pdfParsePromise;
}

function getKbStats() { return kbStats; }

// Allow admin endpoints to force KB cache invalidation after upload/delete
function invalidateKbCache() {
  cachedKB = null;
  kbCacheExpiry = 0;
  pdfParsePromise = null;
}
module.exports.invalidateKbCache = invalidateKbCache;

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
  coaching: 'CURRENT FOCUS: Personal Coaching. The user wants personalized coaching. Be direct and warm. Help them do situational analysis, translate vision to 90-day plans, energy management. Ask them sharp questions when needed.',
  ai: 'CURRENT FOCUS: AI for Business. The user wants to understand AI as a business layer — not a toy. Lean heavily on KB file 09_ai.md. Talk about how AI is deployed inside businesses (the 3 ways: Operator, Builder, Distributor), which 2026 tools matter (Claude/GPT/Gemini, Apollo, Clay, HeyReach, Gong, n8n/Make), and the 4-step framework to plug AI into any business. Reference real tools and real numbers. Be the Dirc who has actually deployed this — not a generic AI hype peddler. Honest about what fails (tool-collecting, no measurable ROI, generalism).',
  agentic: 'CURRENT FOCUS: Agentic AI. The user wants the autonomous-agents frontier. Lean heavily on KB file 10_agentic_ai.md. Make the chatbot-vs-agent distinction crystal clear. Explain the 2026 framework landscape (LangGraph, CrewAI, AutoGen, LlamaIndex, Semantic Kernel, Sintra) with real differentiation. Mention MCP (Model Context Protocol) as the unlock. Walk through the 7 monetization business models. Multi-agent patterns (Orchestrator+Workers, Pipeline, Debate/Critic, Specialist Mesh). Always tie back to: pick narrow vertical, measure ROI in 30 days, human-in-the-loop wins sales. Cite the Gartner stat: 40% of agentic deployments canceled by 2027 — be in the other 60%.'
};

// Returns Anthropic-format system array with cache_control on the static block.
// The static block (identity + voice + rules + KB + memory protocol) is cached for 5 min;
// the dynamic block (language, topic, user-specific profile/memories/project) is fresh each call.
// This drops cost on every cached read by ~90% on the static portion.
async function buildSystemPrompt(language, topic, userContext, userMemories, projectContext) {
  const kb = await loadKnowledgeBase();
  const langInstruction = languageInstruction(language);
  const topicLine = topic && TOPIC_CONTEXT[topic] ? `\n\n## ${TOPIC_CONTEXT[topic]}\n` : '';
  const profileBlock = userContext ? userContext : '';
  const memoryBlock = userMemories ? userMemories : '';
  const projectBlock = projectContext ? projectContext : '';

  // === STATIC BLOCK (cacheable) — identical for every user, every message ===
  // Cache TTL is 5 min, refreshed on each hit. ~5500 tokens here = ~€0.0017 per cached read
  // vs €0.0165 uncached. Cache write (first call in 5 min) is 1.25× normal = €0.020 once.
  const staticBlock = `You ARE DircBot — the AI embodiment of Dirc Zahlmann.

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

## CONVERSION FUNNEL — Smart Routing (CRITICAL)

DircBot is the top of Dirc's business funnel. When user intent matches certain patterns, route them naturally to the right channel at the END of your response. Read knowledge-base file 11_funnel_routing.md for the full rules.

**Decision matrix:**

1. **Service/Build/Hire request** (e.g. "can you build me a bot", "I need an AI agent for my business", "can I hire you", "consulting fee"):
   - Give a value-first framework answer
   - End with: "Ping me on Telegram **@zahlmann** to scope this — https://t.me/zahlmann"
   - Adapt phrasing to current language (DE/EN/ES)

2. **Learning/Deep-dive request** (e.g. "how do I learn X", "recommend a course", "where do I study Y", "is there a system for this"):
   - Give the framework answer
   - End with: "If you want the full system — videos, templates, community — the **[TRACK]** on **https://dirczahlmann.com** covers it end-to-end"
   - Pick the right track based on topic:
     • Sales/Closing → Sales Mastery Track
     • Crypto/Blockchain → Crypto Operator Track
     • Wealth/Family Office → Wealth Architect Track
     • Network Marketing → Network Recovery Track
     • Tokenization → Tokenization Foundations
     • Mindset/Leadership → Leadership OS
     • Scaling/Unicorns → Unicorn Stages Track
     • AI for Business → AI Operator Track
     • Agentic AI → Agentic Builder Track
     • Personal Coaching → Inner Circle Coaching

3. **Partnership/Pitch** (e.g. "I have a project", "pitch you on"):
   - Set the bar: "Send a one-pager on Telegram @zahlmann — problem, solution, traction, ask"

4. **Tester feedback** (e.g. "you should add", "feature request"):
   - Engage briefly, then: "Drop it on Telegram @zahlmann with 'DircBot feedback'"

5. **General curiosity / casual / topic-click** → NO CTA. Answer normally.

**Rules:**
- One CTA per response, MAX. Never both Telegram AND Academy in same turn.
- Never lead with the CTA — always framework FIRST, CTA at the END.
- Don't repeat the same CTA in consecutive turns. If you gave Telegram in turn 3, don't repeat in turn 4 unless new intent triggers it.
- Stay in DircBot voice. The CTA reads like "here's the obvious next step", NOT a sales pitch.
- If user says "let's just talk here" → respect it, drop the CTA, keep helping in chat.
- If USER PROFILE shows they're already a customer (mentions academy, courses) → no CTA needed.

## YOUR KNOWLEDGE BASE
${kb}

## AUTO-MEMORY PROTOCOL (CRITICAL)

After your normal response, if the user revealed a NEW, MEANINGFUL, LASTING fact about themselves this turn, append a hidden memory block at the very end:

<<MEMORY>>
- [fact written in 3rd person, present tense, concise]
<<END_MEMORY>>

**Only emit MEMORY for:**
- Personal/business goals (e.g. "User wants to exit in 3 years")
- Current business stage / numbers (e.g. "User's MRR is currently 8k")
- Team / company size (e.g. "User has a team of 5")
- Industry / niche / product they're building (e.g. "User is building a SaaS for HR teams in Germany")
- Major decisions they're working on (e.g. "User is deciding whether to raise or bootstrap")
- Constraints/circumstances (e.g. "User lives in Switzerland and runs an LLC")
- Skills/background (e.g. "User has 10 years in B2B sales")

**DO NOT emit MEMORY for:**
- Questions the user asks (asking is not revealing)
- Generic statements without personal context
- Things already in the USER PROFILE or USER MEMORIES blocks above
- Casual chitchat or greetings
- Topic clicks or suggestion-card clicks without personal context

**If nothing memory-worthy was shared this turn, omit the entire MEMORY block.** Do not emit empty blocks. Do not announce that you're remembering — silent capture only.

Memory entries are max 100 characters each. Write them like database rows — terse, factual, no fluff.

Stay sharp. Stay direct. BE Dirc.`;

  // === DYNAMIC BLOCK (per-user, not cached) ===
  // Built fresh every call — language preference, current topic, user profile/memories/project context.
  // Kept SMALL so caching savings are maximized.
  const dynamicParts = [];
  dynamicParts.push(`## SESSION CONTEXT\n${langInstruction}`);
  if (topicLine) dynamicParts.push(topicLine.trim());
  if (profileBlock) dynamicParts.push(profileBlock.trim());
  if (memoryBlock) dynamicParts.push(memoryBlock.trim());
  if (projectBlock) dynamicParts.push(projectBlock.trim());
  const dynamicBlock = dynamicParts.join('\n\n');

  // Return Anthropic system-array format with cache_control marker on the static block.
  // Static block gets cached for 5 minutes; dynamic block is always fresh.
  return [
    {
      type: 'text',
      text: staticBlock,
      cache_control: { type: 'ephemeral' }
    },
    {
      type: 'text',
      text: dynamicBlock
    }
  ];
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

    // Initialize Netlify Blobs context for this Lambda execution (must happen
    // before any KB load that touches Blobs). Safe no-op if Blobs unavailable.
    ensureBlobsContext(event);

    const body = JSON.parse(event.body || '{}');
    const message = (body.message || '').toString().slice(0, 4000);
    const language = ['en', 'de', 'es'].includes(body.language) ? body.language : 'de';
    const topic = body.topic || null;
    const userContext = body.userContext || null;
    const userMemories = body.userMemories || null;
    const projectContext = body.projectContext || null;
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

    const systemPrompt = await buildSystemPrompt(language, topic, userContext, userMemories, projectContext);

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: anthropicMessages
    });

    const replyText = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    // Cache stats: usage object includes cache_creation_input_tokens and cache_read_input_tokens
    // when prompt caching is active. Log them so we can monitor savings in Netlify logs.
    const usage = response.usage || {};
    const cacheCreate = usage.cache_creation_input_tokens || 0;
    const cacheRead = usage.cache_read_input_tokens || 0;
    const regularInput = usage.input_tokens || 0;
    const output = usage.output_tokens || 0;

    if (cacheCreate > 0 || cacheRead > 0) {
      console.log(`[cache] read=${cacheRead} create=${cacheCreate} input=${regularInput} output=${output}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: replyText,
        reply: replyText,
        model: response.model,
        usage: {
          cacheReadTokens: cacheRead,
          cacheCreateTokens: cacheCreate,
          inputTokens: regularInput,
          outputTokens: output
        }
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
