import type { ChartData, ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { useAppSettings } from '~/hooks/useAppSettings';
import { useAppWeight } from '~/hooks/useAppWeight';
import {
  getMovingAverageDeltaChartData,
  getMovingAverageDeltaChartOptions,
} from './chartData';

export function MovingAverageDeltaChart() {
  const { weightRecords, weightUnit } = useAppWeight();
  const { accentColour } = useAppSettings();

  if (weightRecords.length === 0) {
    return <div>Not enough data</div>;
  }

  const chartData: ChartData<'line'> = getMovingAverageDeltaChartData({
    weightRecords,
    weightUnit,
    accentColour,
  });

  const chartOptions: ChartOptions<'line'> =
    getMovingAverageDeltaChartOptions(weightUnit);

  return (
    <div className="card">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}
