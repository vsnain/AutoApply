import { delay, moveMouseTo } from './utils.js';
import { openIndeedJobInNewTab } from './indeed.js';
import { openLinkedinJobInNewTab } from './linkedin.js';

let shouldStop = false;
chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
  if (message.action === 'startExecution') {
    sendResponse({ success: true });
    await delay(1500);


    const currentURL = window.location.href;
    
    if (currentURL.includes("indeed")) {
      try {
        // Define the number of pages
        

          // Process job elements
          const jobElements = document.querySelectorAll('#mosaic-provider-jobcards > ul > li.css-5lfssm.eu4oa1w0');
          console.log(`Found ${jobElements.length} job elements`);
      
          for (let i = 0; i < jobElements.length; i++) {

            if (shouldStop) {
              console.log('Execution stopped');
              break;
            }

            const jobElement = jobElements[i];
            console.log(`Processing job element ${i + 1}/${jobElements.length}`);
            try{
            await moveMouseTo(jobElement);
            await delay(500);
            await openIndeedJobInNewTab(jobElement);
            await delay(250);
          } catch (error) {
            // Handle the error
            console.error('Error occurred while processing job element:', error);
            // Send a message to the background script indicating the error
            await delay(1000);
            chrome.runtime.sendMessage({ type: 'applied' });
          }
          }
      
          // Click the "Next Page" link

          const nextPageLink = document.querySelector('[aria-label="Next Page"]');
          if (nextPageLink) {
            await delay(1000);
            console.log("Clicking 'Next Page' link");
            await moveMouseTo(nextPageLink);
            chrome.runtime.sendMessage({ type: 'nextPageClicked' });
          } else {
            console.error("Next page link not found");
             // Exit the loop if the "Next Page" link is not found
          }
        }
       catch (error) {
        console.error('An error occurred:', error);
      }
      
    } else if (currentURL.includes("linkedin")) {
      console.log("Executing LinkedIn script");
      const jobListItems = document.querySelectorAll('.jobs-search-results__list-item');
      console.log(`Total number of job list items: ${jobListItems.length}`);

      for (const jobListItem of jobListItems) {
        const jobTitleLink = jobListItem.querySelector('.job-card-container__link');

        if (jobTitleLink) {
          const jobUrl = jobTitleLink.href;
          await moveMouseTo(jobTitleLink);
          console.log(jobUrl);
          await delay(2000);
        }
      }
    } else {
      console.log("URL does not match any supported platforms");
      chrome.runtime.sendMessage({ type: 'openChatGPT', query: query });
    }
  }
  else if (message.action === 'stopExecution') {
    shouldStop = true;
    console.log('Execution stopped');
  }
});