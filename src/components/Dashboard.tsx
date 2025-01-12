import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './Dashboard.module.css';

interface Video {
  _id: string;
  videoName: string;
  videoDescription: string;
  videoUrl: string;
  thumbnailUrl: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // For search
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Video[]>([]);

  // Fetch videos on mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/videos');
        const data = await response.json();
        setVideos(data);
      } catch (err) {
        console.error('Failed to fetch videos:', err);
      }
    };
    fetchVideos();
  }, []);

  // Add to watch history
  const handleThumbnailClick = async (video: Video) => {
    setSelectedVideo(video);
    try {
      if (userId) {
        await fetch(`http://localhost:3000/api/users/${userId}/history`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId: video._id }),
        });
      }
    } catch (err) {
      console.error('Failed to add to history:', err);
    }
  };

  // Close modal
  const closeDetailModal = () => {
    setSelectedVideo(null);
  };

  // Add to watchlist
  const handleAddToWatchlist = async () => {
    if (!selectedVideo || !userId) return;
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}/watchlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: selectedVideo._id }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Error adding to watchlist:', data.error);
      } else {
        console.log('Successfully added to watchlist');
      }
    } catch (err) {
      console.error('Failed to add to watchlist:', err);
    }
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/api/videos/search?query=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search Error:', error);
    }
  };

  // Clear search & results, then go home
  const handleHomeClick = () => {
    setSearchTerm('');
    setSearchResults([]);
    navigate('/dashboard');
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
      { breakpoint: 768,  settings: { slidesToShow: 2 } },
      { breakpoint: 480,  settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className={styles.dashboard}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.navbarLeft}>
          <h1 className={styles.logo}>The Streamy Place</h1>
          <ul className={styles.navLinks}>
            {/* Home clears the search and returns to default */}
            <li>
              <a onClick={handleHomeClick}>Home</a>
            </li>
            <li>
              <a onClick={() => navigate('/watchlist')}>Watchlist</a>
            </li>
            <li>
              <a onClick={() => navigate('/watchhistory')}>Watch History</a>
            </li>
          </ul>
        </div>
        <div className={styles.navbarRight}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </div>
      </nav>

      {/** If we have searchResults, show them alone, otherwise show the normal dashboard layout */}
      {searchResults.length > 0 ? (
        <>
          {/* SEARCH RESULTS VIEW */}
          <div className={styles.content}>
            <h2>Search Results</h2>
            <p>Found {searchResults.length} videos for: <b>{searchTerm}</b></p>
          </div>
          <div className={styles.grid}>
            <div className={styles.gridContainer}>
              {searchResults.map((video) => (
                <div
                  className={styles.gridItem}
                  key={video._id}
                  onClick={() => handleThumbnailClick(video)}
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.videoName}
                    style={{ cursor: 'pointer' }}
                  />
                  <h3 style={{ margin: '10px 0 5px' }}>{video.videoName}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#ccc' }}>
                    {video.videoDescription}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* DEFAULT DASHBOARD VIEW (Carousel + Grid) */}
          <div className={styles.content}>
            <h2>Welcome to The Streamy Place</h2>
            <p>Start exploring your favorite videos!</p>
          </div>

          <div className={styles.carousel}>
            <h3 className={styles.sectionTitle}>Top Picks for You</h3>
            <Slider {...sliderSettings}>
              {videos.map((video) => (
                <div
                  key={video._id}
                  className={styles.carouselItem}
                  onClick={() => handleThumbnailClick(video)}
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.videoName}
                    style={{ width: '100%', cursor: 'pointer' }}
                  />
                </div>
              ))}
            </Slider>
          </div>

          <div className={styles.grid}>
            <h3 className={styles.sectionTitle}>Browse Other Videos</h3>
            <div className={styles.gridContainer}>
              {videos.map((video) => (
                <div
                  className={styles.gridItem}
                  key={video._id}
                  onClick={() => handleThumbnailClick(video)}
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.videoName}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* MODAL */}
      {selectedVideo && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{selectedVideo.videoName}</h2>
            <p>{selectedVideo.videoDescription}</p>
            <video
              src={selectedVideo.videoUrl}
              controls
              style={{ width: '100%', marginTop: '20px' }}
            />
            <button
              onClick={handleAddToWatchlist}
              style={{ marginTop: '10px', marginRight: '10px' }}
            >
              Add to Watchlist
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
