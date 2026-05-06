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
import { useAppStore } from '~/stores/appStore';
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

type ChangeIndicator = 'improve' | 'worsen' | 'noChange';

function getChangeIndicator(
  weightChange: number | undefined,
  weightTargetKgs: number | null,
  currentWeightKgs: number,
): ChangeIndicator {
  if (weightChange === undefined || weightChange === 0) {
    return 'noChange';
  }

  if (weightTargetKgs === null) {
    // Fallback if no goal weight set
    return weightChange > 0 ? 'worsen' : 'improve';
  }

  // Determine if moving towards or away from goal
  const isCurrentAboveGoal = currentWeightKgs > weightTargetKgs;
  const isMovingTowardsGoal =
    (isCurrentAboveGoal && weightChange < 0) ||
    (!isCurrentAboveGoal && weightChange > 0);

  return isMovingTowardsGoal ? 'improve' : 'worsen';
}

function HistoryTable({ monthWeightRecords }: HistoryTableProps) {
  const { weightUnit } = useAppWeight();
  const weightTargetKgs = useAppStore((state) => state.weightTargetKgs);

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

          const changeIndicatorKey = getChangeIndicator(
            weightChange,
            weightTargetKgs,
            record.weightKgs,
          );
          const changeIndicator = styles[changeIndicatorKey];

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
                    className={`${styles.weightChange} ${weightChange === 0 ? styles.noChange : changeIndicator}`}
                  >
                    {
                      <FontAwesomeIcon
                        aria-label={
                          weightChange === 0
                            ? 'No weight change'
                            : changeIndicatorKey === 'improve'
                              ? 'Weight improving towards goal'
                              : 'Weight worsening away from goal'
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
