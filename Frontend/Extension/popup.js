document.addEventListener('DOMContentLoaded', restoreScreenshotsAndNotes);


function convertSecondsToHMS(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  // Prepare the formatted components
  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  // Construct the result based on what's present
  let result = '';

  if (hours > 0) {
    result += `${paddedHours}:`;
  }
  
  if (minutes > 0 || hours > 0) { // Show minutes if there are hours or if minutes are > 0
    result += `${paddedMinutes}:`;
  }

  result += paddedSeconds; // Always show seconds

  return result;
}

document.getElementById('screenshotBtn').addEventListener('click', async () => {
  takeScreenshot();
});
document.addEventListener('keydown', (event) => {
  // Check if Ctrl (or Command on Mac) + S is pressed
  if ((event.ctrlKey || event.metaKey) && event.key === 's') {
    event.preventDefault(); // Prevent default save dialog
    takeScreenshot(); // Call the screenshot function
  }
});


function takeScreenshot() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.runtime.sendMessage({ action: 'takeScreenshot', tabId: tabs[0].id }, (response) => {
      if (response.error) {
        console.error(response.error);
        alert(response.error); 
      } else {
        addScreenshotToPopup(response.screenshotUrl, response.time);
        saveScreenshotToLocalStorage(response.screenshotUrl, response.time);
      }
    });
  });
}
document.getElementById('addNoteBtn').addEventListener('click', async () => {
  addNote();
});

// Function to add a note
function addNote() {
  const note = document.getElementById('noteInput').value;

  if (!note) {
    alert('Please enter a note.');
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.runtime.sendMessage({ action: 'addNote', note: note, tabId: tabs[0].id }, (response) => {
      if (response.error) {
        console.error(response.error);
        alert(response.error); 
      } else {
        addNoteToPopup(response.note, response.time);
        saveNoteToLocalStorage(response.note, response.time);
      }
    });
  });

  // Clear the input field after adding the note
  document.getElementById('noteInput').value = ''; 
}

// Add event listener for the Enter key
document.getElementById('noteInput').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent the default action (form submission, etc.)
    addNote(); // Call the addNote function
  }
});


document.getElementById('clearBtn').addEventListener('click', clearAllScreenshotsAndNotes);
document.getElementById('saveBtn').addEventListener('click', saveAsPDF);


function saveSummaryToLocalStorage(summary,bullets) {
  localStorage.setItem('summary', summary);
  localStorage.setItem('bullets', bullets);

}

function formatSummaryToHTML(summaryText) {
  let formattedSummary = summaryText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  formattedSummary = formattedSummary.replace(/\n/g, '<br>');

  formattedSummary = formattedSummary.replace(/-\s(.*?)<br>/g, '<li>$1</li>'); 
  formattedSummary = formattedSummary.replace(/<br>\*\*Key Themes:\*\*<br>/g, '<br><strong>Key Themes:</strong><ul>');
  formattedSummary = formattedSummary.replace(/<\/li><br>/g, '</li>'); 
  formattedSummary += '</ul>';  

  return formattedSummary;
}

document.getElementById('summaryBtn').addEventListener('click', async () => {
  const summaryBtn = document.getElementById('summaryBtn');
  const summaryResult = document.getElementById('summaryResult');

  // Change button to loading state
  summaryBtn.disabled = true;
  summaryBtn.textContent = 'Loading...'; // Update button text to "Loading..."
  summaryResult.innerHTML = ''; // Clear any previous summary result

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

        // Get the summary from the response
        const data = await response.json();
        console.log(data);
        saveSummaryToLocalStorage(data.summary,data.bullets);

        // Display the summary in the popup as HTML
        summaryResult.innerHTML = formatSummaryToHTML(data.summary);
        summaryBullets.innerHTML = formatSummaryToHTML(data.bullets);

        // Save the summary to localStorage
        // localStorage.setItem('youtubeSummary', data.summary);
        // localStorage.setItem('youtubeSummaryBullets', data.bullets);
      } catch (error) {
        console.error('Error fetching summary:', error);
        summaryResult.innerText = 'Failed to fetch summary.';
      } finally {
        // Restore button state after the request is complete
        summaryBtn.disabled = false;
        summaryBtn.textContent = 'Summary'; // Reset button text to original
      }
    } else {
      summaryResult.innerText = 'This is not a YouTube video page.';
      // Restore button state if not a YouTube video
      summaryBtn.disabled = false;
      summaryBtn.textContent = 'Get Summary';
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
  
  // Wait for the image to load before scrolling
  img.onload = () => {
    screenshotNoteContainer.scrollTo({
      top: screenshotNoteContainer.scrollHeight,
      behavior: 'smooth'
    });

    if (outerScrollContainer) {
      outerScrollContainer.scrollTo({
        top: outerScrollContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  };
  
  div.appendChild(img);

  const timestamp = document.createElement('p');
  timestamp.classList.add('timestamp');
  timestamp.textContent = convertSecondsToHMS(time);
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
  timestamp.textContent = `${convertSecondsToHMS(time)}`;
  div.appendChild(timestamp);

  screenshotNoteContainer.appendChild(div);

  // Scroll to the newly added note
  screenshotNoteContainer.scrollTo({
    top: screenshotNoteContainer.scrollHeight,
    behavior: 'smooth' // Enables smooth scrolling
  });
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
  const savedBullets = localStorage.getItem('bullets') || '';

  savedScreenshots.forEach((screenshot) => {
    addScreenshotToPopup(screenshot.screenshotUrl, screenshot.time);
  });

  savedNotes.forEach((note) => {
    addNoteToPopup(note.note, note.time);
  });

  // Restore the summary if it exists
  if (savedSummary) {
    document.getElementById('summaryResult').innerHTML = formatSummaryToHTML(savedSummary);
    document.getElementById('summaryBullets').innerHTML = formatSummaryToHTML(savedBullets);
  }
}



// Clear all screenshots and notes
function clearAllScreenshotsAndNotes() {
  // Clear the popup
  document.getElementById('screenshotNoteContainer').innerHTML = '';
  document.getElementById('summaryResult').innerHTML = '';
  document.getElementById('summaryBullets').innerHTML = '' // Clear the summary from the UI
  
  // Clear from localStorage
  localStorage.removeItem('screenshots');
  localStorage.removeItem('notes');
  localStorage.removeItem('summary');
  localStorage.removeItem('bullets') // Clear the summary from localStorage
}



// Save screenshots and notes as PDF using jsPDF and optionally upload the file
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
      doc.setFontSize(16);
      doc.text('Video Summary:', 10, 10);

      const summaryLines = doc.splitTextToSize(savedSummary, 180);

      doc.setFontSize(12);
      doc.text(summaryLines, 10, 20);
    }

    // Generate the PDF file
    const pdfFile = doc.output('blob');
    const fileName = `${videoTitle}.pdf`;

    // Check if access token exists in localStorage
    const accessToken = localStorage.getItem('access');

    if (accessToken) {
      // If access token exists, upload the PDF using the token
      const formData = new FormData();
      formData.append('file', pdfFile, fileName);

      try {
        const response = await fetch('http://127.0.0.1:8000/api/userspace/upload/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`, // Pass the JWT token here
          },
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          console.log('File uploaded successfully:', result);
        } else {
          console.error('Failed to upload file:', response.statusText);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } 
      // just download the PDF
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


// Selecting necessary elements
const loginBtn = document.getElementById('loginBtn');
const backBtn = document.getElementById('backBtn');
const mainContent = document.getElementById('mainContent');
const loginContainer = document.getElementById('loginContainer');

// Show the login page and hide the main content
loginBtn.addEventListener('click', () => {
  mainContent.style.display = 'none';
  loginContainer.style.display = 'block';
});

// Go back to the main content and hide the login page
backBtn.addEventListener('click', () => {
  loginContainer.style.display = 'none';
  mainContent.style.display = 'block';
});


// Selecting necessary elements
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const submitLogin = document.getElementById('submitLogin');

// API endpoint for login
const apiUrl = 'http://127.0.0.1:8000/api/user/login/';

// Handle the login submission
submitLogin.addEventListener('click', async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  // Create the request body
  const requestBody = {
    email: email,
    password: password,
  };

  try {
    // Send the POST request to the API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // Parse the JSON response
    const data = await response.json();

    if (response.ok) {
      // Successfully logged in, store tokens in Chrome's local storage
      const refreshToken = data.token.refresh;
      const accessToken = data.token.access;
      alert('Login successful, tokens saved 1.');
      // Store tokens using chrome.storage.local
      // chrome.storage.local.set({ refreshToken, accessToken }, () => {
      //   console.log('Tokens saved successfully!');
      //   alert('Login successful, tokens saved 2.');
      // });
      localStorage.setItem('refresh',refreshToken);
      localStorage.setItem('access',accessToken);
      setTimeout(() => {
        console.log("tooooooooookens",localStorage.getItem('refresh'));
      },2000);

      // Optionally, you can redirect or switch views after successful login
      mainContent.style.display = 'block';
      loginContainer.style.display = 'none';
    } else {
      // Handle login errors (e.g., wrong credentials)
      alert(data.msg || 'Login failed. Please check your credentials.');
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('An error occurred while logging in. Please try again.');
  }
});


// chrome.storage.local.get(['refreshToken', 'accessToken'], (result) => {
//   console.log('Tokens retrieved:', result);
//   const refreshToken = result.refreshToken;
//   const accessToken = result.accessToken;

//   // Use the tokens for subsequent requests
//   if (accessToken) {
//     // Make API requests with the access token
//     fetch('http://127.0.0.1:8000/api/protected-route/', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${accessToken}`,
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => console.log('Protected data:', data))
//       .catch((error) => console.error('Error fetching protected data:', error));
//   } else {
//     console.error('No access token found.');
//   }
// });
