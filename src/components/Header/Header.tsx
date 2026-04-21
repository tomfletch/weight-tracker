import {
  faCalendarDays,
  faChartLine,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, NavLink } from 'react-router-dom';
import logo from '~/assets/logo.svg';
import styles from './Header.module.css';

export function Header() {
  const isActiveClass = ({
    isActive,
  }: {
    isActive: boolean;
  }): string | undefined => (isActive ? styles.active : undefined);

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
            <NavLink to="/" className={isActiveClass}>
              <FontAwesomeIcon icon={faChartLine} /> Stats
            </NavLink>
          </li>
          <li>
            <NavLink to="/history" className={isActiveClass}>
              <FontAwesomeIcon icon={faCalendarDays} /> History
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={isActiveClass}>
              <FontAwesomeIcon icon={faGear} /> Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
