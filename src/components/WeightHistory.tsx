import { useContext, useMemo } from 'react';
import WeightContext, { WeightRecord, WeightUnit } from '../context/WeightContext';
import { formatWeight } from '../utils/weightConversion';

function WeightHistoryRow({weightRecord, unit}: {weightRecord: WeightRecord, unit: WeightUnit}) {
  const weightStr = formatWeight(weightRecord, unit);

  const date = new Date(weightRecord.date);

  return (
    <tr>
      <td>{date.toLocaleDateString()}</td>
      <td>{weightStr}</td>
    </tr>
  );
}

function WeightHistory() {
  const { weightRecords, weightUnit } = useContext(WeightContext);

  const sortedWeightRecords = useMemo(() => weightRecords.sort((a, b) => a.date.localeCompare(b.date)), [weightRecords]);

  return (
    <div>
      <h2>Weight History</h2>

      <table>
        <tbody>
          {sortedWeightRecords.map((weightRecord) => (
            <WeightHistoryRow key={weightRecord.date} weightRecord={weightRecord} unit={weightUnit} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WeightHistory;
