import { delay, moveMouseTo } from './utils.js';

export async function openIndeedJobInNewTab(jobElement) {
  const spanElements = jobElement.querySelectorAll('span');
  let found = false;
  spanElements.forEach(span => {
    if (span.textContent.trim() === "Easily apply") {
      found = true;
    }
  });

  if (found) {
    console.log("Found: Easily apply");
    try {
      const jobAnchor = jobElement.querySelector('.jcs-JobTitle');
      
      await moveMouseTo(jobAnchor);
      if (!jobAnchor) {
        console.log('No job anchor found in the job element:', jobElement);
        return;
      }

      const jobUrl = jobAnchor.getAttribute('href');
      console.log(jobUrl);
      const jobTab = window.open(jobUrl, '_blank');
      await delay(2000);
      chrome.runtime.sendMessage({ type: 'openIndeedJob' });
      
      // Wait for a message from the background script indicating that the injected script has finished
      await new Promise((resolve) => {
        chrome.runtime.onMessage.addListener(function listener(message) {
          if (message.type === 'injectedScriptFinished') {
            chrome.runtime.onMessage.removeListener(listener);
            resolve();
          }
        });
      });

    } catch (error) {
      console.error('An error occurred while opening a job listing:', error);
    }
  } else {
    console.log("Not found: Easily apply");
  }
}


