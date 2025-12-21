import React, { useState, useEffect } from 'react';
import styles from './WatchHistory.module.css';
import NavBar from './NavBar';
import Spinner from './ui/Spinner';
import InlineAlert from './ui/InlineAlert';
import { apiFetch, ApiError } from '../lib/api';

interface Video {
  _id: string;
  videoName: string;
  videoDescription: string;
  videoUrl: string;
  thumbnailUrl: string;
}

const WatchHistory: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const userId = localStorage.getItem('userId');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) return;
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiFetch<Video[]>(`/users/${userId}/history`);
        setVideos(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load watch history.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [userId]);

  // Clears entire watch history
  const clearHistory = async () => {
    if (!userId) return;
    try {
      setIsClearing(true);
      setError(null);
      await apiFetch(`/users/${userId}/history`, { method: 'DELETE' });
      // Clear local state so UI updates
      setVideos([]);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to clear watch history.');
      }
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className={styles.historyPage}>
      <NavBar />

      <div className={styles.content}>
        <h2>My Watch History</h2>
        {error && (
          <InlineAlert title="Watch History" message={error} variant="danger" />
        )}
        {videos.length > 0 && (
          <button
            type="button"
            onClick={clearHistory}
            style={{ marginBottom: '20px' }}
            disabled={isClearing}
          >
            {isClearing ? 'Clearing…' : 'Clear All History'}
          </button>
        )}

        {isLoading ? (
          <Spinner label="Loading watch history" />
        ) : videos.length === 0 ? (
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
