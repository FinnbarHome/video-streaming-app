import React from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard">
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

            <div className="content">
                <h2>Welcome to The Streamy Place</h2>
                <p>Start exploring your favorite movies and shows!</p>
            </div>
        </div>
    );
};

export default Dashboard;
