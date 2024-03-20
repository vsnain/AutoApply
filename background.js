import { getActiveTab, openJobTab, executeScriptWithDelay } from './utils.js';
import { setTextareaValue, fetchLastMessage } from './chatgpt.js';

let parentID;
let appliedTabId;

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
    console.log("message.type == openIndeedJob");

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs.length > 0) {
        const activeTab = tabs[0];
        const activeTabId = activeTab.id;
        console.log('ID of active tab:', activeTabId);
        console.log("ID of sender:", sender.tab.id);
        // Execute the script in the active tab
        appliedTabId = activeTabId;
        chrome.scripting.executeScript({
          target: { tabId: activeTabId },
          files: ['./applyScript.bundle.js'],
        });
      } else {
        console.error('No active tab found');
      }
    });

    parentID = sender.tab.id;
  }
  else if (message.type == "injectScript"){
    console.log("Received injectScript message");
    console.log('Sender vs stored appliedTab', sender.tab.id, appliedTabId);
  }
  else if(message.type=="applied"){
    console.log("Continue part done and applied job");
    chrome.tabs.sendMessage(parentID, { type: 'injectedScriptFinished' });
    sendResponse({ success: true });
    return true;
  }
});

// Listen for tab updates to detect page navigation
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tabId === appliedTabId) {
    console.log('Page navigation detected in applied tab, injecting injectScript.bundle.js');
    chrome.scripting.executeScript({
      target: { tabId: appliedTabId },
      files: ['./injectScript.bundle.js'],
    });
  }
});