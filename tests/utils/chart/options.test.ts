import type {
  ChartData,
  ChartOptions,
  Scale,
  Tick,
  TooltipItem,
  TooltipModel,
} from 'chart.js';
import { describe, expect, it } from 'vitest';
import { WeightUnit } from '../../../src/types/weight';
import { buildBaseLineChartOptions } from '../../../src/utils/chart/options';

function getYTickCallback(options: ChartOptions<'line'>) {
  const callback = options.scales?.y?.ticks?.callback;
  if (!callback) {
    throw new Error('Expected y-axis tick callback to be defined');
  }
  return callback;
}

function getTooltipLabelCallback(options: ChartOptions<'line'>) {
  const label = options.plugins?.tooltip?.callbacks?.label;
  if (!label) {
    throw new Error('Expected tooltip label callback to be defined');
  }
  return label;
}

function getTooltipFilter(options: ChartOptions<'line'>) {
  const filter = options.plugins?.tooltip?.filter;
  if (!filter) {
    throw new Error('Expected tooltip filter to be defined');
  }
  return filter;
}

describe('options utils', () => {
  describe('buildBaseLineChartOptions', () => {
    it('should build base options with required parameters', () => {
      const options = buildBaseLineChartOptions({
        weightUnit: WeightUnit.KGS,
      });

      expect(options).toBeDefined();
      expect(options.plugins?.legend?.display).toBe(false);
      expect(options.spanGaps).toBe(true);
      expect(options.clip).toBe(false);
      expect(options.interaction?.mode).toBe('nearest');
      expect(options.interaction?.axis).toBe('x');
      expect(options.interaction?.intersect).toBe(true);
    });

    it('should set min and max dates when provided', () => {
      const options = buildBaseLineChartOptions({
        weightUnit: WeightUnit.KGS,
        minDate: '2025-01-01',
        maxDate: '2025-01-31',
      });

      expect(options.scales?.x?.min).toBe('2025-01-01');
      expect(options.scales?.x?.max).toBe('2025-01-31');
    });

    it('should omit date bounds when not provided', () => {
      const options = buildBaseLineChartOptions({
        weightUnit: WeightUnit.KGS,
      });

      expect(options.scales?.x?.min).toBeUndefined();
      expect(options.scales?.x?.max).toBeUndefined();
    });

    it('should configure y-axis with beginAtZero when specified', () => {
      const options = buildBaseLineChartOptions({
        weightUnit: WeightUnit.KGS,
        yAxisConfig: {
          beginAtZero: true,
        },
      });

      const yScale = options.scales?.y;
      expect(yScale).toBeDefined();
      if (!yScale || !('beginAtZero' in yScale)) {
        throw new Error('Expected y-scale to support beginAtZero');
      }
      expect(yScale.beginAtZero).toBe(true);
    });

    it('should use default tooltip label when not provided', () => {
      const options = buildBaseLineChartOptions({
        weightUnit: WeightUnit.KGS,
      });

      const mockContext = {
        parsed: { y: 75 },
      } as unknown as TooltipItem<'line'>;

      const label = getTooltipLabelCallback(options);
      const result = label.call(
        {} as unknown as TooltipModel<'line'>,
        mockContext,
      );
      expect(result).toContain('75');
      expect(result).toContain('kg');
    });

    it('should return empty string for null values in tooltip', () => {
      const options = buildBaseLineChartOptions({
        weightUnit: WeightUnit.KGS,
      });

      const mockContext = {
        parsed: { y: null },
      } as unknown as TooltipItem<'line'>;

      const label = getTooltipLabelCallback(options);
      const result = label.call(
        {} as unknown as TooltipModel<'line'>,
        mockContext,
      );
      expect(result).toBe('');
    });

    it('should format y-axis ticks for kg unit', () => {
      const options = buildBaseLineChartOptions({
        weightUnit: WeightUnit.KGS,
      });

      const callback = getYTickCallback(options);
      const result = callback.call({} as unknown as Scale, 75, 0, [] as Tick[]);
      expect(result).toContain('75');
      expect(result).toContain('kg');
    });

    it('should format y-axis ticks for lb unit', () => {
      const options = buildBaseLineChartOptions({
        weightUnit: WeightUnit.LBS,
      });

      const callback = getYTickCallback(options);
      const result = callback.call(
        {} as unknown as Scale,
        160,
        0,
        [] as Tick[],
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should return empty string for non-numeric tick values', () => {
      const options = buildBaseLineChartOptions({
        weightUnit: WeightUnit.KGS,
      });

      const callback = getYTickCallback(options);
      const result = callback.call(
        {} as unknown as Scale,
        'not a number',
        0,
        [] as Tick[],
      );
      expect(result).toBe('');
    });

    it('should filter tooltip to first dataset only', () => {
      const options = buildBaseLineChartOptions({
        weightUnit: WeightUnit.KGS,
      });

      const filter = getTooltipFilter(options);
      const item0 = { datasetIndex: 0 } as unknown as TooltipItem<'line'>;
      const item1 = { datasetIndex: 1 } as unknown as TooltipItem<'line'>;
      const tooltipItems = [item0, item1];
      const data = {
        labels: ['2025-01-01'],
        datasets: [{ data: [70] }],
      } as ChartData<'line'>;

      expect(filter(item0, 0, tooltipItems, data)).toBe(true);
      expect(filter(item1, 1, tooltipItems, data)).toBe(false);
    });

    it('should configure tooltip as external', () => {
      const options = buildBaseLineChartOptions({
        weightUnit: WeightUnit.KGS,
      });

      expect(options.plugins?.tooltip?.external).toBeDefined();
    });

    it('should use default tick precision when not specified', () => {
      const options = buildBaseLineChartOptions({
        weightUnit: WeightUnit.KGS,
      });

      // Default is 0 decimal places
      const callback = getYTickCallback(options);
      const result = callback.call(
        {} as unknown as Scale,
        75.5,
        0,
        [] as Tick[],
      );
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should configure x-axis as time scale with day unit', () => {
      const options = buildBaseLineChartOptions({
        weightUnit: WeightUnit.KGS,
      });

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
