export async function setTextareaValue(query) {
    console.log("Entered textareavalue script");
    const textarea = document.getElementById('prompt-textarea');
    console.log(textarea);
    if (textarea) {
      textarea.value = query;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
  
      const enterKeyEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        which: 13,
        keyCode: 13,
        bubbles: true,
        cancelable: true
      });
  
      // Dispatch the "Enter" key event on the textarea
      textarea.dispatchEvent(enterKeyEvent);
    } else {
      console.log("TextArea not found!");
    }
  }
  
  export async function fetchLastMessage(query) {
    console.log("Entered Last message script");
    const lastMessageElement = document.querySelector('[data-testid^="conversation-turn-"]:last-child');
  
    // Check if the element is found
    if (lastMessageElement) {
      const paragraphElement = lastMessageElement.querySelector('.text-message div.markdown.prose');
  
      // Get the text content of the paragraph
      const paragraphText = paragraphElement.textContent.trim();
  
      console.log(paragraphText);
    } else {
      console.error('Last message element not found.');
    }
  }