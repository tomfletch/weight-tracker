import type { ChartData } from 'chart.js';
import { describe, expect, it } from 'vitest';
import {
  type WeightRecord,
  WeightUnit,
} from '../../../../../../src/context/WeightContext';
import {
  getWeightChartData,
  getWeightChartDateRange,
  getWeightChartOptions,
} from '../../../../../../src/pages/StatsPage/components/WeightChart/utils/chartData';

const weightRecords: WeightRecord[] = [
  { date: '2025-01-01', weightKgs: 100 },
  { date: '2025-01-11', weightKgs: 90 },
];

function getRequiredLabels(chartData: ChartData<'line'>) {
  if (!chartData.labels) {
    throw new Error('Expected chart data labels to be defined');
  }

  return chartData.labels;
}

describe('chartData utils', () => {
  it('should include expected boundary dates and interpolate weights', () => {
    const dateRange = getWeightChartDateRange({
      weightRecords,
      periodKey: 'ALL',
      endDate: new Date(2025, 0, 6),
    });

    const chartData = getWeightChartData({
      weightRecords,
      weightTargetKgs: 80,
      weightUnit: WeightUnit.KGS,
      accentColour: '#123456',
      dateRange,
    });

    const labels = getRequiredLabels(chartData);

    expect(labels).toContain('2025-01-01');
    expect(labels).toContain('2025-01-06');

    const weightIndex = labels.indexOf('2025-01-06');
    expect(chartData.datasets[0].data[weightIndex]).toBe(95);
  });

  it('should return null when interpolation is not possible', () => {
    const dateRange = getWeightChartDateRange({
      weightRecords,
      periodKey: 'ALL',
      endDate: new Date(2026, 0, 1),
    });

    const chartData = getWeightChartData({
      weightRecords,
      weightTargetKgs: 80,
      weightUnit: WeightUnit.KGS,
      accentColour: '#123456',
      dateRange,
    });

    const labels = getRequiredLabels(chartData);

    const endIndex = labels.indexOf('2026-01-01');
    expect(chartData.datasets[0].data[endIndex]).toBeNull();
  });

  it('should set target weights at period start and end', () => {
    const dateRange = getWeightChartDateRange({
      weightRecords,
      periodKey: '1M',
      endDate: new Date(2025, 0, 31),
    });

    const chartData = getWeightChartData({
      weightRecords,
      weightTargetKgs: 82,
      weightUnit: WeightUnit.KGS,
      accentColour: '#123456',
      dateRange,
    });

    const labels = getRequiredLabels(chartData);

    const startIndex = labels.indexOf(dateRange.startDateStr);
    const endIndex = labels.indexOf(dateRange.endDateStr);

    expect(chartData.datasets[1].data[startIndex]).toBe(82);
    expect(chartData.datasets[1].data[endIndex]).toBe(82);
  });

  it('should convert output data to lbs for non-kg units', () => {
    const dateRange = getWeightChartDateRange({
      weightRecords,
      periodKey: 'ALL',
      endDate: new Date(2025, 0, 1),
    });

    const chartData = getWeightChartData({
      weightRecords,
      weightTargetKgs: 80,
      weightUnit: WeightUnit.LBS,
      accentColour: '#123456',
      dateRange,
    });

    const labels = getRequiredLabels(chartData);

    const startIndex = labels.indexOf('2025-01-01');
    expect(chartData.datasets[0].data[startIndex]).toBe(220.5);
  });

  it('should build date range for period and reuse it in chart options', () => {
    const dateRange = getWeightChartDateRange({
      weightRecords,
      periodKey: '1M',
      endDate: new Date(2025, 0, 31),
    });
    const options = getWeightChartOptions(WeightUnit.KGS, dateRange);

    expect(dateRange.startDateStr).toBe('2024-12-31');
    expect(dateRange.endDateStr).toBe('2025-01-31');
    expect(options.scales?.x?.min).toBe('2024-12-31');
    expect(options.scales?.x?.max).toBe('2025-01-31');
  });
});
