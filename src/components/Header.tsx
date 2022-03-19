import { faCalendarDays, faChartLine, faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink, Link } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {

  const isActiveClass = ({ isActive }: { isActive: boolean}) => {
    if (isActive) {
      return styles.active;
    }
  }

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}><Link to="/">Weight Tracker</Link></h1>
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

export default Header;
