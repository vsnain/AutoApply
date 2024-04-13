// Wait for the DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the "Start" button
    document.getElementById('start').addEventListener('click', function() {
      // Send message to the content script to start execution
      console.log("Script Running");
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'startExecution'}, function(response) {
          console.log("Sending message");
        });
      });
    });
  });
  


document.getElementById('showQuestionsAndAnswers').addEventListener('click', () => {
  chrome.storage.sync.get('questions', (data) => {
    const questions = data.questions || [];

    if (questions.length === 0) {
      alert('No questions found in the storage.');
      return;
    }

    const tabUrl = chrome.runtime.getURL('questions.html');
    chrome.tabs.create({ url: tabUrl, active: true }, (tab) => {
      // Wait for the new tab to be fully loaded
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          // Send the questions and answers to the new tab
          chrome.tabs.sendMessage(tabId, { type: 'showQuestionsAndAnswers', questions });
          chrome.tabs.onUpdated.removeListener(listener);
        }
      });
    });
  });
});