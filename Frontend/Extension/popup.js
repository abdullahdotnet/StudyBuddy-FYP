document.getElementById('screenshotBtn').addEventListener('click', async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.runtime.sendMessage({ action: 'takeScreenshot', tabId: tabs[0].id }, (response) => {
      if (response.error) {
        console.error(response.error);
        alert(response.error); // Show error alert if screenshot fails
      } else {
        addScreenshotToPopup(response.screenshotUrl, response.time);
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
      }
    });
  });

  document.getElementById('noteInput').value = ''; // Clear input field after adding the note
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
