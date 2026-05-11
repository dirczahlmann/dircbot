// ============== DIRCBOT PROFILE + HISTORY + MEMORY ==============
// All data stored in localStorage (Variant A)
// Variant B will move this to server-side per-tester

// ============== PROFILE ==============
let userProfile = null;

const STAGES = {
  en: [
    { v: 'starting', label: 'Just starting out' },
    { v: 'side-hustle', label: 'Side hustle / Part-time' },
    { v: 'solopreneur', label: 'Full-time solopreneur' },
    { v: 'small-team', label: 'Small team (2-10)' },
    { v: 'scaling', label: 'Scaling business (10-50)' },
    { v: 'established', label: 'Established (50+)' }
  ],
  de: [
    { v: 'starting', label: 'Gerade am Anfang' },
    { v: 'side-hustle', label: 'Side Hustle / Nebenberuflich' },
    { v: 'solopreneur', label: 'Vollzeit Solopreneur' },
    { v: 'small-team', label: 'Kleines Team (2-10)' },
    { v: 'scaling', label: 'Skalierendes Business (10-50)' },
    { v: 'established', label: 'Etabliert (50+)' }
  ],
  es: [
    { v: 'starting', label: 'Empezando' },
    { v: 'side-hustle', label: 'Trabajo extra / Tiempo parcial' },
    { v: 'solopreneur', label: 'Emprendedor a tiempo completo' },
    { v: 'small-team', label: 'Equipo pequeño (2-10)' },
    { v: 'scaling', label: 'Negocio escalando (10-50)' },
    { v: 'established', label: 'Establecido (50+)' }
  ]
};

function loadProfile() {
  try {
    const raw = localStorage.getItem('dircbot-profile');
    if (raw) {
      userProfile = JSON.parse(raw);
      return userProfile;
    }
  } catch (e) { console.warn('Profile load:', e); }
  return null;
}

function saveProfile(profile) {
  userProfile = profile;
  try {
    localStorage.setItem('dircbot-profile', JSON.stringify(profile));
  } catch (e) { console.warn('Profile save:', e); }
}

function hasProfile() {
  return userProfile && userProfile.name && userProfile.primaryGoal;
}

function openProfileModal(isEdit) {
  const modal = document.getElementById('profileModal');
  if (!modal) return;

  // Populate stages dropdown
  const stageSelect = document.getElementById('profileStage');
  if (stageSelect) {
    stageSelect.innerHTML = '<option value="">—</option>';
    const stages = STAGES[currentLang] || STAGES.en;
    stages.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.v;
      opt.textContent = s.label;
      stageSelect.appendChild(opt);
    });
  }

  // Populate focus area dropdown
  const focusSelect = document.getElementById('profileFocus');
  if (focusSelect) {
    focusSelect.innerHTML = '<option value="">—</option>';
    if (typeof TOPICS !== 'undefined') {
      TOPICS.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = t.name[currentLang];
        focusSelect.appendChild(opt);
      });
    }
  }

  // Pre-fill if editing
  if (isEdit && userProfile) {
    document.getElementById('profileName').value = userProfile.name || '';
    document.getElementById('profileGoal').value = userProfile.primaryGoal || '';
    const jobEl = document.getElementById('profileJob');
    if (jobEl) jobEl.value = userProfile.currentJob || '';
    const impEl = document.getElementById('profileImprove');
    if (impEl) impEl.value = userProfile.improvementGoal || '';
    document.getElementById('profileFocus').value = userProfile.focusArea || '';
    document.getElementById('profileStage').value = userProfile.stage || '';
    document.getElementById('profilePriorities').value = (userProfile.priorities || []).join('\n');
  }

  // Toggle "skip" button visibility (only on first creation)
  const skipBtn = document.getElementById('profileSkipBtn');
  if (skipBtn) skipBtn.style.display = isEdit ? 'none' : 'inline-flex';

  // Show memory section only when editing an existing profile (not on first setup)
  const memSection = document.getElementById('profileMemoriesSection');
  if (memSection) {
    memSection.style.display = isEdit ? 'block' : 'none';
    if (isEdit && typeof renderMemoriesList === 'function') renderMemoriesList();
  }

  // Modal title
  const title = document.getElementById('profileModalTitle');
  if (title) {
    title.textContent = isEdit
      ? { en: 'Edit Your Profile', de: 'Profil bearbeiten', es: 'Editar Perfil' }[currentLang]
      : { en: 'Welcome — set up your profile', de: 'Willkommen — richte dein Profil ein', es: 'Bienvenido — configura tu perfil' }[currentLang];
  }

  modal.classList.add('visible');
}

function closeProfileModal() {
  const modal = document.getElementById('profileModal');
  if (modal) modal.classList.remove('visible');
}

function skipProfile() {
  closeProfileModal();
}

function submitProfile(e) {
  e.preventDefault();
  const name = document.getElementById('profileName').value.trim();
  const goal = document.getElementById('profileGoal').value.trim();
  const currentJob = (document.getElementById('profileJob')?.value || '').trim();
  const improvementGoal = (document.getElementById('profileImprove')?.value || '').trim();
  const focus = document.getElementById('profileFocus').value;
  const stage = document.getElementById('profileStage').value;
  const prioritiesRaw = document.getElementById('profilePriorities').value.trim();
  const priorities = prioritiesRaw
    ? prioritiesRaw.split('\n').map(s => s.trim()).filter(s => s.length).slice(0, 3)
    : [];

  if (!name || !goal) {
    const err = document.getElementById('profileError');
    if (err) err.textContent = { en: 'Name and primary goal are required.', de: 'Name und Hauptziel sind Pflicht.', es: 'Nombre y meta principal son obligatorios.' }[currentLang];
    return;
  }

  const profile = {
    name: name,
    primaryGoal: goal,
    currentJob: currentJob,
    improvementGoal: improvementGoal,
    focusArea: focus,
    stage: stage,
    priorities: priorities,
    memories: (userProfile && userProfile.memories) || [],
    createdAt: (userProfile && userProfile.createdAt) || Date.now(),
    updatedAt: Date.now()
  };

  saveProfile(profile);
  closeProfileModal();
  renderProfileCard();
  renderDailyFocus();
}

function renderProfileCard() {
  const card = document.getElementById('sidebarProfileCard');
  if (!card) return;
  if (!hasProfile()) {
    card.innerHTML = `
      <button class="profile-create-btn" onclick="openProfileModal(false)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
        <span>${{en:'Create Profile',de:'Profil anlegen',es:'Crear Perfil'}[currentLang]}</span>
      </button>
    `;
    return;
  }
  const focusTopic = TOPICS.find(t => t.id === userProfile.focusArea);
  card.innerHTML = `
    <div class="profile-card-inner" onclick="openProfileModal(true)">
      <div class="profile-avatar">${userProfile.name.charAt(0).toUpperCase()}</div>
      <div class="profile-info">
        <div class="profile-name">${escapeHtml(userProfile.name)}</div>
        <div class="profile-meta">${focusTopic ? focusTopic.name[currentLang] : (userProfile.primaryGoal.slice(0, 24) + (userProfile.primaryGoal.length > 24 ? '…' : ''))}</div>
      </div>
      <svg class="profile-edit-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
    </div>
  `;
}

// ============== DAILY FOCUS WIDGET ==============
function renderDailyFocus() {
  const widget = document.getElementById('dailyFocusWidget');
  if (!widget) return;

  // Determine which topic to use
  let topicId = userProfile && userProfile.focusArea ? userProfile.focusArea : null;
  if (!topicId) {
    // Default rotation through all topics based on day-of-week
    const dow = new Date().getDay();
    const topicKeys = Object.keys(DAILY_TIPS);
    topicId = topicKeys[dow % topicKeys.length];
  }
  const topic = TOPICS.find(t => t.id === topicId);
  const tip = getDailyTip(topicId, currentLang);
  if (!tip || !topic) {
    widget.style.display = 'none';
    return;
  }

  const labels = {
    en: { today: "Today's Focus", action: 'Action', goal: 'Your goal', cta: 'Get my plan' },
    de: { today: 'Dein Fokus heute', action: 'Action', goal: 'Dein Ziel', cta: 'Hol meinen Plan' },
    es: { today: 'Tu foco hoy', action: 'Acción', goal: 'Tu meta', cta: 'Dame mi plan' }
  }[currentLang];

  // PERSONALIZED VIEW: when profile exists, show user's goal + a generic-but-pointed
  // "one step closer" prompt. The actual content gets generated when they click,
  // using their full profile context.
  if (hasProfile() && userProfile.primaryGoal) {
    const goalShort = userProfile.primaryGoal.length > 70
      ? userProfile.primaryGoal.slice(0, 68) + '…'
      : userProfile.primaryGoal;
    const stageLabel = userProfile.stage ? `<span class="daily-focus-stage">${escapeHtml(userProfile.stage)}</span>` : '';
    const ctxLine = {
      en: 'One concrete step closer today. The bot picks based on your full context.',
      de: 'Ein konkreter Schritt näher heute. Der Bot pickt basierend auf deinem ganzen Kontext.',
      es: 'Un paso concreto más cerca hoy. El bot elige según tu contexto completo.'
    }[currentLang];

    widget.innerHTML = `
      <div class="daily-focus-header">
        <span class="daily-focus-label">✦ ${labels.today}</span>
        <span class="daily-focus-topic" style="color:${topic.color};">${topic.name[currentLang]}</span>
      </div>
      <div class="daily-focus-goal-block">
        <div class="daily-focus-goal-label">${labels.goal}</div>
        <div class="daily-focus-goal-text">${escapeHtml(goalShort)}</div>
        ${stageLabel}
      </div>
      <div class="daily-focus-ctxline">${ctxLine}</div>
      <button class="daily-focus-go" onclick="startDailyFocusChat('${topicId}', '', '')">
        <span>${labels.cta}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    `;
    widget.style.display = 'block';
    return;
  }

  // FALLBACK VIEW (no profile): show static daily tip
  widget.innerHTML = `
    <div class="daily-focus-header">
      <span class="daily-focus-label">✦ ${labels.today}</span>
      <span class="daily-focus-topic" style="color:${topic.color};">${topic.name[currentLang]}</span>
    </div>
    <div class="daily-focus-tip">${escapeHtml(tip.tip)}</div>
    <div class="daily-focus-action">
      <span class="daily-focus-action-label">${labels.action}:</span>
      <span>${escapeHtml(tip.action)}</span>
    </div>
    <button class="daily-focus-go" onclick="startDailyFocusChat('${topicId}', ${JSON.stringify(tip.tip).replace(/"/g,'&quot;')}, ${JSON.stringify(tip.action).replace(/"/g,'&quot;')})">
      <span>${{en:'Discuss with DircBot',de:'Mit DircBot besprechen',es:'Hablar con DircBot'}[currentLang]}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
  `;
  widget.style.display = 'block';
}

function startDailyFocusChat(topicId, tip, action) {
  if (typeof selectTopic === 'function') {
    selectTopic(topicId);
  }
  setTimeout(() => {
    const topic = TOPICS.find(t => t.id === topicId);
    const topicName = topic ? topic.name[currentLang] : topicId;
    const hasProf = hasProfile();

    // If profile exists, ask the bot for a PERSONALIZED daily action based on profile.
    // Otherwise fall back to the static tip.
    let msg;
    if (hasProf && userProfile.primaryGoal) {
      const ctxBits = [];
      ctxBits.push(`mein Ziel: ${userProfile.primaryGoal}`);
      if (userProfile.currentJob) ctxBits.push(`ich mache aktuell: ${userProfile.currentJob}`);
      if (userProfile.improvementGoal) ctxBits.push(`will besser werden in: ${userProfile.improvementGoal}`);
      if (userProfile.stage) ctxBits.push(`Stage: ${userProfile.stage}`);
      const ctxDE = ctxBits.join('; ');

      const ctxBitsEN = [];
      ctxBitsEN.push(`my goal: ${userProfile.primaryGoal}`);
      if (userProfile.currentJob) ctxBitsEN.push(`I currently do: ${userProfile.currentJob}`);
      if (userProfile.improvementGoal) ctxBitsEN.push(`want to get better at: ${userProfile.improvementGoal}`);
      if (userProfile.stage) ctxBitsEN.push(`stage: ${userProfile.stage}`);
      const ctxEN = ctxBitsEN.join('; ');

      msg = {
        en: `Given my context (${ctxEN}), what's the ONE most-impactful thing I should focus on TODAY in the ${topicName} area to move closer to my goal? Be specific to MY situation — not generic. Give me a 3-step plan I can execute today.`,
        de: `Mit meinem Kontext (${ctxDE}) — was ist das EINE wirkungsvollste das ich HEUTE im Bereich ${topicName} angehen sollte um meinem Ziel näher zu kommen? Spezifisch für MEINE Situation — nicht generisch. Gib mir einen 3-Schritte-Plan den ich heute ausführen kann.`,
        es: `Con mi contexto (${ctxEN}), ¿cuál es la UNA cosa más impactante en la que debo enfocarme HOY en ${topicName} para acercarme a mi meta? Específico a MI situación. Plan de 3 pasos para hoy.`
      }[currentLang];
    } else {
      msg = {
        en: `Help me work on this today: "${action}" — give me a tactical 3-step plan.`,
        de: `Hilf mir das heute anzugehen: "${action}" — gib mir einen taktischen 3-Schritte-Plan.`,
        es: `Ayúdame a trabajar esto hoy: "${action}" — dame un plan táctico de 3 pasos.`
      }[currentLang];
    }
    if (typeof askQuestion === 'function') askQuestion(msg);
  }, 300);
}

// ============== CHAT HISTORY ==============
let allChats = [];
let currentChatId = null;

function loadChats() {
  try {
    const raw = localStorage.getItem('dircbot-chats');
    if (raw) {
      allChats = JSON.parse(raw);
      return allChats;
    }
  } catch (e) { console.warn('Chats load:', e); }
  allChats = [];
  return [];
}

function saveChats() {
  try {
    // Keep only last 100 chats to prevent localStorage overflow
    if (allChats.length > 100) allChats = allChats.slice(0, 100);
    localStorage.setItem('dircbot-chats', JSON.stringify(allChats));
  } catch (e) { console.warn('Chats save:', e); }
}

function createNewChat(firstMessage, topicId) {
  const chat = {
    id: 'chat-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
    title: firstMessage ? truncateTitle(firstMessage) : (currentLang === 'de' ? 'Neuer Chat' : currentLang === 'es' ? 'Chat Nuevo' : 'New Chat'),
    topic: topicId || null,
    messages: [],
    created: Date.now(),
    updated: Date.now()
  };
  allChats.unshift(chat);
  currentChatId = chat.id;
  saveChats();
  return chat;
}

function truncateTitle(text) {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > 42 ? clean.slice(0, 42) + '…' : clean;
}

function getCurrentChat() {
  if (!currentChatId) return null;
  return allChats.find(c => c.id === currentChatId);
}

function appendToCurrentChat(role, content) {
  let chat = getCurrentChat();
  if (!chat) {
    chat = createNewChat(role === 'user' ? content : null, currentTopic ? currentTopic.id : null);
  }
  chat.messages.push({ role: role, content: content, timestamp: Date.now() });
  // Update title from first user message if it's still default
  if (role === 'user' && (!chat.title || chat.title === 'Neuer Chat' || chat.title === 'New Chat' || chat.title === 'Chat Nuevo')) {
    chat.title = truncateTitle(content);
  }
  chat.updated = Date.now();
  saveChats();
  renderChatHistory();
}

function loadChat(chatId) {
  const chat = allChats.find(c => c.id === chatId);
  if (!chat) return;
  currentChatId = chatId;
  if (typeof conversationHistory !== 'undefined') {
    conversationHistory = chat.messages.map(m => ({ role: m.role, content: m.content }));
  }
  // If chat has a topic, select it
  if (chat.topic && typeof selectTopic === 'function') {
    selectTopic(chat.topic);
  } else if (typeof clearTopic === 'function') {
    clearTopic();
  }
  // Render messages in chat body
  const cb = document.getElementById('chatBody');
  if (cb) {
    cb.innerHTML = '';
    cb.classList.remove('has-welcome');
    chat.messages.forEach(m => {
      if (typeof appendMessage === 'function') {
        appendMessage(m.role, m.content);
      }
    });
  }
  // Hide topic suggestions if any messages exist
  const sug = document.getElementById('topicSuggestions');
  if (sug && chat.messages.length > 0) sug.classList.remove('visible');

  renderChatHistory();
}

function deleteChat(chatId, event) {
  if (event) event.stopPropagation();
  if (!confirm({ en: 'Delete this chat?', de: 'Diesen Chat löschen?', es: '¿Borrar este chat?' }[currentLang])) return;
  allChats = allChats.filter(c => c.id !== chatId);
  if (currentChatId === chatId) {
    currentChatId = null;
    if (typeof newChat === 'function') newChat();
  }
  saveChats();
  renderChatHistory();
}

function renderChatHistory() {
  const container = document.getElementById('chatHistoryList');
  if (!container) return;
  container.innerHTML = '';

  if (allChats.length === 0) {
    container.innerHTML = `<div class="chat-history-empty">${{en:'No chats yet',de:'Noch keine Chats',es:'Sin chats aún'}[currentLang]}</div>`;
    return;
  }

  // Group by time
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const sevenDays = 7 * oneDay;
  const groups = { today: [], week: [], older: [] };
  allChats.forEach(c => {
    const age = now - (c.updated || c.created);
    if (age < oneDay) groups.today.push(c);
    else if (age < sevenDays) groups.week.push(c);
    else groups.older.push(c);
  });

  const groupLabels = {
    en: { today: 'Today', week: 'This week', older: 'Older' },
    de: { today: 'Heute', week: 'Diese Woche', older: 'Älter' },
    es: { today: 'Hoy', week: 'Esta semana', older: 'Más viejo' }
  }[currentLang];

  ['today', 'week', 'older'].forEach(g => {
    if (groups[g].length === 0) return;
    const groupEl = document.createElement('div');
    groupEl.className = 'chat-history-group';
    groupEl.innerHTML = `<div class="chat-history-group-label">${groupLabels[g]}</div>`;
    groups[g].forEach(chat => {
      const item = document.createElement('div');
      item.className = 'chat-history-item' + (chat.id === currentChatId ? ' active' : '');
      const topic = chat.topic ? TOPICS.find(t => t.id === chat.topic) : null;
      const iconColor = topic ? topic.color : 'rgba(240,237,232,0.4)';
      item.innerHTML = `
        <div class="chat-history-item-icon" style="color:${iconColor};">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        </div>
        <div class="chat-history-item-title">${escapeHtml(chat.title)}</div>
        <button class="chat-history-item-delete" onclick="deleteChat('${chat.id}', event)" title="Delete">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      `;
      item.onclick = () => loadChat(chat.id);
      groupEl.appendChild(item);
    });
    container.appendChild(groupEl);
  });
}

// ============== MEMORY (pinned messages) ==============
function pinToMemory(text, button) {
  if (!userProfile) {
    showToast({ en: 'Create profile first', de: 'Erst Profil anlegen', es: 'Crea perfil primero' }[currentLang]);
    return;
  }
  if (!userProfile.memories) userProfile.memories = [];
  if (userProfile.memories.length >= 20) {
    showToast({ en: 'Memory full (max 20)', de: 'Memory voll (max 20)', es: 'Memoria llena' }[currentLang]);
    return;
  }
  // Truncate long memories
  const memory = text.length > 400 ? text.slice(0, 400) + '…' : text;
  if (userProfile.memories.includes(memory)) {
    showToast({ en: 'Already saved', de: 'Schon gespeichert', es: 'Ya guardado' }[currentLang]);
    return;
  }
  userProfile.memories.push(memory);
  saveProfile(userProfile);

  if (button) {
    const original = button.innerHTML;
    button.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>' + { en: 'Saved!', de: 'Gespeichert!', es: '¡Guardado!' }[currentLang] + '</span>';
    button.classList.add('success');
    setTimeout(() => {
      button.innerHTML = original;
      button.classList.remove('success');
    }, 2000);
  }
}

function getMemoriesPrompt() {
  if (!userProfile || !userProfile.memories || userProfile.memories.length === 0) return '';
  return '\n\nUSER MEMORIES (things they asked you to remember):\n' + userProfile.memories.map((m, i) => `${i + 1}. ${m}`).join('\n');
}

function getProfilePrompt() {
  if (!hasProfile()) return '';
  let p = '\n\nUSER PROFILE:';
  p += `\n- Name: ${userProfile.name}`;
  p += `\n- Primary goal: ${userProfile.primaryGoal}`;
  if (userProfile.currentJob) p += `\n- Currently does for work: ${userProfile.currentJob}`;
  if (userProfile.improvementGoal) p += `\n- Wants to get better at: ${userProfile.improvementGoal}`;
  if (userProfile.focusArea) {
    const t = TOPICS.find(t => t.id === userProfile.focusArea);
    if (t) p += `\n- Current focus area: ${t.name.en}`;
  }
  if (userProfile.stage) p += `\n- Business stage: ${userProfile.stage}`;
  if (userProfile.priorities && userProfile.priorities.length) {
    p += `\n- Top priorities: ${userProfile.priorities.join('; ')}`;
  }
  p += '\n\nAddress them by name occasionally. Reference their goal, what they do, and what they want to improve in your advice. Tie every recommendation to THEIR specific situation. Don\'t give generic answers when their profile gives you context.';
  return p;
}

// ============== UTIL ==============
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  loadChats();
});


// ============== AUTO-MEMORY EXTRACTION ==============
// Parses <<MEMORY>>...<<END_MEMORY>> blocks from bot responses,
// strips them from displayed text, and silently saves to profile.

function extractMemoryBlock(rawText) {
  if (!rawText) return { cleanText: rawText, memories: [] };
  const re = /<<MEMORY>>([\s\S]*?)<<END_MEMORY>>/i;
  const match = rawText.match(re);
  if (!match) return { cleanText: rawText, memories: [] };

  const block = match[1];
  // Strip from display
  const cleanText = rawText.replace(re, '').trim();

  // Parse memories (lines starting with -, *, •)
  const memories = block
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => line.replace(/^[-*•]\s*/, '').trim())
    .filter(line => line.length > 3 && line.length < 200);

  return { cleanText, memories };
}

function saveAutoMemories(memories) {
  if (!memories || memories.length === 0) return [];
  if (!userProfile) {
    // Create minimal profile if user is in tester mode without setup yet
    userProfile = {
      name: 'Tester',
      primaryGoal: '',
      focusArea: '',
      stage: '',
      priorities: [],
      memories: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }
  if (!userProfile.memories) userProfile.memories = [];

  const newlyAdded = [];
  memories.forEach(mem => {
    // Deduplicate (case-insensitive, fuzzy)
    const normalized = mem.toLowerCase().replace(/[^a-z0-9]/g, '');
    const exists = userProfile.memories.some(existing => {
      const eNorm = existing.toLowerCase().replace(/[^a-z0-9]/g, '');
      return eNorm === normalized || eNorm.includes(normalized) || normalized.includes(eNorm);
    });
    if (!exists) {
      userProfile.memories.push(mem);
      newlyAdded.push(mem);
    }
  });

  // Cap at 30 (FIFO — drop oldest)
  if (userProfile.memories.length > 30) {
    userProfile.memories = userProfile.memories.slice(-30);
  }

  if (newlyAdded.length > 0) {
    saveProfile(userProfile);
  }
  return newlyAdded;
}

// Remove a memory by its exact text (used by inline ✕ chip dismiss)
function removeMemoryByText(text) {
  if (!userProfile || !userProfile.memories) return false;
  const idx = userProfile.memories.indexOf(text);
  if (idx !== -1) {
    userProfile.memories.splice(idx, 1);
    saveProfile(userProfile);
    return true;
  }
  return false;
}

// ============== MEMORY MANAGEMENT (Profile Modal Section) ==============
function renderMemoriesList() {
  const container = document.getElementById('profileMemoriesList');
  if (!container) return;
  container.innerHTML = '';

  if (!userProfile || !userProfile.memories || userProfile.memories.length === 0) {
    container.innerHTML = `<div class="memories-empty">${{en:'No memories yet. The bot will start learning as you chat.',de:'Noch keine Memories. Der Bot lernt sobald du chattest.',es:'Sin memorias aún. El bot empezará a aprender al chatear.'}[currentLang]}</div>`;
    return;
  }

  userProfile.memories.forEach((mem, idx) => {
    const item = document.createElement('div');
    item.className = 'memory-item';
    item.innerHTML = `
      <span class="memory-icon">🧠</span>
      <div class="memory-text" contenteditable="true" data-idx="${idx}">${escapeHtml(mem)}</div>
      <button class="memory-delete" onclick="deleteMemory(${idx})" title="Delete">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;
    const textEl = item.querySelector('.memory-text');
    textEl.addEventListener('blur', () => {
      const newText = textEl.textContent.trim();
      if (newText && newText !== userProfile.memories[idx]) {
        userProfile.memories[idx] = newText;
        saveProfile(userProfile);
      }
    });
    container.appendChild(item);
  });
}

function deleteMemory(idx) {
  if (!userProfile || !userProfile.memories) return;
  userProfile.memories.splice(idx, 1);
  saveProfile(userProfile);
  renderMemoriesList();
}

function clearAllMemories() {
  const msg = {
    en: 'Delete all memories? The bot will forget what it learned.',
    de: 'Alle Memories löschen? Der Bot vergisst was er gelernt hat.',
    es: '¿Borrar todas las memorias?'
  }[currentLang];
  if (!confirm(msg)) return;
  if (userProfile) {
    userProfile.memories = [];
    saveProfile(userProfile);
    renderMemoriesList();
  }
}
