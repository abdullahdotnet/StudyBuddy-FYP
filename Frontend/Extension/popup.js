document.addEventListener('DOMContentLoaded', restoreScreenshotsAndNotes);

document.getElementById('screenshotBtn').addEventListener('click', async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.runtime.sendMessage({ action: 'takeScreenshot', tabId: tabs[0].id }, (response) => {
      if (response.error) {
        console.error(response.error);
        alert(response.error); // Show error alert if screenshot fails
      } else {
        addScreenshotToPopup(response.screenshotUrl, response.time);
        saveScreenshotToLocalStorage(response.screenshotUrl, response.time);
      }
    });
  });
});

document.getElementById('addNoteBtn').addEventListener('click', async () => {
  const note = document.getElementById('noteInput').value;

  if (!note) {
    alert('Please enter a note.');
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.runtime.sendMessage({ action: 'addNote', note: note, tabId: tabs[0].id }, (response) => {
      if (response.error) {
        console.error(response.error);
        alert(response.error); // Show error alert if adding note fails
      } else {
        addNoteToPopup(response.note, response.time);
        saveNoteToLocalStorage(response.note, response.time);
      }
    });
  });

  document.getElementById('noteInput').value = ''; // Clear input field after adding the note
});

document.getElementById('clearBtn').addEventListener('click', clearAllScreenshotsAndNotes);
document.getElementById('saveBtn').addEventListener('click', saveAsPDF);


function saveSummaryToLocalStorage(summary) {
  localStorage.setItem('summary', summary);
}

document.getElementById('summaryBtn').addEventListener('click', async () => {
  // Get the current active tab
  chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
      let activeTab = tabs[0];
      let youtubeUrl = activeTab.url;

      
      // Check if the current tab is a YouTube video
      if (youtubeUrl.includes("youtube.com/watch")) {
          try {
              // Send POST request to API
              const response = await fetch('http://127.0.0.1:8000/api/yt-summary/', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ youtube_url: youtubeUrl })
              });

              // Save summary to localStorage
             

              // Get the summary from the response
              const data = await response.json();
              saveSummaryToLocalStorage(data.summary);
              // alert(data)
              // Display the summary in the popup
              document.getElementById('summaryResult').innerText = data.summary;
              // Save the summary to local storage
              localStorage.setItem('youtubeSummary', data.summary);

              // Optionally save the summary as a PDF (if you're generating PDF in the background)
              // chrome.runtime.sendMessage({
              //     action: 'saveToPDFSummary',
              //     summary: data.summary,
              //     url: youtubeUrl
              // });

          } catch (error) {
              console.error('Error fetching summary:', error);
              document.getElementById('summaryResult').innerText = 'Failed to fetch summary.';
          }
      } else {
          document.getElementById('summaryResult').innerText = 'This is not a YouTube video page.';
      }
  });
});

// Function to add a screenshot to the popup in real-time
function addScreenshotToPopup(screenshotUrl, time) {
  const screenshotNoteContainer = document.getElementById('screenshotNoteContainer');

  const div = document.createElement('div');
  div.classList.add('screenshot-note');

  const img = document.createElement('img');
  img.src = screenshotUrl;
  img.classList.add('screenshot');
  div.appendChild(img);

  const timestamp = document.createElement('p');
  timestamp.classList.add('timestamp');
  timestamp.textContent = `Time: ${time.toFixed(2)} seconds`;
  div.appendChild(timestamp);

  screenshotNoteContainer.appendChild(div);
}

// Function to add a note to the popup in real-time
function addNoteToPopup(note, time) {
  const screenshotNoteContainer = document.getElementById('screenshotNoteContainer');

  const div = document.createElement('div');
  div.classList.add('screenshot-note');

  const noteElement = document.createElement('p');
  noteElement.classList.add('note');
  noteElement.textContent = note;
  div.appendChild(noteElement);

  const timestamp = document.createElement('p');
  timestamp.classList.add('timestamp');
  timestamp.textContent = `Time: ${time.toFixed(2)} seconds`;
  div.appendChild(timestamp);

  screenshotNoteContainer.appendChild(div);
}

// Save screenshot and note to localStorage
function saveScreenshotToLocalStorage(screenshotUrl, time) {
  let savedScreenshots = JSON.parse(localStorage.getItem('screenshots')) || [];
  savedScreenshots.push({ screenshotUrl, time });
  localStorage.setItem('screenshots', JSON.stringify(savedScreenshots));
}

function saveNoteToLocalStorage(note, time) {
  let savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
  savedNotes.push({ note, time });
  localStorage.setItem('notes', JSON.stringify(savedNotes));
}

// Restore screenshots and notes from localStorage when popup is opened
function restoreScreenshotsAndNotes() {
  const savedScreenshots = JSON.parse(localStorage.getItem('screenshots')) || [];
  const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
  const savedSummary = localStorage.getItem('summary') || '';

  savedScreenshots.forEach((screenshot) => {
    addScreenshotToPopup(screenshot.screenshotUrl, screenshot.time);
  });

  savedNotes.forEach((note) => {
    addNoteToPopup(note.note, note.time);
  });

  // Restore the summary if it exists
  if (savedSummary) {
    document.getElementById('summaryResult').innerText = savedSummary;
  }
}

// Clear all screenshots and notes
function clearAllScreenshotsAndNotes() {
  // Clear the popup
  document.getElementById('screenshotNoteContainer').innerHTML = '';
  
  // Clear from localStorage
  localStorage.removeItem('screenshots');
  localStorage.removeItem('notes');
}

// Save screenshots and notes as PDF using jsPDF
async function saveAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const videoTitle = tabs[0].title;
    const videoUrl = tabs[0].url;
    let y = 10; // Start position in the PDF for text
    const pageHeight = 270; // Define the page height threshold for better page breaks

    // Add the video title at the top and make it clickable
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 255);
    doc.textWithLink(videoTitle, 10, y, { url: videoUrl });
    y += 10;

    const savedScreenshots = JSON.parse(localStorage.getItem('screenshots')) || [];
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    const savedSummary = localStorage.getItem('summary') || '';

    // Combine screenshots and notes into a single array and sort by timestamp
    const combinedContent = [];

    savedScreenshots.forEach((screenshot) => {
      combinedContent.push({ type: 'screenshot', data: screenshot });
    });

    savedNotes.forEach((note) => {
      combinedContent.push({ type: 'note', data: note });
    });

    combinedContent.sort((a, b) => a.data.time - b.data.time);

    // Process each item (note or screenshot) in the combined content
    for (const [index, item] of combinedContent.entries()) {
      if (item.type === 'note') {
        const noteText = `Note ${index + 1}: ${item.data.note}`;
        const noteLines = doc.splitTextToSize(noteText, 180);

        if (y + noteLines.length * 10 + 10 > pageHeight) {
          doc.addPage();
          y = 10;
        }

        doc.text(noteLines, 10, y);
        y += noteLines.length * 10;

        doc.setTextColor(0, 0, 255);
        doc.textWithLink(`${item.data.time.toFixed(2)} seconds`, 10, y, {
          url: `${videoUrl}&t=${Math.floor(item.data.time)}s`,
        });
        doc.setTextColor(0, 0, 0);
        y += 10;

      } else if (item.type === 'screenshot') {
        const screenshotText = `Screenshot ${index + 1}`;
        
        if (y + 110 + 10 > pageHeight) {
          doc.addPage();
          y = 10;
        }

        doc.text(screenshotText, 10, y);
        y += 10;

        await new Promise((resolve) => {
          convertImageToDataUrl(item.data.screenshotUrl, (dataUrl) => {
            doc.addImage(dataUrl, 'JPEG', 10, y, 180, 100);
            y += 110;

            doc.setTextColor(0, 0, 255);
            doc.textWithLink(`${item.data.time.toFixed(2)} seconds`, 10, y, {
              url: `${videoUrl}&t=${Math.floor(item.data.time)}s`,
            });
            doc.setTextColor(0, 0, 0);
            y += 10;

            resolve();
          });
        });
      }
    }

    // Add the summary at the end of the PDF
    if (savedSummary) {
      doc.addPage();
      doc.setFontSize(12);
      doc.text('Video Summary:', 10, 10);
      const summaryLines = doc.splitTextToSize(savedSummary, 180);
      doc.text(summaryLines, 10, 20);
    }

    // Save the PDF
    const fileName = `${videoTitle}.pdf`;
    doc.save(fileName);
  });
}


// Utility function to convert image URL to Data URL
function convertImageToDataUrl(url, callback) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = url;
  img.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    callback(dataUrl);
  };
}
