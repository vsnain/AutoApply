import { delay, moveMouseTo } from './utils.js';

async function clickApply() {

    const applyButton = document.querySelector('[aria-label^="Apply now"]');
    console.log("applyScript running like crazy");
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (applyButton && !applyButton.hasAttribute('href')) {
      console.log("Clicking Apply");
      await moveMouseTo(applyButton);
      chrome.runtime.sendMessage({ type: 'injectScript' });
    }
}
  
clickApply();