import { delay, moveMouseTo } from './utils.js';

async function applyForJob() {

    const applyButton = document.querySelector('[aria-label^="Apply now"]');
    console.log("injectScript running like crazy my friend");
    await new Promise(resolve => setTimeout(resolve, 1000));

    
    
    if (applyButton && !applyButton.hasAttribute('href')) {
      console.log(applyButton);
      await moveMouseTo(applyButton);
      await delay(4000);
      console.log("Before window load");
    //   await new Promise(resolve => {
    //     window.addEventListener('load', resolve);
    //   });
    //   console.log("After window load");
  
    //   // Search for the continue button on the new page
    //   const continueButton = Array.from(document.querySelectorAll('button'))
    //     .find(button => {
    //       const spanElement = button.querySelector('span');
    //       return spanElement && spanElement.textContent.trim() === 'Continue';
    //     });
  
    //   if (continueButton) {
    //     console.log("Continue button found:", continueButton);
    //   } else {
    //     console.log("Continue button not found.");
    //   }
    // } else {
    //   console.log("Apply button not found or job already applied.");
    }

    // Send a message back to the background script
    await delay(4000);
    console.log("waiting");
    await delay(4000);
    console.log("waiting");

    chrome.runtime.sendMessage({ type: 'jobApplied' });

  }
  
applyForJob();