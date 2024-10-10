import React from 'react';

function FormatPaper({ paper }) {
  if (!paper) return <div>No paper data available.</div>;

  return (
    <div>
      {paper.split('\n').map((line, index) => {
        if (line.trim() === '') return null; // Skip empty lines

        if (line.startsWith('**')) {
          return <h1 key={index}>{line.replace('**', '')}</h1>;
        } else if (line.startsWith('Section')) {
          return <h2 key={index}>{line}</h2>;
        } else if (line.startsWith('Part')) {
          return <h3 key={index}>{line}</h3>;
        } else if (line.match(/^\d+\. /)) {
          return <p key={index}><b>{line}</b></p>;
        } else {
          return <p key={index}>{line}</p>;
        }
      })}
    </div>
  );
}

export default FormatPaper;