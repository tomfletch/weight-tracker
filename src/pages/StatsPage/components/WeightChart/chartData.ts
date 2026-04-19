import type { ChartData, ChartOptions } from 'chart.js';
import type {
  WeightRecord,
  WeightUnit,
} from '../../../../context/WeightContext';
import { buildBaseLineChartOptions } from '../../../../utils/chart/options';
import { convertSeriesKgToDisplayUnit } from '../../../../utils/chart/weightUnits';
import { parseISODate, toISODate } from '../../../../utils/dates';
import { interpolateWeightAtDateString } from '../../../../utils/weightInterpolation';

export const CHART_PERIODS = [
  { key: 'ALL', label: 'All Time' },
  { key: '1Y', label: '1 Year' },
  { key: '3M', label: '3 Months' },
  { key: '1M', label: '1 Month' },
] as const;

export type ChartPeriod = (typeof CHART_PERIODS)[number];
export type ChartPeriodKey = ChartPeriod['key'];

export interface WeightChartDateRange {
  startDateStr: string;
  endDateStr: string;
}

function insertSortedUniqueDate(dates: string[], newDate: string) {
  let index = 0;
  while (index < dates.length && dates[index] < newDate) {
    index++;
  }

  if (dates[index] !== newDate) {
    dates.splice(index, 0, newDate);
  }
}

function getPeriodStartDate(
  periodKey: ChartPeriodKey,
  startDateAll: Date,
  endDate: Date,
): Date {
  if (periodKey === 'ALL') {
    return startDateAll;
  }

  const startDate = new Date(endDate);

  if (periodKey === '1Y') {
    startDate.setFullYear(endDate.getFullYear() - 1);
  } else if (periodKey === '3M') {
    startDate.setMonth(endDate.getMonth() - 3);
  } else {
    startDate.setMonth(endDate.getMonth() - 1);
  }

  return startDate;
}

export function getWeightChartDateRange({
  weightRecords,
  periodKey,
  endDate = new Date(),
}: {
  weightRecords: WeightRecord[];
  periodKey: ChartPeriodKey;
  endDate?: Date;
}): WeightChartDateRange {
  const endDateStr = toISODate(endDate);
  const startDateAll = parseISODate(weightRecords[0].date);
  const startDateStr = toISODate(
    getPeriodStartDate(periodKey, startDateAll, endDate),
  );

  return {
    startDateStr,
    endDateStr,
  };
}

export function getWeightChartData({
  weightRecords,
  weightTargetKgs,
  weightUnit,
  accentColour,
  dateRange,
}: {
  weightRecords: WeightRecord[];
  weightTargetKgs: number | null;
  weightUnit: WeightUnit;
  accentColour: string;
  dateRange: WeightChartDateRange;
}): ChartData<'line'> {
  const dates = weightRecords.map((weightRecord) => weightRecord.date);
  const { startDateStr, endDateStr } = dateRange;
  const endDate = parseISODate(endDateStr);
  const startDateAll = parseISODate(dates[0]);

  insertSortedUniqueDate(dates, toISODate(startDateAll));
  insertSortedUniqueDate(
    dates,
    toISODate(getPeriodStartDate('1Y', startDateAll, endDate)),
  );
  insertSortedUniqueDate(
    dates,
    toISODate(getPeriodStartDate('3M', startDateAll, endDate)),
  );
  insertSortedUniqueDate(
    dates,
    toISODate(getPeriodStartDate('1M', startDateAll, endDate)),
  );
  insertSortedUniqueDate(dates, endDateStr);

  const weights = convertSeriesKgToDisplayUnit(
    dates.map((date) => interpolateWeightAtDateString(date, weightRecords)),
    weightUnit,
  );
  const targetWeights = convertSeriesKgToDisplayUnit(
    dates.map((date) =>
      date === startDateStr || date === endDateStr ? weightTargetKgs : null,
    ),
    weightUnit,
  );

  return {
    labels: dates,
    datasets: [
      {
        label: 'Weight',
        data: weights,
        borderColor: accentColour,
        borderWidth: 1,
        backgroundColor: accentColour,
        pointHitRadius: 500,
      },
      {
        label: 'Target Weight',
        data: targetWeights,
        borderColor: '#e65424',
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 0,
        pointHitRadius: 0,
        showLabel: true,
        animation: false,
      },
    ],
  };
}

export function getWeightChartOptions(
  weightUnit: WeightUnit,
  dateRange: WeightChartDateRange,
): ChartOptions<'line'> {
  const { startDateStr, endDateStr } = dateRange;

  return buildBaseLineChartOptions({
    weightUnit,
    minDate: startDateStr,
    maxDate: endDateStr,
  });
}
