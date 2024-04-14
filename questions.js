chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'showQuestionsAndAnswers') {
      console.log('Questions in the database:', message.questions);
      const questionsContainer = document.getElementById('questionsContainer');
      const saveButtonTop = document.getElementById('saveButtonTop');
      const saveButtonBottom = document.getElementById('saveButtonBottom');
  
      const updateAnswers = () => {
        const updatedQuestions = [];
  
        const questionDivs = questionsContainer.getElementsByClassName('question');
        for (let i = 0; i < questionDivs.length; i++) {
          const questionDiv = questionDivs[i];
          const questionHeading = questionDiv.querySelector('h3').textContent;
          const answerType = message.questions[i].answerType;
          let userAnswer;
  
          if (answerType === 'textarea') {
            userAnswer = questionDiv.querySelector('textarea').value;
          } else if (answerType === 'dropdown') {
            userAnswer = questionDiv.querySelector('select').value;
          } else if (answerType === 'radio') {
            const selectedRadio = questionDiv.querySelector(`input[name="question-${questionHeading}"]:checked`);
            userAnswer = selectedRadio ? selectedRadio.value : null;
          } else if (answerType === 'number') {
            userAnswer = questionDiv.querySelector('input[type="number"]').value;
          }
  
          const updatedQuestion = {
            ...message.questions[i],
            userAnswer,
          };
  
          updatedQuestions.push(updatedQuestion);
        }
  
        chrome.storage.sync.set({ questions: updatedQuestions }, () => {
          console.log('Answers updated in the storage.');
        });
      };
  
      saveButtonTop.addEventListener('click', updateAnswers);
      saveButtonBottom.addEventListener('click', updateAnswers);
  
      message.questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
  
        const questionHeading = document.createElement('h3');
        questionHeading.textContent = question.question;
        questionDiv.appendChild(questionHeading);
  
        if (question.answerType === 'textarea') {
          const textareaElement = document.createElement('textarea');
          textareaElement.setAttribute('placeholder', 'Enter your answer here');
          textareaElement.value = question.userAnswer || ''; // Set the value from the storage
          questionDiv.appendChild(textareaElement);
        } else if (question.answerType === 'dropdown') {
          const selectElement = document.createElement('select');
          const defaultOption = document.createElement('option');
          defaultOption.textContent = 'Select an option';
          defaultOption.disabled = true;
          defaultOption.selected = !question.userAnswer; // Select the default option if no answer is present
          selectElement.appendChild(defaultOption);
          question.options.forEach((option) => {
            const optionElement = document.createElement('option');
            optionElement.textContent = option;
            optionElement.value = option;
            optionElement.selected = option === question.userAnswer; // Select the option if it matches the stored answer
            selectElement.appendChild(optionElement);
          });
          questionDiv.appendChild(selectElement);
        } else if (question.answerType === 'radio') {
          const optionsDiv = document.createElement('div');
          optionsDiv.classList.add('options');
          question.options.forEach((option) => {
            const radioDiv = document.createElement('div');
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = `question-${question.question}`;
            radioInput.value = option;
            radioInput.checked = option === question.userAnswer; // Check the radio button if it matches the stored answer
            const radioLabel = document.createElement('label');
            radioLabel.textContent = option;
            radioDiv.appendChild(radioInput);
            radioDiv.appendChild(radioLabel);
            optionsDiv.appendChild(radioDiv);
          });
          questionDiv.appendChild(optionsDiv);
        } else if (question.answerType === 'number') {
          const numberInput = document.createElement('input');
          numberInput.type = 'number';
          numberInput.setAttribute('placeholder', 'Enter a number');
          numberInput.value = question.userAnswer || ''; // Set the value from the storage
          questionDiv.appendChild(numberInput);
        }
  
        questionsContainer.appendChild(questionDiv);
      });
    }
  });