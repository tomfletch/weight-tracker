import styles from './HistoryPage.module.css';
import Calendar from './components/Calendar/Calendar';
import Timeline from './components/Timeline/Timeline';

function History() {
  return (
    <div className="pageContainer">
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

export default History;
