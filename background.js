import { getActiveTab, openJobTab, executeScriptWithDelay } from './utils.js';
import { setTextareaValue, fetchLastMessage } from './chatgpt.js';

let parentID;
let appliedTabId;
let injectedTabId = null;

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
        
        // Execute the script in the active tab
        // appliedTabId = activeTabId;
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
    appliedTabId = sender.tab.id;
    
  }
  else if(message.type=="applied"){
    console.log("Applied job, closing job tab now");
    injectedTabId = null;
    chrome.tabs.remove(sender.tab.id);
    chrome.tabs.sendMessage(parentID, { type: 'injectedScriptFinished' });
    sendResponse({ success: true });
    return true;
  }
  else if (message.type === 'storeQuestion') {
    const { question, answerType, options } = message;

    chrome.storage.sync.get('questions', (data) => {
      const questions = data.questions || [];

      // Check if the question already exists
      const existingQuestion = questions.find(q => q.question === question);
      if (!existingQuestion) {
        // Question doesn't exist, add it to the storage
        const newQuestion = { question, answerType, options };
        questions.push(newQuestion);
        chrome.storage.sync.set({ questions }, () => {
          console.log(`Question "${question}" stored in Chrome Storage.`);
        });
      } else {
        console.log(`Question "${question}" already exists in Chrome Storage, skipping.`);
      }
    });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tabId === appliedTabId) {
    console.log('Page navigation detected in applied tab, injecting injectScript.bundle.js');
    
    if (injectedTabId===null){
    injectedTabId = appliedTabId;
    chrome.scripting.executeScript({
      target: { tabId: appliedTabId },
      files: ['./injectScript.bundle.js'],
    });
  }
  }
});