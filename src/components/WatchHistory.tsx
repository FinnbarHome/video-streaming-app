// History.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WatchHistory.module.css';

interface Video {
  _id: string;
  videoName: string;
  videoDescription: string;
  videoUrl: string;
  thumbnailUrl: string;
}

const WatchHistory: React.FC = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) return;
      try {
        const response = await fetch(
          `http://localhost:3000/api/users/${userId}/history`
        );
        const data = await response.json();
        setVideos(data);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      }
    };
    fetchHistory();
  }, [userId]);

  // Clears entire watch history
  const clearHistory = async () => {
    if (!userId) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${userId}/history`,
        {
          method: 'DELETE',
        }
      );
      const data = await response.json();
      if (!response.ok) {
        console.error('Error clearing history:', data.error);
        return;
      }
      // Clear local state so UI updates
      setVideos([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  return (
    <div className={styles.historyPage}>
      <nav className={styles.navbar}>
        <div className={styles.navbarLeft}>
          <h1 className={styles.logo}>The Streamy Place</h1>
          <ul className={styles.navLinks}>
            <li onClick={() => navigate('/dashboard')}>Home</li>
            <li onClick={() => navigate('/watchlist')}>Watchlist</li>
            <li onClick={() => navigate('/watchhistory')}>Watch History</li>
          </ul>
        </div>
      </nav>

      <div className={styles.content}>
        <h2>My Watch History</h2>
        {/* Clear History Button */}
        {videos.length > 0 && (
          <button onClick={clearHistory} style={{ marginBottom: '20px' }}>
            Clear All History
          </button>
        )}

        {videos.length === 0 ? (
          <p>You haven’t watched any videos yet.</p>
        ) : (
          <div className={styles.gridContainer}>
            {videos.map((video) => (
              <div key={video._id} className={styles.gridItem}>
                <img src={video.thumbnailUrl} alt={video.videoName} />
                <h3>{video.videoName}</h3>
                <p>{video.videoDescription}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchHistory;
