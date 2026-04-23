import { faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from '~/components/IconButton/IconButton';
import { useAppWeight } from '~/hooks/useAppWeight';
import type { WeightRecord } from '~/types/weight';
import {
  formatDateStr,
  formatDayth,
  getFirstOfMonth,
  MONTH_NAMES,
  parseISODate,
  toISODate,
} from '~/utils/dates';
import { formatWeight } from '~/utils/weights';
import styles from './Timeline.module.css';

export function Timeline() {
  const { weightRecords, weightUnit, deleteWeight } = useAppWeight();

  if (weightRecords.length === 0) {
    return (
      <div className={styles.timeline}>
        <div className={styles.emptyState}>No weight entries yet.</div>
      </div>
    );
  }

  const reverseWeightRecords = [...weightRecords].reverse();

  const firstMonth = getFirstOfMonth(parseISODate(weightRecords[0].date));
  const lastMonth = getFirstOfMonth(
    parseISODate(weightRecords[weightRecords.length - 1].date),
  );

  let currentMonth = lastMonth;

  const months = [];

  const filterCurrentMonth = (weightRecord: WeightRecord): boolean => {
    const weightRecordDate = parseISODate(weightRecord.date);
    return (
      weightRecordDate.getFullYear() === currentMonth.getFullYear() &&
      weightRecordDate.getMonth() === currentMonth.getMonth()
    );
  };

  while (currentMonth >= firstMonth) {
    const monthStr = MONTH_NAMES[currentMonth.getMonth()];
    const year = currentMonth.getFullYear();

    const currentMonthRecords = reverseWeightRecords.filter(filterCurrentMonth);

    const month = (
      <div key={toISODate(currentMonth)}>
        <div className={styles.month}>
          {monthStr} {year}
        </div>
        {currentMonthRecords.map((weightRecord) => (
          <div key={weightRecord.date} className={styles.weightRecord}>
            <div className={styles.date}>{formatDayth(weightRecord.date)}</div>
            <div className={styles.weight}>
              {formatWeight(weightRecord.weightKgs, weightUnit)}
            </div>
            <div className={styles.options}>
              <IconButton
                label={`Delete weight record for ${formatDateStr(weightRecord.date)}`}
                onClick={() => deleteWeight(weightRecord.date)}
                icon={<FontAwesomeIcon icon={faRemove} />}
              />
            </div>
            <div className={styles.dataDot} />
          </div>
        ))}
      </div>
    );

    months.push(month);

    currentMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1,
    );
  }

  return <div className={styles.timeline}>{months}</div>;
}
