import { getActiveTab, openJobTab, executeScriptWithDelay } from './utils.js';
import { setTextareaValue, fetchLastMessage } from './chatgpt.js';

chrome.runtime.onMessage.addListener(async ({ type, url, query }, sender, sendResponse) => {
  if (type === 'openJobTab') {
    chrome.storage.local.get('url', async ({ url }) => {
      console.log("Opening tab", url);
      await openJobTab(url);
    });
  } else if (type === 'closeTab') {
    const [tab] = await getActiveTab();
    if (tab) {
      chrome.tabs.remove(tab.id);
    }
  } else if (type === 'openChatGPT') {
    console.log("Running background openChatGPT function");
    const chatGPTUrl = 'https://chat.openai.com/';
    const tab = await chrome.tabs.create({ url: chatGPTUrl });
    await new Promise(resolve => setTimeout(resolve, 7000));
    await executeScriptWithDelay(tab.id, setTextareaValue, query);
    await new Promise(resolve => setTimeout(resolve, 5000));
    await executeScriptWithDelay(tab.id, fetchLastMessage, query);
  }
});