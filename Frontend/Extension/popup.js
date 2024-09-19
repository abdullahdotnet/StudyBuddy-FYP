document.getElementById('screenshotBtn').addEventListener('click', async () => {
  const time = document.getElementById('timeInput').value;
  
  if (time) {
    // Send a message to the background script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: takeScreenshotAtTime,
        args: [time]
      });
    });
  } else {
    alert('Please enter a valid time.');
  }
});

function takeScreenshotAtTime(time) {
  const video = document.querySelector('video');
  if (!video) {
    alert('No video element found on this page.');
    return;
  }

  // Set the video to the desired time
  video.currentTime = time;

  // Wait until the video reaches the specified time
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
}
