async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function openLinkedinJobInNewTab(jobElement){
  console.log(jobElement);
}
async function openIndeedJobInNewTab(jobElement) {
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
      const jobUrl = jobAnchor.getAttribute('href');
      jobTab = window.open(jobUrl, '_blank');
      // Wait for the job listing page to fully load
      await new Promise(resolve => {
          jobTab.addEventListener('load', resolve);
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      const applyButton = jobTab.document.querySelector('[aria-label^="Apply now"]');
      
      if(applyButton.hasAttribute('href')) {
        jobTab.close();
      } else {
        // const applyButton = jobTab.document.querySelector('[aria-label^="Apply now"]');
        await delay(500);
        await moveMouseTo(applyButton);
        await new Promise(resolve => window.addEventListener('load', resolve));

        const continueButton = document.querySelector('button > span:contains("Continue")');
        while (continueButton){
          await moveMouseTo(applyButton);
          await new Promise(resolve => window.addEventListener('load', resolve));
          const newButton = document.querySelector('button > span:contains("Continue")');
          continueButton = newButton;
        }
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
    
    simulateMouseEvent(element, "mousedown", coordX, coordY);
    simulateMouseEvent(element, "mouseup", coordX, coordY);
    simulateMouseEvent(element, "click", coordX, coordY);
}

chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
    // Check if the message action is to start execution
    if (message.action === 'startExecution') {
      sendResponse({ success: true });

      const currentURL = window.location.href;
        // Check if the URL contains "indeed" or "linkedin"

      if (currentURL.includes("indeed")) {
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
            await openIndeedJobInNewTab(jobElement);
            // Wait for 250 milliseconds
            await delay(250);
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
          
      } else if (currentURL.includes("linkedin")) {
          // Execute linkedin script
          console.log("Executing LinkedIn script");
          const jobListItems = document.querySelectorAll('.jobs-search-results__list-item');
          console.log(`Total number of job list items: ${jobListItems.length}`);
          
          for (const jobListItem of jobListItems) {
              // Get the job title link
              const jobTitleLink = jobListItem.querySelector('.job-card-container__link');
              
              // Check if the job title link exists
              if (jobTitleLink) {
                  // Click on the job title link
                  const jobUrl = jobTitleLink.href;
                  await moveMouseTo(jobTitleLink);
                  // await openLinkedinJobInNewTab(jobUrl);
                  // Wait for 250 milliseconds
                  console.log(jobUrl);
                  await delay(2000);
              }
          }
          
      } else {
          console.log("URL does not match any supported platforms");
      }
      
    }
});




