async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function openJobInNewTab(jobElement) {
    let jobTab; // Declare the jobTab variable

    try {
        // Find the anchor element inside the job element
        const jobAnchor = jobElement.querySelector('.jcs-JobTitle');
        // const jobAnchor = jobElement.querySelector('a[class*="jcs-JobTitle"]');

        // Check if the anchor element exists
        if (!jobAnchor) {
            console.log('No job anchor found in the job element:', jobElement);
            return; // Exit the function
        }

        // Get the URL of the job listing from the anchor element
        const jobUrl = jobAnchor.getAttribute('href');

        
        
        jobTab = window.open(jobUrl, '_blank');
        

        // Wait for the job listing page to fully load
        await new Promise(resolve => {
            jobTab.addEventListener('load', resolve);
        });

        await new Promise(resolve => setTimeout(resolve, 500));

        const applyButton = jobTab.document.querySelector('[aria-label^="Apply now"]');
        
        await moveMouseTo(applyButton);

        await new Promise(resolve => setTimeout(resolve, 500));

        
        
    } catch (error) {
        console.error('An error occurred while opening a job listing:', error);
        // Close the jobTab if an error occurs
        if (jobTab) {
            jobTab.close();
        }
    }
}


// function handleMutation(mutationsList, observer, jobTab) {
    

//     mutationsList.forEach(mutation => {
//         if (mutation.type === 'childList') {
//             // Check if the form element is added to the DOM
//             const form = document.querySelector('form[action="https://smartapply.indeed.com/beta/indeedapply/postresumeapply"]');
//             if (form) {
//                 // Extract the URL from the form's action attribute
//                 console.log('Form element:', form);
//                 const actionUrl = form.getAttribute('action');

//                 console.log('Form action URL====================', actionUrl);
                
//                 // Open the next page with the extracted URL
//                 window.open(actionUrl, '_blank');
//                 observer.disconnect();
              
                
//             }
//             else{
//                 jobTab.close();
//             }
            
//         }
//     });
// }

  

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
        for (let i = 0; i < 3; i++) {
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
