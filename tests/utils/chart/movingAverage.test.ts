import { describe, expect, it } from 'vitest';
import type { WeightRecord } from '~/types/weight';
import {
  computeMovingAverage,
  generateMovingAverageSeries,
  MOVING_AVERAGE_OFFSET,
  MOVING_AVERAGE_SIZE,
} from '~/utils/chart/movingAverage';

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
    const weightRecords: WeightRecord[] = [
      { date: '2025-01-01', weightKgs: 70 },
      { date: '2025-01-02', weightKgs: 71 },
      { date: '2025-01-03', weightKgs: 72 },
      { date: '2025-01-04', weightKgs: 73 },
      { date: '2025-01-05', weightKgs: 74 },
      { date: '2025-01-06', weightKgs: 75 },
      { date: '2025-01-07', weightKgs: 76 },
      { date: '2025-01-08', weightKgs: 77 },
      { date: '2025-01-09', weightKgs: 78 },
      { date: '2025-01-10', weightKgs: 79 },
    ];

    it('should compute 7-day moving average correctly', () => {
      const date = new Date(2025, 0, 5); // 2025-01-05
      const result = computeMovingAverage(date, weightRecords);
      // Average of [71, 72, 73, 74, 75, 76, 77] for dates Jan 2-8 = 74
      expect(result).toBe(74);
    });

    it('should return null if any value in window is null', () => {
      const recordsWithGap: WeightRecord[] = [
        { date: '2025-01-01', weightKgs: 70 },
        { date: '2025-01-02', weightKgs: 71 },
        // Gap from 2025-01-03 to 2025-01-08 - interpolation will return null
        { date: '2025-01-09', weightKgs: 78 },
        { date: '2025-01-10', weightKgs: 79 },
      ];

      // Computing average at Jan 3 requires dates Jan 0-6
      // Jan 1-2 are in records, but Jan 3-6 have no neighbors for interpolation
      // So Jan 3 itself will return null from interpolation
      const date = new Date(2025, 0, 3);
      const result = computeMovingAverage(date, recordsWithGap);
      expect(result).toBeNull();
    });

    it('should return null at boundaries when insufficient data', () => {
      // Date before any available weight
      const earlyDate = new Date(2024, 11, 25);
      const result = computeMovingAverage(earlyDate, weightRecords);
      expect(result).toBeNull();
    });

    it('should handle edge case with minimal data', () => {
      const minimalRecords: WeightRecord[] = [
        { date: '2025-01-01', weightKgs: 70 },
        { date: '2025-01-02', weightKgs: 71 },
        { date: '2025-01-03', weightKgs: 72 },
        { date: '2025-01-04', weightKgs: 73 },
        { date: '2025-01-05', weightKgs: 74 },
        { date: '2025-01-06', weightKgs: 75 },
        { date: '2025-01-07', weightKgs: 76 },
      ];

      const date = new Date(2025, 0, 4); // 2025-01-04
      const result = computeMovingAverage(date, minimalRecords);
      // Average of [70, 71, 72, 73, 74, 75, 76] = 73
      expect(result).toBe(73);
    });
  });

  describe('generateMovingAverageSeries', () => {
    const weightRecords: WeightRecord[] = [
      { date: '2025-01-01', weightKgs: 70 },
      { date: '2025-01-02', weightKgs: 71 },
      { date: '2025-01-03', weightKgs: 72 },
      { date: '2025-01-04', weightKgs: 73 },
      { date: '2025-01-05', weightKgs: 74 },
      { date: '2025-01-06', weightKgs: 75 },
      { date: '2025-01-07', weightKgs: 76 },
      { date: '2025-01-08', weightKgs: 77 },
      { date: '2025-01-09', weightKgs: 78 },
      { date: '2025-01-10', weightKgs: 79 },
    ];

    it('should generate dates and moving averages', () => {
      const firstDate = new Date(2025, 0, 1);
      const lastDate = new Date(2025, 0, 5);

      const { dates, weights: averages } = generateMovingAverageSeries(
        firstDate,
        lastDate,
        weightRecords,
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
        weightRecords,
        true,
      );

      const { dates: datesExclusive } = generateMovingAverageSeries(
        firstDate,
        lastDate,
        weightRecords,
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
        weightRecords,
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
        weightRecords,
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
        weightRecords,
        true,
      );

      expect(dates.length).toBe(1);
      expect(averages.length).toBe(1);
      expect(dates[0]).toBe('2025-01-05');
    });
  });
});
