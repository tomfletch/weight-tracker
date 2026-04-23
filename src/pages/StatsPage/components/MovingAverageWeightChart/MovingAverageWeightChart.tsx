import type { ChartData, ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { Card } from '~/components/Card/Card';
import { useAppSettings } from '~/hooks/useAppSettings';
import { useAppWeight } from '~/hooks/useAppWeight';
import {
  getMovingAverageWeightChartData,
  getMovingAverageWeightChartOptions,
} from './chartData';

export function MovingAverageWeightChart() {
  const { weightRecords, weightTargetKgs, weightUnit } = useAppWeight();
  const { accentColour } = useAppSettings();

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
    <Card>
      <Card.Title>Weight Trend (7 Day Average)</Card.Title>
      <p>
        Shows your weight trend using a 7-day moving average, smoothing daily
        fluctuations. Each point averages the 3 days before and after. Your
        target weight is included for reference.
      </p>
      <Line
        aria-label="A chart showing moving average weight over time"
        data={chartData}
        options={chartOptions}
      />
    </Card>
  );
}
