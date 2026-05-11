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
