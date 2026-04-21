/** biome-ignore-all lint/suspicious/noApproximativeNumericConstant: Test file */
import { describe, expect, it } from 'vitest';
import { toFixedNoZero } from '~/utils/numbers';

describe('numbers utils', () => {
  describe('toFixedNoZero', () => {
    it('should return number with specified digits', () => {
      expect(toFixedNoZero(3.14159, 2)).toBe('3.14');
      expect(toFixedNoZero(5.67, 2)).toBe('5.67');
    });

    it('should remove trailing zeros after decimal', () => {
      expect(toFixedNoZero(3.1, 2)).toBe('3.1');
      expect(toFixedNoZero(3, 2)).toBe('3');
      expect(toFixedNoZero(3.0, 2)).toBe('3');
    });

    it('should handle zero values', () => {
      expect(toFixedNoZero(0, 2)).toBe('0');
      expect(toFixedNoZero(0.0, 2)).toBe('0');
    });

    it('should handle single decimal place', () => {
      expect(toFixedNoZero(3.5, 1)).toBe('3.5');
      expect(toFixedNoZero(3.0, 1)).toBe('3');
    });

    it('should handle larger numbers', () => {
      expect(toFixedNoZero(1234.5678, 2)).toBe('1234.57');
      expect(toFixedNoZero(1234.5, 2)).toBe('1234.5');
      expect(toFixedNoZero(1234, 2)).toBe('1234');
    });

    it('should round correctly', () => {
      expect(toFixedNoZero(3.145, 2)).toBe('3.15');
      expect(toFixedNoZero(3.144, 2)).toBe('3.14');
    });

    it('should handle negative numbers', () => {
      expect(toFixedNoZero(-3.14159, 2)).toBe('-3.14');
      expect(toFixedNoZero(-3.1, 2)).toBe('-3.1');
      expect(toFixedNoZero(-3, 2)).toBe('-3');
    });

    it('should handle high precision', () => {
      expect(toFixedNoZero(3.14159265, 5)).toBe('3.14159');
      expect(toFixedNoZero(3.1, 5)).toBe('3.1');
    });

    it('should handle no decimal places', () => {
      expect(toFixedNoZero(3.7, 0)).toBe('4');
      expect(toFixedNoZero(3.2, 0)).toBe('3');
    });

    it('should remove decimal point when not needed', () => {
      const result = toFixedNoZero(10.0, 1);
      expect(result).toBe('10');
      expect(result.includes('.')).toBe(false);
    });
  });
});
