import React, { useState, useCallback } from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const originalImages = [
    '/testImages/test-image1.jpg',
    '/testImages/test-image2.jpg',
    '/testImages/test-image3.jpg',
    '/testImages/test-image4.jpg',
    '/testImages/test-image5.jpg',
    '/testImages/test-image6.jpg',
    '/testImages/test-image7.jpg',
    '/testImages/test-image8.jpg',
    '/testImages/test-image9.jpg',
    '/testImages/test-image10.jpg',
    '/testImages/test-image11.jpg',
    '/testImages/test-image12.jpg',
  ];

  // Number of items visible at once
  const visibleItems = 3;

  // How many times to repeat the original images so the user can keep scrolling
  const REPEAT_FACTOR = 20;

  // Create a long array by repeating originalImages multiple times.
  const repeatedImages = Array.from(
    { length: originalImages.length * REPEAT_FACTOR },
    (_, i) => originalImages[i % originalImages.length]
  );

  // Current index (starting at 0). This will keep incrementing as the user presses Next.
  const [currentIndex, setCurrentIndex] = useState(0);

  // Slide transition duration (in seconds)
  const transitionDuration = 0.5;

  // Move to the next slide
  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  }, []);

  // Move to the previous slide
  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  }, []);

  return (
    <div className="dashboard">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-left">
          <h1 className="logo">The Streamy Place</h1>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#watchlist">Watchlist</a></li>
            <li><a href="#history">Watch History</a></li>
          </ul>
        </div>
        <div className="navbar-right">
          <input
            type="text"
            className="search-input"
            placeholder="Search movies, shows..."
          />
        </div>
      </nav>

      {/* CONTENT */}
      <div className="content">
        <h2>Welcome to The Streamy Place</h2>
        <p>Start exploring your favorite movies and shows!</p>
      </div>

      {/* CAROUSEL SECTION */}
      <div className="carousel">
        <h3 className="section-title">Top Picks for You</h3>
        
        <button className="carousel-arrow left" onClick={handlePrev}>
          &#8249;
        </button>
        
        <div className="carousel-container">
          <div
            className="carousel-track"
            // Translate the track left by (currentIndex * 100%) / visibleItems
            style={{
              transform: `translateX(-${
                (currentIndex * 100) / visibleItems
              }%)`,
              transition: `transform ${transitionDuration}s ease`,
            }}
          >
            {repeatedImages.map((src, idx) => (
              <div className="carousel-item" key={idx}>
                <img src={src} alt={`Show ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <button className="carousel-arrow right" onClick={handleNext}>
          &#8250;
        </button>
      </div>

      {/* GRID SECTION */}
      <div className="grid">
        <h3 className="section-title">Browse Other Shows</h3>
        <div className="grid-container">
          {originalImages.map((image, index) => (
            <div className="grid-item" key={index}>
              <img src={image} alt={`Show ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
