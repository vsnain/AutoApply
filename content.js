import { delay, moveMouseTo } from './utils.js';
import { openIndeedJobInNewTab } from './indeed.js';
import { openLinkedinJobInNewTab } from './linkedin.js';

chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
  if (message.action === 'startExecution') {
    sendResponse({ success: true });

    const currentURL = window.location.href;

    if (currentURL.includes("indeed")) {
      try {
        const jobElements = document.querySelectorAll('#mosaic-provider-jobcards > ul > li.css-5lfssm.eu4oa1w0');
        console.log(`Found ${jobElements.length} job elements`);

        for (let i = 0; i < jobElements.length; i++) {
          const jobElement = jobElements[i];
          console.log(`Processing job element ${i + 1}/${jobElements.length}`);
          await moveMouseTo(jobElement);
          await openIndeedJobInNewTab(jobElement);
          await delay(250);
        }
      } catch (error) {
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
});