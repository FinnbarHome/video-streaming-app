import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './Dashboard.module.css';
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

const Dashboard: React.FC = () => {
  const userId = localStorage.getItem('userId');

  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // For search
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [isSavingWatchlist, setIsSavingWatchlist] = useState(false);
  const [watchlistMessage, setWatchlistMessage] = useState<string | null>(null);

  // Fetch videos on mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const data = await apiFetch<Video[]>('/videos');
        setVideos(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setLoadError(err.message);
        } else {
          setLoadError('Failed to load videos.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, []);

  useEffect(() => {
    if (!selectedVideo) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedVideo(null);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedVideo]);

  // Add to watch history
  const handleThumbnailClick = async (video: Video) => {
    setSelectedVideo(video);
    setWatchlistMessage(null);
    try {
      if (userId) {
        await apiFetch(`/users/${userId}/history`, {
          method: 'POST',
          body: JSON.stringify({ videoId: video._id }),
        });
      }
    } catch {}
  };

  // Close modal
  const closeDetailModal = () => {
    setSelectedVideo(null);
  };

  // Add to watchlist
  const handleAddToWatchlist = async () => {
    if (!selectedVideo || !userId) return;
    try {
      setIsSavingWatchlist(true);
      setWatchlistMessage(null);
      await apiFetch(`/users/${userId}/watchlist`, {
        method: 'POST',
        body: JSON.stringify({ videoId: selectedVideo._id }),
      });
      setWatchlistMessage('Added to watchlist.');
    } catch (err) {
      if (err instanceof ApiError) {
        setWatchlistMessage(err.message);
      } else {
        setWatchlistMessage('Failed to add to watchlist.');
      }
    } finally {
      setIsSavingWatchlist(false);
    }
  };

  // Handle search
  const handleSearch = async () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      setSearchResults([]);
      setHasSearched(false);
      setSearchError(null);
      return;
    }
    try {
      setIsSearching(true);
      setSearchError(null);
      setHasSearched(true);
      const data = await apiFetch<Video[]>(
        `/videos/search?query=${encodeURIComponent(trimmed)}`,
      );
      setSearchResults(data);
    } catch (error) {
      if (error instanceof ApiError) {
        setSearchError(error.message);
      } else {
        setSearchError('Search failed.');
      }
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Clear search & results, then go home
  const handleHomeClick = () => {
    setSearchTerm('');
    setSearchResults([]);
    setHasSearched(false);
    setSearchError(null);
  };

  // Slick settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className={styles.dashboard}>
      <NavBar
        onHomeClick={handleHomeClick}
        rightSlot={
          <div className={styles.searchRow}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
            <button
              type="button"
              className={styles.searchButton}
              onClick={handleSearch}
              disabled={isSearching}
            >
              Search
            </button>
          </div>
        }
      />

      {loadError && (
        <InlineAlert
          title="Couldn’t load videos"
          message={loadError}
          variant="danger"
        />
      )}

      {isLoading ? (
        <Spinner label="Loading videos" />
      ) : hasSearched ? (
        <>
          <div className={styles.content}>
            <h2>Search Results</h2>
            {searchError ? (
              <p>{searchError}</p>
            ) : (
              <p>
                Found {searchResults.length} videos for:{' '}
                <b>{searchTerm.trim()}</b>
              </p>
            )}
          </div>
          <div className={styles.grid}>
            <div className={styles.gridContainer}>
              {searchResults.length === 0 ? (
                <div className={styles.emptyState}>
                  {isSearching ? 'Searching…' : 'No videos found.'}
                </div>
              ) : (
                searchResults.map((video) => (
                  <div
                    className={styles.gridCard}
                    key={video._id}
                    onClick={() => handleThumbnailClick(video)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleThumbnailClick(video);
                    }}
                  >
                    <img src={video.thumbnailUrl} alt={video.videoName} />
                    <div className={styles.cardMeta}>
                      <h3 className={styles.cardTitle}>{video.videoName}</h3>
                      <p className={styles.cardDesc}>
                        {video.videoDescription}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.content}>
            <h2>Welcome to The Streamy Place</h2>
            <p>Start exploring your favorite videos!</p>
          </div>

          {videos.length > 0 && (
            <div className={styles.carousel}>
              <h3 className={styles.sectionTitle}>Top Picks for You</h3>
              <Slider {...sliderSettings}>
                {videos.map((video) => (
                  <div
                    key={video._id}
                    className={styles.carouselItem}
                    onClick={() => handleThumbnailClick(video)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleThumbnailClick(video);
                    }}
                  >
                    <img src={video.thumbnailUrl} alt={video.videoName} />
                  </div>
                ))}
              </Slider>
            </div>
          )}

          <div className={styles.grid}>
            <h3 className={styles.sectionTitle}>Browse Other Videos</h3>
            {videos.length === 0 ? (
              <div className={styles.emptyState}>No videos available.</div>
            ) : (
              <div className={styles.gridContainer}>
                {videos.map((video) => (
                  <div
                    className={styles.gridItem}
                    key={video._id}
                    onClick={() => handleThumbnailClick(video)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleThumbnailClick(video);
                    }}
                  >
                    <img src={video.thumbnailUrl} alt={video.videoName} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {selectedVideo && (
        <div
          className={styles.modalOverlay}
          onClick={closeDetailModal}
          role="presentation"
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedVideo.videoName}</h2>
            <p>{selectedVideo.videoDescription}</p>
            <video
              src={selectedVideo.videoUrl}
              controls
              style={{ width: '100%', marginTop: '20px' }}
            />
            {watchlistMessage && (
              <div className={styles.modalMessage}>{watchlistMessage}</div>
            )}
            <button
              onClick={handleAddToWatchlist}
              style={{ marginTop: '10px', marginRight: '10px' }}
              disabled={isSavingWatchlist}
            >
              {isSavingWatchlist ? 'Adding…' : 'Add to Watchlist'}
            </button>
            <button onClick={closeDetailModal} style={{ marginTop: '10px' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
