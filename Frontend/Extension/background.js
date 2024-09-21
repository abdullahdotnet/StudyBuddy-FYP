let screenshotNotes = []; // Store screenshots and notes

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'takeScreenshot') {
    chrome.scripting.executeScript(
      {
        target: { tabId: message.tabId },
        func: takeScreenshotAtCurrentTime,
        args:[screenshotNotes]
      },
      (result) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          sendResponse({ error: chrome.runtime.lastError.message });
        } else if (result && result[0] && result[0].result) {
          sendResponse({ screenshotUrl: result[0].result.screenshotUrl, time: result[0].result.time });
        } else {
          sendResponse({ error: 'Failed to take screenshot. No result returned.' });
        }
      }
    );
    return true; // Indicates that the response is asynchronous
  } else if (message.action === 'addNote') {
    chrome.scripting.executeScript(
      {
        target: { tabId: message.tabId },
        func: logNoteWithTime,
        args: [screenshotNotes,message.note],
      },
      (result) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          sendResponse({ error: chrome.runtime.lastError.message });
        } else if (result && result[0] && result[0].result) {
          sendResponse({ note: result[0].result.note, time: result[0].result.time });
        } else {
          sendResponse({ error: 'Failed to log note. No result returned.' });
        }
      }
    );
    return true; // Indicates that the response is asynchronous
  } else if (message.action === 'getScreenshotNotes') {
    sendResponse(screenshotNotes); // Send all saved screenshots and notes
  }
});

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === 'saveToPDFSummary') {
//       // Use jsPDF or any other library to generate the PDF
//       const doc = new jsPDF();

//       // Add the summary to the PDF
//       doc.text("Video URL: " + message.url, 10, 10);
//       doc.text("Summary: " + message.summary, 10, 30);

//       // Save the PDF
//       doc.save('summary.pdf');
//   }
// });

// Function to take a screenshot at the current video time and return it to the popup
function takeScreenshotAtCurrentTime(screenshotNotes) {
  const video = document.querySelector('video');
  if (!video) {
    return { error: 'No video element found on this page.' };
  }

  const time = video.currentTime;

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const screenshotUrl = canvas.toDataURL('image/png');
  // console.log(screenshotUrl,time)
  // Store the screenshot and time
  screenshotNotes.push({
    screenshotUrl: screenshotUrl,
    time: time,
    note: null,
  });

  return { screenshotUrl: screenshotUrl, time: time };
}

// Function to log the note with the current video time and return it to the popup
function logNoteWithTime(screenshotNotes,note) {
  const video = document.querySelector('video');
  if (!video) {
    return { error: 'No video element found on this page.' };
  }

  const time = video.currentTime;

  // Store the note and time
  screenshotNotes.push({
    screenshotUrl: null,
    time: time,
    note: note,
  });

  return { note: note, time: time };
}
