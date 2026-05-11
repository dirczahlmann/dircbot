// ============== DIRCBOT CLIENT-SIDE JS ==============

// ---- STATE ----
let conversationHistory = [];
let messagesLeft = 3;
let isLoading = false;
let attachedFile = null; // { name, size, type, base64, dataUrl, isImage }

// ---- LANGUAGE ----
function setLang(lang) {
  document.body.className = 'lang-' + lang;
  ['en','de','es'].forEach(l => {
    const btn = document.getElementById('btn-' + l);
    if (btn) btn.classList.toggle('active', l === lang);
  });
  const input = document.getElementById('userInput');
  input.placeholder = input.getAttribute('data-placeholder-' + lang) || '';
  localStorage.setItem('dircbot-lang', lang);
}

(function initLang() {
  const saved = localStorage.getItem('dircbot-lang') || 'de';
  setLang(saved);
})();

// ---- SUGGESTED QUESTIONS ----
const suggestedQuestions = {
  1: {
    en: "My prospect just said 'I need to think about it.' What do I do?",
    de: "Mein Interessent sagt gerade 'Ich muss noch nachdenken.' Was tun?",
    es: "Mi prospecto dijo 'Necesito pensarlo'. ¿Qué hago?"
  },
  2: {
    en: "Should I DCA into Bitcoin at this price level?",
    de: "Soll ich auf diesem Preisniveau in Bitcoin DCA-en?",
    es: "¿Debería hacer DCA en Bitcoin a este nivel de precio?"
  },
  3: {
    en: "How do I scale my business to the next level?",
    de: "Wie skaliere ich mein Business auf das nächste Level?",
    es: "¿Cómo escalo mi negocio al siguiente nivel?"
  }
};

function currentLang() {
  if (document.body.classList.contains('lang-en')) return 'en';
  if (document.body.classList.contains('lang-es')) return 'es';
  return 'de';
}

function askSuggested(id) {
  const text = suggestedQuestions[id][currentLang()];
  document.getElementById('userInput').value = text;
  sendMessage(new Event('submit'));
}

// ---- FILE UPLOAD ----
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_TYPES = ['image/png','image/jpeg','image/jpg','image/gif','image/webp'];
const ALLOWED_DOC_TYPES = ['application/pdf'];

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  const lang = currentLang();

  if (file.size > MAX_FILE_SIZE) {
    alert({
      en: 'File too large. Maximum 5 MB.',
      de: 'Datei zu groß. Maximal 5 MB.',
      es: 'Archivo demasiado grande. Máximo 5 MB.'
    }[lang]);
    event.target.value = '';
    return;
  }

  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isDoc = ALLOWED_DOC_TYPES.includes(file.type);
  if (!isImage && !isDoc) {
    alert({
      en: 'Only images (PNG, JPG, GIF, WebP) and PDFs are supported.',
      de: 'Nur Bilder (PNG, JPG, GIF, WebP) und PDFs werden unterstützt.',
      es: 'Solo se admiten imágenes (PNG, JPG, GIF, WebP) y PDFs.'
    }[lang]);
    event.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    const base64 = dataUrl.split(',')[1];
    attachedFile = {
      name: file.name,
      size: file.size,
      type: file.type,
      base64,
      dataUrl,
      isImage
    };
    showFilePreview();
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}

function showFilePreview() {
  if (!attachedFile) return;
  const preview = document.getElementById('filePreview');
  const icon = document.getElementById('filePreviewIcon');
  const name = document.getElementById('filePreviewName');
  const size = document.getElementById('filePreviewSize');

  if (attachedFile.isImage) {
    icon.innerHTML = `<img src="${attachedFile.dataUrl}" alt="">`;
  } else {
    icon.innerHTML = '📄';
  }
  name.textContent = attachedFile.name;
  size.textContent = formatBytes(attachedFile.size);
  preview.classList.add('visible');
}

function removeAttachment() {
  attachedFile = null;
  document.getElementById('filePreview').classList.remove('visible');
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB';
  return (bytes/(1024*1024)).toFixed(1) + ' MB';
}

// ---- MESSAGE RENDERING ----
function addMessage(role, content, attachment) {
  const chatBody = document.getElementById('chatBody');
  const msg = document.createElement('div');
  msg.className = 'msg ' + role;

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';

  if (attachment) {
    const attEl = document.createElement('div');
    attEl.className = 'msg-attachment' + (attachment.isImage ? '' : ' file');
    if (attachment.isImage) {
      attEl.innerHTML = `<img src="${attachment.dataUrl}" alt="${escapeHtml(attachment.name)}">`;
    } else {
      attEl.innerHTML = `<span class="file-icon">📄</span><span class="file-name">${escapeHtml(attachment.name)}</span>`;
    }
    bubble.appendChild(attEl);
  }

  if (content) {
    const textEl = document.createElement('div');
    textEl.innerHTML = formatMessage(content);
    bubble.appendChild(textEl);
  }

  msg.appendChild(bubble);
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
  return msg;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatMessage(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

function showTyping() {
  const chatBody = document.getElementById('chatBody');
  const msg = document.createElement('div');
  msg.className = 'msg bot';
  msg.id = 'typing-indicator';
  msg.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function hideTyping() {
  const t = document.getElementById('typing-indicator');
  if (t) t.remove();
}

// ---- SEND MESSAGE ----
async function sendMessage(e) {
  if (e) e.preventDefault();
  if (isLoading || messagesLeft <= 0) return;

  const input = document.getElementById('userInput');
  const text = input.value.trim();
  if (!text && !attachedFile) return;

  const lang = currentLang();
  const userAttachment = attachedFile ? { ...attachedFile } : null;
  addMessage('user', text, userAttachment);

  // Build API content
  let userContent;
  if (attachedFile) {
    userContent = [];
    if (attachedFile.isImage) {
      userContent.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: attachedFile.type,
          data: attachedFile.base64
        }
      });
    } else {
      userContent.push({
        type: 'document',
        source: {
          type: 'base64',
          media_type: attachedFile.type,
          data: attachedFile.base64
        }
      });
    }
    userContent.push({
      type: 'text',
      text: text || {
        en: 'Take a look at this and give me your read.',
        de: 'Schau dir das mal an und gib mir deine Einschätzung.',
        es: 'Echa un vistazo y dame tu opinión.'
      }[lang]
    });
  } else {
    userContent = text;
  }

  conversationHistory.push({ role: 'user', content: userContent });

  input.value = '';
  removeAttachment();
  isLoading = true;
  document.getElementById('sendBtn').disabled = true;
  document.getElementById('attachBtn').disabled = true;
  input.disabled = true;
  showTyping();

  try {
    const response = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: conversationHistory,
        language: lang
      })
    });

    hideTyping();
    if (!response.ok) throw new Error('API error: ' + response.status);

    const data = await response.json();
    const reply = data.reply || {
      en: 'Hmm, something went wrong. Try again.',
      de: 'Hmm, da ging was schief. Versuch es nochmal.',
      es: 'Hmm, algo salió mal. Inténtalo de nuevo.'
    }[lang];

    addMessage('bot', reply);
    conversationHistory.push({ role: 'assistant', content: reply });

    messagesLeft--;
    ['counter','counter-de','counter-es'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = messagesLeft;
    });

    if (messagesLeft <= 0) {
      input.disabled = true;
      document.getElementById('sendBtn').disabled = true;
      document.getElementById('attachBtn').disabled = true;
      setTimeout(() => {
        const cta = document.getElementById('ctaSection');
        cta.classList.add('visible');
        cta.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 800);
    } else {
      input.disabled = false;
      document.getElementById('sendBtn').disabled = false;
      document.getElementById('attachBtn').disabled = false;
      input.focus();
    }
  } catch (err) {
    hideTyping();
    console.error(err);
    const errorMsg = {
      en: '⚠️ Connection failed. Please try again in a moment.',
      de: '⚠️ Verbindung fehlgeschlagen. Bitte versuche es gleich nochmal.',
      es: '⚠️ Conexión fallida. Por favor inténtalo de nuevo en un momento.'
    }[lang];
    addMessage('bot', errorMsg);
    input.disabled = false;
    document.getElementById('sendBtn').disabled = false;
    document.getElementById('attachBtn').disabled = false;
  } finally {
    isLoading = false;
  }
}

// ---- EMAIL SIGNUP ----
async function signUp(e) {
  e.preventDefault();
  const form = document.getElementById('emailForm');
  const formData = new FormData(form);

  try {
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    });
  } catch (err) {
    console.error(err);
  }
  form.style.display = 'none';
  document.getElementById('successMsg').classList.add('visible');
  return false;
}
