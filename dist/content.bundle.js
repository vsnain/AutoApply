(()=>{"use strict";async function e(e){return new Promise((o=>setTimeout(o,e)))}function o(e,o,n,t){e.dispatchEvent(new MouseEvent(o,{view:window,bubbles:!0,cancelable:!0,clientX:n,clientY:t,button:0}))}async function n(e){const n=e.getBoundingClientRect(),t=n.left+(n.right-n.left)/2,s=n.top+(n.bottom-n.top)/2;o(e,"mousedown",t,s),o(e,"mouseup",t,s),o(e,"click",t,s)}async function t(o){const t=o.querySelectorAll("span");let s=!1;if(t.forEach((e=>{"Easily apply"===e.textContent.trim()&&(s=!0)})),s){console.log("Found: Easily apply");try{const t=o.querySelector(".jcs-JobTitle");if(await n(t),!t)return void console.log("No job anchor found in the job element:",o);const s=t.getAttribute("href");window.open(s,"_blank"),await e(2e3),chrome.runtime.sendMessage({type:"openIndeedJob"}),await new Promise((e=>{chrome.runtime.onMessage.addListener((function o(n){"injectedScriptFinished"===n.type&&(chrome.runtime.onMessage.removeListener(o),e())}))}))}catch(e){console.error("An error occurred while opening a job listing:",e)}}else console.log("Not found: Easily apply")}chrome.runtime.onMessage.addListener((async function(o,s,c){if("startExecution"===o.action){c({success:!0});const o=window.location.href;if(o.includes("indeed"))try{const o=document.querySelectorAll("#mosaic-provider-jobcards > ul > li.css-5lfssm.eu4oa1w0");console.log(`Found ${o.length} job elements`);for(let s=0;s<o.length;s++){const c=o[s];console.log(`Processing job element ${s+1}/${o.length}`),await n(c),await t(c),await e(250)}}catch(e){console.error("An error occurred:",e)}else if(o.includes("linkedin")){console.log("Executing LinkedIn script");const o=document.querySelectorAll(".jobs-search-results__list-item");console.log(`Total number of job list items: ${o.length}`);for(const t of o){const o=t.querySelector(".job-card-container__link");if(o){const t=o.href;await n(o),console.log(t),await e(2e3)}}}else console.log("URL does not match any supported platforms"),chrome.runtime.sendMessage({type:"openChatGPT",query})}}))})();