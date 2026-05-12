// ============== DIRCBOT ADMIN PANEL ==============
// ⚠️ Password protection is OBSCURITY, not security.
// Anyone reading the source code can find the password.
// For real security, use Netlify Identity + redirects.
// To change password: edit ADMIN_PASSWORD below.

const ADMIN_PASSWORD = 'dirczahlmann2026';

let currentEmailLang = 'de';

document.addEventListener('DOMContentLoaded', () => {
  // Check session
  const stored = sessionStorage.getItem('dircbot-admin-auth');
  if (stored === ADMIN_PASSWORD) {
    showAdmin();
  } else {
    showLogin();
  }
});

function showLogin() {
  document.getElementById('adminLogin').style.display = 'flex';
  document.getElementById('adminPanel').style.display = 'none';
  setTimeout(() => {
    const input = document.getElementById('adminPassInput');
    if (input) input.focus();
  }, 100);
}

function showAdmin() {
  document.getElementById('adminLogin').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'block';
  renderCodesGrid();
  populateCodeSelect();
  updateStats();
  if (typeof loadKbStats === 'function') loadKbStats();
  if (typeof loadCacheStats === 'function') loadCacheStats();
}

function attemptLogin(e) {
  e.preventDefault();
  const input = document.getElementById('adminPassInput');
  const err = document.getElementById('adminLoginError');
  if (input.value === ADMIN_PASSWORD) {
    sessionStorage.setItem('dircbot-admin-auth', ADMIN_PASSWORD);
    err.textContent = '';
    showAdmin();
  } else {
    err.textContent = "❌ Falsches Passwort. Versuch's nochmal.";
    input.value = '';
    input.focus();
  }
}

function logout() {
  sessionStorage.removeItem('dircbot-admin-auth');
  location.reload();
}

function updateStats() {
  document.getElementById('statCodesCount').textContent = VALID_TESTER_CODES.length;
}

function renderCodesGrid() {
  const grid = document.getElementById('adminCodesGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const codeDescriptions = {
    'DIRC500': 'Universal Master Code',
    'DIRCBETA': 'Beta Wave Tester',
    'DIRCINSIDER': 'Inner Circle / Friends & Family',
    'LAUNCH2026': 'Launch Campaign 2026',
    'UNICORN8': '8 Unicorns Reference',
    'SALESGENT': 'Sales Gentleman Reference',
    'CRYPTO2011': 'Year Dirc Started Crypto',
    'TOKEN500': 'Tokenization Theme',
    'DZACADEMY': 'Academy Members',
    'PRESALE500': 'Presale Connection'
  };

  VALID_TESTER_CODES.forEach(code => {
    const card = document.createElement('div');
    card.className = 'admin-code-card';
    card.innerHTML = `
      <div class="admin-code-value">${code}</div>
      <div class="admin-code-desc">${codeDescriptions[code] || 'Custom code'}</div>
      <button class="admin-code-copy" onclick="copyCode('${code}')">📋 Kopieren</button>
    `;
    grid.appendChild(card);
  });
}

function populateCodeSelect() {
  const select = document.getElementById('emailCode');
  if (!select) return;
  select.innerHTML = '';
  VALID_TESTER_CODES.forEach(code => {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = code;
    select.appendChild(opt);
  });
}

function setEmailLang(lang) {
  currentEmailLang = lang;
  document.querySelectorAll('.admin-lang-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  // Re-generate if there's already content
  const output = document.getElementById('emailOutput');
  if (output.value) generateEmail();
}

function copyCode(code) {
  navigator.clipboard.writeText(code).then(() => {
    showToast(`Code "${code}" kopiert!`);
  });
}

const EMAIL_TEMPLATES = {
  de: (name, code) => ({
    subject: `🔥 ${name}, du bist drin — dein DircBot Tester-Code`,
    body: `Hi ${name},

du bist drin. 🔥

Willkommen als DircBot Beta-Tester. Hier ist alles was du brauchst:

═══════════════════════════════════════
🔓 DEIN TESTER-CODE: ${code}
🔗 BOT-URL: https://dircbot.netlify.app
═══════════════════════════════════════

So funktioniert's:
1) Geh auf https://dircbot.netlify.app
2) Klick "Have a tester code?" unten
3) Gib deinen Code "${code}" ein
4) Loslegen

Du hast 500 Nachrichten Zugang zu allem:
✅ Alle 8 Themen-Bereiche (Sales, Crypto, Wealth, Network Marketing, Tokenisierung, Mindset, Business Build, Personal Coaching)
✅ Voice-Input (sprich statt tippen)
✅ Copy/Share Features
✅ Try-Another-Answer (lass den Bot anders antworten)
✅ Photo/File Upload zur Analyse

Was wir uns zurück wünschen:
• Ehrliches Feedback — was funktioniert, was nicht?
• Welche Antworten haben dich umgehauen?
• Welche Themen fehlen?
• Welche Bugs sind dir aufgefallen?

Antworte einfach auf diese Email oder schreib direkt auf Telegram.

Let's build the future of AI coaching together.

🔥 Dirc Zahlmann
DircBot · 8 KI-Modelle · 30 Jahre Praxis-Wissen

—
Dirc Zahlmann · Zahlmann Consulting International GmbH
https://dirczahlmann.com`
  }),
  en: (name, code) => ({
    subject: `🔥 ${name}, you're in — your DircBot Tester Code`,
    body: `Hi ${name},

You're in. 🔥

Welcome as a DircBot Beta-Tester. Here's everything you need:

═══════════════════════════════════════
🔓 YOUR TESTER CODE: ${code}
🔗 BOT URL: https://dircbot.netlify.app
═══════════════════════════════════════

How it works:
1) Visit https://dircbot.netlify.app
2) Click "Have a tester code?" at the bottom
3) Enter your code "${code}"
4) Start chatting

You have 500 messages of full access:
✅ All 8 topic areas (Sales, Crypto, Wealth, Network Marketing, Tokenization, Mindset, Business Build, Personal Coaching)
✅ Voice Input (speak instead of typing)
✅ Copy/Share features
✅ Try-Another-Answer (let the bot reanswer differently)
✅ Photo/File upload for analysis

What we'd love back from you:
• Honest feedback — what works, what doesn't?
• Which answers blew you away?
• Which topics are missing?
• Any bugs you noticed?

Just reply to this email or hit me up directly on Telegram.

Let's build the future of AI coaching together.

🔥 Dirc Zahlmann
DircBot · 8 AI models · 30 years of mastery

—
Dirc Zahlmann · Zahlmann Consulting International GmbH
https://dirczahlmann.com`
  }),
  es: (name, code) => ({
    subject: `🔥 ${name}, estás dentro — tu código de Tester DircBot`,
    body: `Hola ${name},

Estás dentro. 🔥

Bienvenido como Beta-Tester de DircBot. Aquí está todo lo que necesitas:

═══════════════════════════════════════
🔓 TU CÓDIGO DE TESTER: ${code}
🔗 BOT URL: https://dircbot.netlify.app
═══════════════════════════════════════

Cómo funciona:
1) Visita https://dircbot.netlify.app
2) Haz clic en "¿Tienes un código de tester?" abajo
3) Ingresa tu código "${code}"
4) ¡Empieza a chatear!

Tienes 500 mensajes de acceso completo:
✅ Las 8 áreas temáticas (Ventas, Crypto, Patrimonio, Network Marketing, Tokenización, Mentalidad, Construir Negocios, Coaching Personal)
✅ Entrada por voz (habla en lugar de escribir)
✅ Funciones Copiar/Compartir
✅ Otra-Respuesta (deja que el bot responda diferente)
✅ Subida de Foto/Archivo para análisis

Lo que nos encantaría de vuelta:
• Feedback honesto — ¿qué funciona, qué no?
• ¿Qué respuestas te impactaron?
• ¿Qué temas faltan?
• ¿Algún bug que hayas notado?

Solo responde a este email o escríbeme directamente en Telegram.

Construyamos juntos el futuro del coaching con IA.

🔥 Dirc Zahlmann
DircBot · 8 modelos de IA · 30 años de maestría

—
Dirc Zahlmann · Zahlmann Consulting International GmbH
https://dirczahlmann.com`
  })
};

function generateEmail() {
  const name = (document.getElementById('emailFirstName').value || 'Tester').trim();
  const code = document.getElementById('emailCode').value;
  const tpl = EMAIL_TEMPLATES[currentEmailLang](name, code);

  document.getElementById('emailOutputSubject').textContent = `Subject: ${tpl.subject}`;
  document.getElementById('emailOutput').value = tpl.body;
  showToast('✓ Email generiert');
}

function copyEmail() {
  const output = document.getElementById('emailOutput');
  const subject = document.getElementById('emailOutputSubject').textContent;
  if (!output.value) {
    showToast('Erst Email generieren!');
    return;
  }
  const fullText = subject + '\n\n' + output.value;
  navigator.clipboard.writeText(fullText).then(() => {
    const btn = document.getElementById('copyEmailBtn');
    const original = btn.textContent;
    btn.textContent = '✓ Kopiert!';
    btn.classList.add('success');
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('success');
    }, 2000);
  });
}

function showToast(msg) {
  const toast = document.getElementById('adminToast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 2500);
}


// ============== LIVE SUBMISSIONS FROM NETLIFY FORMS API ==============
async function loadSubmissions() {
  const statusEl = document.getElementById('submissionsStatus');
  const listEl = document.getElementById('submissionsList');
  if (!statusEl || !listEl) return;

  statusEl.innerHTML = '<div class="admin-loading">⏳ Lade Bewerbungen...</div>';
  listEl.innerHTML = '';

  // Use the admin API password (set via Netlify env var ADMIN_API_PASS).
  // We prompt the user to enter it once per session for the API call.
  let apiPass = sessionStorage.getItem('dircbot-admin-api-pass');
  if (!apiPass) {
    apiPass = prompt('Admin-API-Passwort (ADMIN_API_PASS aus Netlify Env Vars):');
    if (!apiPass) {
      statusEl.innerHTML = '<div class="admin-error">❌ Kein API-Passwort eingegeben.</div>';
      return;
    }
    sessionStorage.setItem('dircbot-admin-api-pass', apiPass);
  }

  try {
    const res = await fetch('/.netlify/functions/admin-submissions', {
      headers: { 'x-admin-pass': apiPass }
    });

    if (res.status === 401) {
      sessionStorage.removeItem('dircbot-admin-api-pass');
      statusEl.innerHTML = '<div class="admin-error">❌ Falsches API-Passwort. Klick nochmal "Bewerbungen laden".</div>';
      return;
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      statusEl.innerHTML = `<div class="admin-error">❌ Fehler: ${errData.error || res.status}<br><small>${errData.detail || ''}</small></div>`;
      return;
    }

    const data = await res.json();
    renderSubmissions(data);
    statusEl.innerHTML = '';
  } catch (err) {
    console.error('Submissions load error:', err);
    statusEl.innerHTML = `<div class="admin-error">❌ Network-Fehler: ${err.message}</div>`;
  }
}

function renderSubmissions(data) {
  const listEl = document.getElementById('submissionsList');
  if (!listEl) return;
  listEl.innerHTML = '';

  if (!data.forms || data.forms.length === 0) {
    listEl.innerHTML = '<div class="admin-loading">📭 Noch keine Forms gefunden.</div>';
    return;
  }

  data.forms.forEach(form => {
    const formHeader = document.createElement('div');
    formHeader.className = 'admin-form-header';
    formHeader.innerHTML = `
      <h3>${form.form_name} <span class="admin-form-count">${form.submission_count}</span></h3>
    `;
    listEl.appendChild(formHeader);

    if (form.submissions.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'admin-loading';
      empty.textContent = 'Noch keine Einsendungen.';
      listEl.appendChild(empty);
      return;
    }

    form.submissions.forEach(sub => {
      const card = renderSubmissionCard(sub, form.form_name);
      listEl.appendChild(card);
    });
  });
}

function renderSubmissionCard(submission, formName) {
  const d = submission.data || {};
  const card = document.createElement('div');
  card.className = 'admin-submission-card';

  const firstName = d.first_name || d.firstName || d.name || 'Tester';
  const lastName = d.last_name || d.lastName || '';
  const fullName = (firstName + ' ' + lastName).trim();
  const email = d.email || '';
  const telegram = d.telegram || '';
  const instagram = d.instagram || '';
  const country = d.country || '';
  const interest = d.primary_interest || '';
  const challenge = d.challenge || '';
  const motivation = d.motivation || '';
  const created = new Date(submission.created_at).toLocaleString('de-DE');

  // Status from localStorage
  const statusKey = 'dircbot-submission-status-' + submission.id;
  const currentStatus = localStorage.getItem(statusKey) || 'new';

  card.innerHTML = `
    <div class="admin-submission-header">
      <div>
        <div class="admin-submission-name">${escapeHtml2(fullName)}</div>
        <div class="admin-submission-date">${created}</div>
      </div>
      <div class="admin-submission-status status-${currentStatus}">${statusLabel(currentStatus)}</div>
    </div>
    <div class="admin-submission-body">
      <div class="admin-submission-fields">
        ${email ? `<div class="admin-sub-field"><span>📧 Email</span><strong>${escapeHtml2(email)}</strong></div>` : ''}
        ${telegram ? `<div class="admin-sub-field"><span>💬 Telegram</span><strong>${escapeHtml2(telegram)}</strong></div>` : ''}
        ${instagram ? `<div class="admin-sub-field"><span>📷 Instagram</span><strong>${escapeHtml2(instagram)}</strong></div>` : ''}
        ${country ? `<div class="admin-sub-field"><span>🌍 Land</span><strong>${escapeHtml2(country)}</strong></div>` : ''}
        ${interest ? `<div class="admin-sub-field"><span>🎯 Interesse</span><strong>${escapeHtml2(interest)}</strong></div>` : ''}
      </div>
      ${challenge ? `<div class="admin-sub-text"><strong>Herausforderung:</strong><br>${escapeHtml2(challenge)}</div>` : ''}
      ${motivation ? `<div class="admin-sub-text"><strong>Motivation:</strong><br>${escapeHtml2(motivation)}</div>` : ''}
    </div>
    <div class="admin-submission-actions">
      <button class="admin-btn admin-btn-primary" onclick="approveAndGenerateEmail('${escapeForAttr(firstName)}', '${escapeForAttr(email)}', '${submission.id}')">
        ✓ Welcome-Email
      </button>
      ${telegram ? `<a href="https://t.me/${telegram.replace('@', '')}" target="_blank" class="admin-btn">💬 Telegram öffnen</a>` : ''}
      ${email ? `<button class="admin-btn" onclick="copyEmailAddress('${escapeForAttr(email)}')">📋 Email kopieren</button>` : ''}
      <button class="admin-btn admin-btn-subtle" onclick="setSubmissionStatus('${submission.id}', 'rejected', this)">✕ Ablehnen</button>
    </div>
  `;
  return card;
}

function statusLabel(status) {
  return {
    'new': 'NEU',
    'approved': '✓ FREIGESCHALTET',
    'rejected': '✕ ABGELEHNT'
  }[status] || 'NEU';
}

function setSubmissionStatus(id, status, btn) {
  localStorage.setItem('dircbot-submission-status-' + id, status);
  // Re-render this card's status
  if (btn) {
    const card = btn.closest('.admin-submission-card');
    if (card) {
      const statusEl = card.querySelector('.admin-submission-status');
      if (statusEl) {
        statusEl.className = 'admin-submission-status status-' + status;
        statusEl.textContent = statusLabel(status);
      }
    }
  }
}

function approveAndGenerateEmail(firstName, email, submissionId) {
  // Pre-fill the email generator with this person's data
  document.getElementById('emailFirstName').value = firstName;
  generateEmail();
  // Mark as approved
  setSubmissionStatus(submissionId, 'approved', null);
  // Re-render to update visual
  loadSubmissions();
  // Scroll to email generator
  const emailTool = document.querySelector('.admin-email-tool');
  if (emailTool) emailTool.scrollIntoView({ behavior: 'smooth', block: 'center' });
  showToast(`✉️ Email generiert für ${firstName}. Code dann kopieren und schicken an ${email}.`);
}

function copyEmailAddress(email) {
  navigator.clipboard.writeText(email).then(() => {
    showToast(`📋 ${email} kopiert!`);
  });
}

function escapeHtml2(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

function escapeForAttr(text) {
  if (!text) return '';
  return String(text).replace(/'/g, "\\'").replace(/"/g, '&quot;');
}


// ============== COST CALCULATOR (v8.5) ==============
function onCostModelChange() {
  const sel = document.getElementById('costModel');
  if (!sel) return;
  const opt = sel.options[sel.selectedIndex];
  const inPrice = opt.getAttribute('data-in');
  const outPrice = opt.getAttribute('data-out');
  if (inPrice !== null && outPrice !== null && sel.value !== 'custom') {
    document.getElementById('costInputPrice').value = inPrice;
    document.getElementById('costOutputPrice').value = outPrice;
  }
  recalcCost();
}

function recalcCost() {
  const inPrice = parseFloat(document.getElementById('costInputPrice')?.value || 0);
  const outPrice = parseFloat(document.getElementById('costOutputPrice')?.value || 0);
  const inTok = parseFloat(document.getElementById('costInputTokens')?.value || 0);
  const outTok = parseFloat(document.getElementById('costOutputTokens')?.value || 0);
  const msgPer = parseFloat(document.getElementById('costMsgPerTester')?.value || 0);
  const testers = parseFloat(document.getElementById('costTesters')?.value || 0);

  const totalMsgs = msgPer * testers;
  const totalInputTokens = totalMsgs * inTok;
  const totalOutputTokens = totalMsgs * outTok;

  const costInput = (totalInputTokens / 1_000_000) * inPrice;
  const costOutput = (totalOutputTokens / 1_000_000) * outPrice;
  const total = costInput + costOutput;

  const perTester = testers > 0 ? total / testers : 0;
  const perMsg = totalMsgs > 0 ? total / totalMsgs : 0;
  const inputPct = total > 0 ? Math.round(costInput / total * 100) : 0;
  const outputPct = 100 - inputPct;

  // Format numbers
  const fmt = (n) => '€' + n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmt4 = (n) => '€' + n.toLocaleString('de-DE', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  const fmtNum = (n) => Math.round(n).toLocaleString('de-DE');

  const setText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };

  setText('costTotal', fmt(total));
  setText('costTotalMeta', `${fmtNum(testers)} Tester × ${fmtNum(msgPer)} msgs = ${fmtNum(totalMsgs)} total`);
  setText('costPerTester', fmt(perTester));
  setText('costPerMsg', fmt4(perMsg));
  setText('costSplit', `${inputPct}% in / ${outputPct}% out`);
  setText('costTotalTokens', fmtNum(totalInputTokens + totalOutputTokens) + ' (' + fmtNum(totalInputTokens) + ' in / ' + fmtNum(totalOutputTokens) + ' out)');
}

function setCostScenario(testers, msgPerTester) {
  document.getElementById('costTesters').value = testers;
  document.getElementById('costMsgPerTester').value = msgPerTester;
  recalcCost();
}

function saveVariantB() {
  const text = document.getElementById('abVariantBPrompt')?.value || '';
  try {
    localStorage.setItem('dircbot-variant-b-prompt', text);
    showToast('💾 Variant-B-Prompt lokal gespeichert');
  } catch (e) {
    showToast('❌ Speichern fehlgeschlagen');
  }
}

function loadVariantB() {
  try {
    const saved = localStorage.getItem('dircbot-variant-b-prompt');
    const ta = document.getElementById('abVariantBPrompt');
    if (saved && ta) ta.value = saved;
  } catch (e) {}
}

// Init cost calc + variant on admin panel show
const _origShowAdminPanel = typeof showAdminPanel === 'function' ? showAdminPanel : null;
function bootstrapAdminAddons() {
  if (typeof recalcCost === 'function') recalcCost();
  loadVariantB();
}
// Run after page loads, then again when admin panel is shown
if (document.readyState !== 'loading') {
  setTimeout(bootstrapAdminAddons, 100);
} else {
  document.addEventListener('DOMContentLoaded', () => setTimeout(bootstrapAdminAddons, 100));
}


// ============== KB STATS (v8.13) ==============
async function loadKbStats() {
  const apiPass = getAdminApiPass();
  if (!apiPass) return;
  try {
    const res = await fetch('/.netlify/functions/kb-stats', {
      headers: { 'x-admin-pass': apiPass }
    });
    if (res.status === 401) {
      clearAdminApiPass();
      document.getElementById('kbBudgetHint').innerHTML = '🔴 <strong>Falsches API-Passwort.</strong> <a href="#" onclick="loadKbStats(); return false;">Nochmal versuchen</a>';
      return;
    }
    if (!res.ok) {
      console.warn('KB stats fetch failed:', res.status);
      document.getElementById('kbBudgetHint').textContent = 'Stats konnten nicht geladen werden (HTTP ' + res.status + ').';
      return;
    }
    const stats = await res.json();
    renderKbStats(stats);
  } catch (e) {
    console.error('KB stats error:', e);
    document.getElementById('kbBudgetHint').textContent = 'Netzwerk-Fehler: ' + e.message;
  }
}

function renderKbStats(stats) {
  const tokensEl = document.getElementById('kbTokens');
  const pctEl = document.getElementById('kbBudgetPct');
  const fillEl = document.getElementById('kbBudgetFill');
  const hintEl = document.getElementById('kbBudgetHint');

  if (tokensEl) tokensEl.textContent = stats.totalTokens.toLocaleString('de-DE');
  if (pctEl) pctEl.textContent = stats.budgetUsedPct + '%';
  if (fillEl) {
    fillEl.style.width = Math.min(stats.budgetUsedPct, 100) + '%';
    if (stats.budgetUsedPct < 50) {
      fillEl.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
    } else if (stats.budgetUsedPct < 80) {
      fillEl.style.background = 'linear-gradient(90deg, #c9a84c, #f59e0b)';
    } else {
      fillEl.style.background = 'linear-gradient(90deg, #f59e0b, #ef4444)';
    }
  }
  if (hintEl) {
    if (!stats.pdfParseAvailable) {
      hintEl.innerHTML = '⚠️ <strong>pdf-parse Modul nicht verfügbar.</strong> Nach Deploy automatisch installiert. Falls Problem bleibt: <code>npm install pdf-parse</code> in package.json prüfen.';
    } else if (stats.budgetUsedPct >= 95) {
      hintEl.innerHTML = '🔴 <strong>Budget fast voll!</strong> Spätere PDFs werden abgeschnitten. Reduziere oder steige auf RAG um.';
    } else if (stats.budgetUsedPct >= 80) {
      hintEl.innerHTML = '⚠️ Budget bei ' + stats.budgetUsedPct + '%. Bei weiteren PDFs auf RAG umsteigen erwägen.';
    } else if (stats.totalTokens === 0) {
      hintEl.innerHTML = 'Noch keine KB-Files. MD-Files sind in <code>knowledge-base/</code>, PDFs in <code>knowledge-base/pdfs/</code>.';
    } else {
      hintEl.innerHTML = '✅ Im sicheren Bereich. API-Cost pro Nachricht: ca. €' + (0.035 + (stats.totalTokens * 3 / 1000000) * 0.5).toFixed(3);
    }
  }

  // MD list
  const mdList = document.getElementById('kbMdList');
  if (mdList) {
    if (stats.md.length === 0) {
      mdList.innerHTML = '<div class="kb-empty">Keine MD-Files gefunden.</div>';
    } else {
      mdList.innerHTML = stats.md.map(f => `
        <div class="kb-file-row">
          <span class="kb-file-name">${escapeHtmlAdmin(f.file)}</span>
          <span class="kb-file-tokens">${f.tokens.toLocaleString('de-DE')} tok</span>
        </div>
      `).join('');
    }
  }

  // PDF list
  const pdfList = document.getElementById('kbPdfList');
  if (pdfList) {
    if (stats.pdf.length === 0) {
      pdfList.innerHTML = '<div class="kb-empty">Noch keine PDFs.<br>Drop in <code>knowledge-base/pdfs/</code></div>';
    } else {
      pdfList.innerHTML = stats.pdf.map(f => {
        let detail;
        if (f.error) detail = '<span class="kb-file-err">Fehler: ' + escapeHtmlAdmin(f.error) + '</span>';
        else if (f.empty) detail = '<span class="kb-file-err">Leer (gescannt? OCR nötig)</span>';
        else if (f.tokens) detail = `${f.tokens.toLocaleString('de-DE')} tok · ${f.pages || '?'} S.`;
        else detail = `${f.sizeKB} KB`;
        return `
          <div class="kb-file-row">
            <span class="kb-file-name">${escapeHtmlAdmin(f.file)}</span>
            <span class="kb-file-tokens">${detail}</span>
          </div>
        `;
      }).join('');
    }
  }
}

function escapeHtmlAdmin(s) {
  if (!s) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}


// ============== CACHE STATS DISPLAY (v8.14) ==============
function loadCacheStats() {
  try {
    const raw = localStorage.getItem('dircbot-cache-stats') || '[]';
    const stats = JSON.parse(raw);
    renderCacheStats(stats);
  } catch (e) {
    console.error('Cache stats load error:', e);
  }
}

function renderCacheStats(stats) {
  const hitRateEl = document.getElementById('cacheHitRate');
  const hitDetailEl = document.getElementById('cacheHitDetail');
  const savingsEl = document.getElementById('cacheSavings');
  const savingsDetailEl = document.getElementById('cacheSavingsDetail');
  const avgCostEl = document.getElementById('cacheAvgCost');
  const avgDetailEl = document.getElementById('cacheAvgDetail');
  const totalMsgsEl = document.getElementById('cacheTotalMsgs');
  const hintEl = document.getElementById('cacheStatsHint');

  if (totalMsgsEl) totalMsgsEl.textContent = stats.length;

  if (stats.length === 0) {
    if (hitRateEl) hitRateEl.textContent = '—';
    if (savingsEl) savingsEl.textContent = '—';
    if (avgCostEl) avgCostEl.textContent = '—';
    if (hintEl) hintEl.innerHTML = '🟡 <strong>Noch keine Daten.</strong> Sende mind. 3-5 Nachrichten als Tester (im Chat) damit die ersten Stats erscheinen. Cache braucht ~5sec zum aufzubauen, dann greift er auf Folge-Nachrichten.';
    return;
  }

  // Compute aggregates
  let totalCacheRead = 0, totalCacheWrite = 0, totalInput = 0, totalOutput = 0;
  let hits = 0; // messages where cacheRead > 0
  let writes = 0;
  stats.forEach(s => {
    totalCacheRead += s.cr || 0;
    totalCacheWrite += s.cw || 0;
    totalInput += s.i || 0;
    totalOutput += s.o || 0;
    if ((s.cr || 0) > 0) hits++;
    if ((s.cw || 0) > 0) writes++;
  });

  const hitRate = stats.length > 0 ? (hits / stats.length) * 100 : 0;
  if (hitRateEl) hitRateEl.textContent = hitRate.toFixed(0) + '%';
  if (hitDetailEl) hitDetailEl.textContent = `${hits} hits / ${writes} writes`;

  // Cost calc (Sonnet 4.6 pricing per 1M tokens):
  // - Cache read: $0.30 ($3 * 0.1)
  // - Cache write: $3.75 ($3 * 1.25)
  // - Regular input: $3
  // - Output: $15
  // Currency conversion ~1:1 USD/EUR for simplicity (close enough for estimates)
  const PRICE_CACHE_READ = 0.30 / 1_000_000;
  const PRICE_CACHE_WRITE = 3.75 / 1_000_000;
  const PRICE_INPUT = 3 / 1_000_000;
  const PRICE_OUTPUT = 15 / 1_000_000;

  const totalCost = totalCacheRead * PRICE_CACHE_READ
                  + totalCacheWrite * PRICE_CACHE_WRITE
                  + totalInput * PRICE_INPUT
                  + totalOutput * PRICE_OUTPUT;

  // Hypothetical cost without caching = (cacheRead + cacheWrite tokens would all be regular input)
  const cacheTokens = totalCacheRead + totalCacheWrite;
  const costWithoutCaching = (cacheTokens + totalInput) * PRICE_INPUT
                           + totalOutput * PRICE_OUTPUT;

  const savings = costWithoutCaching - totalCost;
  const savingsPct = costWithoutCaching > 0 ? (savings / costWithoutCaching) * 100 : 0;

  if (savingsEl) savingsEl.textContent = savingsPct.toFixed(0) + '%';
  if (savingsDetailEl) savingsDetailEl.textContent = '$' + savings.toFixed(4) + ' gespart';

  const avgCost = stats.length > 0 ? totalCost / stats.length : 0;
  if (avgCostEl) avgCostEl.textContent = '$' + avgCost.toFixed(4);
  if (avgDetailEl) {
    const avgWithoutCache = stats.length > 0 ? costWithoutCaching / stats.length : 0;
    avgDetailEl.textContent = `ohne Cache: $${avgWithoutCache.toFixed(4)}`;
  }

  if (hintEl) {
    if (hitRate >= 70) {
      hintEl.innerHTML = '✅ <strong>Caching läuft optimal.</strong> Hohe Hit-Rate = User chatten oft in Folge → Anthropic refresht den 5-Min-Cache automatisch.';
    } else if (hitRate >= 40) {
      hintEl.innerHTML = '🟡 <strong>OK.</strong> Cache greift, aber nicht maximal. Typisch wenn User längere Pausen machen oder Cache-Refresh aufs nächste Gespräch warten muss.';
    } else if (stats.length < 5) {
      hintEl.innerHTML = '🟡 <strong>Zu wenig Daten.</strong> Sende mind. 5 Nachrichten in einer Session damit der Cache greifen kann.';
    } else {
      hintEl.innerHTML = '🔴 <strong>Niedrige Hit-Rate.</strong> Möglich: zu lange Pausen zwischen Nachrichten (>5min läuft Cache ab) oder System-Prompt-Block ändert sich.';
    }
  }
}


// ============== KB MANAGEMENT (v8.15) ==============
// Upload, list, delete, toggle, preview KB files stored in Netlify Blobs

const KB_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// Centralized admin-api-pass getter that auto-prompts if not set yet.
// Uses sessionStorage (matches admin-submissions flow). Returns null if user cancels.
function getAdminApiPass() {
  let pass = sessionStorage.getItem('dircbot-admin-api-pass');
  if (!pass) {
    pass = prompt('Admin-API-Passwort (ADMIN_API_PASS aus Netlify Env Vars):');
    if (!pass) return null;
    sessionStorage.setItem('dircbot-admin-api-pass', pass);
  }
  return pass;
}

// Clear stored pass (called when API returns 401)
function clearAdminApiPass() {
  sessionStorage.removeItem('dircbot-admin-api-pass');
}

function initKbManager() {
  const dropZone = document.getElementById('kbUploadZone');
  const fileInput = document.getElementById('kbFileInput');
  if (!dropZone || !fileInput) return;

  // File input change
  fileInput.addEventListener('change', (e) => {
    handleKbFiles(Array.from(e.target.files));
    fileInput.value = ''; // reset
  });

  // Drag & drop
  ['dragenter', 'dragover'].forEach(ev => {
    dropZone.addEventListener(ev, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('drag-over');
    });
  });
  ['dragleave', 'drop'].forEach(ev => {
    dropZone.addEventListener(ev, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('drag-over');
    });
  });
  dropZone.addEventListener('drop', (e) => {
    const files = Array.from(e.dataTransfer.files);
    handleKbFiles(files);
  });
}

async function handleKbFiles(files) {
  if (!files.length) return;
  const validFiles = [];
  const errors = [];

  for (const file of files) {
    const ext = file.name.toLowerCase().split('.').pop();
    if (!['pdf', 'md', 'txt'].includes(ext)) {
      errors.push(`${file.name}: nicht unterstützt (nur PDF/MD/TXT)`);
      continue;
    }
    if (file.size > KB_MAX_FILE_SIZE) {
      errors.push(`${file.name}: zu groß (${Math.round(file.size / 1024 / 1024)}MB, max 10MB)`);
      continue;
    }
    validFiles.push(file);
  }

  if (errors.length) {
    alert('Fehler:\n' + errors.join('\n'));
  }
  if (!validFiles.length) return;

  // Upload sequentially with progress UI
  const progress = document.getElementById('kbUploadProgress');
  progress.style.display = 'block';
  progress.innerHTML = '';

  for (let i = 0; i < validFiles.length; i++) {
    const file = validFiles[i];
    const row = document.createElement('div');
    row.className = 'kb-upload-progress-row';
    row.innerHTML = `
      <span class="kb-progress-name">${escapeHtmlAdmin(file.name)}</span>
      <span class="kb-progress-status" id="kbProg-${i}">⏳ wird verarbeitet…</span>
    `;
    progress.appendChild(row);

    try {
      const base64 = await fileToBase64(file);
      const result = await uploadKbFile(file.name, base64, file.name.endsWith('.pdf') ? 'pdf' : 'md');
      if (result.error) {
        document.getElementById(`kbProg-${i}`).innerHTML = `❌ ${escapeHtmlAdmin(result.error)}`;
        document.getElementById(`kbProg-${i}`).className = 'kb-progress-status error';
      } else {
        document.getElementById(`kbProg-${i}`).innerHTML = `✅ ${result.file.tokens.toLocaleString('de-DE')} Tokens`;
        document.getElementById(`kbProg-${i}`).className = 'kb-progress-status success';
      }
    } catch (e) {
      document.getElementById(`kbProg-${i}`).innerHTML = `❌ ${escapeHtmlAdmin(e.message)}`;
      document.getElementById(`kbProg-${i}`).className = 'kb-progress-status error';
    }
  }

  // Reload list + budget
  await loadKbStats();

  // Auto-hide progress after 5s if no errors
  setTimeout(() => {
    const hasErrors = progress.querySelector('.kb-progress-status.error');
    if (!hasErrors) {
      progress.style.display = 'none';
      progress.innerHTML = '';
    }
  }, 5000);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // strip data URL prefix
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadKbFile(fileName, base64Data, fileType) {
  const apiPass = getAdminApiPass();
  if (!apiPass) return { error: 'Admin-Pass nicht eingegeben — abgebrochen.' };
  const res = await fetch('/.netlify/functions/kb-manage?action=upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-pass': apiPass
    },
    body: JSON.stringify({ fileName, fileType, fileData: base64Data })
  });
  if (res.status === 401) {
    clearAdminApiPass();
    return { error: 'Falsches API-Passwort. Refresh + neu versuchen.' };
  }
  return await res.json();
}

async function deleteKbFile(id, fileName) {
  if (!confirm(`Wirklich löschen: "${fileName}"?`)) return;
  const apiPass = getAdminApiPass();
  if (!apiPass) return;
  const res = await fetch(`/.netlify/functions/kb-manage?action=delete&id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { 'x-admin-pass': apiPass }
  });
  if (res.status === 401) {
    clearAdminApiPass();
    alert('Falsches API-Passwort. Bitte neu eingeben.');
    return;
  }
  const data = await res.json();
  if (data.error) {
    alert('Fehler: ' + data.error);
  } else {
    await loadKbStats();
  }
}

async function toggleKbFile(id) {
  const apiPass = getAdminApiPass();
  if (!apiPass) return;
  const res = await fetch(`/.netlify/functions/kb-manage?action=toggle&id=${encodeURIComponent(id)}`, {
    method: 'POST',
    headers: { 'x-admin-pass': apiPass }
  });
  if (res.status === 401) {
    clearAdminApiPass();
    alert('Falsches API-Passwort. Bitte neu eingeben.');
    return;
  }
  const data = await res.json();
  if (data.error) {
    alert('Fehler: ' + data.error);
  } else {
    await loadKbStats();
  }
}

async function previewKbFile(id, title) {
  const apiPass = getAdminApiPass();
  if (!apiPass) return;
  const res = await fetch(`/.netlify/functions/kb-manage?action=preview&id=${encodeURIComponent(id)}`, {
    headers: { 'x-admin-pass': apiPass }
  });
  if (res.status === 401) {
    clearAdminApiPass();
    alert('Falsches API-Passwort. Bitte neu eingeben.');
    return;
  }
  const data = await res.json();
  if (data.error) {
    alert('Fehler: ' + data.error);
    return;
  }
  const modal = document.getElementById('kbPreviewModal');
  document.getElementById('kbPreviewTitle').textContent = title || data.file.title || data.file.fileName;
  document.getElementById('kbPreviewMeta').innerHTML = `
    <span>${data.file.tokens?.toLocaleString('de-DE') || '—'} Tokens</span>
    <span>·</span>
    <span>${data.file.type.toUpperCase()}</span>
    ${data.file.pages ? `<span>·</span><span>${data.file.pages} Seiten</span>` : ''}
    ${data.file.sizeKB ? `<span>·</span><span>${data.file.sizeKB} KB</span>` : ''}
  `;
  const previewText = data.preview + (data.truncated ? '\n\n[...gekürzt, voller Text im Bot verfügbar...]' : '');
  document.getElementById('kbPreviewText').textContent = previewText;
  modal.classList.add('visible');
}

function closeKbPreview() {
  const modal = document.getElementById('kbPreviewModal');
  if (modal) modal.classList.remove('visible');
}

// Override the existing renderKbStats to handle the new blob list section
const _originalRenderKbStats = typeof renderKbStats === 'function' ? renderKbStats : null;
function renderKbStatsV15(stats) {
  // Budget bar (same as before)
  const tokensEl = document.getElementById('kbTokens');
  const pctEl = document.getElementById('kbBudgetPct');
  const fillEl = document.getElementById('kbBudgetFill');
  const hintEl = document.getElementById('kbBudgetHint');

  if (tokensEl) tokensEl.textContent = stats.totalTokens.toLocaleString('de-DE');
  if (pctEl) pctEl.textContent = stats.budgetUsedPct + '%';
  if (fillEl) {
    fillEl.style.width = Math.min(stats.budgetUsedPct, 100) + '%';
    if (stats.budgetUsedPct < 50) fillEl.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
    else if (stats.budgetUsedPct < 80) fillEl.style.background = 'linear-gradient(90deg, #c9a84c, #f59e0b)';
    else fillEl.style.background = 'linear-gradient(90deg, #f59e0b, #ef4444)';
  }
  if (hintEl) {
    if (!stats.pdfParseAvailable) {
      hintEl.innerHTML = '⚠️ <strong>pdf-parse Modul nicht verfügbar.</strong> Wird beim nächsten Deploy automatisch installiert.';
    } else if (stats.budgetUsedPct >= 95) {
      hintEl.innerHTML = '🔴 <strong>Budget fast voll!</strong> Reduziere Files oder steige auf RAG um.';
    } else if (stats.budgetUsedPct >= 80) {
      hintEl.innerHTML = '⚠️ Budget bei ' + stats.budgetUsedPct + '%. Bei weiteren Files auf RAG umsteigen erwägen.';
    } else if (stats.totalTokens === 0) {
      hintEl.innerHTML = '👇 Lade deine ersten Files hoch — Drop sie in die Zone unten.';
    } else {
      const estCost = 0.0017 + (stats.totalTokens * 0.3 / 1000000); // with caching
      hintEl.innerHTML = `✅ Im sicheren Bereich. API-Cost pro Nachricht (mit Caching): ca. $${estCost.toFixed(4)}`;
    }
  }

  // Repo MD/PDF lists (read-only)
  const mdList = document.getElementById('kbMdList');
  if (mdList) {
    mdList.innerHTML = stats.md.length === 0
      ? '<div class="kb-empty">Keine MD-Files im Repo.</div>'
      : stats.md.map(f => `
        <div class="kb-file-row">
          <span class="kb-file-name">${escapeHtmlAdmin(f.file)}</span>
          <span class="kb-file-tokens">${f.tokens.toLocaleString('de-DE')} tok</span>
        </div>
      `).join('');
  }

  const pdfList = document.getElementById('kbPdfList');
  if (pdfList) {
    pdfList.innerHTML = stats.pdf.length === 0
      ? '<div class="kb-empty">Keine PDFs im Repo.</div>'
      : stats.pdf.map(f => {
        let detail = f.error ? '<span class="kb-file-err">Fehler</span>'
          : f.empty ? '<span class="kb-file-err">Leer (OCR?)</span>'
          : f.tokens ? `${f.tokens.toLocaleString('de-DE')} tok · ${f.pages || '?'} S.`
          : `${f.sizeKB} KB`;
        return `<div class="kb-file-row"><span class="kb-file-name">${escapeHtmlAdmin(f.file)}</span><span class="kb-file-tokens">${detail}</span></div>`;
      }).join('');
  }

  // Blob KB files (managed via UI) — split into active and inactive
  const blobs = stats.blobs || [];
  const active = blobs.filter(f => f.active !== false);
  const inactive = blobs.filter(f => f.active === false);

  document.getElementById('kbActiveCount').textContent = active.length;
  document.getElementById('kbInactiveCount').textContent = inactive.length;
  document.getElementById('kbInactiveDetails').style.display = inactive.length > 0 ? 'block' : 'none';

  const activeList = document.getElementById('kbActiveList');
  const inactiveList = document.getElementById('kbInactiveList');

  const renderRow = (file, isActive) => {
    const typeIcon = file.type === 'pdf' ? '📕' : '📄';
    return `
      <div class="kb-managed-row ${isActive ? '' : 'inactive'}">
        <div class="kb-managed-icon">${typeIcon}</div>
        <div class="kb-managed-main">
          <div class="kb-managed-title">${escapeHtmlAdmin(file.title || file.fileName)}</div>
          <div class="kb-managed-meta">
            <span>${(file.tokens || 0).toLocaleString('de-DE')} tok</span>
            ${file.pages ? `· <span>${file.pages} Seiten</span>` : ''}
            ${file.sizeKB ? `· <span>${file.sizeKB} KB</span>` : ''}
            · <span>${formatRelTime(file.uploadedAt)}</span>
          </div>
        </div>
        <div class="kb-managed-actions">
          <button class="kb-action-btn" onclick="previewKbFile('${file.id}', '${escapeHtmlAdmin(file.title || file.fileName).replace(/'/g, "\\'")}')" title="Preview">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="kb-action-btn ${isActive ? 'active-toggle' : ''}" onclick="toggleKbFile('${file.id}')" title="${isActive ? 'Deaktivieren' : 'Aktivieren'}">
            ${isActive
              ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
              : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>'}
          </button>
          <button class="kb-action-btn danger" onclick="deleteKbFile('${file.id}', '${escapeHtmlAdmin(file.fileName).replace(/'/g, "\\'")}')" title="Löschen">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `;
  };

  if (activeList) {
    activeList.innerHTML = active.length === 0
      ? '<div class="kb-empty">Noch keine Files aktiv. Drop deine ersten PDFs/MDs oben rein.</div>'
      : active.map(f => renderRow(f, true)).join('');
  }

  if (inactiveList) {
    inactiveList.innerHTML = inactive.length === 0
      ? ''
      : inactive.map(f => renderRow(f, false)).join('');
  }
}

function formatRelTime(timestamp) {
  if (!timestamp) return '—';
  const diff = Date.now() - timestamp;
  const min = Math.floor(diff / 60000);
  const hr = Math.floor(diff / 3600000);
  const day = Math.floor(diff / 86400000);
  if (min < 1) return 'gerade eben';
  if (min < 60) return `vor ${min} min`;
  if (hr < 24) return `vor ${hr} h`;
  if (day < 7) return `vor ${day} d`;
  return new Date(timestamp).toLocaleDateString('de-DE');
}

// Hook into loadKbStats to call our v15 renderer
window.renderKbStats = renderKbStatsV15;

// Init drop zone after admin shows
const _origShowAdmin = typeof showAdmin === 'function' ? showAdmin : null;
window.showAdmin = function() {
  if (_origShowAdmin) _origShowAdmin();
  setTimeout(initKbManager, 100);
};
