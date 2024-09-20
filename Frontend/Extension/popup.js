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

  savedScreenshots.forEach((screenshot) => {
    addScreenshotToPopup(screenshot.screenshotUrl, screenshot.time);
  });

  savedNotes.forEach((note) => {
    addNoteToPopup(note.note, note.time);
  });
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
function saveAsPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 10; // Start position in the PDF for text

  const savedScreenshots = JSON.parse(localStorage.getItem('screenshots')) || [];
  const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];

  savedScreenshots.forEach((screenshot, index) => {
    doc.text(`Screenshot ${index + 1} - Time: ${screenshot.time.toFixed(2)} seconds`, 10, y);
    y += 10;

    // Add the screenshot to the PDF
    convertImageToDataUrl(screenshot.screenshotUrl, (dataUrl) => {
      doc.addImage(dataUrl, 'JPEG', 10, y, 180, 100); // Adjust size and position as needed
      y += 110;
      if (index === savedScreenshots.length - 1) {
        doc.save('notes_screenshots.pdf'); // Save the PDF when done
      }
    });
  });

  savedNotes.forEach((note, index) => {
    doc.text(`Note ${index + 1}: ${note.note}`, 10, y);
    y += 10;
  });

  if (savedNotes.length > 0) {
    doc.save('notes_screenshots.pdf'); // Save if only notes are present
  }
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
