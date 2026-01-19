// Word of the Day - Background Service Worker v2.0

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'lookupWord',
    title: 'Look up "%s" in Word of the Day',
    contexts: ['selection']
  });
  
  // Set up daily alarm for notifications
  chrome.alarms.create('dailyReminder', {
    when: getNextReminderTime(),
    periodInMinutes: 24 * 60
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'lookupWord') {
    const selectedWord = info.selectionText.trim().toLowerCase();
    chrome.storage.local.set({ lookupWord: selectedWord }, () => {
      chrome.action.openPopup();
    });
  }
});

// Handle alarm for daily reminders
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dailyReminder') {
    checkAndSendReminder();
  }
});

// Check if user should receive reminder
async function checkAndSendReminder() {
  const data = await chrome.storage.local.get(['vocabStats', 'dailyWordDate']);
  const stats = data.vocabStats || {};
  const today = new Date().toISOString().split('T')[0];
  
  // Only send if notifications are enabled and user hasn't practiced today
  if (stats.notificationsEnabled && data.dailyWordDate !== today) {
    chrome.notifications.create('dailyReminder', {
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: '📚 Word of the Day',
      message: "Don't forget to learn your word today! Keep that streak going.",
      priority: 2
    });
  }
}

// Calculate next 9 AM
function getNextReminderTime() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(9, 0, 0, 0);
  
  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }
  
  return next.getTime();
}

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  if (notificationId === 'dailyReminder') {
    chrome.action.openPopup();
    chrome.notifications.clear(notificationId);
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getRandomWord') {
    // Future: could fetch word from an API
    sendResponse({ success: true });
  }
  return true;
});
