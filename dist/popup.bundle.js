document.addEventListener("DOMContentLoaded",(function(){document.getElementById("start").addEventListener("click",(function(){console.log("Script Running"),chrome.tabs.query({active:!0,currentWindow:!0},(function(e){chrome.tabs.sendMessage(e[0].id,{action:"startExecution"},(function(e){console.log("Sending message")}))}))}))})),document.getElementById("showQuestionsAndAnswers").addEventListener("click",(()=>{chrome.storage.sync.get("questions",(e=>{const t=e.questions||[];if(0===t.length)return void alert("No questions found in the storage.");const n=chrome.runtime.getURL("questions.html");chrome.tabs.create({url:n,active:!0},(e=>{chrome.tabs.onUpdated.addListener((function e(n,s,o){n===o.id&&"complete"===s.status&&(chrome.tabs.sendMessage(n,{type:"showQuestionsAndAnswers",questions:t}),chrome.tabs.onUpdated.removeListener(e))}))}))}))}));