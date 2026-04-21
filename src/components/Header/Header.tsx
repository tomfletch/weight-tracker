import {
  faCalendarDays,
  faChartLine,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { CSSProperties } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '~/assets/logo.svg';
import { useAppSettings } from '~/hooks/useAppSettings';
import styles from './Header.module.css';

export function Header() {
  const { accentColour } = useAppSettings();

  const isActiveClass = ({
    isActive,
  }: {
    isActive: boolean;
  }): string | undefined => (isActive ? styles.active : undefined);

  const isActiveStyle = ({ isActive }: { isActive: boolean }): CSSProperties =>
    isActive ? { color: accentColour } : {};

  return (
    <header className={styles.header}>
      <h1>
        <Link to="/" className={styles.logo}>
          <img
            className={styles.logoIcon}
            src={logo}
            width="27"
            height="20"
            alt=""
          />
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
            <NavLink
              to="/history"
              className={isActiveClass}
              style={isActiveStyle}
            >
              <FontAwesomeIcon icon={faCalendarDays} /> History
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={isActiveClass}
              style={isActiveStyle}
            >
              <FontAwesomeIcon icon={faGear} /> Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
