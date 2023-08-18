import { faCalendarDays, faChartLine, faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSSProperties } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSettingsContext } from '../../context/SettingsContext';
import styles from './Header.module.css';
import { ReactComponent as Logo } from '../../assets/logo.svg';

function Header() {
  const { accentColour } = useSettingsContext();

  const isActiveClass = ({ isActive }: { isActive: boolean}): string | undefined => (
    (isActive) ? styles.active : undefined
  );

  const isActiveStyle = ({ isActive }: { isActive: boolean}): CSSProperties => (
    (isActive) ? { color: accentColour } : {}
  );

  return (
    <header className={styles.header}>
      <h1>
        <Link to="/" className={styles.logo}>
          <Logo className={styles.logoIcon} width="27" height="20" />
          <div className={styles.logoText}>Weight Tracker</div>
        </Link>
      </h1>
      <nav className={styles.mainNav}>
        <ul>
          <li>
            <NavLink to="/" className={isActiveClass} style={isActiveStyle}>
              <FontAwesomeIcon icon={faChartLine} /> Stats
            </NavLink>
          </li>
          <li>
            <NavLink to="/history" className={isActiveClass} style={isActiveStyle}>
              <FontAwesomeIcon icon={faCalendarDays} /> History
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={isActiveClass} style={isActiveStyle}>
              <FontAwesomeIcon icon={faGear} /> Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
