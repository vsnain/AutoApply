export async function getActiveTab() {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        resolve(tabs);
      });
    });
  }
  
  export async function openJobTab(jobUrl) {
    const currentTab = await getActiveTab();
  
    try {
      const jobTab = await chrome.tabs.create({ url: jobUrl });
      await chrome.tabs.update(jobTab.id, { active: true }); // Activate the newly created tab
      currentTab && (await chrome.tabs.remove(currentTab[0].id)); // Close the current tab if it exists
      chrome.runtime.sendMessage({ type: 'tabLoaded' });
    } catch (err) {
      console.error("Error at openJobTab:", err);
    }
  }
  
  export async function executeScriptWithDelay(tabId, func, ...args) {
    await chrome.scripting.executeScript({
      target: { tabId },
      func,
      args
    });
    console.log("Script done");
  }


  export async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  export function simulateMouseEvent(element, eventName, coordX, coordY) {
    element.dispatchEvent(new MouseEvent(eventName, {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: coordX,
      clientY: coordY,
      button: 0
    }));
  }
  
  export async function moveMouseTo(element) {
    const rect = element.getBoundingClientRect();
    const coordX = rect.left + (rect.right - rect.left) / 2;
    const coordY = rect.top + (rect.bottom - rect.top) / 2;
  
    simulateMouseEvent(element, "mousedown", coordX, coordY);
    simulateMouseEvent(element, "mouseup", coordX, coordY);
    simulateMouseEvent(element, "click", coordX, coordY);
  }