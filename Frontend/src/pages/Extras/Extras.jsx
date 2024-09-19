import React, { useState, useRef } from 'react';

const Extras = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const iframeRef = useRef(null);
  const canvasRef = useRef(null);

  // Modify YouTube URL to embed format
  const getEmbedUrl = (url) => {
    const videoId = url.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  // Capture screenshot function (currently not working with iframe, to be replaced)
  const captureScreenshot = () => {
    setStatusMessage('Screenshot capturing is not supported for YouTube iframes.');
  };

  return (
    <div className="container mt-5">
      <h1>YouTube Timestamp Screenshot</h1>

      {/* Video URL Input */}
      <div className="mb-3">
        <input
          className="form-control"
          type="text"
          placeholder="Enter YouTube video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
      </div>

      {/* Display YouTube Video using iframe */}
      {videoUrl && (
        <div className="mb-3 text-center">
          <iframe
            ref={iframeRef}
            src={getEmbedUrl(videoUrl)}
            style={{ width: '100%', height: '360px' }}
            frameBorder="0"
            allowFullScreen
            title="YouTube Video"
          ></iframe>
        </div>
      )}

      {/* Button to Capture Screenshot */}
      {videoUrl && (
        <div className="text-center">
          <button className="btn btn-primary" onClick={captureScreenshot}>
            Capture Screenshot
          </button>
        </div>
      )}

      {/* Display Status Message */}
      {statusMessage && (
        <div className="alert alert-warning mt-3 text-center">
          {statusMessage}
        </div>
      )}

      {/* Display Captured Screenshot */}
      {screenshotUrl && (
        <div className="text-center mt-3">
          <a href={screenshotUrl} download="screenshot.png">
            <img
              src={screenshotUrl}
              alt="Screenshot"
              style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }}
            />
          </a>
        </div>
      )}

      {/* Hidden Canvas for Capturing the Screenshot */}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
};

export default Extras;
