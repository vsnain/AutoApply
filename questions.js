chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'showQuestionsAndAnswers') {
      const questionsContainer = document.getElementById('questionsContainer');
      message.questions.forEach((question) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
  
        const questionHeading = document.createElement('h3');
        questionHeading.textContent = question.question;
        questionDiv.appendChild(questionHeading);
  
        if (question.answerType === 'textarea') {
          const textareaElement = document.createElement('textarea');
          textareaElement.setAttribute('placeholder', 'Enter your answer here');
          questionDiv.appendChild(textareaElement);
        } else if (question.answerType === 'dropdown') {
          const selectElement = document.createElement('select');
          question.options.forEach((option) => {
            const optionElement = document.createElement('option');
            optionElement.textContent = option;
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
          questionDiv.appendChild(numberInput);
        }
  
        questionsContainer.appendChild(questionDiv);
      });
    }
  });