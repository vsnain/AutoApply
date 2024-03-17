import { delay, moveMouseTo } from './utils.js';

export async function openIndeedJobInNewTab(jobElement) {
  let jobTab;
  const spanElements = jobElement.querySelectorAll('span');

  let found = false;
  spanElements.forEach(span => {
    if (span.textContent.trim() === "Easily apply") {
      found = true;
    }
  });

  if (found) {
    console.log("Found: Easily apply");
    try {
      const jobAnchor = jobElement.querySelector('.jcs-JobTitle');

      if (!jobAnchor) {
        console.log('No job anchor found in the job element:', jobElement);
        return;
      }

      const jobUrl = jobAnchor.getAttribute('href');
      jobTab = window.open(jobUrl, '_blank');

      await new Promise(resolve => {
        jobTab.addEventListener('load', resolve);
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      const applyButton = jobTab.document.querySelector('[aria-label^="Apply now"]');

      if (applyButton.hasAttribute('href')) {
        jobTab.close();
      } else {
        await delay(500);
        await moveMouseTo(applyButton);
        await delay(4000);

        console.log("Looking for Continue");
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            const continueButton = Array.from(mutation.target.querySelectorAll('button'))
              .find(button => {
                console.log(button);
                const spanElement = button.querySelector('span');
                return spanElement && spanElement.textContent.trim() === 'Continue';
              });

            if (continueButton) {
              console.log("Continue button found:", continueButton);
              observer.disconnect();
            } else {
              console.log("Continue button not found.");
            }
          });
        });

        observer.observe(document, { childList: true, subtree: true });
        setTimeout(() => {
          observer.disconnect();
          console.log("Timed out while looking for Continue button.");
        }, 10000);
      }
    } catch (error) {
      console.error('An error occurred while opening a job listing:', error);
      if (jobTab) {
        jobTab.close();
      }
    }
  } else {
    console.log("Not found: Easily apply");
  }
}