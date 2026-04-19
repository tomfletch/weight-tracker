import type { ChartData, ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { useSettingsContext } from '../../../../context/SettingsContext';
import { useWeightContext } from '../../../../context/WeightContext';
import { generateMovingAverageSeries } from '../../../../utils/chart/movingAverage';
import { buildBaseLineChartOptions } from '../../../../utils/chart/options';
import { convertSeriesKgToDisplayUnit } from '../../../../utils/chart/weightUnits';
import { parseISODate, toISODate } from '../../../../utils/dates';

export function MovingAverageWeightChart() {
  const { weightRecords, getInterpolatedWeight, weightTargetKgs, weightUnit } =
    useWeightContext();
  const { accentColour } = useSettingsContext();
  const today = toISODate(new Date());

  if (weightRecords.length === 0) {
    return <div>Not enough data</div>;
  }

  const firstDate = parseISODate(weightRecords[0].date);
  const lastDate = parseISODate(weightRecords[weightRecords.length - 1].date);

  const { dates, weights } = generateMovingAverageSeries(
    firstDate,
    lastDate,
    getInterpolatedWeight,
    true,
  );

  let targetWeights: number[] = [];
  if (weightTargetKgs) {
    targetWeights = dates.map(() => weightTargetKgs);
  }

  const displayWeights = convertSeriesKgToDisplayUnit(weights, weightUnit);
  const displayTargetWeights = convertSeriesKgToDisplayUnit(
    targetWeights.map((w) => w),
    weightUnit,
  );

  const chartData: ChartData<'line'> = {
    labels: dates,
    datasets: [
      {
        label: 'Moving Average Weight',
        data: displayWeights,
        borderColor: accentColour,
        borderWidth: 1,
        backgroundColor: accentColour,
        pointHitRadius: 500,
      },
      {
        label: 'Target Weight',
        data: displayTargetWeights,
        borderColor: '#e65424',
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 0,
        pointHitRadius: 0,
        showLabel: true,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = buildBaseLineChartOptions({
    weightUnit,
    maxDate: today,
  });

  return (
    <div className="card">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}
