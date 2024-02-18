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

chrome.runtime.onMessage.addListener(async ({type, jobUrl}, sender) => {
    
    if (type === 'openJobTab') {
        chrome.storage.local.get('url', async ({url}) => {
            console.log("Opening new tab", url);
            await openJobTab(url); 
          })
        
    }
});
