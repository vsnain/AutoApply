import { delay, moveMouseTo } from './utils.js';

let flag = true;
async function hitButton(query){
  let continueButton = Array.from(document.querySelectorAll('button'))
  .find(button => {
    const spanElement = button.querySelector('span');
    return spanElement && spanElement.textContent.trim() === query;
  });

  
  if (continueButton){
    await moveMouseTo(continueButton);
  }
  else{
    flag = false;
  }
}

async function applyForJob() {
  await delay(1500);
  console.log("injectScript INJECTED");

  
  const resumeFileInput = document.querySelector('[data-testid="FileResumeCard-input"]');

  // Check if the element is found
  if (resumeFileInput) {
      // If found, simulate a click event on the element
      resumeFileInput.click();
      console.log("Clicked on the resume file input:", resumeFileInput);
  } else {
      console.log("Resume file input not found.");
  }

  let count = 0;

  while (flag && count<4){
    await hitButton('Continue');
    await delay(1500);
    count = count + 1; 
  }

  await hitButton('Submit your application');
  await delay(1500);
  
  chrome.runtime.sendMessage({ type: 'applied' });

}
  
applyForJob();