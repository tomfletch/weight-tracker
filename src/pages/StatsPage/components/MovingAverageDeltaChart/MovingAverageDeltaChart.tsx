import type { ChartData, ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { useSettingsContext } from '../../../../context/SettingsContext';
import { useWeightContext } from '../../../../context/WeightContext';
import { generateMovingAverageSeries } from '../../../../utils/chart/movingAverage';
import { buildBaseLineChartOptions } from '../../../../utils/chart/options';
import { convertSeriesKgToDisplayUnit } from '../../../../utils/chart/weightUnits';
import { parseISODate, toISODate } from '../../../../utils/dates';

export function MovingAverageDeltaChart() {
  const { weightRecords, getInterpolatedWeight, weightUnit } =
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

  const deltaWeights = weights.map((current, index) => {
    if (index === 0 || current === null) {
      return null;
    }

    const previous = weights[index - 1];
    if (previous === null) {
      return null;
    }

    return current - previous;
  });

  const displayDeltaWeights = convertSeriesKgToDisplayUnit(
    deltaWeights,
    weightUnit,
  );

  const chartData: ChartData<'line'> = {
    labels: dates,
    datasets: [
      {
        label: 'Weight Delta',
        data: displayDeltaWeights,
        borderColor: accentColour,
        borderWidth: 1,
        backgroundColor: accentColour,
        pointHitRadius: 500,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = buildBaseLineChartOptions({
    weightUnit,
    maxDate: today,
    yAxisConfig: {
      beginAtZero: true,
    },
  });

  return (
    <div className="card">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}
