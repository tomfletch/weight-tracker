import { describe, expect, it } from 'vitest';
import type { WeightRecord } from '../../src/context/WeightContext';
import {
  interpolateWeightAtDate,
  interpolateWeightAtDateString,
} from '../../src/utils/weightInterpolation';

describe('weightInterpolation utils', () => {
  const weightRecords: WeightRecord[] = [
    { date: '2025-01-01', weightKgs: 100 },
    { date: '2025-01-05', weightKgs: 90 },
    { date: '2025-01-10', weightKgs: 85 },
  ];

  describe('interpolateWeightAtDate', () => {
    it('should return exact weight when date matches a record', () => {
      const result = interpolateWeightAtDate(
        new Date(2025, 0, 1),
        weightRecords,
      );
      expect(result).toBe(100);
    });

    it('should interpolate weight between two records', () => {
      const result = interpolateWeightAtDate(
        new Date(2025, 0, 3),
        weightRecords,
      );
      // Between 2025-01-01 (100kg) and 2025-01-05 (90kg)
      // 2025-01-03 is 2 days out of 4 = 50% through
      // 100 + (90 - 100) * (2 / 4) = 100 - 5 = 95
      expect(result).toBe(95);
    });

    it('should return null when date is before first record', () => {
      const result = interpolateWeightAtDate(
        new Date(2024, 11, 31),
        weightRecords,
      );
      expect(result).toBeNull();
    });

    it('should return null when date is after last record', () => {
      const result = interpolateWeightAtDate(
        new Date(2025, 0, 11),
        weightRecords,
      );
      expect(result).toBeNull();
    });

    it('should return null for empty records array', () => {
      const result = interpolateWeightAtDate(new Date(2025, 0, 1), []);
      expect(result).toBeNull();
    });

    it('should handle interpolation with negative weight change', () => {
      const result = interpolateWeightAtDate(
        new Date(2025, 0, 7),
        weightRecords,
      );
      // Between 2025-01-05 (90kg) and 2025-01-10 (85kg)
      // 2025-01-07 is 2 days out of 5 = 40% through
      // 90 + (85 - 90) * (2 / 5) = 90 - 2 = 88
      expect(result).toBe(88);
    });

    it('should handle records with same weight', () => {
      const sameWeightRecords: WeightRecord[] = [
        { date: '2025-01-01', weightKgs: 100 },
        { date: '2025-01-05', weightKgs: 100 },
      ];

      const result = interpolateWeightAtDate(
        new Date(2025, 0, 3),
        sameWeightRecords,
      );
      expect(result).toBe(100);
    });

    it('should find correct neighbors when records are not sequential', () => {
      const sparseRecords: WeightRecord[] = [
        { date: '2025-01-01', weightKgs: 100 },
        { date: '2025-02-15', weightKgs: 90 },
      ];

      const result = interpolateWeightAtDate(
        new Date(2025, 0, 15),
        sparseRecords,
      );
      // Between 2025-01-01 and 2025-02-15 is 45 days
      // 2025-01-15 is 14 days from start
      // Weight change is 90 - 100 = -10
      // 100 + (-10) * (14 / 45) = 100 - 3.111... ≈ 96.888...
      expect(result).toBeCloseTo(96.888, 2);
    });

    it('should handle multiple records with same date by using first found', () => {
      const dupRecords: WeightRecord[] = [
        { date: '2025-01-01', weightKgs: 100 },
        { date: '2025-01-01', weightKgs: 101 },
        { date: '2025-01-05', weightKgs: 90 },
      ];

      const result = interpolateWeightAtDate(new Date(2025, 0, 1), dupRecords);
      expect(result).toBe(100);
    });
  });

  describe('interpolateWeightAtDateString', () => {
    it('should return exact weight when date string matches a record', () => {
      const result = interpolateWeightAtDateString('2025-01-01', weightRecords);
      expect(result).toBe(100);
    });

    it('should interpolate weight between two records using date string', () => {
      const result = interpolateWeightAtDateString('2025-01-03', weightRecords);
      expect(result).toBe(95);
    });

    it('should return null when date string is before first record', () => {
      const result = interpolateWeightAtDateString('2024-12-31', weightRecords);
      expect(result).toBeNull();
    });

    it('should return null when date string is after last record', () => {
      const result = interpolateWeightAtDateString('2025-01-11', weightRecords);
      expect(result).toBeNull();
    });

    it('should return null for empty records array', () => {
      const result = interpolateWeightAtDateString('2025-01-01', []);
      expect(result).toBeNull();
    });
  });

  describe('edge cases with unsorted records', () => {
    it('should work correctly even if records appear unsorted (finds nearest)', () => {
      const unsortedRecords: WeightRecord[] = [
        { date: '2025-01-05', weightKgs: 90 },
        { date: '2025-01-01', weightKgs: 100 },
        { date: '2025-01-10', weightKgs: 85 },
      ];

      // Should still find 100 and 90 as neighbors for Jan 3
      const result = interpolateWeightAtDate(
        new Date(2025, 0, 3),
        unsortedRecords,
      );
      expect(result).toBe(95);
    });
  });

  describe('consistency between both interpolation functions', () => {
    it('should return same result whether using Date or date string', () => {
      const dateResult = interpolateWeightAtDate(
        new Date(2025, 0, 3),
        weightRecords,
      );
      const stringResult = interpolateWeightAtDateString(
        '2025-01-03',
        weightRecords,
      );
      expect(dateResult).toBe(stringResult);
    });

    it('should return same result for multiple queries with same records', () => {
      const result1 = interpolateWeightAtDate(
        new Date(2025, 0, 7),
        weightRecords,
      );
      const result2 = interpolateWeightAtDate(
        new Date(2025, 0, 7),
        weightRecords,
      );
      expect(result1).toBe(result2);
    });
  });
});
