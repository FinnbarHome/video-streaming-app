import React, { useState, useEffect } from 'react';
import styles from './Watchlist.module.css';
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

const Watchlist: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const userId = localStorage.getItem('userId');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!userId) return;
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiFetch<Video[]>(`/users/${userId}/watchlist`);
        setVideos(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load watchlist.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchWatchlist();
  }, [userId]);

  // Removes a single video from watchlist
  const removeFromWatchlist = async (videoId: string) => {
    if (!userId) return;
    try {
      setError(null);
      await apiFetch(`/users/${userId}/watchlist/${videoId}`, {
        method: 'DELETE',
      });
      // Update local state: filter out the removed video
      setVideos((prev) => prev.filter((vid) => vid._id !== videoId));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to remove video.');
      }
    }
  };

  return (
    <div className={styles.watchlistPage}>
      <NavBar />

      <div className={styles.content}>
        <h2>My Watchlist</h2>
        {error && (
          <InlineAlert title="Watchlist" message={error} variant="danger" />
        )}
        {isLoading ? (
          <Spinner label="Loading watchlist" />
        ) : videos.length === 0 ? (
          <p>No videos in your watchlist yet.</p>
        ) : (
          <div className={styles.gridContainer}>
            {videos.map((video) => (
              <div key={video._id} className={styles.gridItem}>
                <img src={video.thumbnailUrl} alt={video.videoName} />
                <h3>{video.videoName}</h3>
                <p>{video.videoDescription}</p>
                <button
                  type="button"
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
