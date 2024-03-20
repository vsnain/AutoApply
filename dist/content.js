import{delay,moveMouseTo}from"./utils.js";import{openIndeedJobInNewTab}from"./indeed.js";import{openLinkedinJobInNewTab}from"./linkedin.js";chrome.runtime.onMessage.addListener((async function(e,o,n){if("startExecution"===e.action){n({success:!0});const e=window.location.href;if(e.includes("indeed"))try{const e=document.querySelectorAll("#mosaic-provider-jobcards > ul > li.css-5lfssm.eu4oa1w0");console.log(`Found ${e.length} job elements`);for(let o=0;o<3;o++){const n=e[o];console.log(`Processing job element ${o+1}/${e.length}`),await moveMouseTo(n),await openIndeedJobInNewTab(n),await delay(250)}}catch(e){console.error("An error occurred:",e)}else if(e.includes("linkedin")){console.log("Executing LinkedIn script");const e=document.querySelectorAll(".jobs-search-results__list-item");console.log(`Total number of job list items: ${e.length}`);for(const o of e){const e=o.querySelector(".job-card-container__link");if(e){const o=e.href;await moveMouseTo(e),console.log(o),await delay(2e3)}}}else console.log("URL does not match any supported platforms"),chrome.runtime.sendMessage({type:"openChatGPT",query})}}));