import { describe, expect, it } from 'vitest';
import { WeightUnit } from '../../src/context/WeightContext';
import {
  convertKgToLb,
  convertKgToStLb,
  convertLbToKg,
  convertLbToStLb,
  convertStLbToKg,
  convertStLbToLb,
  formatKg,
  formatLb,
  formatLbAsStLb,
  formatStLb,
  formatWeight,
} from '../../src/utils/weights';

describe('weights utils', () => {
  describe('convertLbToKg', () => {
    it('should convert pounds to kilograms', () => {
      expect(convertLbToKg(154)).toBeCloseTo(69.85, 2);
      expect(convertLbToKg(220)).toBeCloseTo(99.79, 2);
    });

    it('should handle zero', () => {
      expect(convertLbToKg(0)).toBe(0);
    });

    it('should handle small values', () => {
      expect(convertLbToKg(2.20462)).toBeCloseTo(1, 4);
    });
  });

  describe('convertKgToLb', () => {
    it('should convert kilograms to pounds', () => {
      expect(convertKgToLb(70)).toBeCloseTo(154.32, 2);
      expect(convertKgToLb(100)).toBeCloseTo(220.462, 2);
    });

    it('should handle zero', () => {
      expect(convertKgToLb(0)).toBe(0);
    });

    it('should handle small values', () => {
      expect(convertKgToLb(1)).toBeCloseTo(2.20462, 4);
    });
  });

  describe('convertStLbToLb', () => {
    it('should convert stones and pounds to total pounds', () => {
      expect(convertStLbToLb({ st: 10, lb: 0 })).toBe(140); // 10 stones = 140 lbs
      expect(convertStLbToLb({ st: 10, lb: 7 })).toBe(147); // 10 stones 7 lbs
      expect(convertStLbToLb({ st: 0, lb: 10 })).toBe(10);
    });

    it('should handle zero', () => {
      expect(convertStLbToLb({ st: 0, lb: 0 })).toBe(0);
    });

    it('should handle full stones', () => {
      expect(convertStLbToLb({ st: 15, lb: 0 })).toBe(210);
    });
  });

  describe('convertStLbToKg', () => {
    it('should convert stones and pounds to kilograms', () => {
      expect(convertStLbToKg({ st: 10, lb: 7 })).toBeCloseTo(66.68, 2);
      expect(convertStLbToKg({ st: 11, lb: 0 })).toBeCloseTo(69.85, 2);
    });

    it('should handle zero', () => {
      expect(convertStLbToKg({ st: 0, lb: 0 })).toBe(0);
    });
  });

  describe('convertLbToStLb', () => {
    it('should convert total pounds to stones and pounds', () => {
      expect(convertLbToStLb(147)).toEqual({ st: 10, lb: 7 });
      expect(convertLbToStLb(140)).toEqual({ st: 10, lb: 0 });
      expect(convertLbToStLb(154)).toEqual({ st: 11, lb: 0 });
    });

    it('should handle zero', () => {
      expect(convertLbToStLb(0)).toEqual({ st: 0, lb: 0 });
    });

    it('should handle partial stones', () => {
      expect(convertLbToStLb(10)).toEqual({ st: 0, lb: 10 });
    });
  });

  describe('convertKgToStLb', () => {
    it('should convert kilograms to stones and pounds', () => {
      const result = convertKgToStLb(70);
      expect(result.st).toBe(11);
      expect(result.lb).toBeCloseTo(0, 0);
    });

    it('should handle zero', () => {
      expect(convertKgToStLb(0)).toEqual({ st: 0, lb: 0 });
    });
  });

  describe('formatKg', () => {
    it('should format kilograms with default precision', () => {
      expect(formatKg(70)).toBe('70.0kg');
      expect(formatKg(70.5)).toBe('70.5kg');
    });

    it('should format with specified precision', () => {
      expect(formatKg(70.12345, 2)).toBe('70.12kg');
      expect(formatKg(70.12345, 0)).toBe('70kg');
    });

    it('should handle zero', () => {
      expect(formatKg(0)).toBe('0.0kg');
    });
  });

  describe('formatLb', () => {
    it('should format pounds with default precision', () => {
      expect(formatLb(154)).toBe('154.0lb');
      expect(formatLb(154.5)).toBe('154.5lb');
    });

    it('should format with specified precision', () => {
      expect(formatLb(154.12345, 2)).toBe('154.12lb');
      expect(formatLb(154.12345, 0)).toBe('154lb');
    });

    it('should handle zero', () => {
      expect(formatLb(0)).toBe('0.0lb');
    });
  });

  describe('formatStLb', () => {
    it('should format stones and pounds', () => {
      expect(formatStLb({ st: 10, lb: 7 })).toBe('10st 7.0lb');
      expect(formatStLb({ st: 11, lb: 0 })).toBe('11st 0.0lb');
    });

    it('should omit stones when zero', () => {
      expect(formatStLb({ st: 0, lb: 7 })).toBe('7.0lb');
      expect(formatStLb({ st: 0, lb: 0 })).toBe('0.0lb');
    });

    it('should format with specified precision', () => {
      expect(formatStLb({ st: 10, lb: 7.123 }, 2)).toBe('10st 7.12lb');
      expect(formatStLb({ st: 10, lb: 7.123 }, 0)).toBe('10st 7lb');
    });
  });

  describe('formatLbAsStLb', () => {
    it('should format total pounds as stones and pounds', () => {
      expect(formatLbAsStLb(147)).toBe('10st 7.0lb');
      expect(formatLbAsStLb(154)).toBe('11st 0.0lb');
    });

    it('should handle values less than a stone', () => {
      expect(formatLbAsStLb(10)).toBe('10.0lb');
    });

    it('should format with specified precision', () => {
      expect(formatLbAsStLb(147.234, 2)).toBe('10st 7.23lb');
    });
  });

  describe('formatWeight', () => {
    it('should format weight in kilograms', () => {
      expect(formatWeight(70, WeightUnit.KGS)).toBe('70.0kg');
    });

    it('should format weight in pounds', () => {
      const result = formatWeight(70, WeightUnit.LBS);
      expect(result).toContain('lb');
      expect(result).toContain('154');
    });

    it('should format weight in stones and pounds', () => {
      const result = formatWeight(70, WeightUnit.STONES_LBS);
      expect(result).toContain('st');
      expect(result).toContain('lb');
    });

    it('should throw error for invalid unit', () => {
      expect(() => formatWeight(70, 'INVALID' as WeightUnit)).toThrow();
    });

    it('should handle zero weight', () => {
      expect(formatWeight(0, WeightUnit.KGS)).toBe('0.0kg');
    });
  });

  describe('round-trip conversions', () => {
    it('should handle lb -> kg -> lb round trip', () => {
      const original = 154;
      const result = convertKgToLb(convertLbToKg(original));
      expect(result).toBeCloseTo(original, 10);
    });

    it('should handle st/lb -> kg -> st/lb round trip', () => {
      const original = { st: 10, lb: 7 };
      const result = convertKgToStLb(convertStLbToKg(original));
      expect(result.st).toBe(original.st);
      expect(result.lb).toBeCloseTo(original.lb, 10);
    });

    it('should handle st/lb -> lb -> st/lb round trip', () => {
      const original = { st: 10, lb: 7 };
      const result = convertLbToStLb(convertStLbToLb(original));
      expect(result.st).toBe(original.st);
      expect(result.lb).toBe(original.lb);
    });
  });
});
