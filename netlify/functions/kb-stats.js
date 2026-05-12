// ============== ADMIN: KB Stats (v8.15) ==============
// Returns metadata about loaded knowledge base (MD + PDF files from repo + Blobs).
// Requires header "x-admin-pass" matching ADMIN_API_PASS env var.

const fs = require('fs');
const path = require('path');

let getStoreFn = null;
let connectLambdaFn = null;
try {
  const blobs = require('@netlify/blobs');
  getStoreFn = blobs.getStore;
  connectLambdaFn = blobs.connectLambda;
} catch (e) { /* not available */ }

function estimateTokens(text) {
  return Math.ceil((text || '').length / 4);
}

// Initialize Blobs with Lambda-compat or manual fallback
function initBlobs(event) {
  if (!getStoreFn) return null;
  if (connectLambdaFn) {
    try {
      connectLambdaFn(event);
      return getStoreFn({ name: 'dircbot-kb', consistency: 'strong' });
    } catch (e) { /* fall through */ }
  }
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  if (siteID && token) {
    return getStoreFn({ name: 'dircbot-kb', consistency: 'strong', siteID, token });
  }
  try {
    return getStoreFn({ name: 'dircbot-kb', consistency: 'strong' });
  } catch (e) { return null; }
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-pass',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const adminPass = event.headers['x-admin-pass'] || event.headers['X-Admin-Pass'];
  const expectedPass = process.env.ADMIN_API_PASS;
  if (!expectedPass || adminPass !== expectedPass) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const kbDir = path.join(__dirname, '..', '..', 'knowledge-base');
  const pdfDir = path.join(kbDir, 'pdfs');
  const stats = { md: [], pdf: [], blobs: [], totalTokens: 0, budgetLimit: 80000 };

  // === Repo MDs ===
  try {
    const files = fs.readdirSync(kbDir).filter(f => f.endsWith('.md')).sort();
    for (const file of files) {
      const content = fs.readFileSync(path.join(kbDir, file), 'utf-8');
      const tokens = estimateTokens(content);
      stats.md.push({ file, tokens, chars: content.length, source: 'repo' });
      stats.totalTokens += tokens;
    }
  } catch (e) { stats.mdError = e.message; }

  // === Repo PDFs (legacy) ===
  let pdfParse = null;
  try { pdfParse = require('pdf-parse'); } catch (e) { stats.pdfParseAvailable = false; }
  if (pdfParse) stats.pdfParseAvailable = true;

  if (fs.existsSync(pdfDir)) {
    try {
      const pdfFiles = fs.readdirSync(pdfDir).filter(f => f.toLowerCase().endsWith('.pdf')).sort();
      for (const file of pdfFiles) {
        const filePath = path.join(pdfDir, file);
        const fileStat = fs.statSync(filePath);
        let pdfInfo = { file, sizeKB: Math.round(fileStat.size / 1024), source: 'repo' };
        if (pdfParse) {
          try {
            const buf = fs.readFileSync(filePath);
            const data = await pdfParse(buf);
            const text = (data.text || '').trim();
            pdfInfo.tokens = estimateTokens(text);
            pdfInfo.pages = data.numpages;
            pdfInfo.chars = text.length;
            pdfInfo.empty = text.length < 100;
            stats.totalTokens += pdfInfo.tokens;
          } catch (e) {
            pdfInfo.error = e.message;
          }
        }
        stats.pdf.push(pdfInfo);
      }
    } catch (e) { stats.pdfError = e.message; }
  }

  // === Blob KB Files (managed via admin UI) ===
  if (getStoreFn) {
    try {
      const store = initBlobs(event);
      if (!store) throw new Error('Blobs store could not be initialised');
      const indexRaw = await store.get('__index', { type: 'json' });
      const index = Array.isArray(indexRaw) ? indexRaw : [];
      for (const entry of index) {
        stats.blobs.push({ ...entry, source: 'blob' });
        if (entry.active !== false) {
          stats.totalTokens += entry.tokens || 0;
        }
      }
    } catch (e) {
      stats.blobsError = e.message;
    }
  }

  stats.withinBudget = stats.totalTokens <= stats.budgetLimit;
  stats.budgetUsedPct = Math.round((stats.totalTokens / stats.budgetLimit) * 100);

  return { statusCode: 200, headers, body: JSON.stringify(stats) };
};
