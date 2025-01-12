import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard'; // New Page Component
import Watchlist from './components/Watchlist';
import WatchHistory from './components/WatchHistory';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/watchlist" element={<Watchlist/>} />
                <Route path="/watchhistory" element={<WatchHistory />} />
            </Routes>
        </Router>
    );
};

export default App;
