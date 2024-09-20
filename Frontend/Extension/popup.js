document.getElementById('screenshotBtn').addEventListener('click', async () => {
  // Send a message to the background script to take a screenshot at the current video time
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.runtime.sendMessage({ action: 'takeScreenshot', tabId: tabs[0].id });
  });
});
