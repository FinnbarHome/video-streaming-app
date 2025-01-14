import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login: React.FC = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Use your actual API base URL here
  const API_BASE_URL = 'http://backend:5000/api';

  const handleLogin = async () => {
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.error || 'Login failed. Please try again.');
      } else {
        console.log('Login success:', data);
        // data.token is our JWT
        localStorage.setItem('token', data.token);
        // We can still store userId if we want
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('username', data.username);
        // Now navigate
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleRegister = async () => {
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Registration failed. Please try again.');
      } else {
        console.log('Registration success:', data);
        // Store userId in localStorage
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('username', data.username);
  
        // navigate to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Register Error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegisterMode) {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  return (
    <div className={styles.loginBackground}>
      <div className={styles.loginContainer}>
        <h1 className={styles.loginTitle}>{isRegisterMode ? 'Register' : 'Login'}</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.loginInput}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.loginInput}
          />

          <button type="submit" className={styles.loginButton}>
            {isRegisterMode ? 'Register' : 'Login'}
          </button>
        </form>

        <button
          style={{ marginTop: '10px', width: '100%' }}
          className={styles.loginButton}
          onClick={() => setIsRegisterMode(!isRegisterMode)}
        >
          {isRegisterMode
            ? 'Already have an account? Click here to Login'
            : "Don't have an account? Click here to Register"}
        </button>

        {error && <p className={styles.loginError}>{error}</p>}
      </div>

      {/* Image credit */}
      <div className={styles.imageCredit}>
        Image by{' '}
        <a
          href="https://pixabay.com/users/antonio_cansino-6477209/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=5069314"
          target="_blank"
          rel="noopener noreferrer"
        >
          Antonio Cansino
        </a>{' '}
        from{' '}
        <a
          href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=5069314"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pixabay
        </a>
      </div>
    </div>
  );
};

export default Login;
