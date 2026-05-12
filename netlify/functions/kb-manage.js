// ============== KB MANAGEMENT API (v8.15) ==============
// Endpoints (all routed through this single function via ?action= query param):
//   - action=list                  → returns all KB files with metadata + budget
//   - action=upload (POST)         → upload PDF or MD, stores in Netlify Blobs
//   - action=delete                → delete by id
//   - action=toggle                → enable/disable a file (active vs inactive)
//   - action=preview               → return content preview (first 500 chars)
//
// All require x-admin-pass header matching ADMIN_API_PASS env var.

const { getStore } = require('@netlify/blobs');

const KB_TOKEN_BUDGET = 80000;
const KB_MAX_FILE_SIZE_MB = 10; // single file limit
const KB_MAX_FILES = 20;        // max files in active KB

function estimateTokens(text) {
  return Math.ceil((text || '').length / 4);
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-pass',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };
}

function unauthorized() {
  return { statusCode: 401, headers: corsHeaders(), body: JSON.stringify({ error: 'Unauthorized' }) };
}

// Get the metadata index (single key holding all file metadata)
async function getIndex(store) {
  try {
    const raw = await store.get('__index', { type: 'json' });
    return Array.isArray(raw) ? raw : [];
  } catch (e) {
    return [];
  }
}

async function setIndex(store, index) {
  await store.setJSON('__index', index);
}

async function listFiles(store) {
  const index = await getIndex(store);
  const activeTokens = index
    .filter(f => f.active !== false)
    .reduce((sum, f) => sum + (f.tokens || 0), 0);

  return {
    files: index,
    totalTokens: activeTokens,
    budgetLimit: KB_TOKEN_BUDGET,
    budgetUsedPct: Math.round((activeTokens / KB_TOKEN_BUDGET) * 100),
    maxFiles: KB_MAX_FILES,
    maxFileSizeMB: KB_MAX_FILE_SIZE_MB
  };
}

async function uploadFile(store, body) {
  const { fileName, fileType, fileData, title } = body;
  if (!fileName || !fileData) {
    return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'Missing fileName or fileData' }) };
  }

  // Decode base64 fileData
  let buffer;
  try {
    buffer = Buffer.from(fileData, 'base64');
  } catch (e) {
    return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'Invalid base64 fileData' }) };
  }

  // Size guard (post-decode)
  if (buffer.length > KB_MAX_FILE_SIZE_MB * 1024 * 1024) {
    return { statusCode: 413, headers: corsHeaders(), body: JSON.stringify({ error: `File too large. Max ${KB_MAX_FILE_SIZE_MB}MB per file.` }) };
  }

  // Extract text content based on type
  let textContent = '';
  let pages = null;
  const isPdf = fileType === 'pdf' || fileName.toLowerCase().endsWith('.pdf');
  const isMd = fileType === 'md' || fileName.toLowerCase().endsWith('.md') || fileName.toLowerCase().endsWith('.txt');

  if (isPdf) {
    try {
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(buffer);
      textContent = (data.text || '').trim();
      pages = data.numpages;
      if (!textContent) {
        return { statusCode: 422, headers: corsHeaders(), body: JSON.stringify({ error: 'PDF appears to be empty or scanned (no extractable text). OCR required first.' }) };
      }
    } catch (e) {
      return { statusCode: 500, headers: corsHeaders(), body: JSON.stringify({ error: 'PDF parse failed: ' + e.message }) };
    }
  } else if (isMd) {
    textContent = buffer.toString('utf-8').trim();
    if (!textContent) {
      return { statusCode: 422, headers: corsHeaders(), body: JSON.stringify({ error: 'File is empty.' }) };
    }
  } else {
    return { statusCode: 415, headers: corsHeaders(), body: JSON.stringify({ error: 'Unsupported file type. Use .pdf or .md/.txt.' }) };
  }

  const tokens = estimateTokens(textContent);

  // Index management
  const index = await getIndex(store);

  // Count check (only active counted toward max)
  const activeCount = index.filter(f => f.active !== false).length;
  if (activeCount >= KB_MAX_FILES) {
    return { statusCode: 409, headers: corsHeaders(), body: JSON.stringify({ error: `Max ${KB_MAX_FILES} active KB files reached. Deactivate or delete one first.` }) };
  }

  // Budget check
  const currentTokens = index
    .filter(f => f.active !== false)
    .reduce((s, f) => s + (f.tokens || 0), 0);
  if (currentTokens + tokens > KB_TOKEN_BUDGET) {
    return {
      statusCode: 409,
      headers: corsHeaders(),
      body: JSON.stringify({
        error: `Token budget exceeded. Adding this file (${tokens} tok) would push KB to ${currentTokens + tokens} tok, exceeding ${KB_TOKEN_BUDGET}.`,
        currentTokens,
        newFileTokens: tokens,
        budgetLimit: KB_TOKEN_BUDGET
      })
    };
  }

  // Generate id + slug
  const id = 'kb-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
  const safeName = (title || fileName.replace(/\.(pdf|md|txt)$/i, '')).slice(0, 80);

  // Store content under id
  await store.set(id, textContent);

  // Update index
  const entry = {
    id,
    fileName,
    title: safeName,
    type: isPdf ? 'pdf' : 'md',
    tokens,
    pages,
    chars: textContent.length,
    sizeKB: Math.round(buffer.length / 1024),
    uploadedAt: Date.now(),
    active: true
  };
  index.push(entry);
  await setIndex(store, index);

  return {
    statusCode: 200,
    headers: corsHeaders(),
    body: JSON.stringify({ success: true, file: entry, totalTokens: currentTokens + tokens })
  };
}

async function deleteFile(store, id) {
  if (!id) return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'Missing id' }) };
  const index = await getIndex(store);
  const idx = index.findIndex(f => f.id === id);
  if (idx === -1) return { statusCode: 404, headers: corsHeaders(), body: JSON.stringify({ error: 'File not found' }) };
  await store.delete(id);
  index.splice(idx, 1);
  await setIndex(store, index);
  return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify({ success: true }) };
}

async function toggleFile(store, id) {
  if (!id) return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'Missing id' }) };
  const index = await getIndex(store);
  const entry = index.find(f => f.id === id);
  if (!entry) return { statusCode: 404, headers: corsHeaders(), body: JSON.stringify({ error: 'File not found' }) };
  entry.active = !(entry.active !== false);
  // When activating, check budget
  if (entry.active) {
    const activeTokens = index
      .filter(f => f.id !== id && f.active !== false)
      .reduce((s, f) => s + (f.tokens || 0), 0);
    if (activeTokens + (entry.tokens || 0) > KB_TOKEN_BUDGET) {
      entry.active = false;
      return {
        statusCode: 409,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Activating this file would exceed token budget. Deactivate something else first.' })
      };
    }
  }
  await setIndex(store, index);
  return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify({ success: true, file: entry }) };
}

async function previewFile(store, id) {
  if (!id) return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'Missing id' }) };
  const index = await getIndex(store);
  const entry = index.find(f => f.id === id);
  if (!entry) return { statusCode: 404, headers: corsHeaders(), body: JSON.stringify({ error: 'File not found' }) };
  const content = await store.get(id);
  return {
    statusCode: 200,
    headers: corsHeaders(),
    body: JSON.stringify({
      file: entry,
      preview: (content || '').slice(0, 2000),
      truncated: (content || '').length > 2000
    })
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders(), body: '' };
  }

  const adminPass = event.headers['x-admin-pass'] || event.headers['X-Admin-Pass'];
  if (!process.env.ADMIN_API_PASS || adminPass !== process.env.ADMIN_API_PASS) {
    return unauthorized();
  }

  const action = (event.queryStringParameters || {}).action;

  try {
    const store = getStore({ name: 'dircbot-kb', consistency: 'strong' });

    if (action === 'list' || !action) {
      const data = await listFiles(store);
      return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify(data) };
    }

    if (action === 'upload') {
      if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers: corsHeaders(), body: JSON.stringify({ error: 'POST required' }) };
      }
      const body = JSON.parse(event.body || '{}');
      return await uploadFile(store, body);
    }

    if (action === 'delete') {
      const id = (event.queryStringParameters || {}).id;
      return await deleteFile(store, id);
    }

    if (action === 'toggle') {
      const id = (event.queryStringParameters || {}).id;
      return await toggleFile(store, id);
    }

    if (action === 'preview') {
      const id = (event.queryStringParameters || {}).id;
      return await previewFile(store, id);
    }

    return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'Unknown action. Use list, upload, delete, toggle, or preview.' }) };
  } catch (err) {
    console.error('KB manage error:', err);
    return { statusCode: 500, headers: corsHeaders(), body: JSON.stringify({ error: err.message }) };
  }
};
