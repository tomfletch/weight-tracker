import {
  faChevronLeft,
  faChevronRight,
  faEquals,
  faLongArrowDown,
  faLongArrowUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card } from '~/components/Card/Card';
import { IconButton } from '~/components/IconButton/IconButton';
import { useAppWeight } from '~/hooks/useAppWeight';
import type { WeightRecord } from '~/types/weight';
import { DAY_NAMES_SHORT, formatMonth } from '~/utils/dates';
import { formatWeight } from '~/utils/weights';
import styles from './HistoryPage.module.css';
import { useMonthSelector } from './hooks/useMonthSelector';
import { useMonthWeightRecords } from './hooks/useMonthWeightRecords';

export function History() {
  const { weightRecords } = useAppWeight();

  const minDate = weightRecords.length > 0 ? weightRecords[0].date : undefined;

  const {
    selectedMonth,
    goToPreviousMonth,
    goToNextMonth,
    isPrevMonthDisabled,
    isNextMonthDisabled,
  } = useMonthSelector({ minDate });

  console.log(selectedMonth);

  const monthWeightRecords = useMonthWeightRecords(selectedMonth);

  return (
    <div className="pageContainer">
      <header className={styles.header}>
        <h1>History</h1>
        <p className="textLight">Review your past entries and progress.</p>
      </header>
      <Card>
        <header className={styles.monthHeader}>
          <IconButton
            label="Previous Month"
            icon={<FontAwesomeIcon icon={faChevronLeft} />}
            onClick={goToPreviousMonth}
            disabled={isPrevMonthDisabled}
          />
          <h2>{formatMonth(selectedMonth)}</h2>
          <IconButton
            label="Next Month"
            icon={<FontAwesomeIcon icon={faChevronRight} />}
            onClick={goToNextMonth}
            disabled={isNextMonthDisabled}
          />
        </header>
        {monthWeightRecords.length === 0 ? (
          <div className={styles.emptyState}>No entries for this month.</div>
        ) : (
          <HistoryTable monthWeightRecords={monthWeightRecords} />
        )}
      </Card>
    </div>
  );
}

type HistoryTableProps = {
  monthWeightRecords: WeightRecord[];
};

function HistoryTable({ monthWeightRecords }: HistoryTableProps) {
  const { weightUnit } = useAppWeight();

  return (
    <table className={styles.weightTable}>
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Weight</th>
          <th scope="col">Change</th>
        </tr>
      </thead>
      <tbody>
        {monthWeightRecords.map((record, index) => {
          const date = new Date(record.date);
          const dayOfMonth = date.getUTCDate();
          const dayOfWeek = DAY_NAMES_SHORT[(date.getUTCDay() + 6) % 7];

          const previousRecord = monthWeightRecords[index + 1];
          const weightChange = previousRecord
            ? record.weightKgs - previousRecord.weightKgs
            : undefined;

          return (
            <tr key={record.date}>
              <td>
                <span className={styles.dayOfMonth}>{dayOfMonth}</span>{' '}
                <span className={styles.dayOfWeek}>{dayOfWeek}</span>
              </td>
              <td>{formatWeight(record.weightKgs, weightUnit)}</td>
              <td>
                {weightChange !== undefined && (
                  <span
                    className={`${styles.weightChange} ${weightChange === 0 ? styles.noChange : weightChange > 0 ? styles.increase : styles.decrease}`}
                  >
                    {
                      <FontAwesomeIcon
                        aria-label={
                          weightChange === 0
                            ? 'No weight change'
                            : weightChange > 0
                              ? 'Weight increasing'
                              : 'Weight decreasing'
                        }
                        icon={
                          weightChange === 0
                            ? faEquals
                            : weightChange > 0
                              ? faLongArrowUp
                              : faLongArrowDown
                        }
                      />
                    }
                    {formatWeight(Math.abs(weightChange), weightUnit)}
                  </span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
