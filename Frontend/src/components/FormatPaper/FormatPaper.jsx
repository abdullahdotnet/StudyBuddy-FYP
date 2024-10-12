import React from 'react';
import DOMPurify from 'dompurify';

// Function to format the paper with correct HTML tags
function formatPaper(paperText) {
  return paperText
    .replace(/\\*([^\\]*)\\*/g, '<strong>$1</strong>') // Bold text within asterisks
    .replace(/\n/g, '<br>') // Replace new lines with <br> tags
    .replace(/(\d+)\. /g, '<p>$1. ') // Numbered list items should be wrapped in <p>
    .replace(/\*\*(Problem Solving.*?)\*\*/g, '<h2>$1</h2>')
    .replace(/\*\*Section (.*?)\*\*/g, '<h3>Section $1</h3>') // Sections in <h3>
    .replace(/\*\*Part (.*?)\*\*/g, '<h4>Part $1</h4>') // Parts in <h4>
    .replace(/\*\*Choose any three questions\*\*/g, '<h5>Choose any three questions</h5>') // Wrap "Choose any three questions" in <h5>
    .replace(/\*\*(Question.*?)\*\*/g, '<h6>$1</h6>')
    .replace(/<br><br>/g, '<br>'); // Remove extra <br> tags
}

function FormatPaper({ paper }) {
  if (!paper) return <div>No paper data available.</div>;

  const formattedPaper = formatPaper(paper);
  const cleanHTML = DOMPurify.sanitize(formattedPaper, {
    ALLOWED_TAGS: ['strong', 'h2', 'h3', 'h4', 'h5', 'p', 'br'], // Allowed tags
  });

  return (
    <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />
  );
}

export default FormatPaper;
