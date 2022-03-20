import { useContext } from 'react';
import SettingsContext from '../context/SettingsContext';
import WeightContext from '../context/WeightContext';
import { formatDayth, getFirstOfMonth, MONTH_NAMES } from '../utils/dates';
import { formatWeight } from '../utils/weights';
import styles from './Timeline.module.css';

function Timeline() {
  const { weightRecords, weightUnit } = useContext(WeightContext);
  const { accentColour } = useContext(SettingsContext);

  const reverseWeightRecords = [...weightRecords].reverse();

  const firstMonth = getFirstOfMonth(new Date(weightRecords[0].date));
  const lastMonth = getFirstOfMonth(new Date(weightRecords[weightRecords.length - 1].date));

  let currentMonth = lastMonth;

  const months = [];

  while (currentMonth >= firstMonth) {
    const monthStr = MONTH_NAMES[currentMonth.getMonth()];
    const year = currentMonth.getFullYear();

    const month = (
      <div key={currentMonth.toISOString()}>
        <div className={styles.month}>{monthStr} {year}</div>
        {reverseWeightRecords.map((weightRecord) => (
          <div key={weightRecord.date} className={styles.weightRecord}>
            <div className={styles.date}>{formatDayth(weightRecord.date)}</div>
            <div className={styles.weight}>{formatWeight(weightRecord.weightKgs, weightUnit)}</div>
            <div className={styles.dataDot} style={{backgroundColor: accentColour}}></div>
          </div>
        ))}
      </div>
    );

    months.push(month);

    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth()-1, 1);
  }

  return (
    <div className={styles.timeline} style={{borderLeftColor: accentColour}}>
      {months}
    </div>
  );
}

export default Timeline;
