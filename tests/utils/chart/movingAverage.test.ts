import { describe, expect, it } from 'vitest';
import {
  computeMovingAverage,
  generateMovingAverageSeries,
  MOVING_AVERAGE_OFFSET,
  MOVING_AVERAGE_SIZE,
} from '../../../src/utils/chart/movingAverage';

describe('movingAverage utils', () => {
  describe('MOVING_AVERAGE constants', () => {
    it('should have size of 7', () => {
      expect(MOVING_AVERAGE_SIZE).toBe(7);
    });

    it('should have offset of 3', () => {
      expect(MOVING_AVERAGE_OFFSET).toBe(3);
    });
  });

  describe('computeMovingAverage', () => {
    const weights: { [key: string]: number } = {
      '2025-01-01': 70,
      '2025-01-02': 71,
      '2025-01-03': 72,
      '2025-01-04': 73,
      '2025-01-05': 74,
      '2025-01-06': 75,
      '2025-01-07': 76,
      '2025-01-08': 77,
      '2025-01-09': 78,
      '2025-01-10': 79,
    };

    const mockGetInterpolatedWeight = (date: Date): number | null => {
      const isoDate = date.toISOString().split('T')[0];
      return weights[isoDate] ?? null;
    };

    it('should compute 7-day moving average correctly', () => {
      const date = new Date(2025, 0, 5); // 2025-01-05
      const result = computeMovingAverage(date, mockGetInterpolatedWeight);
      // Average of [71, 72, 73, 74, 75, 76, 77] for dates Jan 2-8 = 74
      expect(result).toBe(74);
    });

    it('should return null if any value in window is null', () => {
      const getInterpolatedWithGap = (date: Date): number | null => {
        const isoDate = date.toISOString().split('T')[0];
        if (isoDate === '2025-01-05') return null;
        return weights[isoDate] ?? null;
      };

      const date = new Date(2025, 0, 5);
      const result = computeMovingAverage(date, getInterpolatedWithGap);
      expect(result).toBeNull();
    });

    it('should return null at boundaries when insufficient data', () => {
      const getInterpolatedWithLimited = (date: Date): number | null => {
        const isoDate = date.toISOString().split('T')[0];
        return weights[isoDate] ?? null;
      };

      // Date before any available weight
      const earlyDate = new Date(2024, 11, 25);
      const result = computeMovingAverage(
        earlyDate,
        getInterpolatedWithLimited,
      );
      expect(result).toBeNull();
    });

    it('should handle edge case with minimal data', () => {
      const minimalWeights: { [key: string]: number } = {
        '2025-01-01': 70,
        '2025-01-02': 71,
        '2025-01-03': 72,
        '2025-01-04': 73,
        '2025-01-05': 74,
        '2025-01-06': 75,
        '2025-01-07': 76,
      };

      const getMinimalInterpolated = (date: Date): number | null => {
        const isoDate = date.toISOString().split('T')[0];
        return minimalWeights[isoDate] ?? null;
      };

      const date = new Date(2025, 0, 4); // 2025-01-04
      const result = computeMovingAverage(date, getMinimalInterpolated);
      // Average of [70, 71, 72, 73, 74, 75, 76] = 73
      expect(result).toBe(73);
    });
  });

  describe('generateMovingAverageSeries', () => {
    const weights: { [key: string]: number | null } = {
      '2025-01-01': 70,
      '2025-01-02': 71,
      '2025-01-03': 72,
      '2025-01-04': 73,
      '2025-01-05': 74,
      '2025-01-06': 75,
      '2025-01-07': 76,
      '2025-01-08': 77,
      '2025-01-09': 78,
      '2025-01-10': 79,
    };

    const mockGetInterpolatedWeight = (date: Date): number | null => {
      const isoDate = date.toISOString().split('T')[0];
      return weights[isoDate] ?? null;
    };

    it('should generate dates and moving averages', () => {
      const firstDate = new Date(2025, 0, 1);
      const lastDate = new Date(2025, 0, 5);

      const { dates, weights: averages } = generateMovingAverageSeries(
        firstDate,
        lastDate,
        mockGetInterpolatedWeight,
        true,
      );

      expect(dates.length).toBe(5);
      expect(averages.length).toBe(5);
      expect(dates[0]).toBe('2025-01-01');
      expect(dates[4]).toBe('2025-01-05');
    });

    it('should respect inclusive parameter', () => {
      const firstDate = new Date(2025, 0, 1);
      const lastDate = new Date(2025, 0, 5);

      const { dates: datesInclusive } = generateMovingAverageSeries(
        firstDate,
        lastDate,
        mockGetInterpolatedWeight,
        true,
      );

      const { dates: datesExclusive } = generateMovingAverageSeries(
        firstDate,
        lastDate,
        mockGetInterpolatedWeight,
        false,
      );

      expect(datesInclusive.length).toBe(5);
      expect(datesExclusive.length).toBe(4);
      expect(datesInclusive[datesInclusive.length - 1]).toBe('2025-01-05');
      expect(datesExclusive[datesExclusive.length - 1]).toBe('2025-01-04');
    });

    it('should include nulls when moving average cannot be computed', () => {
      const { weights: averages } = generateMovingAverageSeries(
        new Date(2025, 0, 1),
        new Date(2025, 0, 10),
        mockGetInterpolatedWeight,
        true,
      );

      // Dates at the boundary (2025-01-01, 2025-01-02, 2025-01-03)
      // should have null values because they can't form complete window
      expect(averages[0]).toBeNull();
      expect(averages[1]).toBeNull();
      expect(averages[2]).toBeNull();

      // Middle dates should have values
      expect(averages[3]).not.toBeNull();
      expect(averages[4]).not.toBeNull();
    });

    it('should generate full date range', () => {
      const firstDate = new Date(2025, 0, 1);
      const lastDate = new Date(2025, 0, 10);

      const { dates } = generateMovingAverageSeries(
        firstDate,
        lastDate,
        mockGetInterpolatedWeight,
        true,
      );

      expect(dates).toEqual([
        '2025-01-01',
        '2025-01-02',
        '2025-01-03',
        '2025-01-04',
        '2025-01-05',
        '2025-01-06',
        '2025-01-07',
        '2025-01-08',
        '2025-01-09',
        '2025-01-10',
      ]);
    });

    it('should handle single day range', () => {
      const date = new Date(2025, 0, 5);

      const { dates, weights: averages } = generateMovingAverageSeries(
        date,
        date,
        mockGetInterpolatedWeight,
        true,
      );

      expect(dates.length).toBe(1);
      expect(averages.length).toBe(1);
      expect(dates[0]).toBe('2025-01-05');
    });
  });
});
