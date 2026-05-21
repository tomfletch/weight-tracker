import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { useState } from 'react';
import { IconButton } from '~/components/IconButton/IconButton';
import { WeightChangeIcon } from '~/components/WeightChangeIcon/WeightChangeIcon';
import { useAppWeight } from '~/hooks/useAppWeight';
import { useAppStore } from '~/stores/appStore';
import type { WeightRecord } from '~/types/weight';
import { formatWeight } from '~/utils/weights';
import { DeleteConfirmationDialog } from '../DeleteConfirmationDialog/DeleteConfirmationDialog';
import { EditWeightDialog } from '../EditWeightDialog/EditWeightDialog';
import styles from './HistoryTable.module.css';
import { createHistoryTableRow } from './historyTableData';

type HistoryTableProps = {
  monthWeightRecords: WeightRecord[];
  allWeightRecords: WeightRecord[];
};

export function HistoryTable({
  monthWeightRecords,
  allWeightRecords,
}: HistoryTableProps) {
  const { weightUnit, addWeight, deleteWeight } = useAppWeight();
  const weightTargetKgs = useAppStore((state) => state.weightTargetKgs);
  const [pendingEditRecord, setPendingEditRecord] =
    useState<WeightRecord | null>(null);
  const [pendingEditWeightKgs, setPendingEditWeightKgs] = useState<
    number | null
  >(null);
  const [pendingDeleteRecord, setPendingDeleteRecord] =
    useState<WeightRecord | null>(null);

  const tableRows = monthWeightRecords.map((record) =>
    createHistoryTableRow(record, allWeightRecords, weightTargetKgs),
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
                      className={clsx(
                        styles.weightChange,
                        styles[row.changeIndicator],
                      )}
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
                <div className={styles.actionsButtons}>
                  <IconButton
                    label="Edit entry"
                    icon={<FontAwesomeIcon icon={faPenToSquare} />}
                    onClick={() => {
                      setPendingEditRecord(row.record);
                      setPendingEditWeightKgs(row.record.weightKgs);
                    }}
                    className={styles.editButton}
                  />
                  <IconButton
                    label="Delete entry"
                    icon={<FontAwesomeIcon icon={faTrashCan} />}
                    onClick={() => setPendingDeleteRecord(row.record)}
                    className={styles.deleteButton}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <EditWeightDialog
        record={pendingEditRecord}
        weightKgs={pendingEditWeightKgs}
        isOpen={pendingEditRecord !== null}
        onClose={() => {
          setPendingEditRecord(null);
          setPendingEditWeightKgs(null);
        }}
        onWeightChange={setPendingEditWeightKgs}
        onConfirm={(weightKgs) => {
          if (pendingEditRecord !== null) {
            addWeight({
              date: pendingEditRecord.date,
              weightKgs,
            });
          }
          setPendingEditRecord(null);
          setPendingEditWeightKgs(null);
        }}
      />

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
