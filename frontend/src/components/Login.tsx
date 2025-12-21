import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { apiFetch, ApiError } from '../lib/api';
import { setAuth } from '../lib/auth';

const Login: React.FC = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter a username and password.');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setError('');
    try {
      setIsSubmitting(true);
      const data = await apiFetch<{
        token: string;
        userId: string;
        username: string;
      }>('/users/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      setAuth({
        token: data.token,
        userId: data.userId,
        username: data.username,
      });
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async () => {
    setError('');
    try {
      setIsSubmitting(true);
      const registered = await apiFetch<{ userId: string; username: string }>(
        '/users/register',
        {
          method: 'POST',
          body: JSON.stringify({ username, password }),
        },
      );

      setAuth({
        userId: registered.userId,
        username: registered.username,
        token: null,
      });
      await handleLogin();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (isRegisterMode) {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  return (
    <div className={styles.loginBackground}>
      <div className={styles.loginContainer}>
        <h1 className={styles.loginTitle}>
          {isRegisterMode ? 'Register' : 'Login'}
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.loginInput}
            autoComplete="username"
            disabled={isSubmitting}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.loginInput}
            autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
            disabled={isSubmitting}
          />

          <button type="submit" className={styles.loginButton}>
            {isSubmitting
              ? 'Please wait…'
              : isRegisterMode
                ? 'Register'
                : 'Login'}
          </button>
        </form>

        <button
          style={{ marginTop: '10px', width: '100%' }}
          className={styles.loginButton}
          onClick={() => setIsRegisterMode(!isRegisterMode)}
          type="button"
          disabled={isSubmitting}
        >
          {isRegisterMode
            ? 'Already have an account? Click here to Login'
            : "Don't have an account? Click here to Register"}
        </button>

        {error && <p className={styles.loginError}>{error}</p>}
      </div>

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
