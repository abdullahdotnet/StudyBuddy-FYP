chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getVideoTime') {
      const video = document.querySelector('video');
      if (video) {
        sendResponse({time: video.currentTime});
      } else {
        sendResponse({time: 0});
      }
    }
  });