// ============== DIRCBOT v8 — APP.JS ==============
// 3 free messages → tester wall → 500 messages
// Topic sidebar, voice input, copy/share, try-another

let currentLang = 'de';
let freeMessagesUsed = 0;
let testerMode = false;
let testerCode = null;
let testerMessagesUsed = 0;
let currentTopic = null;
let attachedFile = null;
let attachedFileData = null;
let conversationHistory = [];
let lastUserMessage = null;
let lastUserFileData = null;
let isListening = false;
let recognition = null;

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initLanguage();
  renderTopics();
  applyMode();
  setupVoiceRecognition();
  updateCounters();
  // Load projects (independent of tester mode for now)
  if (typeof loadProjects === 'function') loadProjects();

  // If already in tester mode on load, render sidebar components
  if (testerMode) {
    setTimeout(() => {
      if (typeof renderProfileCard === 'function') renderProfileCard();
      if (typeof renderDailyFocus === 'function') renderDailyFocus();
      if (typeof renderProjects === 'function') renderProjects();
      if (typeof renderProjectContext === 'function') renderProjectContext();
      if (typeof renderChatHistory === 'function') renderChatHistory();
    }, 100);
  }
});

function loadState() {
  try {
    currentLang = localStorage.getItem('dircbot-lang') || 'de';
    freeMessagesUsed = parseInt(localStorage.getItem('dircbot-free-used') || '0', 10);
    testerCode = localStorage.getItem('dircbot-tester-code') || null;
    testerMessagesUsed = parseInt(localStorage.getItem('dircbot-tester-used') || '0', 10);
    if (testerCode && VALID_TESTER_CODES.includes(testerCode.toUpperCase())) {
      testerMode = true;
    }
  } catch (e) {}
}

function saveState() {
  try {
    localStorage.setItem('dircbot-lang', currentLang);
    localStorage.setItem('dircbot-free-used', String(freeMessagesUsed));
    if (testerCode) localStorage.setItem('dircbot-tester-code', testerCode);
    localStorage.setItem('dircbot-tester-used', String(testerMessagesUsed));
  } catch (e) {}
}

function initLanguage() { setLang(currentLang, true); }

function setLang(lang, silent) {
  currentLang = lang;
  document.body.classList.remove('lang-en', 'lang-de', 'lang-es');
  document.body.classList.add('lang-' + lang);
  document.documentElement.setAttribute('lang', lang);
  ['en','de','es'].forEach(l => {
    const btn = document.getElementById('btn-' + l);
    if (btn) btn.classList.toggle('active', l === lang);
  });
  const input = document.getElementById('userInput');
  if (input) {
    const ph = input.getAttribute('data-placeholder-' + lang);
    if (ph) input.placeholder = ph;
  }
  if (!silent) {
    saveState();
    renderTopics();
  }
}

function applyMode() {
  document.body.classList.remove('mode-free', 'mode-tester');
  document.body.classList.add(testerMode ? 'mode-tester' : 'mode-free');
}

function enterTesterMode(code) {
  testerMode = true;
  testerCode = code.toUpperCase();
  testerMessagesUsed = 0;
  applyMode();
  saveState();
  updateCounters();
  renderTopics();
  closeTesterWall();

  // After entering tester mode, render profile + history + daily focus + projects
  if (typeof renderProfileCard === 'function') renderProfileCard();
  if (typeof renderDailyFocus === 'function') renderDailyFocus();
  if (typeof renderProjects === 'function') renderProjects();
  if (typeof renderProjectContext === 'function') renderProjectContext();
  if (typeof renderChatHistory === 'function') renderChatHistory();

  // If no profile yet, prompt to create one
  setTimeout(() => {
    if (typeof hasProfile === 'function' && !hasProfile() && typeof openProfileModal === 'function') {
      openProfileModal(false);
    }
  }, 500);

  setTimeout(() => {
    const cw = document.querySelector('.chat-wrapper');
    if (cw) cw.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 200);
}

function openTesterWall() {
  const wall = document.getElementById('testerWall');
  if (wall) {
    wall.classList.add('visible');
    setTimeout(() => {
      const inp = document.getElementById('testerCodeInput');
      if (inp) inp.focus();
    }, 100);
  }
}

function closeTesterWall() {
  const wall = document.getElementById('testerWall');
  if (wall) wall.classList.remove('visible');
  const err = document.getElementById('testerWallError');
  if (err) err.textContent = '';
}

function submitTesterCode(e) {
  e.preventDefault();
  const input = document.getElementById('testerCodeInput');
  const err = document.getElementById('testerWallError');
  const code = (input.value || '').trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
  if (VALID_TESTER_CODES.includes(code)) {
    err.textContent = '';
    enterTesterMode(code);
  } else {
    const msgs = {
      en: 'Invalid code. Please check and try again.',
      de: 'Ungültiger Code. Bitte überprüfen und erneut versuchen.',
      es: 'Código inválido. Por favor verifica e intenta de nuevo.'
    };
    err.textContent = msgs[currentLang] || msgs.en;
    input.value = '';
    input.focus();
  }
}

function openTesterLimitWall() {
  const wall = document.getElementById('testerLimitWall');
  if (wall) wall.classList.add('visible');
}

function renderTopics() {
  // Topics now render in the top topic-bar (no longer in sidebar)
  const bar = document.getElementById('topicBar');
  if (!bar) return;
  bar.innerHTML = '';
  TOPICS.forEach(topic => {
    const chip = document.createElement('button');
    chip.className = 'topic-pill';
    chip.dataset.topicId = topic.id;
    if (currentTopic && currentTopic.id === topic.id) chip.classList.add('active');
    chip.style.setProperty('--pill-color', topic.color);
    const label = (topic.short && topic.short[currentLang]) || topic.name[currentLang];
    chip.title = topic.name[currentLang]; // full name on hover
    chip.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="' + topic.icon + '"/></svg><span>' + label + '</span>';
    chip.onclick = () => selectTopic(topic.id);
    bar.appendChild(chip);
  });
}

function selectTopic(topicId) {
  const topic = TOPICS.find(t => t.id === topicId);
  if (!topic) return;
  currentTopic = topic;
  document.querySelectorAll('.topic-pill').forEach(el => {
    el.classList.toggle('active', el.dataset.topicId === topicId);
  });
  const header = document.getElementById('topicHeader');
  const hIcon = document.getElementById('topicHeaderIcon');
  const hName = document.getElementById('topicHeaderName');
  const hIntro = document.getElementById('topicHeaderIntro');
  if (header && hIcon && hName && hIntro) {
    hIcon.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + topic.icon + '"/></svg>';
    hIcon.style.color = topic.color;
    hIcon.style.background = topic.color + '15';
    hName.textContent = topic.name[currentLang];
    hIntro.textContent = topic.intro[currentLang];
    header.classList.add('visible');
  }
  renderTopicSuggestions(topic);
  setTimeout(() => {
    const cw = document.querySelector('.chat-wrapper');
    if (cw) cw.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function clearTopic() {
  currentTopic = null;
  document.querySelectorAll('.topic-pill').forEach(el => el.classList.remove('active'));
  const header = document.getElementById('topicHeader');
  if (header) header.classList.remove('visible');
  const sug = document.getElementById('topicSuggestions');
  if (sug) { sug.classList.remove('visible'); sug.innerHTML = ''; }
}

function renderTopicSuggestions(topic) {
  const container = document.getElementById('topicSuggestions');
  if (!container) return;
  container.innerHTML = '';
  topic.suggestions.forEach(s => {
    const card = document.createElement('button');
    card.className = 'topic-suggestion-card';
    card.style.setProperty('--topic-color', topic.color);
    card.textContent = s[currentLang];
    card.onclick = () => {
      askQuestion(s[currentLang]);
      container.classList.remove('visible');
    };
    container.appendChild(card);
  });
  container.classList.add('visible');
}

function newChat() {
  conversationHistory = [];
  if (typeof currentChatId !== 'undefined') currentChatId = null;
  clearTopic();
  const cb = document.getElementById('chatBody');
  if (cb) {
    cb.classList.add('has-welcome');
    cb.innerHTML = `
      <div class="welcome-state welcome-state-v2" id="welcomeState">
        <img src="/assets/dircbot_logo.png?v=11" alt="DircBot — Your AI. Your Edge." class="welcome-logo">
        <h2 class="welcome-heading">
          <span data-lang="en">Hey — I'm DircBot</span>
          <span data-lang="de">Hey — ich bin DircBot</span>
          <span data-lang="es">Hey — soy DircBot</span>
        </h2>
        <p class="welcome-sub">
          <span data-lang="en">30 years of sales mastery. 15 years in crypto. 8 unicorns built. Pick a topic above or ask me anything.</span>
          <span data-lang="de">30 Jahre Vertriebs-Expertise. 15 Jahre Crypto. 8 Unicorns aufgebaut. Wähl ein Thema oben oder frag mich alles.</span>
          <span data-lang="es">30 años de maestría en ventas. 15 años en crypto. 8 unicornios construidos. Elige un tema arriba o pregúntame lo que sea.</span>
        </p>
        <div class="welcome-suggestions">
          <button class="welcome-card" onclick="askSuggested(1)">
            <div class="welcome-card-title"><span data-lang="en">Sales objection</span><span data-lang="de">Vertriebs-Einwand</span><span data-lang="es">Objeción de ventas</span></div>
            <div class="welcome-card-desc"><span data-lang="en">"I need to think about it" — how to handle</span><span data-lang="de">"Ich muss noch nachdenken" — wie umgehen</span><span data-lang="es">"Necesito pensarlo" — cómo manejar</span></div>
          </button>
          <button class="welcome-card" onclick="askSuggested(2)">
            <div class="welcome-card-title"><span data-lang="en">Bitcoin DCA</span><span data-lang="de">Bitcoin DCA</span><span data-lang="es">DCA Bitcoin</span></div>
            <div class="welcome-card-desc"><span data-lang="en">Should I keep buying at this level?</span><span data-lang="de">Soll ich auf diesem Level weiterkaufen?</span><span data-lang="es">¿Sigo comprando a este nivel?</span></div>
          </button>
          <button class="welcome-card" onclick="askSuggested(3)">
            <div class="welcome-card-title"><span data-lang="en">Scale my business</span><span data-lang="de">Business skalieren</span><span data-lang="es">Escalar mi negocio</span></div>
            <div class="welcome-card-desc"><span data-lang="en">Next-level moves for serious operators</span><span data-lang="de">Next-Level Moves für ernsthafte Operators</span><span data-lang="es">Movimientos de siguiente nivel</span></div>
          </button>
          <button class="welcome-card" onclick="askSuggested(4)">
            <div class="welcome-card-title"><span data-lang="en">AI for my business</span><span data-lang="de">AI für mein Business</span><span data-lang="es">IA para mi negocio</span></div>
            <div class="welcome-card-desc"><span data-lang="en">Where do I actually start in 2026?</span><span data-lang="de">Wo fang ich 2026 wirklich an?</span><span data-lang="es">¿Por dónde empiezo realmente en 2026?</span></div>
          </button>
        </div>
      </div>
    `;
  }
  // Hide topic suggestions and free question area
  const sug = document.getElementById('topicSuggestions');
  if (sug) sug.classList.remove('visible');
  const qa = document.getElementById('questionArea');
  if (qa) qa.style.display = 'none';
  if (typeof renderChatHistory === 'function') renderChatHistory();
}

function updateCounters() {
  const freeRemaining = Math.max(0, FREE_MESSAGE_QUOTA - freeMessagesUsed);
  ['counter','counter-de','counter-es'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = freeRemaining;
  });
  const cv = document.getElementById('msgCounterValue');
  if (cv) cv.textContent = testerMessagesUsed;
  const fill = document.getElementById('msgProgressFill');
  if (fill) {
    const pct = Math.min(100, (testerMessagesUsed / TESTER_MESSAGE_QUOTA) * 100);
    fill.style.width = pct + '%';
    if (pct < 70) fill.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
    else if (pct < 90) fill.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
    else fill.style.background = 'linear-gradient(90deg, #e8420a, #ef4444)';
  }
}

function canSendMessage() {
  if (testerMode) return testerMessagesUsed < TESTER_MESSAGE_QUOTA;
  return freeMessagesUsed < FREE_MESSAGE_QUOTA;
}

function incrementMessageCount() {
  if (testerMode) testerMessagesUsed++;
  else freeMessagesUsed++;
  saveState();
  updateCounters();
}

function askSuggested(idx) {
  const q = {
    1: { en: 'My prospect said "I need to think about it." What do I do?', de: 'Mein Interessent sagt "Ich muss noch nachdenken." Was tun?', es: 'Mi prospecto dijo "Necesito pensarlo". ¿Qué hago?' },
    2: { en: 'Should I DCA into Bitcoin at this level?', de: 'Soll ich auf diesem Level in Bitcoin DCA-en?', es: '¿Debería hacer DCA en Bitcoin a este nivel?' },
    3: { en: 'How do I scale my business to the next level?', de: 'Wie skaliere ich mein Business auf das nächste Level?', es: '¿Cómo escalo mi negocio al siguiente nivel?' },
    4: { en: 'How do I actually start using AI in my business in 2026?', de: 'Wie fang ich 2026 wirklich an AI in meinem Business zu nutzen?', es: '¿Cómo empiezo realmente a usar IA en mi negocio en 2026?' }
  }[idx];
  if (q) askQuestion(q[currentLang]);
}

function askQuestion(text) {
  const input = document.getElementById('userInput');
  if (input) input.value = text;
  sendMessage(new Event('submit'));
}

async function sendMessage(e) {
  if (e && e.preventDefault) e.preventDefault();
  const input = document.getElementById('userInput');
  const text = (input.value || '').trim();
  if (!text && !attachedFileData) return;
  if (!canSendMessage()) {
    if (testerMode) openTesterLimitWall();
    else openTesterWall();
    return;
  }

  // Hide topic suggestions and question area once any message is sent
  const sug = document.getElementById('topicSuggestions');
  if (sug) sug.classList.remove('visible');
  const qa = document.getElementById('questionArea');
  if (qa) qa.style.display = 'none';

  lastUserMessage = text;
  lastUserFileData = attachedFileData;
  appendMessage('user', text, attachedFile ? { type: attachedFile.type, name: attachedFile.name } : null);
  input.value = '';
  const fileToSend = attachedFileData;
  removeAttachment();
  await callBot(text, fileToSend);
  incrementMessageCount();
}

async function callBot(text, fileData) {
  const typingId = appendTyping();
  try {
    const payload = {
      message: text,
      language: currentLang,
      conversationHistory: conversationHistory.slice(-10),
      topic: currentTopic ? currentTopic.id : null
    };
    // Inject user profile and memories
    if (typeof getProfilePrompt === 'function') {
      const profilePrompt = getProfilePrompt();
      if (profilePrompt) payload.userContext = profilePrompt;
    }
    if (typeof getMemoriesPrompt === 'function') {
      const memPrompt = getMemoriesPrompt();
      if (memPrompt) payload.userMemories = memPrompt;
    }
    // Inject current project context (if user is working in a project)
    if (typeof getProjectPrompt === 'function') {
      const projPrompt = getProjectPrompt();
      if (projPrompt) payload.projectContext = projPrompt;
    }
    if (fileData) {
      payload.fileData = fileData.data;
      payload.fileType = fileData.type;
      payload.fileName = fileData.name;
    }
    const response = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    removeTyping(typingId);
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    const botText = data.response || data.message || 'Hmm — something went wrong. Try again?';

    // Auto-memory: strip <<MEMORY>> blocks from displayed text, save silently
    let displayText = botText;
    let newlyAddedMemories = [];
    if (typeof extractMemoryBlock === 'function') {
      const ex = extractMemoryBlock(botText);
      displayText = ex.cleanText;
      if (ex.memories && ex.memories.length > 0 && typeof saveAutoMemories === 'function') {
        newlyAddedMemories = saveAutoMemories(ex.memories) || [];
      }
    }

    appendMessage('bot', displayText);

    // After bot message, render memory-confirmation chips (if any new memories)
    if (newlyAddedMemories.length > 0) {
      renderMemoryChips(newlyAddedMemories);
    }

    conversationHistory.push({ role: 'user', content: text });
    conversationHistory.push({ role: 'assistant', content: displayText });

    // Save to chat history (cleaned text, not raw with markers)
    if (typeof appendToCurrentChat === 'function') {
      appendToCurrentChat('user', text);
      appendToCurrentChat('assistant', displayText);
    }
  } catch (err) {
    removeTyping(typingId);
    const em = {
      en: 'Connection issue. Please try again.',
      de: 'Verbindungsproblem. Bitte erneut versuchen.',
      es: 'Problema de conexión. Por favor intenta de nuevo.'
    };
    appendMessage('bot', em[currentLang] || em.en);
    console.error('Bot error:', err);
  }
}

async function tryAnother() {
  if (!lastUserMessage && !lastUserFileData) return;
  if (!canSendMessage()) {
    if (testerMode) openTesterLimitWall();
    else openTesterWall();
    return;
  }
  const messages = document.querySelectorAll('.msg.bot');
  if (messages.length > 0) messages[messages.length - 1].remove();
  if (conversationHistory.length > 0 && conversationHistory[conversationHistory.length - 1].role === 'assistant') {
    conversationHistory.pop();
  }
  await callBot(lastUserMessage, lastUserFileData);
  incrementMessageCount();
}

function appendMessage(role, text, attachment) {
  const cb = document.getElementById('chatBody');
  if (!cb) return;
  // Remove welcome state from DOM (not just hide) once chat starts.
  // Using display:none would leave it in DOM and the :has() selector
  // would still match, breaking the flex layout for subsequent messages.
  const welcome = document.getElementById('welcomeState');
  if (welcome) welcome.remove();
  cb.classList.remove('has-welcome');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'msg ' + role;
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  if (attachment && role === 'user') {
    const att = document.createElement('div');
    att.className = 'msg-attachment';
    const isImg = attachment.type && attachment.type.startsWith('image/');
    const iconSvg = isImg
      ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'
      : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
    att.innerHTML = iconSvg + ' ' + attachment.name;
    bubble.appendChild(att);
  }
  const txt = document.createElement('div');
  txt.className = 'msg-text';
  txt.textContent = text;
  bubble.appendChild(txt);
  msgDiv.appendChild(bubble);

  if (role === 'bot' && text && text.length > 0) {
    const actions = document.createElement('div');
    actions.className = 'msg-actions';
    const labels = {
      copy: { en: 'Copy', de: 'Kopieren', es: 'Copiar' }[currentLang],
      share: { en: 'Share', de: 'Teilen', es: 'Compartir' }[currentLang],
      another: { en: 'Try another', de: 'Andere Antwort', es: 'Otra' }[currentLang]
    };
    const copyBtn = document.createElement('button');
    copyBtn.className = 'msg-action-btn';
    copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span>' + labels.copy + '</span>';
    copyBtn.onclick = () => copyToClipboard(text, copyBtn);
    actions.appendChild(copyBtn);

    const shareBtn = document.createElement('button');
    shareBtn.className = 'msg-action-btn';
    shareBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg><span>' + labels.share + '</span>';
    shareBtn.onclick = () => shareText(text);
    actions.appendChild(shareBtn);

    const tryBtn = document.createElement('button');
    tryBtn.className = 'msg-action-btn';
    tryBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg><span>' + labels.another + '</span>';
    tryBtn.onclick = () => tryAnother();
    actions.appendChild(tryBtn);

    // Pin to Memory (only in tester mode with profile)
    if (testerMode && typeof hasProfile === 'function' && hasProfile()) {
      const pinLabel = { en: 'Save', de: 'Merken', es: 'Guardar' }[currentLang];
      const pinBtn = document.createElement('button');
      pinBtn.className = 'msg-action-btn';
      pinBtn.title = { en: 'Save to memory', de: 'In Memory speichern', es: 'Guardar en memoria' }[currentLang];
      pinBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 17l-5.5 3 1-6L3 9.5l6-.5L12 4l3 5 6 .5-4.5 4.5 1 6z"/></svg><span>' + pinLabel + '</span>';
      pinBtn.onclick = () => {
        if (typeof pinToMemory === 'function') pinToMemory(text, pinBtn);
      };
      actions.appendChild(pinBtn);
    }

    msgDiv.appendChild(actions);
  }
  cb.appendChild(msgDiv);
  cb.scrollTop = cb.scrollHeight;
}

function appendTyping() {
  const cb = document.getElementById('chatBody');
  if (!cb) return null;
  const id = 'typing-' + Date.now();
  const msgDiv = document.createElement('div');
  msgDiv.className = 'msg bot';
  msgDiv.id = id;
  msgDiv.innerHTML = '<div class="msg-bubble"><div class="typing"><span></span><span></span><span></span></div></div>';
  cb.appendChild(msgDiv);
  cb.scrollTop = cb.scrollHeight;
  return id;
}

function removeTyping(id) {
  if (!id) return;
  const el = document.getElementById(id);
  if (el) el.remove();
}

async function copyToClipboard(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    const original = button.innerHTML;
    const copiedText = { en: 'Copied!', de: 'Kopiert!', es: '¡Copiado!' }[currentLang];
    button.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>' + copiedText + '</span>';
    button.classList.add('success');
    setTimeout(() => {
      button.innerHTML = original;
      button.classList.remove('success');
    }, 2000);
  } catch (err) { console.error('Copy failed:', err); }
}

function shareText(text) {
  const shareData = {
    title: 'DircBot — AI Coach by Dirc Zahlmann',
    text: text,
    url: 'https://dircbot.netlify.app'
  };
  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    navigator.share(shareData).catch(() => {});
  } else {
    const fullText = text + '\n\n— via DircBot · dircbot.netlify.app';
    navigator.clipboard.writeText(fullText).then(() => {
      const notice = { en: 'Copied to clipboard', de: 'In Zwischenablage kopiert', es: 'Copiado al portapapeles' }[currentLang];
      showToast(notice);
    });
  }
}

function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 2500);
}

function setupVoiceRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    const mb = document.getElementById('micBtn');
    if (mb) mb.style.display = 'none';
    return;
  }
  recognition = new SR();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.onresult = (event) => {
    const transcript = Array.from(event.results).map(r => r[0].transcript).join('');
    const input = document.getElementById('userInput');
    if (input) input.value = transcript;
  };
  recognition.onerror = (e) => { console.warn('Speech error:', e.error); stopVoiceInput(); };
  recognition.onend = () => stopVoiceInput();
}

function toggleVoiceInput() {
  if (!recognition) return;
  if (isListening) stopVoiceInput();
  else startVoiceInput();
}

function startVoiceInput() {
  if (!recognition) return;
  const langMap = { en: 'en-US', de: 'de-DE', es: 'es-ES' };
  recognition.lang = langMap[currentLang] || 'de-DE';
  try {
    recognition.start();
    isListening = true;
    const btn = document.getElementById('micBtn');
    if (btn) btn.classList.add('listening');
    const ind = document.getElementById('voiceIndicator');
    if (ind) ind.classList.add('visible');
  } catch (e) { console.error('Voice start:', e); }
}

function stopVoiceInput() {
  if (recognition && isListening) {
    try { recognition.stop(); } catch (e) {}
  }
  isListening = false;
  const btn = document.getElementById('micBtn');
  if (btn) btn.classList.remove('listening');
  const ind = document.getElementById('voiceIndicator');
  if (ind) ind.classList.remove('visible');
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    const msg = { en: 'File too large (max 5MB)', de: 'Datei zu groß (max 5MB)', es: 'Archivo demasiado grande (máx 5MB)' }[currentLang];
    showToast(msg);
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    const base64 = e.target.result.split(',')[1];
    attachedFile = file;
    attachedFileData = { data: base64, type: file.type, name: file.name };
    showFilePreview(file);
  };
  reader.readAsDataURL(file);
}

function showFilePreview(file) {
  const preview = document.getElementById('filePreview');
  const icon = document.getElementById('filePreviewIcon');
  const name = document.getElementById('filePreviewName');
  const size = document.getElementById('filePreviewSize');
  if (!preview) return;
  if (file.type.startsWith('image/')) icon.textContent = '🖼️';
  else if (file.type === 'application/pdf') icon.textContent = '📄';
  else icon.textContent = '📎';
  name.textContent = file.name;
  size.textContent = formatBytes(file.size);
  preview.classList.add('visible');
}

function removeAttachment() {
  attachedFile = null;
  attachedFileData = null;
  const preview = document.getElementById('filePreview');
  if (preview) preview.classList.remove('visible');
  const input = document.getElementById('fileInput');
  if (input) input.value = '';
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

function toggleSidebar() {
  document.body.classList.toggle('sidebar-open');
}

function signUp(e) {
  if (e && e.preventDefault) e.preventDefault();
  const form = document.getElementById('emailForm');
  const success = document.getElementById('successMsg');
  if (!form) return;
  const formData = new FormData(form);
  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(formData).toString()
  }).then(() => {
    form.style.display = 'none';
    if (success) success.classList.add('visible');
  }).catch(err => {
    console.error('Form error:', err);
    form.style.display = 'none';
    if (success) success.classList.add('visible');
  });
}

window.dircbotDebug = {
  reset: () => {
    if (confirm('Reset all DircBot state?')) {
      localStorage.removeItem('dircbot-tester-code');
      localStorage.removeItem('dircbot-tester-used');
      localStorage.removeItem('dircbot-free-used');
      location.reload();
    }
  },
  state: () => ({ testerMode, testerCode, testerMessagesUsed, freeMessagesUsed, currentTopic, currentLang })
};


// ============== MEMORY CONFIRMATION CHIPS ==============
// Shows learned memories as small inline chips below the bot's response.
// User can dismiss with ✕ → memory gets removed silently.
function renderMemoryChips(memories) {
  const cb = document.getElementById('chatBody');
  if (!cb || !memories.length) return;
  // Find the last bot message
  const botMsgs = cb.querySelectorAll('.msg.bot');
  const lastBot = botMsgs[botMsgs.length - 1];
  if (!lastBot) return;

  const chipsContainer = document.createElement('div');
  chipsContainer.className = 'memory-chips';

  const labels = {
    en: { learned: 'Learned', dismiss: 'Remove' },
    de: { learned: 'Gemerkt', dismiss: 'Verwerfen' },
    es: { learned: 'Aprendido', dismiss: 'Quitar' }
  }[currentLang] || { learned: 'Learned', dismiss: 'Remove' };

  memories.forEach(mem => {
    const chip = document.createElement('div');
    chip.className = 'memory-chip';
    chip.innerHTML = `
      <span class="memory-chip-icon">🧠</span>
      <span class="memory-chip-label">${labels.learned}:</span>
      <span class="memory-chip-text"></span>
      <button class="memory-chip-dismiss" title="${labels.dismiss}">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;
    chip.querySelector('.memory-chip-text').textContent = mem;
    chip.querySelector('.memory-chip-dismiss').onclick = () => {
      if (typeof removeMemoryByText === 'function') {
        removeMemoryByText(mem);
      }
      chip.classList.add('dismissed');
      setTimeout(() => chip.remove(), 200);
    };
    chipsContainer.appendChild(chip);
  });

  lastBot.appendChild(chipsContainer);
}
