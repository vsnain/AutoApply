async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function openJobInNewTab(jobElement) {
    let jobTab; // Declare the jobTab variable

    try {
        // Find the anchor element inside the job element
        const jobAnchor = jobElement.querySelector('a.jcs-JobTitle');

        // Check if the anchor element exists
        if (!jobAnchor) {
            console.log('No job anchor found in the job element:', jobElement);
            return; // Exit the function
        }

        // Get the URL of the job listing from the anchor element
        const jobUrl = jobAnchor.getAttribute('href');

        // Open the job listing in a new tab and store the reference to the tab
        jobTab = window.open(jobUrl, '_blank');

        
        // Wait for the job listing page to fully load
        await new Promise(resolve => {
            jobTab.addEventListener('load', resolve);
        });

        await new Promise(resolve => setTimeout(resolve, 500));

        // Find the apply button on the job listing page
        const applyButton = jobTab.document.querySelector('#applyButtonLinkContainer > div > div > button');
        
        await moveMouseTo(applyButton);

        const url = applyButton.getAttribute('href');
        // Check if the apply button exists
        if (!applyButton) {
            console.log('Apply button not found on the job listing page.');
            return; // Exit the function
        }
        console.log(url);
        

        if (url.includes("indeed")) {
            chrome.storage.local.set({ url });
        
            chrome.runtime.sendMessage({
                type: 'openJobTab',
                url
            });
        
            // Define an async function to handle the tab loaded event
            const handleTabLoaded = async (message, sender) => {
                if (message.type === 'tabLoaded') {
                    try {
                        // Execute content script in the new tab to find the label element
                        chrome.tabs.executeScript(sender.tab.id, {
                            code: `document.querySelector('#ihl-useId-indeed-theme-provider-guwgai-1-file-resume > label')`
                        }, function(results) {
                            if (chrome.runtime.lastError) {
                                console.error(chrome.runtime.lastError.message);
                            } else {
                                console.log('Label found:', results[0]);
                                moveMouseTo(results[0]); // Call moveMouseTo without await
                            }
                        });
                    } catch (error) {
                        console.error('An error occurred:', error);
                    }
                }
            };
        
            // Register the handleTabLoaded function as a listener for the tabLoaded event
            chrome.runtime.onMessage.addListener(handleTabLoaded);
        } else {
            console.log("URL does not contain 'indeed'. Ignoring...");
        }
        
        

        

        
    } catch (error) {
        console.error('An error occurred while opening a job listing:', error);
        // Close the jobTab if an error occurs
        if (jobTab) {
            jobTab.close();
        }
    }
}




  

var simulateMouseEvent = function(element, eventName, coordX, coordY) {
    element.dispatchEvent(new MouseEvent(eventName, {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: coordX,
      clientY: coordY,
      button: 0
    }));
};

async function moveMouseTo(element) {
    const rect = element.getBoundingClientRect();
    const coordX = rect.left + (rect.right - rect.left) / 2;
    const coordY = rect.top + (rect.bottom - rect.top) / 2;
    
    console.log(`Moving mouse to (${coordX}, ${coordY})`);
    
    simulateMouseEvent(element, "mousedown", coordX, coordY);
    simulateMouseEvent(element, "mouseup", coordX, coordY);
    simulateMouseEvent(element, "click", coordX, coordY);
}

chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
    // Check if the message action is to start execution
    if (message.action === 'startExecution') {
      sendResponse({ success: true });
      try {
        // Find all job elements
        const jobElements = document.querySelectorAll('#mosaic-provider-jobcards > ul > li.css-5lfssm.eu4oa1w0');
        
        console.log(`Found ${jobElements.length} job elements`);
        
        // Iterate over each job element 
        for (let i = 0; i < 1; i++) {
          const jobElement = jobElements[i];
          
          console.log(`Processing job element ${i + 1}/${jobElements.length}`);
          
          // Move the mouse cursor to the job element and click on it
          await moveMouseTo(jobElement);
          
          
          await openJobInNewTab(jobElement);
          // Wait for 250 milliseconds
          await delay(500);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
});
