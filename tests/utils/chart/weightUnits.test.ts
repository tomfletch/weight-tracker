import { describe, expect, it } from 'vitest';
import { WeightUnit } from '../../../src/types/weight';
import {
  convertSeriesKgToDisplayUnit,
  formatWeightValueByUnit,
} from '../../../src/utils/chart/weightUnits';

describe('weightUnits utils', () => {
  describe('formatWeightValueByUnit', () => {
    it('should format kg values with default precision', () => {
      expect(formatWeightValueByUnit(75.5, WeightUnit.KGS)).toBe('75.5kg');
    });

    it('should format kg values with custom precision', () => {
      expect(formatWeightValueByUnit(75.55, WeightUnit.KGS, 0)).toBe('76kg');
      expect(formatWeightValueByUnit(75.54, WeightUnit.KGS, 0)).toBe('76kg');
    });

    it('should format lb values with default precision', () => {
      const result = formatWeightValueByUnit(160.5, WeightUnit.LBS);
      expect(result).toContain('160.5');
      expect(result).toContain('lb');
    });

    it('should format lb values with custom precision', () => {
      const result = formatWeightValueByUnit(160.55, WeightUnit.LBS, 0);
      expect(result).toContain('161');
      expect(result).toContain('lb');
    });

    it('should format stones and lbs values', () => {
      const result = formatWeightValueByUnit(160.5, WeightUnit.STONES_LBS);
      expect(result).toContain('st');
      expect(result).toContain('lb');
    });
  });

  describe('convertSeriesKgToDisplayUnit', () => {
    it('should return kg values unchanged when unit is KGS', () => {
      const values = [70, 71, null, 72.5];
      const result = convertSeriesKgToDisplayUnit(values, WeightUnit.KGS);
      expect(result).toEqual([70, 71, null, 72.5]);
    });

    it('should convert kg to lbs', () => {
      const values = [70, null, 80];
      const result = convertSeriesKgToDisplayUnit(values, WeightUnit.LBS);
      expect(result[0]).toBe(Math.round(70 * 2.20462 * 10) / 10);
      expect(result[1]).toBeNull();
      expect(result[2]).toBe(Math.round(80 * 2.20462 * 10) / 10);
    });

    it('should preserve null values when converting', () => {
      const values = [null, 75, null, 85, null];
      const result = convertSeriesKgToDisplayUnit(values, WeightUnit.LBS);
      expect(result[0]).toBeNull();
      expect(result[2]).toBeNull();
      expect(result[4]).toBeNull();
      expect(result[1]).not.toBeNull();
      expect(result[3]).not.toBeNull();
    });

    it('should handle stones and lbs unit', () => {
      const values = [70, 80];
      const result = convertSeriesKgToDisplayUnit(
        values,
        WeightUnit.STONES_LBS,
      );
      expect(result[0]).toBe(Math.round(70 * 2.20462 * 10) / 10);
      expect(result[1]).toBe(Math.round(80 * 2.20462 * 10) / 10);
    });

    it('should round to one decimal place', () => {
      const values = [70.25, 80.75];
      const result = convertSeriesKgToDisplayUnit(values, WeightUnit.LBS);
      // Check that all values are rounded to 1 decimal place
      result.forEach((value) => {
        if (value !== null) {
          const decimalPlaces = (value.toString().split('.')[1] || '').length;
          expect(decimalPlaces).toBeLessThanOrEqual(1);
        }
      });
    });

    it('should handle empty array', () => {
      const result = convertSeriesKgToDisplayUnit([], WeightUnit.LBS);
      expect(result).toEqual([]);
    });
  });
});
