import { useSettingsContext } from '../../../../context/SettingsContext';
import { useWeightContext, WeightRecord } from '../../../../context/WeightContext';
import {
  formatDayth,
  getFirstOfMonth,
  MONTH_NAMES,
  toISODate,
} from '../../../../utils/dates';
import { formatWeight } from '../../../../utils/weights';
import styles from './Timeline.module.css';

function Timeline() {
  const { weightRecords, weightUnit, deleteWeight } = useWeightContext();
  const { accentColour } = useSettingsContext();

  const reverseWeightRecords = [...weightRecords].reverse();

  const firstMonth = getFirstOfMonth(new Date(weightRecords[0].date));
  const lastMonth = getFirstOfMonth(new Date(weightRecords[weightRecords.length - 1].date));

  let currentMonth = lastMonth;

  const months = [];

  const filterCurrentMonth = (weightRecord: WeightRecord): boolean => {
    const weightRecordDate = new Date(weightRecord.date);
    return weightRecordDate.getFullYear() === currentMonth.getFullYear() && weightRecordDate.getMonth() === currentMonth.getMonth();
  };

  while (currentMonth >= firstMonth) {
    const monthStr = MONTH_NAMES[currentMonth.getMonth()];
    const year = currentMonth.getFullYear();

    const currentMonthRecords = reverseWeightRecords.filter(filterCurrentMonth);

    const month = (
      <div key={toISODate(currentMonth)}>
        <div className={styles.month}>{monthStr} {year}</div>
        {currentMonthRecords.map((weightRecord) => (
          <div key={weightRecord.date} className={styles.weightRecord}>
            <div className={styles.date}>{formatDayth(weightRecord.date)}</div>
            <div className={styles.weight}>{formatWeight(weightRecord.weightKgs, weightUnit)}</div>
            <div className={styles.options}>
              <button
                className={styles.deleteBtn}
                type="button"
                onClick={() => deleteWeight(weightRecord.date)}
                style={{ color: accentColour }}
              >&times;
              </button>
            </div>
            <div className={styles.dataDot} style={{ backgroundColor: accentColour }} />
          </div>
        ))}
      </div>
    );

    months.push(month);

    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
  }

  return (
    <div className={styles.timeline} style={{ borderLeftColor: accentColour }}>
      {months}
    </div>
  );
}

export default Timeline;
