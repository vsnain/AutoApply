(()=>{"use strict";!async function(){console.log("injectScript running like crazy my friend"),await async function(n){return new Promise((n=>setTimeout(n,3e3)))}();const n=Array.from(document.querySelectorAll("button")).find((n=>{const e=n.querySelector("span");return e&&"Continue"===e.textContent.trim()}));n?console.log("Continue button found:",n):console.log("Continue button not found."),chrome.runtime.sendMessage({type:"applied"})}()})();