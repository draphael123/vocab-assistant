// ============================================
// Word of the Day - Background Service Worker
// ============================================

// Create context menu on install
chrome.runtime.onInstalled.addListener((details) => {
  // Create context menu for selected text
  chrome.contextMenus.create({
    id: 'lookupWord',
    title: 'Look up "%s" in Word of the Day',
    contexts: ['selection']
  });
  
  if (details.reason === 'install') {
    // Initialize default stats on first install
    chrome.storage.local.set({
      vocabStats: {
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
        learningHistory: {} // { "2026-01-15": ["ephemeral", "ubiquitous"] }
      }
    });
    
    console.log('Word of the Day extension installed!');
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'lookupWord' && info.selectionText) {
    const word = info.selectionText.trim().toLowerCase();
    
    // Store the lookup word and open popup
    chrome.storage.local.set({ lookupWord: word }, () => {
      // Open the popup (this will show the word if found)
      chrome.action.openPopup();
    });
  }
});

// Set up daily alarm for word reset and notifications
chrome.alarms.create('dailyWordReset', {
  when: getNextMidnight(),
  periodInMinutes: 24 * 60
});

// Morning reminder alarm (9 AM)
chrome.alarms.create('morningReminder', {
  when: getNext9AM(),
  periodInMinutes: 24 * 60
});

// Handle alarms
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'dailyWordReset') {
    // Clear the daily word so a new one is selected
    chrome.storage.local.remove(['dailyWord', 'dailyWordDate']);
    console.log('Daily word reset for new day');
  }
  
  if (alarm.name === 'morningReminder') {
    // Check if notifications are enabled
    const result = await chrome.storage.local.get(['vocabStats']);
    if (result.vocabStats?.notificationsEnabled) {
      showNotification();
    }
  }
});

// Show daily notification
function showNotification() {
  chrome.notifications.create('dailyWord', {
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'Word of the Day',
    message: 'Your daily word is ready! Click to learn something new.',
    priority: 1
  });
}

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  if (notificationId === 'dailyWord') {
    chrome.action.openPopup();
  }
});

// Get timestamp for next midnight
function getNextMidnight() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime();
}

// Get timestamp for next 9 AM
function getNext9AM() {
  const now = new Date();
  const target = new Date(now);
  target.setHours(9, 0, 0, 0);
  
  // If it's past 9 AM today, set for tomorrow
  if (now >= target) {
    target.setDate(target.getDate() + 1);
  }
  
  return target.getTime();
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'enableNotifications') {
    updateNotificationSetting(true);
    sendResponse({ success: true });
  }
  
  if (request.type === 'disableNotifications') {
    updateNotificationSetting(false);
    sendResponse({ success: true });
  }
  
  if (request.type === 'getSpacedRepetitionWord') {
    getSpacedRepetitionWord().then(word => sendResponse({ word }));
    return true; // Keep channel open for async response
  }
  
  return true;
});

async function updateNotificationSetting(enabled) {
  const result = await chrome.storage.local.get(['vocabStats']);
  if (result.vocabStats) {
    result.vocabStats.notificationsEnabled = enabled;
    await chrome.storage.local.set({ vocabStats: result.vocabStats });
  }
}

// Spaced repetition algorithm (simplified Leitner system)
async function getSpacedRepetitionWord() {
  const result = await chrome.storage.local.get(['vocabStats']);
  const stats = result.vocabStats;
  
  if (!stats || !stats.spacedRepetition || stats.spacedRepetition.length === 0) {
    return null;
  }
  
  const today = new Date().toISOString().split('T')[0];
  
  // Find words due for review
  const dueWords = stats.spacedRepetition.filter(item => {
    return item.nextReview <= today;
  });
  
  if (dueWords.length === 0) return null;
  
  // Return the word with the longest overdue time
  dueWords.sort((a, b) => a.nextReview.localeCompare(b.nextReview));
  return dueWords[0].word;
}

console.log('Word of the Day background service worker loaded');
