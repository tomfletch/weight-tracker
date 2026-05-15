import type { ChartData, ChartOptions } from 'chart.js';
import type { WeightRecord, WeightUnit } from '~/types/weight';
import type { OnChartTooltipChange } from '~/utils/chart/createTooltip';
import { generateMovingAverageSeries } from '~/utils/chart/movingAverage';
import { buildBaseLineChartOptions } from '~/utils/chart/options';
import { convertSeriesKgToDisplayUnit } from '~/utils/chart/weightUnits';
import { parseISODate, toISODate } from '~/utils/dates';

export function getMovingAverageDeltaChartData({
  weightRecords,
  weightUnit,
  accentColour,
  movingAverageSize = 7,
}: {
  weightRecords: WeightRecord[];
  weightUnit: WeightUnit;
  accentColour: string;
  movingAverageSize?: number;
}): ChartData<'line'> {
  const firstDate = parseISODate(weightRecords[0].date);
  const lastDate = parseISODate(weightRecords[weightRecords.length - 1].date);

  const { dates, weights } = generateMovingAverageSeries(
    firstDate,
    lastDate,
    weightRecords,
    movingAverageSize,
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

    const dailyDelta = current - previous;
    return dailyDelta * 7;
  });

  const displayDeltaWeights = convertSeriesKgToDisplayUnit(
    deltaWeights,
    weightUnit,
  );

  return {
    labels: dates,
    datasets: [
      {
        label: 'Weekly Weight Delta',
        data: displayDeltaWeights,
        borderColor: accentColour,
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 0,
        pointHitRadius: 500,
        pointBackgroundColor: accentColour,
      },
    ],
  };
}

export function getMovingAverageDeltaChartOptions(
  weightUnit: WeightUnit,
  maxDate: string = toISODate(new Date()),
  onTooltipChange?: OnChartTooltipChange,
): ChartOptions<'line'> {
  return buildBaseLineChartOptions({
    weightUnit,
    onTooltipChange,
    maxDate,
    yAxisConfig: {
      beginAtZero: true,
      precision: 1,
    },
  });
}
