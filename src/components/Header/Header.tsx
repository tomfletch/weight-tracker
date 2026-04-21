import {
  faCalendarDays,
  faChartLine,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, NavLink } from 'react-router-dom';
import logo from '~/assets/logo.svg';
import styles from './Header.module.css';

const LINKS = [
  { to: '/', label: 'Stats', icon: faChartLine },
  { to: '/history', label: 'History', icon: faCalendarDays },
  { to: '/settings', label: 'Settings', icon: faGear },
];

export function Header() {
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
          {LINKS.map(({ to, label, icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  isActive ? styles.active : undefined
                }
              >
                <FontAwesomeIcon icon={icon} /> {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
