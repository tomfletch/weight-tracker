import type { ChartData, ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { useSettingsContext } from '../../../../context/SettingsContext';
import { useWeightContext } from '../../../../context/WeightContext';
import {
  getMovingAverageWeightChartData,
  getMovingAverageWeightChartOptions,
} from './chartData';

export function MovingAverageWeightChart() {
  const { weightRecords, weightTargetKgs, weightUnit } = useWeightContext();
  const { accentColour } = useSettingsContext();

  if (weightRecords.length === 0) {
    return <div>Not enough data</div>;
  }

  const chartData: ChartData<'line'> = getMovingAverageWeightChartData({
    weightRecords,
    weightTargetKgs,
    weightUnit,
    accentColour,
  });

  const chartOptions: ChartOptions<'line'> =
    getMovingAverageWeightChartOptions(weightUnit);

  return (
    <div className="card">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}
