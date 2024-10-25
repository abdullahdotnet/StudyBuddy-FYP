import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";

const App = () => {
  const [note, setNote] = useState('');
  const [screenshotsAndNotes, setScreenshotsAndNotes] = useState([]);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    restoreScreenshotsAndNotes();
  }, []);

  const takeScreenshot = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.runtime.sendMessage({ action: 'takeScreenshot', tabId: tabs[0].id }, (response) => {
        if (response.error) {
          console.error(response.error);
          alert(response.error);
        } else {
          addScreenshotOrNote(response.screenshotUrl, response.time, 'screenshot');
        }
      });
    });
  };

  const addNote = () => {
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
          addScreenshotOrNote(response.note, response.time, 'note');
          setNote('');
        }
      });
    });
  };

  const addScreenshotOrNote = (content, time, type) => {
    const newItem = { content, time, type };
    setScreenshotsAndNotes(prev => [...prev, newItem]);
    localStorage.setItem('screenshotsAndNotes', JSON.stringify([...screenshotsAndNotes, newItem]));
  };

  const restoreScreenshotsAndNotes = () => {
    const savedItems = JSON.parse(localStorage.getItem('screenshotsAndNotes')) || [];
    setScreenshotsAndNotes(savedItems);
    const savedSummary = localStorage.getItem('summary') || '';
    setSummary(savedSummary);
  };

  const clearAll = () => {
    setScreenshotsAndNotes([]);
    setSummary('');
    localStorage.removeItem('screenshotsAndNotes');
    localStorage.removeItem('summary');
  };

  const getSummary = async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
      let activeTab = tabs[0];
      let youtubeUrl = activeTab.url;

      if (youtubeUrl.includes("youtube.com/watch")) {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/yt-summary/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ youtube_url: youtubeUrl })
          });

          const data = await response.json();
          setSummary(data.summary);
          localStorage.setItem('summary', data.summary);

        } catch (error) {
          console.error('Error fetching summary:', error);
          setSummary('Failed to fetch summary.');
        }
      } else {
        setSummary('This is not a YouTube video page.');
      }
    });
  };

  const saveAsPDF = async () => {
    const doc = new jsPDF();

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const videoTitle = tabs[0].title;
      const videoUrl = tabs[0].url;
      let y = 10;

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 255);
      doc.textWithLink(videoTitle, 10, y, { url: videoUrl });
      y += 10;

      for (const [index, item] of screenshotsAndNotes.entries()) {
        if (item.type === 'note') {
          const noteText = `Note ${index + 1}: ${item.content}`;
          const noteLines = doc.splitTextToSize(noteText, 180);
          doc.text(noteLines, 10, y);
          y += noteLines.length * 10;
        } else if (item.type === 'screenshot') {
          const screenshotText = `Screenshot ${index + 1}`;
          doc.text(screenshotText, 10, y);
          y += 10;
          await new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = item.content;
            img.onload = function () {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              const dataUrl = canvas.toDataURL('image/jpeg');
              doc.addImage(dataUrl, 'JPEG', 10, y, 180, 100);
              y += 110;
              resolve();
            };
          });
        }

        doc.setTextColor(0, 0, 255);
        doc.textWithLink(`${item.time.toFixed(2)} seconds`, 10, y, {
          url: `${videoUrl}&t=${Math.floor(item.time)}s`,
        });
        doc.setTextColor(0, 0, 0);
        y += 10;

        if (y > 270) {
          doc.addPage();
          y = 10;
        }
      }

      if (summary) {
        doc.addPage();
        doc.setFontSize(16);
        doc.text('Video Summary:', 10, 10);
        const summaryLines = doc.splitTextToSize(summary, 180);
        doc.setFontSize(12);
        doc.text(summaryLines, 10, 20);
      }

      doc.save(`${videoTitle}.pdf`);
    });
  };

  return (
    <div>
      <h3>YouTube Screenshot & Note</h3>
      <div>
        <button onClick={getSummary}>Summarize</button>
        <button onClick={clearAll}>Clear</button>
        <button onClick={saveAsPDF}>Save PDF</button>
      </div>
      <div>
        <input 
          type="text" 
          value={note} 
          onChange={(e) => setNote(e.target.value)} 
          placeholder="Add a note"
        />
        <button onClick={addNote}>Add Note</button>
        <button onClick={takeScreenshot}>Take Screenshot</button>
      </div>
      <h4>Screenshots & Notes</h4>
      <div>
        {screenshotsAndNotes.map((item, index) => (
          <div key={index}>
            {item.type === 'screenshot' ? (
              <img src={item.content} alt={`Screenshot ${index}`} style={{width: '100%'}} />
            ) : (
              <p>{item.content}</p>
            )}
            <p>Time: {item.time.toFixed(2)} seconds</p>
          </div>
        ))}
      </div>
      <div>
        <h4>Summary</h4>
        <p>{summary}</p>
      </div>
    </div>
  );
};

export default App;