import type { ChartData } from 'chart.js';
import { describe, expect, it } from 'vitest';
import {
  type WeightRecord,
  WeightUnit,
} from '../../../../../src/context/WeightContext';
import {
  getMovingAverageWeightChartData,
  getMovingAverageWeightChartOptions,
} from '../../../../../src/pages/StatsPage/components/MovingAverageWeightChart/chartData';

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

describe('movingAverageWeightChart chartData utils', () => {
  describe('getMovingAverageWeightChartData', () => {
    it('should build chart datasets with expected labels and colors', () => {
      const chartData = getMovingAverageWeightChartData({
        weightRecords,
        weightTargetKgs: 80,
        weightUnit: WeightUnit.KGS,
        accentColour: '#123456',
      });

      expect(chartData.datasets).toHaveLength(2);
      expect(chartData.datasets[0].label).toBe('Moving Average Weight');
      expect(chartData.datasets[0].borderColor).toBe('#123456');
      expect(chartData.datasets[1].label).toBe('Target Weight');
      expect(chartData.datasets[1].borderColor).toBe('#e65424');
    });

    it('should include date labels from first to last record', () => {
      const chartData = getMovingAverageWeightChartData({
        weightRecords,
        weightTargetKgs: 80,
        weightUnit: WeightUnit.KGS,
        accentColour: '#123456',
      });

      const labels = getRequiredLabels(chartData);
      expect(labels[0]).toBe('2025-01-01');
      expect(labels[labels.length - 1]).toBe('2025-01-11');
    });

    it('should include constant target line when weight target exists', () => {
      const chartData = getMovingAverageWeightChartData({
        weightRecords,
        weightTargetKgs: 82,
        weightUnit: WeightUnit.KGS,
        accentColour: '#123456',
      });

      const targetData = chartData.datasets[1].data;
      expect(targetData.length).toBeGreaterThan(0);
      targetData.forEach((value) => {
        expect(value).toBe(82);
      });
    });

    it('should produce empty target dataset when weight target is null', () => {
      const chartData = getMovingAverageWeightChartData({
        weightRecords,
        weightTargetKgs: null,
        weightUnit: WeightUnit.KGS,
        accentColour: '#123456',
      });

      expect(chartData.datasets[1].data).toEqual([]);
    });

    it('should convert moving average and target data to lbs', () => {
      const chartData = getMovingAverageWeightChartData({
        weightRecords,
        weightTargetKgs: 80,
        weightUnit: WeightUnit.LBS,
        accentColour: '#123456',
      });

      const targetData = chartData.datasets[1].data;
      expect(targetData[0]).toBe(176.4);
    });
  });

  describe('getMovingAverageWeightChartOptions', () => {
    it('should build options with provided max date', () => {
      const options = getMovingAverageWeightChartOptions(
        WeightUnit.KGS,
        '2025-02-01',
      );

      expect(options.scales?.x?.max).toBe('2025-02-01');
      expect(options.plugins?.legend?.display).toBe(false);
    });

    it('should support alternative weight units', () => {
      const options = getMovingAverageWeightChartOptions(
        WeightUnit.STONES_LBS,
        '2025-02-01',
      );

      expect(options.scales?.x?.max).toBe('2025-02-01');
      expect(options.scales?.x?.type).toBe('time');
    });
  });
});
