import { getActiveTab, openJobTab, executeScriptWithDelay } from './utils.js';
import { setTextareaValue, fetchLastMessage } from './chatgpt.js';

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'openJobTab') {
    chrome.storage.local.get('url', async ({ url }) => {
      console.log("Opening tab", url);
      await openJobTab(url);
    });
  } else if (message.type === 'closeTab') {
    const [tab] = await getActiveTab();
    if (tab) {
      chrome.tabs.remove(tab.id);
    }
  } else if (message.type === 'openChatGPT') {
    console.log("Running background openChatGPT function");
    const chatGPTUrl = 'https://chat.openai.com/';
    const tab = await chrome.tabs.create({ url: chatGPTUrl });
    await new Promise(resolve => setTimeout(resolve, 7000));
    await executeScriptWithDelay(tab.id, setTextareaValue, message.query);
    await new Promise(resolve => setTimeout(resolve, 5000));
    await executeScriptWithDelay(tab.id, fetchLastMessage, message.query);
  } else if (message.type === 'openIndeedJob') {
    let activeTabId;
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs.length > 0) {
        const activeTab = tabs[0];
        activeTabId = activeTab.id;
        console.log('ID of active tab:', activeTabId);
        console.log("ID of sender:", sender.tab.id);
        // Execute the script in the active tab
        chrome.scripting.executeScript({
          target: { tabId: activeTabId },
          files: ['./injectScript.bundle.js'],
        });
      } else {
        console.error('No active tab found');
      }
    });

    const parentID = sender.tab.id;
  
    // Listen for the 'jobApplied' message from the injected script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'jobApplied') {
        console.log("Received jobApplied response from injected script");
        chrome.tabs.sendMessage(parentID, { type: 'injectedScriptFinished' });
        sendResponse({ success: true });
      }
    });
  
    // Return true to indicate that the response will be sent asynchronously
    return true;
  }
});