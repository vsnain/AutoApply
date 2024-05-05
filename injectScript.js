import { delay, moveMouseTo } from './utils.js';

let flag = true;
async function hitButton(query) {
  let continueButton = Array.from(document.querySelectorAll('button'))
    .find(button => {
      const spanElement = button.querySelector('span');
      return spanElement && spanElement.textContent.trim() === query;
    });

  if (continueButton) {
    
    const questionsContainer = document.querySelector('#ia-container > div > div.css-12qwcfa.eu4oa1w0 > div > div > div.css-w93e9b.e37uo190 > div.css-6e23tm.eu4oa1w0 > div > div > main > div.ia-BasePage-component.ia-BasePage-component--withContinue');

    if (questionsContainer) {
      let questionIndex = 0;
      let currentQuestion = questionsContainer.querySelector(`#q_${questionIndex}`);

      while (currentQuestion) {
        const questionText = currentQuestion.querySelector('.css-12axhzd.e1wnkr790')?.textContent.trim();

        // Handle empty box
        const textAreaElement = currentQuestion.querySelector('textarea');
        if (textAreaElement) {
          const storedAnswer = textAreaElement.value.trim();
          if (storedAnswer) {
            // Answer is already filled, so we don't change it
            console.log("Answer is there for text box");
            chrome.runtime.sendMessage({ type: 'storeAnswer', question: questionText, answer: storedAnswer, answerType: 'textarea' });
          } else {
            // Answer is not filled, so we use the default answer
            const defaultAnswer = await getDefaultAnswer(questionText, 'textarea');
            textAreaElement.value = defaultAnswer;
            const inputEvent = new Event('input', { bubbles: true });
            textAreaElement.dispatchEvent(inputEvent);
            await delay(500);
            chrome.runtime.sendMessage({ type: 'storeAnswer', question: questionText, answer: defaultAnswer, answerType: 'textarea' });
          }
        }
        const textElement = currentQuestion.querySelector('input[type="text"]');
        if (textElement) {
          const storedAnswer = textElement.value.trim();
          if (storedAnswer) {
            // Answer is already filled, so we don't change it
            console.log("Answer is there for text box");
            chrome.runtime.sendMessage({ type: 'storeAnswer', question: questionText, answer: storedAnswer, answerType: 'textarea' });
          } else {
            // Answer is not filled, so we use the default answer
            const defaultAnswer = await getDefaultAnswer(questionText, 'textarea');
            textElement.value = defaultAnswer;
            const inputEvent = new Event('input', { bubbles: true });
            textElement.dispatchEvent(inputEvent);
            await delay(500);
            chrome.runtime.sendMessage({ type: 'storeAnswer', question: questionText, answer: defaultAnswer, answerType: 'textarea' });
          }
        }

        // Handle dropdown
        const selectElement = currentQuestion.querySelector('select');
        if (selectElement) {
          const options = Array.from(selectElement.options).map(option => option.textContent.trim());
          const storedAnswer = selectElement.value;
          if (storedAnswer) {
            // Answer is already selected, so we don't change it
            console.log("Answer is there for dropdown");
            chrome.runtime.sendMessage({ type: 'storeAnswer', question: questionText, answer: storedAnswer, answerType: 'dropdown', options });
          } else {
            // Answer is not selected, so we use the default answer
            const defaultAnswer = await getDefaultDropdownAnswer(null, options);

            // Check the Canada one. 
            
          if (options.includes('Canada')) {
            // Option "Canada" found, set it as selected
            selectElement.value = '2'; // Assuming the value of Canada is '2'
            // Dispatch a change event to simulate user interaction
            const changeEvent = new Event('change', { bubbles: true });
            selectElement.dispatchEvent(changeEvent);
            await delay(500);
          }
          else{
            selectElement.value = defaultAnswer;
            const changeEvent = new Event('change', { bubbles: true });
            selectElement.dispatchEvent(changeEvent);
            await delay(500);
            chrome.runtime.sendMessage({ type: 'storeAnswer', question: questionText, answer: defaultAnswer, answerType: 'dropdown', options });
          }
          }
        }
        



        // Handle radio buttons
        const radioButtons = currentQuestion.querySelectorAll('input[type="radio"]');
        if (radioButtons.length > 0) {
          const options = Array.from(radioButtons).map(radio => radio.nextElementSibling.textContent.trim());
          const storedAnswer = Array.from(radioButtons).find(radio => radio.checked)?.nextElementSibling.textContent.trim();
          if (storedAnswer) {
            // Answer is already selected, so we don't change it
            console.log("Answer is there for radio");
            chrome.runtime.sendMessage({ type: 'storeAnswer', question: questionText, answer: storedAnswer, answerType: 'radio', options });
          } else {
            // Answer is not selected, so we use the default answer
            const defaultAnswer = await getDefaultRadioAnswer(null, options);
            console.log(defaultAnswer);
            
            const radioButton = Array.from(radioButtons).find(radio => radio.nextElementSibling.textContent.trim() === defaultAnswer);
            if (radioButton) {
              console.log("Attempting to click radio button");
              await moveMouseTo(radioButton);
              await delay(500);
            }
            chrome.runtime.sendMessage({ type: 'storeAnswer', question: questionText, answer: defaultAnswer, answerType: 'radio', options });
          }
        }

        // Handle number input
        const numberInput = currentQuestion.querySelector('input[type="number"]');
        if (numberInput) {
          const storedAnswer = numberInput.value.trim();
          if (storedAnswer) {
            // Answer is already filled, so we don't change it
            console.log("Answer is there for numerical box");
            chrome.runtime.sendMessage({ type: 'storeAnswer', question: questionText, answer: storedAnswer, answerType: 'number' });
          } else {
            // Answer is not filled, so we use the default answer
            let defaultAnswer = await getDefaultNumericalAnswer(questionText, 'number');
            defaultAnswer = parseInt(defaultAnswer);
            numberInput.value = defaultAnswer;
            const inputEvent = new Event('input', { bubbles: true });
            numberInput.dispatchEvent(inputEvent);

            await delay(500);
            chrome.runtime.sendMessage({ type: 'storeAnswer', question: questionText, answer: defaultAnswer, answerType: 'number' });
          }
        }

        questionIndex++;
        currentQuestion = questionsContainer.querySelector(`#q_${questionIndex}`);
      }
    } else {
      console.log('Questions container not found.');
    }
    await moveMouseTo(continueButton);
  } else {
    flag = false;
  }
}

async function getDefaultAnswer(question, answerType) {
  return "github.com/vsnain/autoapply - I created the bot ";
}

async function getDefaultNumericalAnswer(question, answerType) {
  return 2;
}

function getDefaultDropdownAnswer(storedAnswer, options) {
  if (!storedAnswer) {
    const defaultAnswers = ['Canada', 'Asian', 'Decline to answer', 'Asian (not Hispanic or Latino)','Canada(+1)',"2"];
    const match = defaultAnswers.find(answer => options.includes(answer));
    return match || '';
  }
  return storedAnswer;
}

function getDefaultRadioAnswer(storedAnswer, options) {
  if (!storedAnswer) {
    const defaultAnswers = ['Yes', 'Male', 'Yes, I can make the commute', "No, I don't have a disability",'Decline to answer', 'Email me', 'Hybrid'];
    const match = defaultAnswers.find(answer => options.includes(answer));
    return match || '';
  }
  return storedAnswer;
}

async function applyForJob() {
  await delay(1500);
  console.log("injectScript INJECTED");

  const resumeFileLabel = document.querySelector('[data-testid="FileResumeCard-label"]');

  // Check if the element is found
  if (resumeFileLabel) {
    // If found, simulate a click event on the element
    resumeFileLabel.click();
    console.log("Clicked on the resume file label:", resumeFileLabel);
  } else {
    console.log("Resume file label not found.");
    const resumeFileInput = document.querySelector('[data-testid="FileResumeCard-input"]');
    // Check if the element is found
    if (resumeFileInput) {
        // If found, simulate a click event on the element
        resumeFileInput.click();
        console.log("Clicked on the resume file input:", resumeFileInput);
    } else {
        console.log("Resume file input not found.");
    }
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