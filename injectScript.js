import { delay, moveMouseTo } from './utils.js';

let flag = true;
async function hitButton(query) {
  let continueButton = Array.from(document.querySelectorAll('button'))
    .find(button => {
      const spanElement = button.querySelector('span');
      return spanElement && spanElement.textContent.trim() === query;
    });

  if (continueButton) {
    await moveMouseTo(continueButton);

    const questionsContainer = document.querySelector('#ia-container > div > div.css-12qwcfa.eu4oa1w0 > div > div > div.css-w93e9b.e37uo190 > div.css-6e23tm.eu4oa1w0 > div > div > main > div.ia-BasePage-component.ia-BasePage-component--withContinue');

    if (questionsContainer) {
      let questionIndex = 0;
      let currentQuestion = questionsContainer.querySelector(`#q_${questionIndex}`);

      while (currentQuestion) {
        const questionText = currentQuestion.querySelector('.css-12axhzd.e1wnkr790')?.textContent.trim();

        // Handle empty box
        const textAreaElement = currentQuestion.querySelector('textarea');
        if (textAreaElement) {
          chrome.runtime.sendMessage({ type: 'storeQuestion', question: questionText, answerType: 'textarea' });
        }

        // Handle dropdown
        const selectElement = currentQuestion.querySelector('select');
        if (selectElement) {
          const options = Array.from(selectElement.options).map(option => option.textContent.trim());
          chrome.runtime.sendMessage({ type: 'storeQuestion', question: questionText, answerType: 'dropdown', options });
        }

        // Handle radio buttons
        const radioButtons = currentQuestion.querySelectorAll('input[type="radio"]');
        if (radioButtons.length > 0) {
          const options = Array.from(radioButtons).map(radio => radio.nextElementSibling.textContent.trim());
          chrome.runtime.sendMessage({ type: 'storeQuestion', question: questionText, answerType: 'radio', options });
        }

        // Handle number input
        const numberInput = currentQuestion.querySelector('input[type="number"]');
        if (numberInput) {
          chrome.runtime.sendMessage({ type: 'storeQuestion', question: questionText, answerType: 'number' });
        }

        questionIndex++;
        currentQuestion = questionsContainer.querySelector(`#q_${questionIndex}`);
      }
    } else {
      console.log('Questions container not found.');
    }
  } else {
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