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
DircBot · 8 KI-Modelle · 30 Jahre Meisterschaft

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
