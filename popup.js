// DOM Elements
const currentWordEl = document.getElementById('currentWord');
const partOfSpeechEl = document.getElementById('partOfSpeech');
const definitionEl = document.getElementById('definition');
const exampleEl = document.getElementById('example');
const userSentenceEl = document.getElementById('userSentence');
const checkBtnEl = document.getElementById('checkBtn');
const feedbackEl = document.getElementById('feedback');
const streakCountEl = document.getElementById('streakCount');
const wordsLearnedEl = document.getElementById('wordsLearned');
const bestStreakEl = document.getElementById('bestStreak');
const newWordBtnEl = document.getElementById('newWordBtn');

// State
let currentWord = null;
let stats = {
  currentStreak: 0,
  bestStreak: 0,
  wordsLearned: 0,
  learnedWords: [],
  lastPracticeDate: null
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadStats();
  await loadOrSetDailyWord();
  updateUI();
});

// Load stats from Chrome storage
async function loadStats() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['vocabStats'], (result) => {
      if (result.vocabStats) {
        stats = result.vocabStats;
      }
      resolve();
    });
  });
}

// Save stats to Chrome storage
async function saveStats() {
  return new Promise((resolve) => {
    chrome.storage.local.set({ vocabStats: stats }, resolve);
  });
}

// Get today's date as string
function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

// Load or set the daily word
async function loadOrSetDailyWord() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['dailyWord', 'dailyWordDate'], (result) => {
      const today = getTodayString();
      
      if (result.dailyWord && result.dailyWordDate === today) {
        // Use existing daily word
        currentWord = result.dailyWord;
      } else {
        // Set new daily word
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

// Set a new random word
function setNewWord() {
  // Filter out already learned words if we have enough remaining
  const unlearnedWords = VOCABULARY.filter(
    w => !stats.learnedWords.includes(w.word.toLowerCase())
  );
  
  const wordPool = unlearnedWords.length > 0 ? unlearnedWords : VOCABULARY;
  const randomIndex = Math.floor(Math.random() * wordPool.length);
  currentWord = wordPool[randomIndex];
}

// Update UI with current word and stats
function updateUI() {
  if (currentWord) {
    currentWordEl.textContent = currentWord.word;
    partOfSpeechEl.textContent = currentWord.partOfSpeech;
    definitionEl.textContent = currentWord.definition;
    exampleEl.textContent = currentWord.example;
  }
  
  streakCountEl.textContent = stats.currentStreak;
  wordsLearnedEl.textContent = stats.wordsLearned;
  bestStreakEl.textContent = stats.bestStreak;
}

// Check if the user's sentence contains the word
function checkSentence() {
  const sentence = userSentenceEl.value.trim();
  
  if (!sentence) {
    showFeedback('Please write a sentence first!', 'error');
    return;
  }
  
  if (!currentWord) {
    showFeedback('No word loaded. Please refresh.', 'error');
    return;
  }
  
  const wordLower = currentWord.word.toLowerCase();
  const sentenceLower = sentence.toLowerCase();
  
  // Check if the word appears in the sentence
  // Use word boundary regex to match whole words
  const wordRegex = new RegExp(`\\b${escapeRegex(wordLower)}\\w*\\b`, 'i');
  
  if (wordRegex.test(sentenceLower)) {
    handleSuccess(sentence);
  } else {
    showFeedback(
      `Try again! Make sure to use "${currentWord.word}" in your sentence.`,
      'error'
    );
  }
}

// Escape special regex characters
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Handle successful sentence
async function handleSuccess(sentence) {
  const today = getTodayString();
  const wordLower = currentWord.word.toLowerCase();
  
  // Check if this is a new word for the user
  if (!stats.learnedWords.includes(wordLower)) {
    stats.learnedWords.push(wordLower);
    stats.wordsLearned = stats.learnedWords.length;
  }
  
  // Update streak
  if (stats.lastPracticeDate === today) {
    // Already practiced today, don't increment streak
  } else if (isYesterday(stats.lastPracticeDate)) {
    // Practiced yesterday, increment streak
    stats.currentStreak++;
  } else if (stats.lastPracticeDate === null) {
    // First time practicing
    stats.currentStreak = 1;
  } else {
    // Streak broken, reset to 1
    stats.currentStreak = 1;
  }
  
  // Update best streak
  if (stats.currentStreak > stats.bestStreak) {
    stats.bestStreak = stats.currentStreak;
  }
  
  stats.lastPracticeDate = today;
  
  await saveStats();
  updateUI();
  
  showFeedback(
    `🎉 Excellent! You've mastered "${currentWord.word}"!`,
    'success'
  );
}

// Check if a date string is yesterday
function isYesterday(dateString) {
  if (!dateString) return false;
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];
  
  return dateString === yesterdayString;
}

// Show feedback message
function showFeedback(message, type) {
  feedbackEl.textContent = message;
  feedbackEl.className = `feedback ${type}`;
}

// Get a new word (manual refresh)
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
  userSentenceEl.value = '';
  feedbackEl.className = 'feedback';
  feedbackEl.textContent = '';
  
  updateUI();
  
  // Add animation
  currentWordEl.style.animation = 'none';
  currentWordEl.offsetHeight; // Trigger reflow
  currentWordEl.style.animation = 'fadeIn 0.3s ease';
}

// Event Listeners
checkBtnEl.addEventListener('click', checkSentence);
newWordBtnEl.addEventListener('click', getNewWord);

// Allow Enter key to submit (with Shift+Enter for new line)
userSentenceEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    checkSentence();
  }
});

