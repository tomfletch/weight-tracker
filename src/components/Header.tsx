import { faCalendarDays, faChartLine, faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSSProperties, useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import SettingsContext from '../context/SettingsContext';
import styles from './Header.module.css';

function Header() {
  const { accentColour } = useContext(SettingsContext);

  const isActiveClass = ({ isActive }: { isActive: boolean}) => {
    if (isActive) {
      return styles.active;
    }
  }

  const isActiveStyle = ({ isActive }: { isActive: boolean}): CSSProperties => {
    if (isActive) {
      return {color: accentColour}
    }

    return {};
  }

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}><Link to="/">Weight Tracker</Link></h1>
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
