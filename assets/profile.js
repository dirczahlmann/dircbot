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

    // Check if user already generated a plan today
    const today = todayISODate();
    const plans = getDailyPlans();
    const todaysPlan = plans.find(p => p.date === today);
    const streakBadge = typeof getDailyPlansBadgeHtml === 'function' ? getDailyPlansBadgeHtml() : '';

    let ctxLine;
    let ctaLabel;
    if (todaysPlan) {
      ctxLine = {
        en: `Today's plan is set. Continue working on it or re-generate based on progress.`,
        de: `Heutiger Plan steht. Arbeite weiter daran oder generiere neu basierend auf Fortschritt.`,
        es: `El plan de hoy está listo. Continúa o regenera según el progreso.`
      }[currentLang];
      ctaLabel = {
        en: 'Update plan',
        de: 'Plan updaten',
        es: 'Actualizar plan'
      }[currentLang];
    } else if (plans.length > 0) {
      ctxLine = {
        en: `Building on your last ${Math.min(plans.length, 7)} days. Next step today.`,
        de: `Baut auf deinen letzten ${Math.min(plans.length, 7)} Tagen auf. Nächster Schritt heute.`,
        es: `Construye sobre tus últimos ${Math.min(plans.length, 7)} días.`
      }[currentLang];
      ctaLabel = labels.cta;
    } else {
      ctxLine = {
        en: 'One concrete step closer today. The bot picks based on your full context.',
        de: 'Ein konkreter Schritt näher heute. Der Bot pickt basierend auf deinem ganzen Kontext.',
        es: 'Un paso concreto más cerca hoy. El bot elige según tu contexto completo.'
      }[currentLang];
      ctaLabel = labels.cta;
    }

    widget.innerHTML = `
      <div class="daily-focus-header">
        <span class="daily-focus-label">✦ ${labels.today}</span>
        <span class="daily-focus-topic" style="color:${topic.color};">${topic.name[currentLang]}</span>
      </div>
      <div class="daily-focus-goal-block">
        <div class="daily-focus-goal-label">${labels.goal}${streakBadge}</div>
        <div class="daily-focus-goal-text">${escapeHtml(goalShort)}</div>
        ${stageLabel}
      </div>
      <div class="daily-focus-ctxline">${ctxLine}</div>
      <button class="daily-focus-go" onclick="startDailyFocusChat('${topicId}', '', '')">
        <span>${ctaLabel}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      ${plans.length > 0 ? `<button class="daily-focus-history-btn" onclick="openDailyPlanHistory()">${{en:'View history',de:'Verlauf ansehen',es:'Ver historial'}[currentLang]} →</button>` : ''}
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

    // Mark next response as a daily plan so we can save it for tomorrow's progression
    window.__pendingDailyPlan = { topicId: topicId, topicName: topicName, date: todayISODate() };

    // Build previous-plans context (last 7 days) so bot builds on yesterday's plan
    const prevPlansBlock = formatPreviousPlansForPrompt(7);

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
        en: `Given my context (${ctxEN}), what's the ONE most-impactful thing I should focus on TODAY in the ${topicName} area to move closer to my goal? Be specific to MY situation — not generic. Give me a 3-step plan I can execute today.${prevPlansBlock.en}`,
        de: `Mit meinem Kontext (${ctxDE}) — was ist das EINE wirkungsvollste das ich HEUTE im Bereich ${topicName} angehen sollte um meinem Ziel näher zu kommen? Spezifisch für MEINE Situation — nicht generisch. Gib mir einen 3-Schritte-Plan den ich heute ausführen kann.${prevPlansBlock.de}`,
        es: `Con mi contexto (${ctxEN}), ¿cuál es la UNA cosa más impactante en la que debo enfocarme HOY en ${topicName} para acercarme a mi meta? Específico a MI situación. Plan de 3 pasos para hoy.${prevPlansBlock.es}`
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

// ============== DAILY PLAN HISTORY (v8.11) ==============
function todayISODate() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

function getDailyPlans() {
  if (!userProfile) return [];
  if (!userProfile.dailyPlans) userProfile.dailyPlans = [];
  return userProfile.dailyPlans;
}

function saveDailyPlan(topicId, topicName, planText) {
  if (!userProfile) return;
  if (!userProfile.dailyPlans) userProfile.dailyPlans = [];
  const date = todayISODate();
  // Replace existing entry for today if any (user might re-request same day)
  const existingIdx = userProfile.dailyPlans.findIndex(p => p.date === date && p.topicId === topicId);
  // Extract concise summary from plan text (first 280 chars, clean of markdown)
  const summary = planText
    .replace(/[*#_`]/g, '')          // strip markdown
    .replace(/\n+/g, ' ')             // single line
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 280);
  const entry = {
    date: date,
    topicId: topicId,
    topicName: topicName,
    summary: summary,
    fullPlan: planText.slice(0, 1500),  // store up to 1500 chars
    timestamp: Date.now()
  };
  if (existingIdx >= 0) {
    userProfile.dailyPlans[existingIdx] = entry;
  } else {
    userProfile.dailyPlans.push(entry);
  }
  // Keep only last 30 entries
  if (userProfile.dailyPlans.length > 30) {
    userProfile.dailyPlans = userProfile.dailyPlans.slice(-30);
  }
  userProfile.updatedAt = Date.now();
  saveProfile(userProfile);
}

// Build text block of previous plans for injection into the question
function formatPreviousPlansForPrompt(maxDays) {
  if (!userProfile || !userProfile.dailyPlans || userProfile.dailyPlans.length === 0) {
    return { en: '', de: '', es: '' };
  }
  const sortedPlans = [...userProfile.dailyPlans].sort((a, b) => b.timestamp - a.timestamp);
  const recent = sortedPlans.slice(0, maxDays);
  const linesEn = recent.map(p => `  - ${p.date} (${p.topicName}): ${p.summary}`).join('\n');
  const linesDe = recent.map(p => `  - ${p.date} (${p.topicName}): ${p.summary}`).join('\n');
  return {
    en: `\n\nMY PREVIOUS DAILY PLANS (most recent first):\n${linesEn}\n\nBuild on this progression. Reference what I worked on recently. Today's plan should be the natural next step — not a restart.`,
    de: `\n\nMEINE LETZTEN DAILY-PLÄNE (neueste zuerst):\n${linesDe}\n\nBau darauf auf. Beziehe dich auf das was ich kürzlich gemacht habe. Der heutige Plan soll der natürliche nächste Schritt sein — kein Neustart.`,
    es: `\n\nMIS PLANES DIARIOS PREVIOS (más recientes primero):\n${linesEn}\n\nConstruye sobre esta progresión. Hoy debe ser el siguiente paso natural.`
  };
}

// Render small history badge in daily focus widget
function getDailyPlansBadgeHtml() {
  const plans = getDailyPlans();
  if (plans.length === 0) return '';
  const labels = {
    en: 'Day',
    de: 'Tag',
    es: 'Día'
  }[currentLang];
  // Streak: count consecutive days from today backwards
  let streak = 0;
  let checkDate = new Date();
  const planDates = new Set(plans.map(p => p.date));
  while (planDates.has(checkDate.getFullYear() + '-' + String(checkDate.getMonth()+1).padStart(2,'0') + '-' + String(checkDate.getDate()).padStart(2,'0'))) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }
  if (streak === 0) {
    // No plan today, but show total count
    return `<span class="daily-focus-streak" title="${plans.length} ${labels === 'Day' ? 'plans' : labels === 'Tag' ? 'Pläne' : 'planes'}">${plans.length}</span>`;
  }
  return `<span class="daily-focus-streak" title="${streak} ${labels === 'Day' ? 'day streak' : labels === 'Tag' ? 'Tage-Streak' : 'racha'}">🔥 ${streak}</span>`;
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
    projectId: currentProjectId || null,  // auto-assign to current project
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

  // Filter by current project if active
  const filtered = currentProjectId
    ? allChats.filter(c => c.projectId === currentProjectId)
    : allChats;

  if (filtered.length === 0) {
    const msg = currentProjectId
      ? { en: 'No chats in this project yet', de: 'Noch keine Chats in diesem Projekt', es: 'Sin chats en este proyecto aún' }[currentLang]
      : { en: 'No chats yet', de: 'Noch keine Chats', es: 'Sin chats aún' }[currentLang];
    container.innerHTML = `<div class="chat-history-empty">${msg}</div>`;
    return;
  }

  // Group by time
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const sevenDays = 7 * oneDay;
  const groups = { today: [], week: [], older: [] };
  filtered.forEach(c => {
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
      // Project assignment indicator (small colored dot if chat is in a project)
      const chatProj = chat.projectId ? allProjects.find(p => p.id === chat.projectId) : null;
      const projDotHtml = chatProj
        ? `<span class="chat-history-item-projdot" style="background:${chatProj.color};" title="${escapeHtml(chatProj.title)}"></span>`
        : '';
      item.innerHTML = `
        <div class="chat-history-item-icon" style="color:${iconColor};">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        </div>
        <div class="chat-history-item-title">${escapeHtml(chat.title)}</div>
        ${projDotHtml}
        <button class="chat-history-item-move" onclick="openMoveToProjectMenu('${chat.id}', event)" title="Move to project">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
        </button>
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


// ============== PROJECTS (v8.10) ==============
// Projects group chats by context. Each chat optionally belongs to a project.
// When a project is active, new chats are auto-assigned to it.
// System prompt includes project context so bot answers in-context.

let allProjects = [];
let currentProjectId = null;

const PROJECT_COLORS = [
  '#e8420a', // orange
  '#c9a84c', // gold
  '#8b5cf6', // purple
  '#3a78b8', // blue
  '#10b981', // green
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f59e0b'  // amber
];

function loadProjects() {
  try {
    const raw = localStorage.getItem('dircbot-projects');
    if (raw) {
      allProjects = JSON.parse(raw);
    }
    const cur = localStorage.getItem('dircbot-current-project');
    if (cur) {
      // verify it still exists
      if (allProjects.find(p => p.id === cur)) {
        currentProjectId = cur;
      }
    }
  } catch (e) { console.warn('Projects load:', e); allProjects = []; }
  return allProjects;
}

function saveProjects() {
  try {
    localStorage.setItem('dircbot-projects', JSON.stringify(allProjects));
    if (currentProjectId) {
      localStorage.setItem('dircbot-current-project', currentProjectId);
    } else {
      localStorage.removeItem('dircbot-current-project');
    }
  } catch (e) { console.warn('Projects save:', e); }
}

function setCurrentProject(projectId) {
  currentProjectId = projectId;
  saveProjects();
  renderProjects();
  renderProjectContext();
  renderChatHistory(); // refresh chat list (filtered by project)
}

function createProject(title, goal, color) {
  const project = {
    id: 'proj-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    title: title.trim().slice(0, 80),
    goal: (goal || '').trim().slice(0, 400),
    color: color || PROJECT_COLORS[allProjects.length % PROJECT_COLORS.length],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  allProjects.push(project);
  saveProjects();
  return project;
}

function updateProject(projectId, updates) {
  const p = allProjects.find(x => x.id === projectId);
  if (!p) return;
  if (updates.title !== undefined) p.title = updates.title.trim().slice(0, 80);
  if (updates.goal !== undefined) p.goal = updates.goal.trim().slice(0, 400);
  if (updates.color !== undefined) p.color = updates.color;
  p.updatedAt = Date.now();
  saveProjects();
}

function deleteProject(projectId) {
  // Remove project; orphan chats stay (just lose projectId reference)
  allProjects = allProjects.filter(p => p.id !== projectId);
  if (allChats && Array.isArray(allChats)) {
    allChats.forEach(c => { if (c.projectId === projectId) delete c.projectId; });
    if (typeof saveChats === 'function') saveChats();
  }
  if (currentProjectId === projectId) currentProjectId = null;
  saveProjects();
}

function getCurrentProject() {
  if (!currentProjectId) return null;
  return allProjects.find(p => p.id === currentProjectId);
}

function renderProjects() {
  const container = document.getElementById('sidebarProjects');
  if (!container) return;
  container.innerHTML = '';

  // Render "All Chats" pseudo-project at top
  const allBtn = document.createElement('button');
  allBtn.className = 'sidebar-project' + (currentProjectId === null ? ' active' : '');
  allBtn.style.setProperty('--proj-color', 'rgba(240,237,232,0.5)');
  allBtn.innerHTML = `
    <span class="sidebar-project-dot" style="background:rgba(240,237,232,0.5);box-shadow:none;"></span>
    <span class="sidebar-project-name">${{en:'All Chats',de:'Alle Chats',es:'Todos los Chats'}[currentLang]}</span>
  `;
  allBtn.onclick = () => setCurrentProject(null);
  container.appendChild(allBtn);

  if (allProjects.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'sidebar-project-empty';
    empty.textContent = {
      en: 'No projects yet. Click + to create one.',
      de: 'Noch keine Projekte. Klick + um eines zu erstellen.',
      es: 'Sin proyectos aún. Click + para crear uno.'
    }[currentLang];
    container.appendChild(empty);
    return;
  }

  allProjects.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'sidebar-project' + (p.id === currentProjectId ? ' active' : '');
    btn.style.setProperty('--proj-color', p.color);
    btn.innerHTML = `
      <span class="sidebar-project-dot"></span>
      <span class="sidebar-project-name">${escapeHtml(p.title)}</span>
      <button class="sidebar-project-edit" onclick="openProjectModal('${p.id}', event)" title="Edit">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      </button>
    `;
    btn.onclick = (e) => {
      if (e.target.closest('.sidebar-project-edit')) return;
      setCurrentProject(p.id);
    };
    container.appendChild(btn);
  });
}

function renderProjectContext() {
  // Show/hide the project context bar in chat header area
  let bar = document.getElementById('projectContextBar');
  const proj = getCurrentProject();
  if (!proj) {
    if (bar) bar.classList.remove('visible');
    return;
  }
  if (!bar) {
    // inject the bar after chat-header
    const chatHeader = document.querySelector('.chat-header');
    if (!chatHeader) return;
    bar = document.createElement('div');
    bar.className = 'project-context-bar';
    bar.id = 'projectContextBar';
    chatHeader.insertAdjacentElement('afterend', bar);
  }
  bar.style.setProperty('--ctx-color', proj.color);
  bar.innerHTML = `
    <span class="project-context-icon"></span>
    <span class="project-context-label">${{en:'In project',de:'Im Projekt',es:'En proyecto'}[currentLang]}</span>
    <span class="project-context-name">${escapeHtml(proj.title)}</span>
    <button class="project-context-clear" onclick="setCurrentProject(null)">
      ${{en:'Exit',de:'Verlassen',es:'Salir'}[currentLang]}
    </button>
  `;
  bar.classList.add('visible');
}

// Get project system prompt addendum (called from chat fn)
function getProjectPrompt() {
  const proj = getCurrentProject();
  if (!proj) return '';
  let p = '\n\nCURRENT PROJECT CONTEXT:';
  p += `\n- Project: ${proj.title}`;
  if (proj.goal) p += `\n- Project goal: ${proj.goal}`;
  p += '\n\nThe user is working on this specific project. Tie your advice to advancing THIS project. Don\'t give generic answers when project context exists.';
  return p;
}

// ============== PROJECT MODAL ==============
function openProjectModal(projectId, event) {
  if (event) event.stopPropagation();
  const isEdit = !!projectId;
  const proj = isEdit ? allProjects.find(p => p.id === projectId) : null;

  let modal = document.getElementById('projectModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'projectModal';
    modal.className = 'project-modal';
    document.body.appendChild(modal);
  }

  const labels = {
    en: { title: isEdit ? 'Edit Project' : 'New Project', sub: 'Group chats by what you\'re working on. Bot will keep your project context in mind.', name: 'Project Name', goal: 'Project Goal (optional)', goalHint: 'What are you trying to achieve in this project?', color: 'Color', cancel: 'Cancel', save: 'Save', delete: 'Delete', namePlaceholder: 'e.g. Side-Hustle Crypto Consulting' },
    de: { title: isEdit ? 'Projekt bearbeiten' : 'Neues Projekt', sub: 'Gruppiere Chats nach Vorhaben. Der Bot behält den Projekt-Kontext im Kopf.', name: 'Projekt-Name', goal: 'Projekt-Ziel (optional)', goalHint: 'Was willst du in diesem Projekt erreichen?', color: 'Farbe', cancel: 'Abbrechen', save: 'Speichern', delete: 'Löschen', namePlaceholder: 'z.B. Side-Hustle Crypto-Beratung' },
    es: { title: isEdit ? 'Editar Proyecto' : 'Nuevo Proyecto', sub: 'Agrupa chats por lo que estás trabajando. El bot recordará el contexto.', name: 'Nombre del Proyecto', goal: 'Meta del Proyecto (opcional)', goalHint: '¿Qué quieres lograr en este proyecto?', color: 'Color', cancel: 'Cancelar', save: 'Guardar', delete: 'Eliminar', namePlaceholder: 'ej. Consultoría Crypto' }
  }[currentLang];

  const swatches = PROJECT_COLORS.map(c => {
    const initialColor = proj ? proj.color : PROJECT_COLORS[0];
    const sel = c === initialColor ? ' selected' : '';
    return `<button class="project-color-swatch${sel}" data-color="${c}" style="background:${c};" onclick="selectProjectColor('${c}')"></button>`;
  }).join('');

  modal.innerHTML = `
    <div class="project-modal-content">
      <button class="project-modal-close" onclick="closeProjectModal()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <h3>${labels.title}</h3>
      <p class="project-modal-sub">${labels.sub}</p>
      <div class="project-form-group">
        <label>${labels.name}</label>
        <input type="text" id="projectModalName" maxlength="80" placeholder="${labels.namePlaceholder}" value="${proj ? escapeHtml(proj.title).replace(/"/g,'&quot;') : ''}">
      </div>
      <div class="project-form-group">
        <label>${labels.goal}</label>
        <textarea id="projectModalGoal" rows="2" maxlength="400" placeholder="${labels.goalHint}">${proj ? escapeHtml(proj.goal || '') : ''}</textarea>
      </div>
      <div class="project-form-group">
        <label>${labels.color}</label>
        <div class="project-color-picker" id="projectColorPicker">${swatches}</div>
      </div>
      <div class="project-modal-footer">
        ${isEdit ? `<button class="project-modal-btn project-modal-btn-delete" onclick="confirmDeleteProject('${projectId}')">${labels.delete}</button>` : ''}
        <button class="project-modal-btn project-modal-btn-cancel" onclick="closeProjectModal()">${labels.cancel}</button>
        <button class="project-modal-btn project-modal-btn-save" onclick="saveProjectModal('${projectId || ''}')">${labels.save}</button>
      </div>
    </div>
  `;
  modal.classList.add('visible');
  setTimeout(() => document.getElementById('projectModalName')?.focus(), 50);
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  if (modal) modal.classList.remove('visible');
}

function selectProjectColor(color) {
  document.querySelectorAll('.project-color-swatch').forEach(el => {
    el.classList.toggle('selected', el.dataset.color === color);
  });
}

function saveProjectModal(projectId) {
  const name = document.getElementById('projectModalName')?.value.trim();
  const goal = document.getElementById('projectModalGoal')?.value.trim();
  const colorEl = document.querySelector('.project-color-swatch.selected');
  const color = colorEl ? colorEl.dataset.color : PROJECT_COLORS[0];
  if (!name) {
    document.getElementById('projectModalName')?.focus();
    return;
  }
  if (projectId) {
    updateProject(projectId, { title: name, goal: goal, color: color });
  } else {
    const newProj = createProject(name, goal, color);
    currentProjectId = newProj.id;
    saveProjects();
  }
  closeProjectModal();
  renderProjects();
  renderProjectContext();
  renderChatHistory();
}

function confirmDeleteProject(projectId) {
  const proj = allProjects.find(p => p.id === projectId);
  if (!proj) return;
  const msg = {
    en: `Delete project "${proj.title}"? Chats inside stay but lose project link.`,
    de: `Projekt "${proj.title}" löschen? Chats darin bleiben, verlieren aber die Projekt-Zuordnung.`,
    es: `¿Eliminar proyecto "${proj.title}"? Los chats permanecerán pero perderán el enlace.`
  }[currentLang];
  if (!confirm(msg)) return;
  deleteProject(projectId);
  closeProjectModal();
  renderProjects();
  renderProjectContext();
  renderChatHistory();
}


// ============== CHAT → PROJECT MOVE (v8.11) ==============
function moveChatToProject(chatId, projectId) {
  const chat = allChats.find(c => c.id === chatId);
  if (!chat) return;
  if (projectId === null) {
    delete chat.projectId;
  } else {
    chat.projectId = projectId;
  }
  chat.updated = Date.now();
  saveChats();
  renderChatHistory();
  closeMoveToProjectMenu();
}

function openMoveToProjectMenu(chatId, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  // Close any existing popup
  closeMoveToProjectMenu();

  const chat = allChats.find(c => c.id === chatId);
  if (!chat) return;

  const labels = {
    en: { title: 'Move to project', none: 'No project (remove)', empty: 'No projects yet. Create one first.' },
    de: { title: 'In Projekt verschieben', none: 'Kein Projekt (entfernen)', empty: 'Noch keine Projekte. Erst eins erstellen.' },
    es: { title: 'Mover a proyecto', none: 'Sin proyecto (quitar)', empty: 'Sin proyectos aún. Crea uno primero.' }
  }[currentLang];

  const menu = document.createElement('div');
  menu.id = 'moveToProjectMenu';
  menu.className = 'move-to-project-menu';
  let html = `<div class="move-menu-title">${labels.title}</div>`;
  html += `<button class="move-menu-item" onclick="moveChatToProject('${chatId}', null)">
    <span class="move-menu-dot" style="background:rgba(240,237,232,0.4);"></span>
    <span>${labels.none}</span>
  </button>`;
  if (allProjects.length === 0) {
    html += `<div class="move-menu-empty">${labels.empty}</div>`;
  } else {
    allProjects.forEach(p => {
      const isCurrent = chat.projectId === p.id;
      html += `<button class="move-menu-item${isCurrent ? ' active' : ''}" onclick="moveChatToProject('${chatId}', '${p.id}')">
        <span class="move-menu-dot" style="background:${p.color};"></span>
        <span>${escapeHtml(p.title)}</span>
        ${isCurrent ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" style="margin-left:auto;"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
      </button>`;
    });
  }
  menu.innerHTML = html;

  // Position near the click point
  document.body.appendChild(menu);
  const rect = event.currentTarget.getBoundingClientRect();
  const menuW = 220;
  const menuH = menu.offsetHeight;
  let left = rect.left;
  let top = rect.bottom + 6;
  // Prevent overflow
  if (left + menuW > window.innerWidth - 12) left = window.innerWidth - menuW - 12;
  if (top + menuH > window.innerHeight - 12) top = rect.top - menuH - 6;
  menu.style.left = left + 'px';
  menu.style.top = top + 'px';

  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', closeMoveToProjectMenu, { once: true });
  }, 50);
}

function closeMoveToProjectMenu() {
  const m = document.getElementById('moveToProjectMenu');
  if (m) m.remove();
}

// ============== DAILY PLAN HISTORY MODAL (v8.11) ==============
function openDailyPlanHistory() {
  const plans = getDailyPlans();
  if (plans.length === 0) return;
  const sortedPlans = [...plans].sort((a, b) => b.timestamp - a.timestamp);

  const labels = {
    en: { title: 'Your Plan History', sub: 'Every daily plan you generated. The bot uses these to build progressive next steps.', close: 'Close', empty: 'No plans yet.' },
    de: { title: 'Dein Plan-Verlauf', sub: 'Jeder Daily-Plan den du generiert hast. Der Bot nutzt diese um darauf aufzubauen.', close: 'Schließen', empty: 'Noch keine Pläne.' },
    es: { title: 'Tu Historial de Planes', sub: 'Cada plan diario. El bot los usa para construir progresión.', close: 'Cerrar', empty: 'Sin planes aún.' }
  }[currentLang];

  let modal = document.getElementById('dailyPlanHistoryModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'dailyPlanHistoryModal';
    modal.className = 'project-modal';
    document.body.appendChild(modal);
  }
  const entriesHtml = sortedPlans.map(p => {
    const topic = TOPICS.find(t => t.id === p.topicId);
    const color = topic ? topic.color : '#e8420a';
    return `
      <div class="dph-entry" style="--entry-color:${color};">
        <div class="dph-entry-header">
          <span class="dph-entry-date">${p.date}</span>
          <span class="dph-entry-topic" style="color:${color};">${escapeHtml(p.topicName)}</span>
        </div>
        <div class="dph-entry-summary">${escapeHtml(p.summary)}</div>
      </div>
    `;
  }).join('');

  modal.innerHTML = `
    <div class="project-modal-content" style="max-width:600px;max-height:80vh;display:flex;flex-direction:column;">
      <button class="project-modal-close" onclick="closeDailyPlanHistory()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <h3>${labels.title}</h3>
      <p class="project-modal-sub">${labels.sub}</p>
      <div class="dph-list">
        ${entriesHtml || `<div class="move-menu-empty">${labels.empty}</div>`}
      </div>
      <div class="project-modal-footer">
        <button class="project-modal-btn project-modal-btn-cancel" onclick="closeDailyPlanHistory()">${labels.close}</button>
      </div>
    </div>
  `;
  modal.classList.add('visible');
}

function closeDailyPlanHistory() {
  const m = document.getElementById('dailyPlanHistoryModal');
  if (m) m.classList.remove('visible');
}
