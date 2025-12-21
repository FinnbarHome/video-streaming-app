import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Watchlist from './components/Watchlist';
import WatchHistory from './components/WatchHistory';
import RequireAuth from './components/RequireAuth';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/watchhistory" element={<WatchHistory />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
