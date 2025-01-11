import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            if (username === 'admin' && password === 'password') {
                navigate('/dashboard');
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="login-background">
            <div className="login-container">
                <h1 className="login-title">Login</h1>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="login-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                />
                <button onClick={handleLogin} className="login-button">
                    Login
                </button>
                {error && <p className="login-error">{error}</p>}
            </div>
            {/* Add the image credit */}
            <div className="image-credit">
                Image by <a href="https://pixabay.com/users/antonio_cansino-6477209/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=5069314">Antonio Cansino</a> 
                from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=5069314">Pixabay</a>
            </div>
        </div>
    );
};

export default Login;
