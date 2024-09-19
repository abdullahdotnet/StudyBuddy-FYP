import React, { useState } from 'react';
import { YoutubeAPIKey } from '../../../credentials';
import './Extras.css';

const Extras = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState([]);
  const apiKey = YoutubeAPIKey; // Replace with your YouTube API key
  const apiUrl = 'https://www.googleapis.com/youtube/v3/search';

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    const params = {
      part: 'id,snippet',
      q: searchTerm,
      maxResults: 4,
      type: 'video',
      key: apiKey
    };

    const response = await fetch(`${apiUrl}?${new URLSearchParams(params).toString()}`);
    const data = await response.json();
    setVideos(data.items);
  };

  return (
    <div className="extras-container">
      <div className="search-container">
        <input
          type="text"
          id="search-input"
          placeholder="Search YouTube..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button id="search-btn" onClick={handleSearch}>Search</button>
      </div>
      <div className="results-container">
        {videos.map((video) => (
          <div key={video.id.videoId} className="video-card">
            <div className="video-container">
              <iframe
                className="video-iframe"
                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                // frameBorder={0}
                allowFullScreen={true}
                allow="fullscreen"
              />
            </div>
            <p className="video-title">{video.snippet.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Extras;