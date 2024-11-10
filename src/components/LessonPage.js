import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios'; // Or use fetch
import { useUser } from '../hooks/userContext';

function LessonPage() {

  const { fileName } = useParams();
  const location = useLocation();
  const { fileUrl, email, courseId, lessonId } = location.state || {}; // Add courseId and lessonId for tracking
  console.log("Email ",email);
  const [error, setError] = useState(null);

  // Function to update lesson status (progress/completion)
  const updateLessonStatus = async (status) => {
    try {
      await axios.post(`http://localhost:5000/api/user/${email}/course/${courseId}/lesson/${lessonId}`, {
        status: status
      });
      console.log(`Lesson status updated to: ${status}`);
    } catch (err) {
      console.error("Error updating lesson status:", err);
    }
  };

  const getFileType = (url) => {
    if (!url) return 'unknown';

    const extension = url.split('.').pop().toLowerCase();

    if (['pdf'].includes(extension)) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'image';
    if (['mp4', 'webm', 'ogg'].includes(extension)) return 'video';
    if (['mp3', 'wav', 'ogg'].includes(extension)) return 'audio';

    return 'unknown';
  };

  const fileType = getFileType(fileUrl);

  const renderFile = () => {
    if (!fileUrl) return null;

    switch (fileType) {
      case 'pdf':
        return (
          <iframe
            src={fileUrl}
            width="100%"
            height="600px"
            style={{ border: 'none' }}
            title="PDF Preview"
            onLoad={() => updateLessonStatus('in progress')}
            onError={() => setError('Failed to load PDF.')}
          />
        );
      case 'image':
        return (
          <img
            src={fileUrl}
            alt="Preview"
            style={{ width: '100%', height: 'auto', maxHeight: '600px' }}
            onLoad={() => updateLessonStatus('completed')}
            onError={() => setError('Failed to load image.')}
            onContextMenu={(e) => e.preventDefault()} // Disable right-click
          />
        );
      case 'video':
        return (
          <video
            src={fileUrl}
            controls
            width="100%"
            height="auto"
            onPlay={() => updateLessonStatus('in progress')} // Update status to 'in progress' on play
            onEnded={() => updateLessonStatus('completed')}  // Update status to 'completed' when video ends
            onContextMenu={(e) => e.preventDefault()}
            onError={() => setError('Failed to load video.')}
            controlsList="nodownload" // Prevent download option in controls
          />
        );
      case 'audio':
        return (
          <audio
            src={fileUrl}
            controls
            width="100%"
            onPlay={() => updateLessonStatus('in progress')} // Track progress for audio
            onEnded={() => updateLessonStatus('completed')}  // Mark as 'completed' on audio end
            onError={() => setError('Failed to load audio.')}
            onContextMenu={(e) => e.preventDefault()}
            controlsList="nodownload" // Prevent download option in controls
          />
        );
      default:
        return <p>Unsupported file type.</p>;
    }
  };

  return (
    <div>
      <h1>File Preview</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {renderFile()}
    </div>
  );
}

export default LessonPage;
