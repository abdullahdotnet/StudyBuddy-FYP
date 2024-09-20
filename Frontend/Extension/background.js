chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'takeScreenshot') {
      chrome.scripting.executeScript({
        target: { tabId: message.tabId },
        func: takeScreenshotAtCurrentTime
      }, (result) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        }
      });
    }
  });
  
  // Function to take a screenshot at the current video time
  function takeScreenshotAtCurrentTime() {
    const video = document.querySelector('video');
    if (!video) {
      alert('No video element found on this page.');
      return;
    }
  
    const time = video.currentTime;  // Get the current time of the video
  
    // Wait until the video reaches the current time
    video.addEventListener('seeked', function handler() {
      // Create a canvas to draw the video frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
  
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
      // Convert canvas to a data URL and open it in a new tab
      const screenshotUrl = canvas.toDataURL('image/png');
      const newTab = window.open();
      newTab.document.body.innerHTML = `<img src="${screenshotUrl}">`;
  
      video.removeEventListener('seeked', handler);
    }, { once: true });
  
    // Ensure the video is set to the correct time
    video.currentTime = time;
  }
  