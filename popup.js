// ============================================
// Word of the Day - Enhanced Extension v2.0
// ============================================

// State
let currentWord = null;
let stats = {
  currentStreak: 0,
  bestStreak: 0,
  wordsLearned: 0,
  learnedWords: [],
  skippedWords: [],
  favorites: [],
  lastPracticeDate: null,
  difficulty: 2,
  theme: 'light',
  notificationsEnabled: false,
  soundEnabled: true,
  isFirstTime: true,
  spacedRepetition: [],
  learningHistory: {},
  enabledCategories: ['general', 'business', 'literature', 'science', 'philosophy', 'law', 'medicine', 'arts'],
  wordMastery: {}, // { "word": { level: 1-5, lastSeen: date, correctCount: n } }
  personalNotes: {}, // { "word": "note text" }
  wordHistory: [], // [{ word, date, action }]
  streakFreezeUsed: null, // date string when last used
  streakFreezeWeek: null // week number
};
let quizState = { questions: [], current: 0, score: 0 };
let challengeState = { mode: null, questions: [], current: 0, score: 0, startTime: null, timer: null };

// Audio context for sounds
let audioCtx = null;

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  await loadStats();
  applyTheme(stats.theme);
  updateDate();
  initAudio();
  
  await checkLookupWord();
  
  if (stats.isFirstTime) {
    showOnboarding();
  }
  
  checkStreakFreeze();
  await loadOrSetDailyWord();
  updateUI();
  setupEventListeners();
  setupKeyboardShortcuts();
  checkSpacedRepetition();
  generateCategoryToggles();
  updateSoundIcon();
});

// ============================================
// Audio / Sound Effects
// ============================================

function initAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playSound(type) {
  if (!stats.soundEnabled || !audioCtx) return;
  
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  switch(type) {
    case 'success':
      oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.4);
      break;
    case 'error':
      oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
      oscillator.frequency.setValueAtTime(150, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.2);
      break;
    case 'click':
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.05);
      break;
    case 'milestone':
      // Fanfare
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.15);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.15 + 0.3);
        osc.start(audioCtx.currentTime + i * 0.15);
        osc.stop(audioCtx.currentTime + i * 0.15 + 0.3);
      });
      break;
    case 'newword':
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      oscillator.frequency.setValueAtTime(550, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.2);
      break;
  }
}

function updateSoundIcon() {
  document.getElementById('soundIcon').textContent = stats.soundEnabled ? '🔊' : '🔇';
  
  const toggle = document.getElementById('soundEffectsToggle');
  if (toggle) toggle.classList.toggle('active', stats.soundEnabled);
}

// ============================================
// Confetti
// ============================================

function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 380;
  canvas.height = 600;
  canvas.style.display = 'block';
  
  const particles = [];
  const colors = ['#0ea5e9', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
  
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 2,
      d: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngle: 0,
      tiltAngleIncrement: Math.random() * 0.07 + 0.05
    });
  }
  
  let animationFrame;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let allDone = true;
    particles.forEach(p => {
      if (p.y < canvas.height) allDone = false;
      
      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
      ctx.stroke();
      
      p.tiltAngle += p.tiltAngleIncrement;
      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
      p.x += Math.sin(p.d);
      p.tilt = Math.sin(p.tiltAngle) * 15;
    });
    
    if (allDone) {
      cancelAnimationFrame(animationFrame);
      canvas.style.display = 'none';
      return;
    }
    
    animationFrame = requestAnimationFrame(draw);
  }
  
  draw();
  
  setTimeout(() => {
    cancelAnimationFrame(animationFrame);
    canvas.style.display = 'none';
  }, 4000);
}

// ============================================
// Streak Freeze
// ============================================

function checkStreakFreeze() {
  const today = new Date();
  const currentWeek = getWeekNumber(today);
  
  // Reset freeze if new week
  if (stats.streakFreezeWeek !== currentWeek) {
    stats.streakFreezeWeek = currentWeek;
    stats.streakFreezeUsed = null;
    saveStats();
  }
  
  // Check if freeze was used recently
  if (stats.streakFreezeUsed) {
    const freezeDate = new Date(stats.streakFreezeUsed);
    if (isYesterday(stats.streakFreezeUsed)) {
      document.getElementById('freezeBanner').classList.remove('hidden');
      document.getElementById('freezesLeft').textContent = '0';
    }
  }
  
  updateFreezeCount();
}

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function useStreakFreeze() {
  if (stats.streakFreezeUsed) return false;
  
  stats.streakFreezeUsed = getTodayString();
  saveStats();
  return true;
}

function updateFreezeCount() {
  const freezeCount = stats.streakFreezeUsed ? 0 : 1;
  const el = document.getElementById('freezeCount');
  if (el) el.textContent = freezeCount;
}

// ============================================
// Word Mastery
// ============================================

function getMasteryLevel(word) {
  const mastery = stats.wordMastery[word.toLowerCase()];
  if (!mastery) return 0;
  return mastery.level || 0;
}

function updateMastery(word, correct) {
  const key = word.toLowerCase();
  if (!stats.wordMastery[key]) {
    stats.wordMastery[key] = { level: 1, correctCount: 0, lastSeen: getTodayString() };
  }
  
  const m = stats.wordMastery[key];
  m.lastSeen = getTodayString();
  
  if (correct) {
    m.correctCount++;
    // Level up based on correct answers
    if (m.correctCount >= 1 && m.level < 1) m.level = 1; // Seen
    if (m.correctCount >= 2 && m.level < 2) m.level = 2; // Used
    if (m.correctCount >= 4 && m.level < 3) m.level = 3; // Quizzed
    if (m.correctCount >= 7 && m.level < 4) m.level = 4; // Retained
    if (m.correctCount >= 10 && m.level < 5) m.level = 5; // Mastered
  }
  
  saveStats();
}

function getMasteryStars(level) {
  const filled = '★'.repeat(level);
  const empty = '☆'.repeat(5 - level);
  return filled + empty;
}

function updateMasteryDisplay() {
  if (!currentWord) return;
  const level = getMasteryLevel(currentWord.word);
  document.getElementById('masteryStars').textContent = getMasteryStars(level);
  document.getElementById('masteryBadge').setAttribute('data-level', level);
}

// ============================================
// Onboarding
// ============================================

function showOnboarding() {
  document.getElementById('onboarding').classList.remove('hidden');
}

function hideOnboarding() {
  document.getElementById('onboarding').classList.add('hidden');
  stats.isFirstTime = false;
  saveStats();
  playSound('success');
}

// ============================================
// Data Persistence
// ============================================

async function loadStats() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['vocabStats'], (result) => {
      if (result.vocabStats) {
        stats = { ...stats, ...result.vocabStats };
      }
      resolve();
    });
  });
}

async function saveStats() {
  return new Promise((resolve) => {
    chrome.storage.local.set({ vocabStats: stats }, resolve);
  });
}

// ============================================
// Word Management
// ============================================

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

async function checkLookupWord() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['lookupWord'], (result) => {
      if (result.lookupWord) {
        const word = result.lookupWord.toLowerCase();
        const found = VOCABULARY.find(w => w.word.toLowerCase() === word);
        if (found) {
          currentWord = found;
          chrome.storage.local.remove(['lookupWord']);
        }
      }
      resolve();
    });
  });
}

async function loadOrSetDailyWord() {
  if (currentWord) return;
  
  return new Promise((resolve) => {
    chrome.storage.local.get(['dailyWord', 'dailyWordDate'], (result) => {
      const today = getTodayString();
      
      if (result.dailyWord && result.dailyWordDate === today) {
        currentWord = result.dailyWord;
      } else {
        setNewWord();
        chrome.storage.local.set({ dailyWord: currentWord, dailyWordDate: today });
      }
      resolve();
    });
  });
}

function setNewWord() {
  const availableWords = VOCABULARY.filter(w => 
    w.difficulty <= stats.difficulty &&
    stats.enabledCategories.includes(w.category) &&
    !stats.learnedWords.includes(w.word.toLowerCase()) &&
    !stats.skippedWords.includes(w.word.toLowerCase())
  );
  
  const wordPool = availableWords.length > 0 ? availableWords : 
    VOCABULARY.filter(w => w.difficulty <= stats.difficulty && stats.enabledCategories.includes(w.category));
  
  const randomIndex = Math.floor(Math.random() * wordPool.length);
  currentWord = wordPool[randomIndex] || VOCABULARY[0];
}

async function getNewWord() {
  playSound('newword');
  
  // Animate card flip
  const card = document.getElementById('wordCard');
  card.classList.add('flip-out');
  
  setTimeout(async () => {
    setNewWord();
    const today = getTodayString();
    
    await new Promise((resolve) => {
      chrome.storage.local.set({ dailyWord: currentWord, dailyWordDate: today }, resolve);
    });
    
    addToHistory(currentWord.word, 'viewed');
    document.getElementById('userSentence').value = '';
    document.getElementById('feedback').className = 'feedback';
    document.getElementById('hintSection').classList.add('hidden');
    
    updateWordDisplay();
    card.classList.remove('flip-out');
    card.classList.add('flip-in');
    setTimeout(() => card.classList.remove('flip-in'), 300);
  }, 150);
}

async function skipWord() {
  playSound('click');
  if (currentWord && !stats.skippedWords.includes(currentWord.word.toLowerCase())) {
    stats.skippedWords.push(currentWord.word.toLowerCase());
    addToHistory(currentWord.word, 'skipped');
    await saveStats();
  }
  await getNewWord();
}

// ============================================
// Word History
// ============================================

function addToHistory(word, action) {
  stats.wordHistory.unshift({
    word: word,
    date: new Date().toISOString(),
    action: action
  });
  
  // Keep last 100 entries
  if (stats.wordHistory.length > 100) {
    stats.wordHistory = stats.wordHistory.slice(0, 100);
  }
  
  saveStats();
}

function showHistory() {
  showView('history');
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById('historyList');
  list.innerHTML = '';
  
  if (stats.wordHistory.length === 0) {
    list.innerHTML = '<p class="empty-state">No history yet. Start learning!</p>';
    return;
  }
  
  // Group by date
  const grouped = {};
  stats.wordHistory.forEach(item => {
    const date = item.date.split('T')[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(item);
  });
  
  Object.entries(grouped).forEach(([date, items]) => {
    const dateHeader = document.createElement('div');
    dateHeader.className = 'history-date';
    dateHeader.textContent = formatDate(date);
    list.appendChild(dateHeader);
    
    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'history-item';
      
      const actionIcon = item.action === 'learned' ? '✓' : 
                         item.action === 'skipped' ? '⏭️' : '👁️';
      
      el.innerHTML = `
        <span class="history-icon">${actionIcon}</span>
        <span class="history-word">${item.word}</span>
        <span class="history-time">${formatTime(item.date)}</span>
      `;
      
      el.addEventListener('click', () => {
        const found = VOCABULARY.find(w => w.word.toLowerCase() === item.word.toLowerCase());
        if (found) {
          currentWord = found;
          showView('main');
          updateWordDisplay();
        }
      });
      
      list.appendChild(el);
    });
  });
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (dateStr === today.toISOString().split('T')[0]) return 'Today';
  if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';
  
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(isoStr) {
  const date = new Date(isoStr);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

// ============================================
// Hints
// ============================================

function showHint() {
  if (!currentWord) return;
  
  playSound('click');
  const hints = getHints(currentWord);
  const hintSection = document.getElementById('hintSection');
  const hintText = document.getElementById('hintText');
  
  hintText.textContent = hints[Math.floor(Math.random() * hints.length)];
  hintSection.classList.remove('hidden');
}

function getHints(word) {
  const templates = [
    `Try starting with: "The ${word.word.toLowerCase()} nature of..."`,
    `How about: "It was ${word.partOfSpeech === 'adjective' ? 'an ' + word.word.toLowerCase() : word.word.toLowerCase()}..."`,
    `Consider: "Despite being ${word.word.toLowerCase()}..."`,
    `You could say: "The ${word.word.toLowerCase()} ${word.partOfSpeech === 'noun' ? 'was' : 'situation'}..."`,
    `Think about a time when something was ${word.definition.split(' ').slice(0, 3).join(' ')}...`
  ];
  
  return templates;
}

// ============================================
// Personal Notes
// ============================================

function toggleNotes() {
  const notesInput = document.getElementById('notesInput');
  const isHidden = notesInput.classList.contains('hidden');
  
  notesInput.classList.toggle('hidden');
  
  if (isHidden && currentWord) {
    const note = stats.personalNotes[currentWord.word.toLowerCase()] || '';
    document.getElementById('personalNotes').value = note;
  }
  
  playSound('click');
}

function saveNote() {
  if (!currentWord) return;
  
  const note = document.getElementById('personalNotes').value.trim();
  const key = currentWord.word.toLowerCase();
  
  if (note) {
    stats.personalNotes[key] = note;
    document.getElementById('notesIndicator').classList.remove('hidden');
  } else {
    delete stats.personalNotes[key];
    document.getElementById('notesIndicator').classList.add('hidden');
  }
  
  saveStats();
  playSound('success');
  showFeedback('Note saved!', 'success');
}

function updateNotesIndicator() {
  if (!currentWord) return;
  const hasNote = stats.personalNotes[currentWord.word.toLowerCase()];
  document.getElementById('notesIndicator').classList.toggle('hidden', !hasNote);
}

// ============================================
// Challenge Mode
// ============================================

function showChallenge() {
  showView('challenge');
  document.getElementById('challengeSelect').classList.remove('hidden');
  document.getElementById('challengeGame').classList.add('hidden');
  document.getElementById('challengeResult').classList.add('hidden');
}

function startChallenge(mode) {
  playSound('click');
  
  const learnedWordObjects = VOCABULARY.filter(w => 
    stats.learnedWords.includes(w.word.toLowerCase())
  );
  
  if (learnedWordObjects.length < 5) {
    showFeedback('Learn more words first!', 'error');
    return;
  }
  
  challengeState = {
    mode: mode,
    questions: [],
    current: 0,
    score: 0,
    startTime: Date.now(),
    timer: null
  };
  
  const shuffled = learnedWordObjects.sort(() => Math.random() - 0.5).slice(0, 10);
  
  challengeState.questions = shuffled.map(word => ({
    word: word.word,
    definition: word.definition,
    example: word.example
  }));
  
  document.getElementById('challengeSelect').classList.add('hidden');
  document.getElementById('challengeGame').classList.remove('hidden');
  
  if (mode === 'speed') {
    startChallengeTimer();
  }
  
  showChallengeQuestion();
}

function startChallengeTimer() {
  let seconds = 60;
  const timerEl = document.getElementById('challengeTimer');
  timerEl.textContent = seconds;
  timerEl.classList.add('active');
  
  challengeState.timer = setInterval(() => {
    seconds--;
    timerEl.textContent = seconds;
    
    if (seconds <= 10) timerEl.classList.add('warning');
    
    if (seconds <= 0) {
      endChallenge();
    }
  }, 1000);
}

function showChallengeQuestion() {
  const q = challengeState.questions[challengeState.current];
  const mode = challengeState.mode;
  
  document.getElementById('challengeProgress').textContent = 
    `${challengeState.current + 1}/${challengeState.questions.length}`;
  document.getElementById('challengeBarFill').style.width = 
    `${((challengeState.current + 1) / challengeState.questions.length) * 100}%`;
  
  const questionEl = document.getElementById('challengeQuestion');
  const inputEl = document.getElementById('challengeInput');
  const optionsEl = document.getElementById('challengeOptionsGrid');
  
  inputEl.classList.add('hidden');
  optionsEl.classList.add('hidden');
  optionsEl.innerHTML = '';
  document.getElementById('challengeFeedback').textContent = '';
  
  if (mode === 'speed') {
    questionEl.textContent = `What does "${q.word}" mean?`;
    
    // Generate options
    const options = [q.definition];
    const otherWords = VOCABULARY.filter(w => w.word !== q.word);
    while (options.length < 4) {
      const rand = otherWords[Math.floor(Math.random() * otherWords.length)];
      if (!options.includes(rand.definition)) options.push(rand.definition);
    }
    options.sort(() => Math.random() - 0.5);
    
    optionsEl.classList.remove('hidden');
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'challenge-opt-btn';
      btn.textContent = opt;
      btn.onclick = () => checkChallengeAnswer(opt, q.definition);
      optionsEl.appendChild(btn);
    });
    
  } else if (mode === 'reverse') {
    questionEl.innerHTML = `<span class="challenge-def">${q.definition}</span><br><small>Type the word:</small>`;
    inputEl.classList.remove('hidden');
    inputEl.value = '';
    inputEl.focus();
    
  } else if (mode === 'fillblank') {
    const sentence = q.example.replace(new RegExp(q.word, 'gi'), '_____');
    questionEl.innerHTML = `<span class="challenge-sentence">${sentence}</span><br><small>Fill in the blank:</small>`;
    inputEl.classList.remove('hidden');
    inputEl.value = '';
    inputEl.focus();
  }
}

function checkChallengeAnswer(answer, correct) {
  const mode = challengeState.mode;
  const q = challengeState.questions[challengeState.current];
  let isCorrect = false;
  
  if (mode === 'speed') {
    isCorrect = answer === correct;
  } else {
    isCorrect = answer.toLowerCase().trim() === q.word.toLowerCase();
  }
  
  const feedbackEl = document.getElementById('challengeFeedback');
  
  if (isCorrect) {
    challengeState.score++;
    feedbackEl.textContent = '✓ Correct!';
    feedbackEl.className = 'challenge-feedback correct';
    playSound('success');
  } else {
    feedbackEl.textContent = `✗ It was: ${mode === 'speed' ? 'see above' : q.word}`;
    feedbackEl.className = 'challenge-feedback wrong';
    playSound('error');
  }
  
  // Disable buttons
  document.querySelectorAll('.challenge-opt-btn').forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correct) btn.classList.add('correct');
    else if (btn.textContent === answer && !isCorrect) btn.classList.add('wrong');
  });
  
  setTimeout(() => {
    challengeState.current++;
    if (challengeState.current < challengeState.questions.length) {
      showChallengeQuestion();
    } else {
      endChallenge();
    }
  }, 1000);
}

function endChallenge() {
  if (challengeState.timer) {
    clearInterval(challengeState.timer);
    document.getElementById('challengeTimer').classList.remove('active', 'warning');
  }
  
  const elapsed = Math.round((Date.now() - challengeState.startTime) / 1000);
  
  document.getElementById('challengeGame').classList.add('hidden');
  document.getElementById('challengeResult').classList.remove('hidden');
  
  document.getElementById('challengeScore').textContent = 
    `${challengeState.score}/${challengeState.questions.length}`;
  document.getElementById('challengeTime').textContent = `Time: ${elapsed}s`;
  
  const percent = challengeState.score / challengeState.questions.length;
  const messages = ['Keep practicing!', 'Good effort!', 'Great job!', 'Perfect!'];
  document.getElementById('challengeMessage').textContent = 
    messages[Math.min(3, Math.floor(percent * 4))];
  
  if (percent >= 0.8) {
    playSound('milestone');
    launchConfetti();
  }
}

// ============================================
// UI Updates
// ============================================

function updateDate() {
  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  document.getElementById('todayDate').textContent = new Date().toLocaleDateString('en-US', options);
}

function updateUI() {
  updateWordDisplay();
  updateStats();
  updateMasteryDisplay();
  updateNotesIndicator();
}

function updateWordDisplay() {
  if (!currentWord) return;
  
  document.getElementById('currentWord').textContent = currentWord.word;
  document.getElementById('partOfSpeech').textContent = currentWord.partOfSpeech;
  document.getElementById('definition').textContent = currentWord.definition;
  
  // Badges
  const diffLabels = { 1: 'Everyday', 2: 'SAT', 3: 'GRE', 4: 'Obscure' };
  document.getElementById('difficultyBadge').textContent = diffLabels[currentWord.difficulty] || 'SAT';
  document.getElementById('categoryBadge').textContent = currentWord.category || 'general';
  
  // Etymology
  const etymSection = document.getElementById('etymologySection');
  if (currentWord.etymology) {
    etymSection.style.display = 'flex';
    document.getElementById('etymology').textContent = currentWord.etymology;
  } else {
    etymSection.style.display = 'none';
  }
  
  // Pronunciation
  document.getElementById('pronunciation').textContent = generatePronunciation(currentWord.word);
  
  // Examples (multiple)
  const examplesList = document.getElementById('examplesList');
  examplesList.innerHTML = '';
  
  const examples = currentWord.examples || [currentWord.example];
  examples.forEach((ex, i) => {
    const p = document.createElement('p');
    p.className = 'example-item';
    p.textContent = ex;
    if (i > 0) p.classList.add('secondary');
    examplesList.appendChild(p);
  });
  
  // Synonyms & Antonyms
  const synonymsEl = document.getElementById('synonyms');
  const antonymsEl = document.getElementById('antonyms');
  synonymsEl.innerHTML = '';
  antonymsEl.innerHTML = '';
  
  (currentWord.synonyms || []).slice(0, 3).forEach(syn => {
    const span = document.createElement('span');
    span.textContent = syn;
    synonymsEl.appendChild(span);
  });
  
  (currentWord.antonyms || []).slice(0, 3).forEach(ant => {
    const span = document.createElement('span');
    span.textContent = ant;
    antonymsEl.appendChild(span);
  });
  
  updateMasteryDisplay();
  updateNotesIndicator();
}

function generatePronunciation(word) {
  return '/' + word.toLowerCase()
    .replace(/ph/g, 'f')
    .replace(/tion/g, 'shən')
    .replace(/sion/g, 'zhən')
    .replace(/ous$/g, 'əs')
    + '/';
}

function updateStats() {
  document.getElementById('streakCount').textContent = stats.currentStreak;
  document.getElementById('wordsLearned').textContent = stats.wordsLearned;
  document.getElementById('bestStreak').textContent = stats.bestStreak;
}

// ============================================
// Sentence Checking
// ============================================

function checkSentence() {
  const sentence = document.getElementById('userSentence').value.trim();
  
  if (!sentence) {
    showFeedback('Write a sentence first!', 'error');
    playSound('error');
    return;
  }
  
  if (!currentWord) {
    showFeedback('No word loaded.', 'error');
    return;
  }
  
  const wordLower = currentWord.word.toLowerCase();
  const sentenceLower = sentence.toLowerCase();
  const wordRegex = new RegExp(`\\b${escapeRegex(wordLower)}\\w*\\b`, 'i');
  
  if (wordRegex.test(sentenceLower)) {
    handleSuccess();
  } else {
    showFeedback(`Use "${currentWord.word}" in your sentence.`, 'error');
    playSound('error');
  }
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function handleSuccess() {
  const today = getTodayString();
  const wordLower = currentWord.word.toLowerCase();
  
  if (!stats.learnedWords.includes(wordLower)) {
    stats.learnedWords.push(wordLower);
    stats.wordsLearned = stats.learnedWords.length;
    
    addToSpacedRepetition(wordLower);
    addToHistory(currentWord.word, 'learned');
    
    if (!stats.learningHistory[today]) {
      stats.learningHistory[today] = [];
    }
    if (!stats.learningHistory[today].includes(wordLower)) {
      stats.learningHistory[today].push(wordLower);
    }
    
    checkMilestone(stats.wordsLearned);
  }
  
  updateMastery(currentWord.word, true);
  
  // Update streak
  if (stats.lastPracticeDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (stats.lastPracticeDate === yesterdayStr) {
      stats.currentStreak++;
    } else if (!stats.lastPracticeDate) {
      stats.currentStreak = 1;
    } else {
      // Check for streak freeze
      if (!stats.streakFreezeUsed && stats.currentStreak > 0) {
        useStreakFreeze();
        document.getElementById('freezeBanner').classList.remove('hidden');
        document.getElementById('freezesLeft').textContent = '0';
      } else {
        stats.currentStreak = 1;
      }
    }
    
    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak;
    }
    
    stats.lastPracticeDate = today;
  }
  
  await saveStats();
  updateStats();
  
  playSound('success');
  showFeedback(`🎉 Nice! You've got "${currentWord.word}"!`, 'success');
}

function isYesterday(dateString) {
  if (!dateString) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateString === yesterday.toISOString().split('T')[0];
}

function showFeedback(message, type) {
  const feedback = document.getElementById('feedback');
  feedback.textContent = message;
  feedback.className = `feedback ${type} show`;
}

// ============================================
// Spaced Repetition
// ============================================

function addToSpacedRepetition(word) {
  const today = new Date();
  const nextReview = new Date(today);
  nextReview.setDate(nextReview.getDate() + 1);
  
  stats.spacedRepetition.push({
    word: word,
    nextReview: nextReview.toISOString().split('T')[0],
    interval: 1,
    easeFactor: 2.5
  });
}

function checkSpacedRepetition() {
  const today = getTodayString();
  const dueWords = stats.spacedRepetition.filter(item => item.nextReview <= today);
  
  if (dueWords.length > 0) {
    const srBanner = document.getElementById('srBanner');
    const srWord = document.getElementById('srWord');
    srWord.textContent = dueWords[0].word;
    srBanner.classList.remove('hidden');
  }
}

async function reviewSpacedWord() {
  const today = getTodayString();
  const dueWords = stats.spacedRepetition.filter(item => item.nextReview <= today);
  
  if (dueWords.length > 0) {
    const wordToReview = dueWords[0].word;
    const foundWord = VOCABULARY.find(w => w.word.toLowerCase() === wordToReview);
    
    if (foundWord) {
      currentWord = foundWord;
      updateWordDisplay();
      document.getElementById('srBanner').classList.add('hidden');
      
      const item = stats.spacedRepetition.find(i => i.word === wordToReview);
      if (item) {
        item.interval = Math.round(item.interval * item.easeFactor);
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + item.interval);
        item.nextReview = nextDate.toISOString().split('T')[0];
      }
      
      await saveStats();
    }
  }
}

// ============================================
// Milestones
// ============================================

function checkMilestone(count) {
  const milestones = [10, 25, 50, 100, 150, 200, 250, 300, 365, 500];
  if (milestones.includes(count)) {
    showMilestone(`🎉 ${count} words learned!`);
    playSound('milestone');
    launchConfetti();
  }
}

function showMilestone(text) {
  const toast = document.getElementById('milestoneToast');
  document.getElementById('milestoneText').textContent = text;
  toast.classList.remove('hidden');
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 3000);
}

// ============================================
// Audio
// ============================================

function speakWord() {
  if (!currentWord) return;
  
  playSound('click');
  
  const utterance = new SpeechSynthesisUtterance(currentWord.word);
  utterance.rate = 0.8;
  utterance.pitch = 1;
  
  const voices = speechSynthesis.getVoices();
  const englishVoice = voices.find(v => v.lang.startsWith('en-'));
  if (englishVoice) utterance.voice = englishVoice;
  
  speechSynthesis.speak(utterance);
}

// ============================================
// Theme
// ============================================

function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  stats.theme = theme;
  
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
}

function toggleTheme() {
  const themes = ['light', 'dark', 'sepia'];
  const currentIndex = themes.indexOf(stats.theme);
  const nextTheme = themes[(currentIndex + 1) % themes.length];
  applyTheme(nextTheme);
  saveStats();
  playSound('click');
}

// ============================================
// Quiz & Word Bank (existing)
// ============================================

function startQuiz() {
  const learnedWordObjects = VOCABULARY.filter(w => 
    stats.learnedWords.includes(w.word.toLowerCase())
  );
  
  if (learnedWordObjects.length < 4) {
    showFeedback('Learn more words to take the quiz!', 'error');
    return;
  }
  
  playSound('click');
  
  const shuffled = learnedWordObjects.sort(() => Math.random() - 0.5);
  const quizWords = shuffled.slice(0, Math.min(7, shuffled.length));
  
  quizState = {
    questions: quizWords.map(word => ({
      word: word.word,
      correct: word.definition,
      options: generateQuizOptions(word, VOCABULARY)
    })),
    current: 0,
    score: 0
  };
  
  showView('quiz');
  showQuizQuestion();
}

function generateQuizOptions(correctWord, allWords) {
  const options = [correctWord.definition];
  const otherWords = allWords.filter(w => w.word !== correctWord.word);
  
  while (options.length < 4 && otherWords.length > 0) {
    const randomIndex = Math.floor(Math.random() * otherWords.length);
    const randomWord = otherWords.splice(randomIndex, 1)[0];
    if (!options.includes(randomWord.definition)) {
      options.push(randomWord.definition);
    }
  }
  
  return options.sort(() => Math.random() - 0.5);
}

function showQuizQuestion() {
  const q = quizState.questions[quizState.current];
  
  document.getElementById('quizProgress').textContent = `${quizState.current + 1}/${quizState.questions.length}`;
  document.getElementById('quizQuestion').textContent = `What does "${q.word}" mean?`;
  
  const optionsEl = document.getElementById('quizOptions');
  optionsEl.innerHTML = '';
  
  q.options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = option;
    btn.onclick = () => selectQuizOption(btn, option, q.correct, q.word);
    optionsEl.appendChild(btn);
  });
  
  document.getElementById('quizResult').classList.add('hidden');
  document.querySelector('.quiz-content').classList.remove('hidden');
}

function selectQuizOption(btn, selected, correct, word) {
  document.querySelectorAll('.quiz-option').forEach(b => {
    b.disabled = true;
    if (b.textContent === correct) b.classList.add('correct');
  });
  
  if (selected === correct) {
    quizState.score++;
    updateMastery(word, true);
    playSound('success');
  } else {
    btn.classList.add('wrong');
    playSound('error');
  }
  
  setTimeout(() => {
    quizState.current++;
    if (quizState.current < quizState.questions.length) {
      showQuizQuestion();
    } else {
      showQuizResult();
    }
  }, 1000);
}

function showQuizResult() {
  document.querySelector('.quiz-content').classList.add('hidden');
  document.getElementById('quizResult').classList.remove('hidden');
  
  document.getElementById('quizScore').textContent = `${quizState.score}/${quizState.questions.length}`;
  
  const percent = quizState.score / quizState.questions.length;
  const messages = ['Keep practicing! 📚', 'Good effort! 💪', 'Great job! 👏', 'Perfect! 🎯'];
  document.getElementById('quizMessage').textContent = messages[Math.min(3, Math.floor(percent * 4))];
  
  if (percent === 1) {
    playSound('milestone');
    launchConfetti();
  }
}

function showWordBank(filter = 'all', category = null) {
  showView('bank');
  renderWordBank(filter, category);
  generateCategoryFilters();
  
  document.querySelectorAll('.bank-filters .filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
}

function renderWordBank(filter, category = null) {
  let words = VOCABULARY.filter(w => stats.learnedWords.includes(w.word.toLowerCase()));
  
  if (filter === 'favorites') {
    words = words.filter(w => stats.favorites.includes(w.word.toLowerCase()));
  } else if (filter === 'mastered') {
    words = words.filter(w => getMasteryLevel(w.word) >= 5);
  }
  
  if (category) {
    words = words.filter(w => w.category === category);
  }
  
  const listEl = document.getElementById('bankList');
  const emptyEl = document.getElementById('bankEmpty');
  
  if (words.length === 0) {
    listEl.classList.add('hidden');
    emptyEl.classList.remove('hidden');
    return;
  }
  
  emptyEl.classList.add('hidden');
  listEl.classList.remove('hidden');
  listEl.innerHTML = '';
  
  words.forEach(word => {
    const isFav = stats.favorites.includes(word.word.toLowerCase());
    const mastery = getMasteryLevel(word.word);
    
    const item = document.createElement('div');
    item.className = 'bank-item';
    item.innerHTML = `
      <div class="bank-item-main">
        <div class="bank-item-word">${word.word}</div>
        <div class="bank-item-def">${word.definition.slice(0, 50)}...</div>
        <div class="bank-item-mastery">${getMasteryStars(mastery)}</div>
      </div>
      <button class="bank-item-fav ${isFav ? 'active' : ''}" data-word="${word.word.toLowerCase()}">⭐</button>
    `;
    
    listEl.appendChild(item);
  });
  
  document.querySelectorAll('.bank-item-fav').forEach(btn => {
    btn.onclick = () => toggleFavorite(btn.dataset.word, btn);
  });
}

function generateCategoryFilters() {
  const container = document.getElementById('categoryFilters');
  if (!container) return;
  
  container.innerHTML = '';
  
  const learnedCategories = [...new Set(
    VOCABULARY.filter(w => stats.learnedWords.includes(w.word.toLowerCase()))
      .map(w => w.category)
  )];
  
  learnedCategories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-filter-btn';
    btn.textContent = cat;
    btn.onclick = () => showWordBank('all', cat);
    container.appendChild(btn);
  });
}

async function toggleFavorite(word, btn) {
  const index = stats.favorites.indexOf(word);
  if (index > -1) {
    stats.favorites.splice(index, 1);
    btn.classList.remove('active');
  } else {
    stats.favorites.push(word);
    btn.classList.add('active');
  }
  playSound('click');
  await saveStats();
}

function exportWords() {
  const words = VOCABULARY.filter(w => stats.learnedWords.includes(w.word.toLowerCase()));
  
  let csv = 'Word,Part of Speech,Definition,Category,Example,Mastery\n';
  words.forEach(w => {
    const mastery = getMasteryLevel(w.word);
    csv += `"${w.word}","${w.partOfSpeech}","${w.definition}","${w.category}","${w.example}","${mastery}/5"\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'vocabulary-words.csv';
  a.click();
  
  URL.revokeObjectURL(url);
  playSound('success');
}

// ============================================
// Calendar, Settings, Share (existing)
// ============================================

function showCalendar() {
  showView('calendar');
  renderCalendar();
}

function renderCalendar() {
  const grid = document.getElementById('calendarGrid');
  grid.innerHTML = '';
  
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 90);
  
  let thisMonthCount = 0;
  const currentMonth = today.getMonth();
  
  for (let i = 0; i < 91; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    const wordsLearned = stats.learningHistory[dateStr]?.length || 0;
    
    if (date.getMonth() === currentMonth) {
      thisMonthCount += wordsLearned;
    }
    
    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    cell.title = `${dateStr}: ${wordsLearned} words`;
    
    if (wordsLearned === 0) cell.classList.add('empty');
    else if (wordsLearned === 1) cell.classList.add('light');
    else if (wordsLearned <= 3) cell.classList.add('medium');
    else cell.classList.add('full');
    
    grid.appendChild(cell);
  }
  
  document.getElementById('calTotalWords').textContent = stats.wordsLearned;
  document.getElementById('calThisMonth').textContent = thisMonthCount;
}

function showSettings() {
  showView('settings');
  
  // Update difficulty buttons
  document.querySelectorAll('[data-difficulty]').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.difficulty) === stats.difficulty);
  });
  
  // Update theme buttons
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === stats.theme);
  });
  
  // Update toggles
  const notifToggle = document.getElementById('notificationToggle');
  if (notifToggle) notifToggle.classList.toggle('active', stats.notificationsEnabled);
  
  const soundToggle = document.getElementById('soundEffectsToggle');
  if (soundToggle) soundToggle.classList.toggle('active', stats.soundEnabled);
  
  // Generate category toggles
  generateCategoryToggles();
  
  updateFreezeCount();
}

function generateCategoryToggles() {
  const container = document.getElementById('categoryToggles');
  if (!container) {
    console.log('categoryToggles container not found');
    return;
  }
  
  container.innerHTML = '';
  
  if (typeof VOCABULARY === 'undefined' || !VOCABULARY.length) {
    console.log('VOCABULARY not available');
    return;
  }
  
  const categories = [...new Set(VOCABULARY.map(w => w.category).filter(c => c))].sort();
  console.log('Categories found:', categories);
  
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'setting-btn cat-toggle';
    btn.textContent = cat;
    btn.dataset.category = cat;
    btn.classList.toggle('active', stats.enabledCategories.includes(cat));
    btn.onclick = () => toggleCategory(cat, btn);
    container.appendChild(btn);
  });
}

async function toggleCategory(category, btn) {
  const index = stats.enabledCategories.indexOf(category);
  if (index > -1) {
    if (stats.enabledCategories.length > 1) {
      stats.enabledCategories.splice(index, 1);
      btn.classList.remove('active');
    }
  } else {
    stats.enabledCategories.push(category);
    btn.classList.add('active');
  }
  playSound('click');
  await saveStats();
}

async function setDifficulty(level) {
  stats.difficulty = level;
  playSound('click');
  await saveStats();
  
  document.querySelectorAll('[data-difficulty]').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.difficulty) === level);
  });
}

async function toggleNotifications() {
  stats.notificationsEnabled = !stats.notificationsEnabled;
  
  const toggle = document.getElementById('notificationToggle');
  toggle.classList.toggle('active', stats.notificationsEnabled);
  
  if (stats.notificationsEnabled) {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      stats.notificationsEnabled = false;
      toggle.classList.remove('active');
      showFeedback('Notification permission denied', 'error');
    }
  }
  
  playSound('click');
  await saveStats();
}

async function toggleSoundEffects() {
  stats.soundEnabled = !stats.soundEnabled;
  
  const toggle = document.getElementById('soundEffectsToggle');
  toggle.classList.toggle('active', stats.soundEnabled);
  
  updateSoundIcon();
  if (stats.soundEnabled) playSound('click');
  await saveStats();
}

async function resetProgress() {
  if (confirm('Reset all progress? This cannot be undone.')) {
    stats = {
      currentStreak: 0,
      bestStreak: 0,
      wordsLearned: 0,
      learnedWords: [],
      skippedWords: [],
      favorites: [],
      lastPracticeDate: null,
      difficulty: stats.difficulty,
      theme: stats.theme,
      notificationsEnabled: false,
      soundEnabled: stats.soundEnabled,
      isFirstTime: false,
      spacedRepetition: [],
      learningHistory: {},
      enabledCategories: stats.enabledCategories,
      wordMastery: {},
      personalNotes: {},
      wordHistory: [],
      streakFreezeUsed: null,
      streakFreezeWeek: null
    };
    await saveStats();
    await getNewWord();
    updateStats();
    showView('main');
    playSound('click');
  }
}

function showShareModal() {
  if (!currentWord) return;
  
  document.getElementById('shareCardWord').textContent = currentWord.word;
  document.getElementById('shareCardPos').textContent = currentWord.partOfSpeech;
  document.getElementById('shareCardDef').textContent = currentWord.definition;
  
  document.getElementById('shareModal').classList.remove('hidden');
  playSound('click');
}

function hideShareModal() {
  document.getElementById('shareModal').classList.add('hidden');
}

async function copyShareCard() {
  const text = `📚 Word of the Day: ${currentWord.word}\n${currentWord.partOfSpeech} — ${currentWord.definition}`;
  navigator.clipboard.writeText(text);
  showFeedback('Copied to clipboard!', 'success');
  playSound('success');
  hideShareModal();
}

function downloadShareCard() {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 250;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = stats.theme === 'dark' ? '#1e1e24' : '#ffffff';
  ctx.fillRect(0, 0, 400, 250);
  
  ctx.fillStyle = '#0ea5e9';
  ctx.fillRect(0, 0, 400, 4);
  
  ctx.fillStyle = stats.theme === 'dark' ? '#f4f4f6' : '#1a1a18';
  ctx.font = '12px sans-serif';
  ctx.fillText('Word of the Day', 24, 35);
  
  ctx.font = 'bold 32px Georgia';
  ctx.fillText(currentWord.word, 24, 90);
  
  ctx.font = 'italic 14px Georgia';
  ctx.fillStyle = '#0ea5e9';
  ctx.fillText(currentWord.partOfSpeech, 24, 115);
  
  ctx.font = '16px sans-serif';
  ctx.fillStyle = stats.theme === 'dark' ? '#a0a0aa' : '#6b6860';
  
  const words = currentWord.definition.split(' ');
  let line = '';
  let y = 150;
  words.forEach(word => {
    const testLine = line + word + ' ';
    if (ctx.measureText(testLine).width > 350) {
      ctx.fillText(line, 24, y);
      line = word + ' ';
      y += 24;
    } else {
      line = testLine;
    }
  });
  ctx.fillText(line, 24, y);
  
  ctx.font = '11px sans-serif';
  ctx.fillStyle = '#a09a92';
  ctx.fillText('wordoftheday.app', 24, 230);
  
  const link = document.createElement('a');
  link.download = `${currentWord.word}-word-of-the-day.png`;
  link.href = canvas.toDataURL();
  link.click();
  
  playSound('success');
  hideShareModal();
}

function copyTemplate() {
  if (!currentWord) return;
  
  const template = `The word "${currentWord.word}" means "${currentWord.definition}". `;
  navigator.clipboard.writeText(template);
  playSound('click');
  
  const btn = document.getElementById('copyBtn');
  btn.style.color = 'var(--success)';
  setTimeout(() => btn.style.color = '', 1000);
}

// ============================================
// View Management
// ============================================

function showView(view) {
  const views = ['main', 'history', 'challenge', 'calendar', 'quiz', 'bank', 'settings'];
  views.forEach(v => {
    const el = document.getElementById(`${v}View`);
    if (el) el.classList.toggle('hidden', v !== view);
  });
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
  // Onboarding
  document.getElementById('onboardingDone').addEventListener('click', hideOnboarding);
  
  // Header
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  document.getElementById('settingsBtn').addEventListener('click', showSettings);
  document.getElementById('soundToggle').addEventListener('click', () => {
    stats.soundEnabled = !stats.soundEnabled;
    updateSoundIcon();
    if (stats.soundEnabled) playSound('click');
    saveStats();
  });
  
  // Spaced repetition
  document.getElementById('srReviewBtn')?.addEventListener('click', reviewSpacedWord);
  
  // Word actions
  document.getElementById('audioBtn').addEventListener('click', speakWord);
  document.getElementById('skipBtn').addEventListener('click', skipWord);
  document.getElementById('newWordBtn').addEventListener('click', getNewWord);
  document.getElementById('notesToggle').addEventListener('click', toggleNotes);
  document.getElementById('notesSave').addEventListener('click', saveNote);
  
  // Practice
  document.getElementById('checkBtn').addEventListener('click', checkSentence);
  document.getElementById('copyBtn').addEventListener('click', copyTemplate);
  document.getElementById('shareBtn').addEventListener('click', showShareModal);
  document.getElementById('hintBtn').addEventListener('click', showHint);
  document.getElementById('userSentence').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      checkSentence();
    }
  });
  
  // Footer buttons
  document.getElementById('historyBtn').addEventListener('click', showHistory);
  document.getElementById('challengeBtn').addEventListener('click', showChallenge);
  document.getElementById('quizBtn').addEventListener('click', startQuiz);
  document.getElementById('bankBtn').addEventListener('click', () => showWordBank('all'));
  document.getElementById('calendarBtn').addEventListener('click', showCalendar);
  
  // History view
  document.getElementById('historyBackBtn').addEventListener('click', () => showView('main'));
  
  // Challenge view
  document.getElementById('challengeBackBtn').addEventListener('click', () => {
    if (challengeState.timer) clearInterval(challengeState.timer);
    showView('main');
  });
  document.getElementById('challengeDoneBtn').addEventListener('click', () => showView('main'));
  document.querySelectorAll('.challenge-option').forEach(btn => {
    btn.addEventListener('click', () => startChallenge(btn.dataset.mode));
  });
  document.getElementById('challengeInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = challengeState.questions[challengeState.current];
      checkChallengeAnswer(e.target.value, q.word);
    }
  });
  
  // Calendar view
  document.getElementById('calendarBackBtn')?.addEventListener('click', () => showView('main'));
  
  // Quiz view
  document.getElementById('quizBackBtn').addEventListener('click', () => showView('main'));
  document.getElementById('quizDoneBtn').addEventListener('click', () => showView('main'));
  
  // Bank view
  document.getElementById('bankBackBtn').addEventListener('click', () => showView('main'));
  document.getElementById('exportBtn').addEventListener('click', exportWords);
  
  document.querySelectorAll('.bank-filters .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => showWordBank(btn.dataset.filter));
  });
  
  // Settings view
  document.getElementById('settingsBackBtn').addEventListener('click', () => showView('main'));
  document.getElementById('resetBtn').addEventListener('click', resetProgress);
  document.getElementById('notificationToggle').addEventListener('click', toggleNotifications);
  document.getElementById('soundEffectsToggle').addEventListener('click', toggleSoundEffects);
  
  document.querySelectorAll('[data-difficulty]').forEach(btn => {
    btn.addEventListener('click', () => setDifficulty(parseInt(btn.dataset.difficulty)));
  });
  
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme);
      playSound('click');
      saveStats();
    });
  });
  
  // Share modal
  document.getElementById('shareClose').addEventListener('click', hideShareModal);
  document.getElementById('copyShareCard').addEventListener('click', copyShareCard);
  document.getElementById('downloadShareCard').addEventListener('click', downloadShareCard);
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
    
    switch(e.key.toLowerCase()) {
      case 'n': getNewWord(); break;
      case 'l': speakWord(); break;
      case 's': skipWord(); break;
      case 't': toggleTheme(); break;
      case 'q': startQuiz(); break;
      case 'b': showWordBank('all'); break;
      case 'h': showHistory(); break;
      case 'c': showCalendar(); break;
      case 'escape': 
        showView('main'); 
        hideShareModal(); 
        break;
    }
  });
}

// Load voices
speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
