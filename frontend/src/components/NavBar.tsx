import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { clearAuth, getAuth } from '../lib/auth';
import styles from './NavBar.module.css';

type Props = {
  rightSlot?: React.ReactNode;
  onHomeClick?: () => void;
};

const NavBar: React.FC<Props> = ({ rightSlot, onHomeClick }) => {
  const navigate = useNavigate();
  const { username } = getAuth();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo}>The Streamy Place</div>
        <ul className={styles.navLinks}>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
              onClick={() => onHomeClick?.()}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/watchlist"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
            >
              Watchlist
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/watchhistory"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
            >
              Watch History
            </NavLink>
          </li>
        </ul>
      </div>

      <div className={styles.right}>
        {rightSlot}
        {username && <div className={styles.user}>{username}</div>}
        <button type="button" className={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
