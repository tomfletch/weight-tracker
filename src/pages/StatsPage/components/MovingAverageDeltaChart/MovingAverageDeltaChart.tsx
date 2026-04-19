import type { ChartData, ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { useSettingsContext } from '../../../../context/SettingsContext';
import { useWeightContext } from '../../../../context/WeightContext';
import {
  getMovingAverageDeltaChartData,
  getMovingAverageDeltaChartOptions,
} from './chartData';

export function MovingAverageDeltaChart() {
  const { weightRecords, weightUnit } = useWeightContext();
  const { accentColour } = useSettingsContext();

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
