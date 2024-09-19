// src/components/Extra2.js
import React from 'react';
import { useParams } from 'react-router-dom';
import './Extras.css'; // You can reuse the same CSS

const Extra2 = () => {
  const { videoId } = useParams();

  return (
    <div className="video-detail-container">
        <h1>Video</h1>
      <div className="video-container">
        <iframe
          className="video-iframe"
          src={`https://www.youtube.com/embed/${videoId}`}
          allowFullScreen={true}
          allow="fullscreen"
        />
      </div>
      <p>Additional video details or actions can go here.</p>
    </div>
  );
};

export default Extra2;
