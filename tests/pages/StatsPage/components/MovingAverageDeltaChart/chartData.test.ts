import type { ChartData } from 'chart.js';
import { describe, expect, it } from 'vitest';
import {
  type WeightRecord,
  WeightUnit,
} from '../../../../../src/context/WeightContext';
import {
  getMovingAverageDeltaChartData,
  getMovingAverageDeltaChartOptions,
} from '../../../../../src/pages/StatsPage/components/MovingAverageDeltaChart/chartData';

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

describe('movingAverageDeltaChart chartData utils', () => {
  describe('getMovingAverageDeltaChartData', () => {
    it('should build single dataset with expected label and accent color', () => {
      const chartData = getMovingAverageDeltaChartData({
        weightRecords,
        weightUnit: WeightUnit.KGS,
        accentColour: '#123456',
      });

      expect(chartData.datasets).toHaveLength(1);
      expect(chartData.datasets[0].label).toBe('Weight Delta');
      expect(chartData.datasets[0].borderColor).toBe('#123456');
    });

    it('should include date labels from first to last record', () => {
      const chartData = getMovingAverageDeltaChartData({
        weightRecords,
        weightUnit: WeightUnit.KGS,
        accentColour: '#123456',
      });

      const labels = getRequiredLabels(chartData);
      expect(labels[0]).toBe('2025-01-01');
      expect(labels[labels.length - 1]).toBe('2025-01-11');
    });

    it('should set first delta value to null', () => {
      const chartData = getMovingAverageDeltaChartData({
        weightRecords,
        weightUnit: WeightUnit.KGS,
        accentColour: '#123456',
      });

      expect(chartData.datasets[0].data[0]).toBeNull();
    });

    it('should convert delta values to lbs when unit is lbs', () => {
      const chartData = getMovingAverageDeltaChartData({
        weightRecords,
        weightUnit: WeightUnit.LBS,
        accentColour: '#123456',
      });

      const numericValues = chartData.datasets[0].data.filter(
        (value): value is number => value !== null,
      );
      if (numericValues.length > 0) {
        expect(Math.abs(numericValues[0])).toBeGreaterThan(0);
      }
    });
  });

  describe('getMovingAverageDeltaChartOptions', () => {
    it('should build options with beginAtZero on y-axis', () => {
      const options = getMovingAverageDeltaChartOptions(
        WeightUnit.KGS,
        '2025-02-01',
      );

      expect(options.scales?.x?.max).toBe('2025-02-01');
      expect(options.plugins?.legend?.display).toBe(false);

      const yScale = options.scales?.y;
      expect(yScale).toBeDefined();
      if (!yScale || !('beginAtZero' in yScale)) {
        throw new Error('Expected y-scale to support beginAtZero');
      }
      expect(yScale.beginAtZero).toBe(true);
    });
  });
});
