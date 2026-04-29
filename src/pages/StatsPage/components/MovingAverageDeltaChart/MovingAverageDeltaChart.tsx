import type { ChartData, ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { Card } from '~/components/Card/Card';
import { useAppTheme } from '~/hooks/useAppTheme';
import { useAppWeight } from '~/hooks/useAppWeight';
import {
  getMovingAverageDeltaChartData,
  getMovingAverageDeltaChartOptions,
} from './chartData';

export function MovingAverageDeltaChart() {
  const { weightRecords, weightUnit } = useAppWeight();
  const { accentColour } = useAppTheme();

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
    <Card>
      <Card.Title>Weight Change (7 Day Average)</Card.Title>
      <p className="textLight">
        Shows how your 7-day average weight is changing over time.
      </p>
      <Line
        aria-label="A chart showing change in moving average weight over time"
        data={chartData}
        options={chartOptions}
      />
    </Card>
  );
}
