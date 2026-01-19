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
  difficulty: 2, // 1=Everyday, 2=SAT, 3=GRE, 4=Obscure
  theme: 'light'
};
let quizState = { questions: [], current: 0, score: 0 };

// DOM Elements
const elements = {
  // Main View
  mainView: document.getElementById('mainView'),
  todayDate: document.getElementById('todayDate'),
  themeToggle: document.getElementById('themeToggle'),
  settingsBtn: document.getElementById('settingsBtn'),
  difficultyBadge: document.getElementById('difficultyBadge'),
  currentWord: document.getElementById('currentWord'),
  audioBtn: document.getElementById('audioBtn'),
  partOfSpeech: document.getElementById('partOfSpeech'),
  pronunciation: document.getElementById('pronunciation'),
  definition: document.getElementById('definition'),
  etymologySection: document.getElementById('etymologySection'),
  etymology: document.getElementById('etymology'),
  example: document.getElementById('example'),
  synonyms: document.getElementById('synonyms'),
  antonyms: document.getElementById('antonyms'),
  skipBtn: document.getElementById('skipBtn'),
  userSentence: document.getElementById('userSentence'),
  checkBtn: document.getElementById('checkBtn'),
  copyBtn: document.getElementById('copyBtn'),
  feedback: document.getElementById('feedback'),
  streakCount: document.getElementById('streakCount'),
  wordsLearned: document.getElementById('wordsLearned'),
  bestStreak: document.getElementById('bestStreak'),
  quizBtn: document.getElementById('quizBtn'),
  bankBtn: document.getElementById('bankBtn'),
  newWordBtn: document.getElementById('newWordBtn'),
  
  // Quiz View
  quizView: document.getElementById('quizView'),
  quizBackBtn: document.getElementById('quizBackBtn'),
  quizProgress: document.getElementById('quizProgress'),
  quizQuestion: document.getElementById('quizQuestion'),
  quizOptions: document.getElementById('quizOptions'),
  quizResult: document.getElementById('quizResult'),
  quizScore: document.getElementById('quizScore'),
  quizMessage: document.getElementById('quizMessage'),
  quizDoneBtn: document.getElementById('quizDoneBtn'),
  
  // Bank View
  bankView: document.getElementById('bankView'),
  bankBackBtn: document.getElementById('bankBackBtn'),
  exportBtn: document.getElementById('exportBtn'),
  bankList: document.getElementById('bankList'),
  bankEmpty: document.getElementById('bankEmpty'),
  
  // Settings View
  settingsView: document.getElementById('settingsView'),
  settingsBackBtn: document.getElementById('settingsBackBtn'),
  difficultyOptions: document.getElementById('difficultyOptions'),
  resetBtn: document.getElementById('resetBtn'),
  
  // Toast
  milestoneToast: document.getElementById('milestoneToast'),
  milestoneText: document.getElementById('milestoneText')
};

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  await loadStats();
  applyTheme(stats.theme);
  updateDate();
  await loadOrSetDailyWord();
  updateUI();
  setupEventListeners();
  setupKeyboardShortcuts();
});

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

async function loadOrSetDailyWord() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['dailyWord', 'dailyWordDate'], (result) => {
      const today = getTodayString();
      
      if (result.dailyWord && result.dailyWordDate === today) {
        currentWord = result.dailyWord;
      } else {
        setNewWord();
        chrome.storage.local.set({ 
          dailyWord: currentWord, 
          dailyWordDate: today 
        });
      }
      resolve();
    });
  });
}

function setNewWord() {
  // Filter by difficulty and exclude learned/skipped
  const availableWords = VOCABULARY.filter(w => 
    w.difficulty <= stats.difficulty &&
    !stats.learnedWords.includes(w.word.toLowerCase()) &&
    !stats.skippedWords.includes(w.word.toLowerCase())
  );
  
  const wordPool = availableWords.length > 0 ? availableWords : VOCABULARY.filter(w => w.difficulty <= stats.difficulty);
  const randomIndex = Math.floor(Math.random() * wordPool.length);
  currentWord = wordPool[randomIndex];
}

async function getNewWord() {
  setNewWord();
  const today = getTodayString();
  
  await new Promise((resolve) => {
    chrome.storage.local.set({ 
      dailyWord: currentWord, 
      dailyWordDate: today 
    }, resolve);
  });
  
  // Reset input and feedback
  elements.userSentence.value = '';
  elements.feedback.className = 'feedback';
  
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
  elements.todayDate.textContent = new Date().toLocaleDateString('en-US', options);
}

function updateUI() {
  updateWordDisplay();
  updateStats();
}

function updateWordDisplay() {
  if (!currentWord) return;
  
  elements.currentWord.textContent = currentWord.word;
  elements.partOfSpeech.textContent = currentWord.partOfSpeech;
  elements.definition.textContent = currentWord.definition;
  elements.example.textContent = currentWord.example;
  
  // Difficulty badge
  const diffLabels = { 1: 'Everyday', 2: 'SAT', 3: 'GRE', 4: 'Obscure' };
  elements.difficultyBadge.textContent = diffLabels[currentWord.difficulty] || 'SAT';
  
  // Etymology
  if (currentWord.etymology) {
    elements.etymologySection.style.display = 'flex';
    elements.etymology.textContent = currentWord.etymology;
  } else {
    elements.etymologySection.style.display = 'none';
  }
  
  // Pronunciation (generate from word)
  elements.pronunciation.textContent = generatePronunciation(currentWord.word);
  
  // Synonyms
  elements.synonyms.innerHTML = '';
  (currentWord.synonyms || []).slice(0, 3).forEach(syn => {
    const span = document.createElement('span');
    span.textContent = syn;
    elements.synonyms.appendChild(span);
  });
  
  // Antonyms
  elements.antonyms.innerHTML = '';
  (currentWord.antonyms || []).slice(0, 3).forEach(ant => {
    const span = document.createElement('span');
    span.textContent = ant;
    elements.antonyms.appendChild(span);
  });
}

function generatePronunciation(word) {
  // Simple phonetic approximation
  return '/' + word.toLowerCase()
    .replace(/ph/g, 'f')
    .replace(/tion/g, 'shən')
    .replace(/sion/g, 'zhən')
    .replace(/ous$/g, 'əs')
    .replace(/ious$/g, 'ēəs')
    .replace(/eous$/g, 'ēəs')
    + '/';
}

function updateStats() {
  elements.streakCount.textContent = stats.currentStreak;
  elements.wordsLearned.textContent = stats.wordsLearned;
  elements.bestStreak.textContent = stats.bestStreak;
}

// ============================================
// Sentence Checking
// ============================================

function checkSentence() {
  const sentence = elements.userSentence.value.trim();
  
  if (!sentence) {
    showFeedback('Write a sentence first!', 'error');
    return;
  }
  
  if (!currentWord) {
    showFeedback('No word loaded. Click New Word.', 'error');
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
  
  // Track learned word
  if (!stats.learnedWords.includes(wordLower)) {
    stats.learnedWords.push(wordLower);
    stats.wordsLearned = stats.learnedWords.length;
    
    // Check for milestones
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
  elements.feedback.textContent = message;
  elements.feedback.className = `feedback ${type}`;
}

// ============================================
// Milestones
// ============================================

function checkMilestone(count) {
  const milestones = [10, 25, 50, 100, 150, 200, 250];
  if (milestones.includes(count)) {
    showMilestone(`🎉 ${count} words learned!`);
  }
}

function showMilestone(text) {
  elements.milestoneText.textContent = text;
  elements.milestoneToast.classList.remove('hidden');
  
  setTimeout(() => {
    elements.milestoneToast.classList.add('hidden');
  }, 3000);
}

// ============================================
// Audio
// ============================================

function speakWord() {
  if (!currentWord) return;
  
  const utterance = new SpeechSynthesisUtterance(currentWord.word);
  utterance.rate = 0.8;
  utterance.pitch = 1;
  
  // Try to get a good English voice
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
  
  // Update theme buttons if settings is open
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
// Quiz
// ============================================

function startQuiz() {
  // Get 7 random learned words for quiz
  const learnedWordObjects = VOCABULARY.filter(w => 
    stats.learnedWords.includes(w.word.toLowerCase())
  );
  
  if (learnedWordObjects.length < 4) {
    showFeedback('Learn more words to take the quiz!', 'error');
    return;
  }
  
  // Shuffle and take up to 7
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
  
  elements.quizProgress.textContent = `${quizState.current + 1}/${quizState.questions.length}`;
  elements.quizQuestion.textContent = `What does "${q.word}" mean?`;
  
  elements.quizOptions.innerHTML = '';
  q.options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = option;
    btn.onclick = () => selectQuizOption(btn, option, q.correct);
    elements.quizOptions.appendChild(btn);
  });
  
  elements.quizResult.classList.add('hidden');
  document.querySelector('.quiz-content').classList.remove('hidden');
}

function selectQuizOption(btn, selected, correct) {
  // Disable all options
  document.querySelectorAll('.quiz-option').forEach(b => {
    b.disabled = true;
    if (b.textContent === correct) b.classList.add('correct');
  });
  
  if (selected === correct) {
    quizState.score++;
  } else {
    btn.classList.add('wrong');
  }
  
  // Next question after delay
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
  elements.quizResult.classList.remove('hidden');
  
  elements.quizScore.textContent = `${quizState.score}/${quizState.questions.length}`;
  
  const percent = quizState.score / quizState.questions.length;
  if (percent === 1) elements.quizMessage.textContent = 'Perfect! 🎯';
  else if (percent >= 0.7) elements.quizMessage.textContent = 'Great job! 👏';
  else if (percent >= 0.5) elements.quizMessage.textContent = 'Good effort! 💪';
  else elements.quizMessage.textContent = 'Keep practicing! 📚';
}

// ============================================
// Word Bank
// ============================================

function showWordBank(filter = 'all') {
  showView('bank');
  renderWordBank(filter);
  
  // Update filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
}

function renderWordBank(filter) {
  let words = [];
  
  if (filter === 'all') {
    words = VOCABULARY.filter(w => stats.learnedWords.includes(w.word.toLowerCase()));
  } else if (filter === 'favorites') {
    words = VOCABULARY.filter(w => stats.favorites.includes(w.word.toLowerCase()));
  } else if (filter === 'mastered') {
    words = VOCABULARY.filter(w => stats.learnedWords.includes(w.word.toLowerCase()));
  }
  
  if (words.length === 0) {
    elements.bankList.classList.add('hidden');
    elements.bankEmpty.classList.remove('hidden');
    return;
  }
  
  elements.bankEmpty.classList.add('hidden');
  elements.bankList.classList.remove('hidden');
  elements.bankList.innerHTML = '';
  
  words.forEach(word => {
    const item = document.createElement('div');
    item.className = 'bank-item';
    
    const isFav = stats.favorites.includes(word.word.toLowerCase());
    
    item.innerHTML = `
      <div>
        <div class="bank-item-word">${word.word}</div>
        <div class="bank-item-def">${word.definition.slice(0, 50)}...</div>
      </div>
      <button class="bank-item-fav ${isFav ? 'active' : ''}" data-word="${word.word.toLowerCase()}">⭐</button>
    `;
    
    elements.bankList.appendChild(item);
  });
  
  // Add favorite toggle handlers
  document.querySelectorAll('.bank-item-fav').forEach(btn => {
    btn.onclick = () => toggleFavorite(btn.dataset.word, btn);
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
  
  let csv = 'Word,Part of Speech,Definition,Example\n';
  words.forEach(w => {
    csv += `"${w.word}","${w.partOfSpeech}","${w.definition}","${w.example}"\n`;
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
// Settings
// ============================================

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
}

async function setDifficulty(level) {
  stats.difficulty = level;
  await saveStats();
  
  document.querySelectorAll('[data-difficulty]').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.difficulty) === level);
  });
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
      theme: stats.theme
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
  elements.mainView.classList.toggle('hidden', view !== 'main');
  elements.quizView.classList.toggle('hidden', view !== 'quiz');
  elements.bankView.classList.toggle('hidden', view !== 'bank');
  elements.settingsView.classList.toggle('hidden', view !== 'settings');
}

// ============================================
// Copy Template
// ============================================

function copyTemplate() {
  if (!currentWord) return;
  
  const template = `The word "${currentWord.word}" means "${currentWord.definition}". `;
  navigator.clipboard.writeText(template);
  
  // Visual feedback
  elements.copyBtn.style.color = 'var(--success)';
  setTimeout(() => {
    elements.copyBtn.style.color = '';
  }, 1000);
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
  // Header
  elements.themeToggle.addEventListener('click', toggleTheme);
  elements.settingsBtn.addEventListener('click', showSettings);
  
  // Word actions
  elements.audioBtn.addEventListener('click', speakWord);
  elements.skipBtn.addEventListener('click', skipWord);
  elements.newWordBtn.addEventListener('click', getNewWord);
  
  // Practice
  elements.checkBtn.addEventListener('click', checkSentence);
  elements.copyBtn.addEventListener('click', copyTemplate);
  elements.userSentence.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      checkSentence();
    }
  });
  
  // Footer buttons
  elements.quizBtn.addEventListener('click', startQuiz);
  elements.bankBtn.addEventListener('click', () => showWordBank('all'));
  
  // Quiz view
  elements.quizBackBtn.addEventListener('click', () => showView('main'));
  elements.quizDoneBtn.addEventListener('click', () => showView('main'));
  
  // Bank view
  elements.bankBackBtn.addEventListener('click', () => showView('main'));
  elements.exportBtn.addEventListener('click', exportWords);
  
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => showWordBank(btn.dataset.filter));
  });
  
  // Settings view
  elements.settingsBackBtn.addEventListener('click', () => showView('main'));
  elements.resetBtn.addEventListener('click', resetProgress);
  
  document.querySelectorAll('[data-difficulty]').forEach(btn => {
    btn.addEventListener('click', () => setDifficulty(parseInt(btn.dataset.difficulty)));
  });
  
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme);
      saveStats();
    });
  });
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Only handle shortcuts when not typing in textarea
    if (e.target.tagName === 'TEXTAREA') return;
    
    switch(e.key.toLowerCase()) {
      case 'n': getNewWord(); break;
      case 'l': speakWord(); break;
      case 's': skipWord(); break;
      case 't': toggleTheme(); break;
      case 'q': startQuiz(); break;
      case 'b': showWordBank('all'); break;
      case 'escape': showView('main'); break;
    }
  });
}

// Load voices for speech synthesis
speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
