import { subDays } from 'date-fns';
import { useAppWeight } from '~/hooks/useAppWeight';
import { parseISODate } from '~/utils/dates';
import { BMIWidget } from './BMIWidget';
import { RateStatsWidget } from './RateStatsWidget';
import styles from './StatsBar.module.css';

export function StatsBar() {
  const { weightRecords } = useAppWeight();

  const firstRecordDate = parseISODate(weightRecords[0].date);
  const lastRecordDate = parseISODate(
    weightRecords[weightRecords.length - 1].date,
  );
  const weekAgoDate = subDays(lastRecordDate, 7);

  return (
    <div className={styles.statsBar}>
      <RateStatsWidget type="All Time" startDate={firstRecordDate} />
      <RateStatsWidget type="Current" startDate={weekAgoDate} />
      <BMIWidget />
    </div>
  );
}
