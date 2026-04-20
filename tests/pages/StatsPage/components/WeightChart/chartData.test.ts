import type { ChartData } from 'chart.js';
import { describe, expect, it } from 'vitest';
import {
  CHART_PERIODS,
  getWeightChartData,
  getWeightChartDateRange,
  getWeightChartOptions,
} from '../../../../../src/pages/StatsPage/components/WeightChart/chartData';
import { type WeightRecord, WeightUnit } from '../../../../../src/types/weight';

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
  describe('CHART_PERIODS', () => {
    it('should export all expected periods', () => {
      expect(CHART_PERIODS.length).toBe(4);
      expect(CHART_PERIODS.map((p) => p.key)).toEqual([
        'ALL',
        '1Y',
        '3M',
        '1M',
      ]);
    });

    it('should have descriptive labels for each period', () => {
      expect(CHART_PERIODS[0].label).toBe('All Time');
      expect(CHART_PERIODS[1].label).toBe('1 Year');
      expect(CHART_PERIODS[2].label).toBe('3 Months');
      expect(CHART_PERIODS[3].label).toBe('1 Month');
    });
  });

  describe('getWeightChartDateRange', () => {
    it('should return date range for ALL period', () => {
      const dateRange = getWeightChartDateRange({
        weightRecords,
        periodKey: 'ALL',
        endDate: new Date(2025, 0, 20),
      });

      expect(dateRange.startDateStr).toBe('2025-01-01');
      expect(dateRange.endDateStr).toBe('2025-01-20');
    });

    it('should return date range for 1Y period', () => {
      const dateRange = getWeightChartDateRange({
        weightRecords,
        periodKey: '1Y',
        endDate: new Date(2025, 0, 31),
      });

      expect(dateRange.endDateStr).toBe('2025-01-31');
      expect(dateRange.startDateStr).toBe('2024-01-31');
    });

    it('should return date range for 3M period', () => {
      const dateRange = getWeightChartDateRange({
        weightRecords,
        periodKey: '3M',
        endDate: new Date(2025, 2, 31),
      });

      expect(dateRange.endDateStr).toBe('2025-03-31');
      expect(dateRange.startDateStr).toBe('2024-12-31');
    });

    it('should return date range for 1M period', () => {
      const dateRange = getWeightChartDateRange({
        weightRecords,
        periodKey: '1M',
        endDate: new Date(2025, 0, 31),
      });

      expect(dateRange.endDateStr).toBe('2025-01-31');
      expect(dateRange.startDateStr).toBe('2024-12-31');
    });

    it('should use current date when endDate is not provided', () => {
      const dateRange = getWeightChartDateRange({
        weightRecords,
        periodKey: 'ALL',
      });

      expect(dateRange.endDateStr).toBeDefined();
    });
  });

  describe('getWeightChartData', () => {
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
  });

  describe('getWeightChartOptions', () => {
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

    it('should format tooltip labels in kg', () => {
      const dateRange = getWeightChartDateRange({
        weightRecords,
        periodKey: 'ALL',
        endDate: new Date(2025, 0, 1),
      });
      const options = getWeightChartOptions(WeightUnit.KGS, dateRange);

      const callbacks = options.plugins?.tooltip?.callbacks;
      expect(callbacks?.label).toBeDefined();
    });

    it('should set legend display to false', () => {
      const dateRange = getWeightChartDateRange({
        weightRecords,
        periodKey: 'ALL',
        endDate: new Date(2025, 0, 1),
      });
      const options = getWeightChartOptions(WeightUnit.KGS, dateRange);

      expect(options.plugins?.legend?.display).toBe(false);
    });

    it('should configure time scale with day unit', () => {
      const dateRange = getWeightChartDateRange({
        weightRecords,
        periodKey: 'ALL',
        endDate: new Date(2025, 0, 1),
      });
      const options = getWeightChartOptions(WeightUnit.KGS, dateRange);

      const xScale = options.scales?.x;
      expect(xScale?.type).toBe('time');
      expect(xScale).toBeDefined();
      if (!xScale || !('time' in xScale) || !xScale.time) {
        throw new Error('Expected x-scale time configuration to be defined');
      }
      expect(xScale.time.unit).toBe('day');
    });
  });
});
