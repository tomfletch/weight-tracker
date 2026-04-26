import type { ChartData, ChartOptions } from 'chart.js';
import type { WeightRecord, WeightUnit } from '~/types/weight';
import { generateMovingAverageSeries } from '~/utils/chart/movingAverage';
import { buildBaseLineChartOptions } from '~/utils/chart/options';
import { convertSeriesKgToDisplayUnit } from '~/utils/chart/weightUnits';
import { parseISODate, toISODate } from '~/utils/dates';

export function getMovingAverageWeightChartData({
  weightRecords,
  weightTargetKgs,
  weightUnit,
  accentColour,
}: {
  weightRecords: WeightRecord[];
  weightTargetKgs: number | null;
  weightUnit: WeightUnit;
  accentColour: string;
}): ChartData<'line'> {
  const firstDate = parseISODate(weightRecords[0].date);
  const lastDate = parseISODate(weightRecords[weightRecords.length - 1].date);

  const { dates, weights } = generateMovingAverageSeries(
    firstDate,
    lastDate,
    weightRecords,
    true,
  );

  const targetWeights =
    weightTargetKgs === null ? [] : dates.map(() => weightTargetKgs);

  const displayWeights = convertSeriesKgToDisplayUnit(weights, weightUnit);
  const displayTargetWeights = convertSeriesKgToDisplayUnit(
    targetWeights,
    weightUnit,
  );

  return {
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
        borderDash: [4, 2],
        pointRadius: 0,
        pointHoverRadius: 0,
        pointHitRadius: 0,
        showLabel: true,
      },
    ],
  };
}

export function getMovingAverageWeightChartOptions(
  weightUnit: WeightUnit,
  maxDate: string = toISODate(new Date()),
): ChartOptions<'line'> {
  return buildBaseLineChartOptions({
    weightUnit,
    maxDate,
  });
}
