import {
  faChevronLeft,
  faChevronRight,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Card } from '~/components/Card/Card';
import { IconButton } from '~/components/IconButton/IconButton';
import { WeightChangeIcon } from '~/components/WeightChangeIcon/WeightChangeIcon';
import { useAppWeight } from '~/hooks/useAppWeight';
import { useAppStore } from '~/stores/appStore';
import type { WeightRecord } from '~/types/weight';
import { DAY_NAMES_SHORT, daysBetween, formatMonth } from '~/utils/dates';
import { formatWeight } from '~/utils/weights';
import { DeleteConfirmationDialog } from './components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import styles from './HistoryPage.module.css';
import { useMonthSelector } from './hooks/useMonthSelector';
import { useMonthWeightRecords } from './hooks/useMonthWeightRecords';

export function HistoryPage() {
  const { weightRecords } = useAppWeight();

  const minDate = weightRecords.length > 0 ? weightRecords[0].date : undefined;

  const {
    selectedMonth,
    goToPreviousMonth,
    goToNextMonth,
    isPrevMonthDisabled,
    isNextMonthDisabled,
  } = useMonthSelector({ minDate });

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
          <HistoryTable
            monthWeightRecords={monthWeightRecords}
            allWeightRecords={weightRecords}
          />
        )}
      </Card>
    </div>
  );
}

type HistoryTableProps = {
  monthWeightRecords: WeightRecord[];
  allWeightRecords: WeightRecord[];
};

type ChangeIndicator = 'improve' | 'worsen' | 'noChange';

type HistoryTableRow = {
  record: WeightRecord;
  date: Date;
  dayOfMonth: number;
  dayOfWeek: string;
  weightChange: number | undefined;
  daysBetweenRecords: number;
  changeIndicator: ChangeIndicator;
};

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

function createHistoryTableRow(
  record: WeightRecord,
  index: number,
  monthWeightRecords: WeightRecord[],
  allWeightRecords: WeightRecord[],
  weightTargetKgs: number | null,
): HistoryTableRow {
  const date = new Date(record.date);
  const dayOfMonth = date.getUTCDate();
  const dayOfWeek = DAY_NAMES_SHORT[(date.getUTCDay() + 6) % 7];

  let previousRecord: WeightRecord | undefined;

  if (index === monthWeightRecords.length - 1) {
    // For the first entry, find the previous record from all records
    const recordIndex = allWeightRecords.findIndex(
      (r) => r.date === record.date,
    );

    previousRecord =
      recordIndex >= 0 ? allWeightRecords[recordIndex - 1] : undefined;
  } else {
    // For other entries, use the next entry in the month array (which is chronologically before)
    previousRecord = monthWeightRecords[index + 1];
  }

  const weightChange = previousRecord
    ? record.weightKgs - previousRecord.weightKgs
    : undefined;

  const daysBetweenRecords = previousRecord
    ? daysBetween(new Date(previousRecord.date), date)
    : 1;

  const changeIndicator = getChangeIndicator(
    weightChange,
    weightTargetKgs,
    record.weightKgs,
  );

  return {
    record,
    date,
    dayOfMonth,
    dayOfWeek,
    weightChange,
    daysBetweenRecords,
    changeIndicator,
  };
}

function HistoryTable({
  monthWeightRecords,
  allWeightRecords,
}: HistoryTableProps) {
  const { weightUnit, deleteWeight } = useAppWeight();
  const weightTargetKgs = useAppStore((state) => state.weightTargetKgs);
  const [pendingDeleteRecord, setPendingDeleteRecord] =
    useState<WeightRecord | null>(null);

  const tableRows = monthWeightRecords.map((record, index) =>
    createHistoryTableRow(
      record,
      index,
      monthWeightRecords,
      allWeightRecords,
      weightTargetKgs,
    ),
  );

  return (
    <>
      <table className={styles.weightTable}>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Weight</th>
            <th scope="col">Change</th>
            <th scope="col" className={styles.actionsColumn}>
              <span className="visuallyHidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row) => (
            <tr key={row.record.date}>
              <td>
                <span className={styles.dayOfMonth}>{row.dayOfMonth}</span>{' '}
                <span className={styles.dayOfWeek}>{row.dayOfWeek}</span>
              </td>
              <td>{formatWeight(row.record.weightKgs, weightUnit)}</td>
              <td>
                {row.weightChange !== undefined && (
                  <div className={styles.weightChangeContainer}>
                    <span
                      className={`${styles.weightChange} ${row.weightChange === 0 ? styles.noChange : styles[row.changeIndicator]}`}
                    >
                      <WeightChangeIcon weightChange={row.weightChange} />
                      {formatWeight(Math.abs(row.weightChange), weightUnit)}
                    </span>
                    {row.daysBetweenRecords > 1 && (
                      <span className={styles.daysBetween}>
                        ({row.daysBetweenRecords}d)
                      </span>
                    )}
                  </div>
                )}
              </td>
              <td className={styles.actionsCell}>
                <IconButton
                  label="Delete entry"
                  icon={<FontAwesomeIcon icon={faTrashCan} />}
                  onClick={() => setPendingDeleteRecord(row.record)}
                  className={styles.deleteButton}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DeleteConfirmationDialog
        record={pendingDeleteRecord}
        isOpen={pendingDeleteRecord !== null}
        onClose={() => setPendingDeleteRecord(null)}
        onConfirm={() => {
          if (pendingDeleteRecord !== null) {
            deleteWeight(pendingDeleteRecord.date);
          }
          setPendingDeleteRecord(null);
        }}
      />
    </>
  );
}
