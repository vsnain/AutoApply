import { delay, moveMouseTo } from './utils.js';

async function applyForJob() {

  console.log("injectScript running like crazy my friend");
  await delay(3000);
    // Search for the continue button on the new page
  const continueButton = Array.from(document.querySelectorAll('button'))
    .find(button => {
      const spanElement = button.querySelector('span');
      return spanElement && spanElement.textContent.trim() === 'Continue';
    });

  if (continueButton) {
    console.log("Continue button found:", continueButton);
  } else {
    console.log("Continue button not found.");
  }
  chrome.runtime.sendMessage({ type: 'applied' });
}
  
applyForJob();