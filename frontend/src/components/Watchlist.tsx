import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Watchlist.module.css';

interface Video {
  _id: string;
  videoName: string;
  videoDescription: string;
  videoUrl: string;
  thumbnailUrl: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Watchlist: React.FC = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!userId) return;
      try {
        const response = await fetch(
          `${API_BASE_URL}/users/${userId}/watchlist`,
        );
        const data = await response.json();
        setVideos(data);
      } catch (err) {
        console.error('Failed to fetch watchlist:', err);
      }
    };
    fetchWatchlist();
  }, [userId]);

  // Removes a single video from watchlist
  const removeFromWatchlist = async (videoId: string) => {
    if (!userId) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/users/${userId}/watchlist/${videoId}`,
        {
          method: 'DELETE',
        },
      );
      const data = await response.json();
      if (!response.ok) {
        console.error('Error removing from watchlist:', data.error);
        return;
      }
      // Update local state: filter out the removed video
      setVideos((prev) => prev.filter((vid) => vid._id !== videoId));
    } catch (err) {
      console.error('Failed to remove from watchlist:', err);
    }
  };

  return (
    <div className={styles.watchlistPage}>
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
        <h2>My Watchlist</h2>
        {videos.length === 0 ? (
          <p>No videos in your watchlist yet.</p>
        ) : (
          <div className={styles.gridContainer}>
            {videos.map((video) => (
              <div key={video._id} className={styles.gridItem}>
                <img src={video.thumbnailUrl} alt={video.videoName} />
                <h3>{video.videoName}</h3>
                <p>{video.videoDescription}</p>

                {/* Remove button */}
                <button
                  onClick={() => removeFromWatchlist(video._id)}
                  style={{ marginTop: '10px' }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
