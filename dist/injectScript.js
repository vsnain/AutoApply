import{delay,moveMouseTo}from"./utils.js";let flag=!0;async function hitButton(t){let e=Array.from(document.querySelectorAll("button")).find((e=>{const o=e.querySelector("span");return o&&o.textContent.trim()===t}));e?await moveMouseTo(e):flag=!1}async function applyForJob(){await delay(1500),console.log("injectScript INJECTED");const t=document.querySelector('[data-testid="FileResumeCard-input"]');t?(t.click(),console.log("Clicked on the resume file input:",t)):console.log("Resume file input not found.");let e=0;for(;flag&&e<4;)await hitButton("Continue"),await delay(1500),e+=1;await hitButton("Submit your application"),await delay(1500),chrome.runtime.sendMessage({type:"applied"})}applyForJob();