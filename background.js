// Background service worker for Word of the Day extension

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Initialize default stats on first install
    chrome.storage.local.set({
      vocabStats: {
        currentStreak: 0,
        bestStreak: 0,
        wordsLearned: 0,
        learnedWords: [],
        lastPracticeDate: null
      }
    });
    
    console.log('Word of the Day extension installed!');
  }
});

// Optional: Set up daily alarm to reset the word
chrome.alarms?.create('dailyWordReset', {
  when: getNextMidnight(),
  periodInMinutes: 24 * 60 // Every 24 hours
});

chrome.alarms?.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dailyWordReset') {
    // Clear the daily word so a new one is selected
    chrome.storage.local.remove(['dailyWord', 'dailyWordDate']);
    console.log('Daily word reset for new day');
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

