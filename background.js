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
        
        await executeScriptWithDelay(tab.id, setTextareaValue, query);
        await executeScriptWithDelay(tab.id, fetchAndLogFirstParagraph, query);
        // chrome.tabs.sendMessage(tab.id, { action: 'setTextarea', query: query });
        
    }
    
   
});

async function executeScriptWithDelay(tabId, func, ...args) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    await chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: func,
        args: args
    });
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log("Script done");

}

async function setTextareaValue(query) {
    
    
    const textarea = document.getElementById('prompt-textarea');
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
}

async function fetchAndLogFirstParagraph(query) {
    // Select the container element
    const container = document.querySelector('#__next > div.relative.z-0.flex.h-full.w-full.overflow-hidden > div > main > div.flex.h-full.flex-col > div.flex-1.overflow-hidden > div > div');

    // Check if the container element is found
    if (container) {
        // Find the first paragraph element within the container
        const paragraph = container.querySelector('p');
        
        // Check if a paragraph element is found
        if (paragraph) {
            // Fetch the content of the paragraph
            const paragraphContent = paragraph.innerText;
            console.log('First paragraph content:', paragraphContent);
        } else {
            console.error('Paragraph element not found within the container.');
        }
    } else {
        console.error('Container element not found.');
    }
}