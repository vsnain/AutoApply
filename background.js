import { getActiveTab, openJobTab, executeScriptWithDelay,delay } from './utils.js';
import { setTextareaValue, fetchLastMessage } from './chatgpt.js';


let parentID;
let appliedTabId;
let injectedTabId = null;
let contentScriptInjected = false;

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'openJobTab') {
    chrome.storage.local.get('url', async ({ url }) => {
      console.log("Opening tab", url);
      await openJobTab(url);
    });
  } else if (message.type === 'closeTab') {
    chrome.tabs.remove(sender.tab.id);
  }
  else if (message.type === 'openChatGPT') {
    console.log("Running background openChatGPT function");
    const chatGPTUrl = 'https://chat.openai.com/';
    const tab = await chrome.tabs.create({ url: chatGPTUrl });
    await new Promise(resolve => setTimeout(resolve, 7000));
    await executeScriptWithDelay(tab.id, setTextareaValue, message.query);
    await new Promise(resolve => setTimeout(resolve, 5000));
    await executeScriptWithDelay(tab.id, fetchLastMessage, message.query);

  } else if (message.type === 'openIndeedJob') {
    console.log("message.type == openIndeedJob");
    parentID = sender.tab.id;
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs.length > 0) {
        const activeTab = tabs[0];
        const activeTabId = activeTab.id;
        
        const url = activeTab.url;
        console.log(url);
        if (url.includes("indeed")) {
          chrome.scripting.executeScript({
            target: { tabId: activeTabId },
            files: ['./applyScript.bundle.js'],
          });
        }
        
        else{
          console.log("Tab doesn't include indeed",activeTabId, parentID);
          chrome.tabs.remove(activeTabId);
          console.log("tab removed");
          chrome.tabs.sendMessage(parentID, { type: 'injectedScriptFinished' });
          sendResponse({ success: true });
        }
      }
      else {
        console.error('No active tab found');
      }
    });

    
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
  else if (message.type === 'nextPageClicked') {
    console.log("Next page clicked message received");
    contentScriptInjected = true;
  }
  else if (message.type === 'stopExecution') {
    console.log("Stopping the extension...");
    // Terminate all content scripts directly (without cleanup.js)
    chrome.tabs.sendMessage(parentID, { action: 'stopExecution' });
    

    // chrome.runtime.reload();

  }
    
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

  if (changeInfo.status === 'complete' && contentScriptInjected) {
    console.log("Next page onUpdate running now");
    // Reset the flag to false after injecting the script
    contentScriptInjected = false;

    console.log("Trying to inject content script again after next page");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'startExecution' }, function (response) {
        console.log("Sending message");
      });
    });
  }
  else if (changeInfo.status === 'complete' && tabId === appliedTabId) {
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

