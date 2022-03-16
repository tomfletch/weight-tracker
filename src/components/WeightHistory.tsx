import { useContext, useMemo } from 'react';
import WeightContext, { WeightRecord, WeightUnit } from '../context/WeightContext';
import { formatWeight } from '../utils/weightConversion';

interface WeightHistoryRowProps {
  weightRecord: WeightRecord;
  unit: WeightUnit;
  onDelete: () => void;
};

function WeightHistoryRow({weightRecord, unit, onDelete}: WeightHistoryRowProps) {
  const weightStr = formatWeight(weightRecord, unit);

  const date = new Date(weightRecord.date);

  return (
    <tr>
      <td>{date.toLocaleDateString()}</td>
      <td>{weightStr}</td>
      <td><button type="button" onClick={onDelete}>&times;</button></td>
    </tr>
  );
}

function WeightHistory() {
  const { weightRecords, weightUnit, deleteWeight } = useContext(WeightContext);

  const sortedWeightRecords = useMemo(() => weightRecords.sort((a, b) => a.date.localeCompare(b.date)), [weightRecords]);

  return (
    <div>
      <h2>Weight History</h2>

      <table>
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
