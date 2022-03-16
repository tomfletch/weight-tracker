import { useContext, useMemo } from 'react';
import WeightContext, { WeightRecord, WeightUnit } from '../context/WeightContext';
import { formatDate } from '../utils/dates';
import { formatWeight } from '../utils/weightConversion';
import styles from './WeightHistory.module.css';

interface WeightHistoryRowProps {
  weightRecord: WeightRecord;
  unit: WeightUnit;
  onDelete: () => void;
};

function WeightHistoryRow({weightRecord, unit, onDelete}: WeightHistoryRowProps) {
  const weightStr = formatWeight(weightRecord, unit);

  return (
    <tr>
      <td>{formatDate(weightRecord.date)}</td>
      <td>{weightStr}</td>
      <td><button className={styles.deleteBtn} type="button" onClick={onDelete}>&times;</button></td>
    </tr>
  );
}

function WeightHistory() {
  const { weightRecords, weightUnit, deleteWeight } = useContext(WeightContext);

  const sortedWeightRecords = useMemo(() => weightRecords.sort((a, b) => a.date.localeCompare(b.date)), [weightRecords]);

  return (
    <div>
      <h2>Weight History</h2>

      <table className={styles.weightHistoryTable}>
        <tbody>
          {sortedWeightRecords.map((weightRecord) => (
            <WeightHistoryRow
              key={weightRecord.date}
              weightRecord={weightRecord}
              unit={weightUnit}
              onDelete={() => deleteWeight(weightRecord.date)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WeightHistory;
