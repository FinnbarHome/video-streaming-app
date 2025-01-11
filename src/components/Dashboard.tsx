import React from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard-container">
            <h1 className="dashboard-header">Welcome to the Dashboard</h1>
            <p className="dashboard-content">You have successfully logged in!</p>
            <button className="dashboard-button">Logout</button>
        </div>
    );
};

export default Dashboard;
