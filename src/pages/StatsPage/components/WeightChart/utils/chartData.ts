import type { ChartData, ChartOptions, TooltipItem } from 'chart.js';
import {
  type WeightRecord,
  WeightUnit,
} from '../../../../../context/WeightContext';
import { createTooltip } from '../../../../../utils/chartjs';
import {
  daysBetween,
  parseISODate,
  toISODate,
} from '../../../../../utils/dates';
import {
  convertKgToLb,
  formatKg,
  formatLb,
  formatLbAsStLb,
} from '../../../../../utils/weights';

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

function getInterpolatedWeightKgs(
  date: string,
  weightRecords: WeightRecord[],
): number | null {
  const exact = weightRecords.find(
    (weightRecord) => weightRecord.date === date,
  );
  if (exact) {
    return exact.weightKgs;
  }

  let nearestRecordBefore: WeightRecord | null = null;
  let nearestRecordAfter: WeightRecord | null = null;

  for (const weightRecord of weightRecords) {
    if (weightRecord.date < date) {
      nearestRecordBefore = weightRecord;
      continue;
    }

    if (weightRecord.date > date) {
      nearestRecordAfter = weightRecord;
      break;
    }
  }

  if (!nearestRecordBefore || !nearestRecordAfter) {
    return null;
  }

  const beforeDate = parseISODate(nearestRecordBefore.date);
  const afterDate = parseISODate(nearestRecordAfter.date);
  const targetDate = parseISODate(date);
  const deltaDays = daysBetween(beforeDate, afterDate);

  if (deltaDays === 0) {
    return nearestRecordBefore.weightKgs;
  }

  const targetDays = daysBetween(beforeDate, targetDate);
  const deltaWeight =
    nearestRecordAfter.weightKgs - nearestRecordBefore.weightKgs;

  return nearestRecordBefore.weightKgs + (deltaWeight / deltaDays) * targetDays;
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

function convertSeriesToWeightUnit(
  values: (number | null)[],
  weightUnit: WeightUnit,
): (number | null)[] {
  if (weightUnit === WeightUnit.KGS) {
    return values;
  }

  return values.map((weightKg) =>
    weightKg === null ? null : Math.round(convertKgToLb(weightKg) * 10) / 10,
  );
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

  const weights = convertSeriesToWeightUnit(
    dates.map((date) => getInterpolatedWeightKgs(date, weightRecords)),
    weightUnit,
  );
  const targetWeights = convertSeriesToWeightUnit(
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

function formatWeightLabel(value: number, weightUnit: WeightUnit): string {
  if (weightUnit === WeightUnit.KGS) {
    return formatKg(value);
  }
  if (weightUnit === WeightUnit.LBS) {
    return formatLb(value);
  }
  return formatLbAsStLb(value);
}

function formatWeightTick(value: number, weightUnit: WeightUnit): string {
  if (weightUnit === WeightUnit.KGS) {
    return formatKg(value, 0);
  }
  if (weightUnit === WeightUnit.LBS) {
    return formatLb(value, 0);
  }
  return formatLbAsStLb(value, 0);
}

export function getWeightChartOptions(
  weightUnit: WeightUnit,
  dateRange: WeightChartDateRange,
): ChartOptions<'line'> {
  const { startDateStr, endDateStr } = dateRange;

  return {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        filter(tooltipItem: TooltipItem<'line'>) {
          return tooltipItem.datasetIndex === 0;
        },
        position: 'nearest',
        callbacks: {
          label(context: TooltipItem<'line'>) {
            if (context.parsed.y === null) {
              return '';
            }
            return formatWeightLabel(context.parsed.y, weightUnit);
          },
        },
        external: createTooltip,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: true,
    },
    spanGaps: true,
    clip: false,
    scales: {
      x: {
        type: 'time',
        min: startDateStr,
        max: endDateStr,
        time: {
          unit: 'day',
        },
      },
      y: {
        ticks: {
          callback: (value: number | string): string => {
            if (typeof value !== 'number') {
              return '';
            }

            return formatWeightTick(value, weightUnit);
          },
        },
      },
    },
  };
}
