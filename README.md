
# Job application bot

Chrome extension that automatically applies for jobs on Indeed. Works for jobs under "Easy Apply". 


## Developer Guide

npm install

npm run build

**If you want to edit and "refresh" the code**:
npm run watch

## Why a chrome extension?

To avoid scraping, or detection, or IP ban. If 1000 users use a chrome extension, that's 1000 different IPs. Indeed can't detect all of them. 

## What works so far

Search for a desired job on indeed.ca, and hit "start" button. If the code breaks, refresh the page and hit start again. 

## Under construction

* Linkedin functionality
* Saving questions into a database, asking the user for answers, and then giving those answers in applications
* Using LLMs to answer questions, or to match JD against the resume(Apply jobs that are 80% match)

## Bugs/Broken code

* Job already applied
* Clicking on next page(Indeed next page arrow, which then changes the page and shows next 25 jobs i.e. page 2 of jobs) and injecting script again
* Human captcha

## Code Logic

Start button pressed -> content.js injected

* Content.js : Goes through the jobs on the page(usually 25), opens each job in a new tab through background.js. The content script waits while the new tab is doing it's work
* applyScript.js : Once the content.js opens a job in new tab, applyScript.js is injected by background script. This script simply finds the apply button and clicks it. After the click, a new page is loaded in the SAME TAB and a message is sent to the background script to inject injectScript
* injectScript.js : Selects the resume uploaded on indeed, hits next. Answers the questions with HARDCODED answers. Keeps clicking continue till it finds a submit button and then submits the application. After submission, it sends a message to the background script to close this tab and resume content.js that was on pause till now. 


## Future functionality

* questions.js : Grabs all the questions from indeed applications, asks the user to answer them, and then uses those answers for future applications. 
* linkedin.js : Same functionality for linkedin easy apply jobs. 
* chatgpt.js : Hard to implement(OpenAI has weird defenses). Wanted to open chatgpt, check the JD against the resume, and apply only if the JD is an 80% match. 
