import { Calendar } from './components/Calendar/Calendar';
import { Timeline } from './components/Timeline/Timeline';
import styles from './HistoryPage.module.css';

export function History() {
  return (
    <div className="pageContainer">
      <h1 className="visuallyHidden">History</h1>
      <div className={styles.columns}>
        <div className={styles.calendarColumn}>
          <Calendar />
        </div>
        <div className={styles.timelineColumn}>
          <Timeline />
        </div>
      </div>
    </div>
  );
}
