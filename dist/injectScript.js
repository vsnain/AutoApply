import{delay,moveMouseTo}from"./utils.js";let flag=!0;async function hitButton(e){let t=Array.from(document.querySelectorAll("button")).find((t=>{const n=t.querySelector("span");return n&&n.textContent.trim()===e}));if(t){const e=document.querySelector("#ia-container > div > div.css-12qwcfa.eu4oa1w0 > div > div > div.css-w93e9b.e37uo190 > div.css-6e23tm.eu4oa1w0 > div > div > main > div.ia-BasePage-component.ia-BasePage-component--withContinue");if(e){let t=0,n=e.querySelector(`#q_${t}`);for(;n;){const o=n.querySelector(".css-12axhzd.e1wnkr790")?.textContent.trim(),s=n.querySelector("textarea");if(s){const e=s.value.trim();if(e)console.log("Answer is there for text box"),chrome.runtime.sendMessage({type:"storeAnswer",question:o,answer:e,answerType:"textarea"});else{const e=await getDefaultAnswer(o,"textarea");s.value=e;const t=new Event("input",{bubbles:!0});s.dispatchEvent(t),await delay(500),chrome.runtime.sendMessage({type:"storeAnswer",question:o,answer:e,answerType:"textarea"})}}const r=n.querySelector('input[type="text"]');if(r){const e=r.value.trim();if(e)console.log("Answer is there for text box"),chrome.runtime.sendMessage({type:"storeAnswer",question:o,answer:e,answerType:"textarea"});else{const e=await getDefaultAnswer(o,"textarea");r.value=e;const t=new Event("input",{bubbles:!0});r.dispatchEvent(t),await delay(500),chrome.runtime.sendMessage({type:"storeAnswer",question:o,answer:e,answerType:"textarea"})}}const a=n.querySelector("select");if(a){const e=Array.from(a.options).map((e=>e.textContent.trim())),t=a.value;if(t)console.log("Answer is there for dropdown"),chrome.runtime.sendMessage({type:"storeAnswer",question:o,answer:t,answerType:"dropdown",options:e});else{const t=await getDefaultDropdownAnswer(null,e);a.value=t;const n=new Event("change",{bubbles:!0});a.dispatchEvent(n),await delay(500),chrome.runtime.sendMessage({type:"storeAnswer",question:o,answer:t,answerType:"dropdown",options:e})}}const i=n.querySelectorAll('input[type="radio"]');if(i.length>0){const e=Array.from(i).map((e=>e.nextElementSibling.textContent.trim())),t=Array.from(i).find((e=>e.checked))?.nextElementSibling.textContent.trim();if(t)console.log("Answer is there for radio"),chrome.runtime.sendMessage({type:"storeAnswer",question:o,answer:t,answerType:"radio",options:e});else{const t=await getDefaultRadioAnswer(null,e);console.log(t);const n=Array.from(i).find((e=>e.nextElementSibling.textContent.trim()===t));n&&(console.log("Attempting to click radio button"),await moveMouseTo(n),await delay(500)),chrome.runtime.sendMessage({type:"storeAnswer",question:o,answer:t,answerType:"radio",options:e})}}const l=n.querySelector('input[type="number"]');if(l){const e=l.value.trim();if(e)console.log("Answer is there for numerical box"),chrome.runtime.sendMessage({type:"storeAnswer",question:o,answer:e,answerType:"number"});else{let e=await getDefaultNumericalAnswer(o,"number");e=parseInt(e),l.value=e;const t=new Event("input",{bubbles:!0});l.dispatchEvent(t),await delay(500),chrome.runtime.sendMessage({type:"storeAnswer",question:o,answer:e,answerType:"number"})}}t++,n=e.querySelector(`#q_${t}`)}}else console.log("Questions container not found.");await moveMouseTo(t)}else flag=!1}async function getDefaultAnswer(e,t){return"I'm a bot designed by Vikram, I couldn't figure out the answer to this question."}async function getDefaultNumericalAnswer(e,t){return 2}function getDefaultDropdownAnswer(e,t){return e||(["Canada","Asian","Decline to answer","Asian (not Hispanic or Latino)","Canada(+1)"].find((e=>t.includes(e)))||"")}function getDefaultRadioAnswer(e,t){return e||(["Yes","Male","Yes, I can make the commute","No, I don't have a disability","Decline to answer","Email me","Hybrid"].find((e=>t.includes(e)))||"")}async function applyForJob(){await delay(1500),console.log("injectScript INJECTED");const e=document.querySelector('[data-testid="FileResumeCard-label"]');if(e)e.click(),console.log("Clicked on the resume file label:",e);else{console.log("Resume file label not found.");const e=document.querySelector('[data-testid="FileResumeCard-input"]');e?(e.click(),console.log("Clicked on the resume file input:",e)):console.log("Resume file input not found.")}let t=0;for(;flag&&t<4;)await hitButton("Continue"),await delay(1500),t+=1;await hitButton("Submit your application"),await delay(1500),chrome.runtime.sendMessage({type:"applied"})}applyForJob();