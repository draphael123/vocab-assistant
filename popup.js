// ============================================
// Word of the Day - Enhanced Extension
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
  isFirstTime: true,
  spacedRepetition: [],
  learningHistory: {},
  enabledCategories: ['general', 'business', 'literature', 'science', 'philosophy', 'law', 'medicine', 'arts']
};
let quizState = { questions: [], current: 0, score: 0 };

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  await loadStats();
  applyTheme(stats.theme);
  updateDate();
  
  // Check for lookup word from context menu
  await checkLookupWord();
  
  // Check for first time user
  if (stats.isFirstTime) {
    showOnboarding();
  }
  
  await loadOrSetDailyWord();
  updateUI();
  setupEventListeners();
  setupKeyboardShortcuts();
  checkSpacedRepetition();
  generateCategoryToggles();
});

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
  if (currentWord) return; // Already set from lookup
  
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
  setNewWord();
  const today = getTodayString();
  
  await new Promise((resolve) => {
    chrome.storage.local.set({ dailyWord: currentWord, dailyWordDate: today }, resolve);
  });
  
  document.getElementById('userSentence').value = '';
  document.getElementById('feedback').className = 'feedback';
  
  updateWordDisplay();
}

async function skipWord() {
  if (currentWord && !stats.skippedWords.includes(currentWord.word.toLowerCase())) {
    stats.skippedWords.push(currentWord.word.toLowerCase());
    await saveStats();
  }
  await getNewWord();
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
}

function updateWordDisplay() {
  if (!currentWord) return;
  
  document.getElementById('currentWord').textContent = currentWord.word;
  document.getElementById('partOfSpeech').textContent = currentWord.partOfSpeech;
  document.getElementById('definition').textContent = currentWord.definition;
  document.getElementById('example').textContent = currentWord.example;
  
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
    
    // Add to spaced repetition
    addToSpacedRepetition(wordLower);
    
    // Add to learning history
    if (!stats.learningHistory[today]) {
      stats.learningHistory[today] = [];
    }
    if (!stats.learningHistory[today].includes(wordLower)) {
      stats.learningHistory[today].push(wordLower);
    }
    
    checkMilestone(stats.wordsLearned);
  }
  
  // Update streak
  if (stats.lastPracticeDate !== today) {
    if (isYesterday(stats.lastPracticeDate)) {
      stats.currentStreak++;
    } else if (!stats.lastPracticeDate) {
      stats.currentStreak = 1;
    } else {
      stats.currentStreak = 1;
    }
    
    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak;
    }
    
    stats.lastPracticeDate = today;
  }
  
  await saveStats();
  updateStats();
  
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
  feedback.className = `feedback ${type}`;
}

// ============================================
// Spaced Repetition
// ============================================

function addToSpacedRepetition(word) {
  const today = new Date();
  const nextReview = new Date(today);
  nextReview.setDate(nextReview.getDate() + 1); // First review tomorrow
  
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
      
      // Update review schedule (simplified SM-2)
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
  }
}

function showMilestone(text) {
  const toast = document.getElementById('milestoneToast');
  document.getElementById('milestoneText').textContent = text;
  toast.classList.remove('hidden');
  
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

// ============================================
// Audio
// ============================================

function speakWord() {
  if (!currentWord) return;
  
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
}

// ============================================
// Calendar
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
  startDate.setDate(startDate.getDate() - 90); // Last 90 days
  
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

// ============================================
// Quiz
// ============================================

function startQuiz() {
  const learnedWordObjects = VOCABULARY.filter(w => 
    stats.learnedWords.includes(w.word.toLowerCase())
  );
  
  if (learnedWordObjects.length < 4) {
    showFeedback('Learn more words to take the quiz!', 'error');
    return;
  }
  
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
    btn.onclick = () => selectQuizOption(btn, option, q.correct);
    optionsEl.appendChild(btn);
  });
  
  document.getElementById('quizResult').classList.add('hidden');
  document.querySelector('.quiz-content').classList.remove('hidden');
}

function selectQuizOption(btn, selected, correct) {
  document.querySelectorAll('.quiz-option').forEach(b => {
    b.disabled = true;
    if (b.textContent === correct) b.classList.add('correct');
  });
  
  if (selected === correct) {
    quizState.score++;
  } else {
    btn.classList.add('wrong');
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
}

// ============================================
// Word Bank
// ============================================

function showWordBank(filter = 'all', category = null) {
  showView('bank');
  renderWordBank(filter, category);
  generateCategoryFilters();
  
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
}

function renderWordBank(filter, category = null) {
  let words = VOCABULARY.filter(w => stats.learnedWords.includes(w.word.toLowerCase()));
  
  if (filter === 'favorites') {
    words = words.filter(w => stats.favorites.includes(w.word.toLowerCase()));
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
    
    const item = document.createElement('div');
    item.className = 'bank-item';
    item.innerHTML = `
      <div>
        <div class="bank-item-word">${word.word}</div>
        <div class="bank-item-def">${word.definition.slice(0, 50)}...</div>
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
  await saveStats();
}

function exportWords() {
  const words = VOCABULARY.filter(w => stats.learnedWords.includes(w.word.toLowerCase()));
  
  let csv = 'Word,Part of Speech,Definition,Category,Example\n';
  words.forEach(w => {
    csv += `"${w.word}","${w.partOfSpeech}","${w.definition}","${w.category}","${w.example}"\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'vocabulary-words.csv';
  a.click();
  
  URL.revokeObjectURL(url);
}

// ============================================
// Share Card
// ============================================

function showShareModal() {
  if (!currentWord) return;
  
  document.getElementById('shareCardWord').textContent = currentWord.word;
  document.getElementById('shareCardPos').textContent = currentWord.partOfSpeech;
  document.getElementById('shareCardDef').textContent = currentWord.definition;
  
  document.getElementById('shareModal').classList.remove('hidden');
}

function hideShareModal() {
  document.getElementById('shareModal').classList.add('hidden');
}

async function copyShareCard() {
  const card = document.getElementById('shareCard');
  
  try {
    const canvas = await html2canvas(card);
    canvas.toBlob(async (blob) => {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      showFeedback('Card copied to clipboard!', 'success');
    });
  } catch (e) {
    // Fallback: copy text
    const text = `📚 Word of the Day: ${currentWord.word}\n${currentWord.partOfSpeech} — ${currentWord.definition}`;
    navigator.clipboard.writeText(text);
    showFeedback('Text copied to clipboard!', 'success');
  }
  
  hideShareModal();
}

function downloadShareCard() {
  const card = document.getElementById('shareCard');
  
  // Create canvas manually for download
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 250;
  const ctx = canvas.getContext('2d');
  
  // Draw background
  ctx.fillStyle = stats.theme === 'dark' ? '#1e1e24' : '#ffffff';
  ctx.fillRect(0, 0, 400, 250);
  
  // Draw accent bar
  ctx.fillStyle = '#c4602d';
  ctx.fillRect(0, 0, 400, 4);
  
  // Draw text
  ctx.fillStyle = stats.theme === 'dark' ? '#f4f4f6' : '#1a1a18';
  ctx.font = '12px Instrument Sans';
  ctx.fillText('Word of the Day', 24, 35);
  
  ctx.font = 'bold 32px Fraunces';
  ctx.fillText(currentWord.word, 24, 90);
  
  ctx.font = 'italic 14px Fraunces';
  ctx.fillStyle = '#c4602d';
  ctx.fillText(currentWord.partOfSpeech, 24, 115);
  
  ctx.font = '16px Instrument Sans';
  ctx.fillStyle = stats.theme === 'dark' ? '#a0a0aa' : '#6b6860';
  
  // Word wrap definition
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
  
  // Footer
  ctx.font = '11px Instrument Sans';
  ctx.fillStyle = '#a09a92';
  ctx.fillText('wordoftheday.app', 24, 230);
  
  // Download
  const link = document.createElement('a');
  link.download = `${currentWord.word}-word-of-the-day.png`;
  link.href = canvas.toDataURL();
  link.click();
  
  hideShareModal();
}

// ============================================
// Settings
// ============================================

function showSettings() {
  showView('settings');
  
  document.querySelectorAll('[data-difficulty]').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.difficulty) === stats.difficulty);
  });
  
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === stats.theme);
  });
  
  const notifToggle = document.getElementById('notificationToggle');
  notifToggle.classList.toggle('active', stats.notificationsEnabled);
}

function generateCategoryToggles() {
  const container = document.getElementById('categoryToggles');
  if (!container) return;
  
  container.innerHTML = '';
  
  const categories = [...new Set(VOCABULARY.map(w => w.category))].sort();
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
  await saveStats();
}

async function setDifficulty(level) {
  stats.difficulty = level;
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
      isFirstTime: false,
      spacedRepetition: [],
      learningHistory: {},
      enabledCategories: stats.enabledCategories
    };
    await saveStats();
    await getNewWord();
    updateStats();
    showView('main');
  }
}

// ============================================
// View Management
// ============================================

function showView(view) {
  document.getElementById('mainView').classList.toggle('hidden', view !== 'main');
  document.getElementById('calendarView').classList.toggle('hidden', view !== 'calendar');
  document.getElementById('quizView').classList.toggle('hidden', view !== 'quiz');
  document.getElementById('bankView').classList.toggle('hidden', view !== 'bank');
  document.getElementById('settingsView').classList.toggle('hidden', view !== 'settings');
}

// ============================================
// Copy Template
// ============================================

function copyTemplate() {
  if (!currentWord) return;
  
  const template = `The word "${currentWord.word}" means "${currentWord.definition}". `;
  navigator.clipboard.writeText(template);
  
  const btn = document.getElementById('copyBtn');
  btn.style.color = 'var(--success)';
  setTimeout(() => btn.style.color = '', 1000);
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
  
  // Spaced repetition
  document.getElementById('srReviewBtn')?.addEventListener('click', reviewSpacedWord);
  
  // Word actions
  document.getElementById('audioBtn').addEventListener('click', speakWord);
  document.getElementById('skipBtn').addEventListener('click', skipWord);
  document.getElementById('newWordBtn').addEventListener('click', getNewWord);
  
  // Practice
  document.getElementById('checkBtn').addEventListener('click', checkSentence);
  document.getElementById('copyBtn').addEventListener('click', copyTemplate);
  document.getElementById('shareBtn').addEventListener('click', showShareModal);
  document.getElementById('userSentence').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      checkSentence();
    }
  });
  
  // Footer buttons
  document.getElementById('calendarBtn').addEventListener('click', showCalendar);
  document.getElementById('quizBtn').addEventListener('click', startQuiz);
  document.getElementById('bankBtn').addEventListener('click', () => showWordBank('all'));
  
  // Calendar view
  document.getElementById('calendarBackBtn').addEventListener('click', () => showView('main'));
  
  // Quiz view
  document.getElementById('quizBackBtn').addEventListener('click', () => showView('main'));
  document.getElementById('quizDoneBtn').addEventListener('click', () => showView('main'));
  
  // Bank view
  document.getElementById('bankBackBtn').addEventListener('click', () => showView('main'));
  document.getElementById('exportBtn').addEventListener('click', exportWords);
  
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => showWordBank(btn.dataset.filter));
  });
  
  // Settings view
  document.getElementById('settingsBackBtn').addEventListener('click', () => showView('main'));
  document.getElementById('resetBtn').addEventListener('click', resetProgress);
  document.getElementById('notificationToggle').addEventListener('click', toggleNotifications);
  
  document.querySelectorAll('[data-difficulty]').forEach(btn => {
    btn.addEventListener('click', () => setDifficulty(parseInt(btn.dataset.difficulty)));
  });
  
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme);
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
    if (e.target.tagName === 'TEXTAREA') return;
    
    switch(e.key.toLowerCase()) {
      case 'n': getNewWord(); break;
      case 'l': speakWord(); break;
      case 's': skipWord(); break;
      case 't': toggleTheme(); break;
      case 'q': startQuiz(); break;
      case 'b': showWordBank('all'); break;
      case 'c': showCalendar(); break;
      case 'escape': showView('main'); hideShareModal(); break;
    }
  });
}

// Load voices
speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
