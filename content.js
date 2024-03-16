async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function openLinkedinJobInNewTab(jobElement){
  console.log(jobElement);
}
async function openIndeedJobInNewTab(jobElement) {
  let jobTab; // Declare the jobTab variable
  // Find the span element with "Easily apply" text
  const spanElements = jobElement.querySelectorAll('span');

  let found = false;

  // Iterate through each span element
  spanElements.forEach(span => {
      // Check if the span contains "Easily apply"
      if (span.textContent.trim() === "Easily apply") {
          found = true;
      }
  });

// Check if the span element exists
  if (found) {
      console.log("Found: Easily apply");
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
          
          // await new Promise(resolve => window.addEventListener('load', resolve));
          await delay(7000);
          

          console.log("Looking for Continue");
          const continueButton = Array.from(jobTab.document.querySelectorAll('button'))
            .find(button => {
              console.log(button);
              const spanElement = button.querySelector('span');
              return spanElement && spanElement.textContent.trim() === 'Continue';
            });

          let counter = 0;
          
          console.log(continueButton);

          
          
          while (continueButton && counter < 5) {
              await moveMouseTo(applyButton);
              await new Promise(resolve => setTimeout(resolve, 7000)); // Wait for some time (adjust as needed)
              continueButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent.trim() === 'Continue'); // Find the continue button again
              counter++; // Increment the counter
              console.log(continueButton);
          }
        }
        
    } catch (error) {
        console.error('An error occurred while opening a job listing:', error);
        // Close the jobTab if an error occurs
        if (jobTab) {
            jobTab.close();
        }
    }
  } else {
      console.log("Not found: Easily apply");
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

// 

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
          chrome.runtime.sendMessage({ type: 'openChatGPT', query: query });
          
      }
      
    }
  //   else if (request.action === 'setTextarea') {
  //     setTextareaValue(request.query);
  // }
});

var query = `You are to become a keyword matcher. 
I will give you a JD, and you have to match it against my resume. And for each JD that I give you, you have to match is with
the resume I have given you. After matching, you MUST reply - "Score". Where 'Score' is the score you assign. 
For each JD I give you, you match it with same exact resume, and you reply with a single sentence which I gave you. 
Do not deviate from instructions. Always reply the score in mathematical form only. And score should be out of 100%. Note that 
score is a variable that you assign, out of 100%. It is not a constant. It is a variable that you assign. 
Here is my resume:

Experience
 Software Engineer April 2021 – October 2021 Scaler Remote
• Engineered the topic exploration portal for Scaler’s learning platform, developing the backend schema and GraphQL API using NodeJS. The React SPA interface provided learners with pathways across 500+ technical courses
• Built a contribution management platform using NodeJS, ExpressJS, and MongoDB, supporting authentication, payments,contribution management, for 700+ mentors/writers increasing contributor retention by more than 80%
• Implemented data-driven optimization strategies using Python that analyzed traffic patterns and storing them on
SQL server to strategically enhance content, driving a 200% increase in monthly users
• Interviewed and onboarded over 150 part-time mentors(Big Tech Engineers), and built the content pipeline,
growing website traffic 5x to 500k monthly users in 6 months
Software Engineer January 2020 – March 2021
Lido
Remote
• Architected a scalable single page application using ReactJS serving over 1 million users annually, reducing page loads by 50% through code splitting and lazy loading techniques
• Developed and managed microservices using Node.js, GraphQL, and Kafka facilitating 10x growth in course enrollments with 99.99% uptime for a catalog of over 1000 online courses
• Implemented OAuth 2.0 authentication and authorization for secure user access across web, mobile and API endpoints. Integrated OAuth providers like Google, Facebook with single sign-on
Concierge - Part Time May 2022 – Jan 2024 SamsonShield Toronto
• Effectively managed a building with 1500+ residents over the weekends, showcasing strong collaboration and communication skills in addressing residents’ needs and ensuring a welcoming environment
Education
Humber College - Information Technology
Software Development Lifecycle, Agile, Scrum
BML University - Bachelor of Computer Science, and Engineering
Data Structures, Algorithms, Computer Architecture, Networks, Database, Functional Programming
Projects
Toronto, Canada
2022 – 2023
Gurugram, India
2016 – 2020
  Alpha - Status based social network - GitHub
• Lead a team of 3 to design an intuitive UI using Android Studio connected to a robust backend built using Node.js
• Implemented a flexible GraphQL API system for efficient data queries and minimal network overhead
• Hardened Security with Google Sign-In, Auth0, JWT Tokens for bulletproof authentication
• Engineered an anonymous posting feature supported by Google’s location services(Geolocation)
• Automated deployment on Digital Ocean Cloud to provide 24/7 uptime. Uploaded the app on Google Play Store
OmegaStock Pro
• Crafted a stock market analysis platform, harmonizing Python’s data analytics with React.js user-friendly interface
• Achieved a 4% boost in predictive accuracy through machine learning
• Deployed REST APIs using FastAPI to power the React frontend with real-time market data updates
Skills
Languages: Java, Python, C, SQL (Postgres), JavaScript, HTML, CSS, TypeScript
Frameworks: React, React Native, NodeJS, JUnit, FastAPI, MongoDB, PostgreSQL, Google Cloud, Amazon AWS Developer Tools: Git, Docker, Google Cloud, IntelliJ, Postman, Android Studio
Other Skills: Attention to detail, Focus, Team Work, Problem Solving and Analytical Skills, Writing Skills
Courses and Certifications
Algorithms Specialization: Stanford University (Coursera - 12 weeks) Crafting Quality Code: University of Toronto (Coursera - 12 weeks)
`;

