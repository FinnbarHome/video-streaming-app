// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // So we can programmatically navigate
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

  // In a real app, you'd get this from context, redux, or localStorage
  const userId = localStorage.getItem('userId');

  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

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

  // Whenever the user clicks a thumbnail, we open the modal
  // AND we also add it to their "view history"
  const handleThumbnailClick = async (video: Video) => {
    setSelectedVideo(video);
    try {
      // Add to user history
      await fetch(`http://localhost:3000/api/users/${userId}/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: video._id }),
      });
      // Optionally handle errors or success
    } catch (err) {
      console.error('Failed to add to history:', err);
    }
  };

  // Close the detail modal
  const closeDetailModal = () => {
    setSelectedVideo(null);
  };

  // Add the selected video to watchlist
  const handleAddToWatchlist = async () => {
    if (!selectedVideo) return;
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

  // React Slick settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,   // how many you want in wide screen
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className={styles.dashboard}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.navbarLeft}>
          <h1 className={styles.logo}>The Streamy Place</h1>
          <ul className={styles.navLinks}>
            {/* Use onClick + navigate or <Link to="/dashboard"> */}
            <li><a onClick={() => navigate('/dashboard')}>Home</a></li>
            <li><a onClick={() => navigate('/watchlist')}>Watchlist</a></li>
            <li><a onClick={() => navigate('/watchhistory')}>Watch History</a></li>
          </ul>
        </div>
        <div className={styles.navbarRight}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search videos..."
          />
        </div>
      </nav>

      {/* CONTENT */}
      <div className={styles.content}>
        <h2>Welcome to The Streamy Place</h2>
        <p>Start exploring your favorite videos!</p>
      </div>

      {/* CAROUSEL SECTION (Using react-slick) */}
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

      {/* GRID SECTION */}
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

      {/* Modal Overlay for Video Detail */}
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
            {/* Button to add to watchlist */}
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
