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
  