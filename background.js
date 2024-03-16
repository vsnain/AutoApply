async function getActiveTab() {
    return new Promise((resolve) => {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            resolve(tabs[0]);
        });
    });
}

async function openJobTab(jobUrl) {
    
    const currentTab = await getActiveTab();
    
    try {
        const jobTab = await chrome.tabs.create({url: jobUrl});
        
        await chrome.tabs.update(jobTab.id, {active: true}); // Activate the newly created tab
        currentTab && chrome.tabs.remove(currentTab.id); // Close the current tab if it exists
        chrome.runtime.sendMessage({ type: 'tabLoaded' });
    } catch(err) {
        console.error("Error at openJobTab:", err);
    }
}


chrome.runtime.onMessage.addListener(async ({type, url, query}, sender, sendResponse) => {
    
    if (type === 'openJobTab') {
        chrome.storage.local.get('url', async ({url}) => {
            console.log("Opening tab", url);
            await openJobTab(url); 
          })
        
    }
    else if (type === 'closeTab') {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            tabId = tabs[0].id;
            const currentTabUrl = tabs[0].url;
          });
        chrome.tabs.remove(tabId);
    }
    else if(type == 'openChatGPT'){
        console.log("Running background openChatGPT function");
        const chatGPTUrl = 'https://chat.openai.com/';
        const tab = await chrome.tabs.create({ url: chatGPTUrl });
        await new Promise(resolve => setTimeout(resolve, 7000));
        await executeScriptWithDelay(tab.id, setTextareaValue, query);
        await new Promise(resolve => setTimeout(resolve, 5000));
        await executeScriptWithDelay(tab.id, fetchLastMessage, query);
        // chrome.tabs.sendMessage(tab.id, { action: 'setTextarea', query: query });
    }
    
   
});

async function executeScriptWithDelay(tabId, func, ...args) {
    await chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: func,
        args: args
    });
    console.log("Script done");
}

async function setTextareaValue(query) {
    
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
    }
    else{
        console.log("TextArea not found!");
    }
}

async function fetchLastMessage(query) {
    
    console.log("Entered Last message script");
    const lastMessageElement = document.querySelector('[data-testid^="conversation-turn-"]:last-child');
    // console.log(lastMessageElement);

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