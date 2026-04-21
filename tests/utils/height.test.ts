import { describe, expect, it } from 'vitest';
import {
  convertCmToM,
  convertFtInToM,
  convertInToFtIn,
  convertInToM,
  convertMToCm,
  convertMToFtIn,
  convertMToIn,
} from '~/utils/height';

describe('height utils', () => {
  describe('convertCmToM', () => {
    it('should convert centimeters to meters', () => {
      expect(convertCmToM(100)).toBe(1);
      expect(convertCmToM(175)).toBe(1.75);
      expect(convertCmToM(200)).toBe(2);
    });

    it('should handle zero', () => {
      expect(convertCmToM(0)).toBe(0);
    });

    it('should handle small values', () => {
      expect(convertCmToM(1)).toBe(0.01);
    });
  });

  describe('convertMToCm', () => {
    it('should convert meters to centimeters', () => {
      expect(convertMToCm(1)).toBe(100);
      expect(convertMToCm(1.75)).toBe(175);
      expect(convertMToCm(2)).toBe(200);
    });

    it('should handle zero', () => {
      expect(convertMToCm(0)).toBe(0);
    });
  });

  describe('convertInToM', () => {
    it('should convert inches to meters', () => {
      const result = convertInToM(39.3701);
      expect(result).toBeCloseTo(1, 4);
    });

    it('should handle zero', () => {
      expect(convertInToM(0)).toBe(0);
    });
  });

  describe('convertMToIn', () => {
    it('should convert meters to inches', () => {
      expect(convertMToIn(1)).toBeCloseTo(39.3701, 4);
      expect(convertMToIn(2)).toBeCloseTo(78.7402, 4);
    });

    it('should handle zero', () => {
      expect(convertMToIn(0)).toBe(0);
    });
  });

  describe('convertInToFtIn', () => {
    it('should convert total inches to feet and inches', () => {
      expect(convertInToFtIn(12)).toEqual({ ft: 1, inch: 0 });
      expect(convertInToFtIn(24)).toEqual({ ft: 2, inch: 0 });
      expect(convertInToFtIn(13)).toEqual({ ft: 1, inch: 1 });
      expect(convertInToFtIn(35)).toEqual({ ft: 2, inch: 11 });
    });

    it('should handle zero', () => {
      expect(convertInToFtIn(0)).toEqual({ ft: 0, inch: 0 });
    });

    it('should handle partial feet', () => {
      expect(convertInToFtIn(5)).toEqual({ ft: 0, inch: 5 });
    });
  });

  describe('convertFtInToM', () => {
    it('should convert feet and inches to meters', () => {
      expect(convertFtInToM({ ft: 5, inch: 9 })).toBeCloseTo(1.7526, 4);
      expect(convertFtInToM({ ft: 6, inch: 0 })).toBeCloseTo(1.8288, 4);
    });

    it('should handle zero values', () => {
      expect(convertFtInToM({ ft: 0, inch: 0 })).toBe(0);
    });
  });

  describe('convertMToFtIn', () => {
    it('should convert meters to feet and inches', () => {
      const result = convertMToFtIn(1.75);
      expect(result.ft).toBe(5);
      expect(result.inch).toBeCloseTo(8.86, 1);
    });

    it('should handle zero', () => {
      const result = convertMToFtIn(0);
      expect(result).toEqual({ ft: 0, inch: 0 });
    });

    it('should handle exact foot values', () => {
      const result = convertMToFtIn(1.8288);
      expect(result.ft).toBe(6);
      expect(result.inch).toBeCloseTo(0, 1);
    });
  });

  describe('round-trip conversions', () => {
    it('should handle cm -> m -> cm round trip', () => {
      const original = 175;
      const result = convertMToCm(convertCmToM(original));
      expect(result).toBeCloseTo(original, 10);
    });

    it('should handle ft/in -> m -> ft/in round trip', () => {
      const original = { ft: 5, inch: 9 };
      const result = convertMToFtIn(convertFtInToM(original));
      expect(result.ft).toBe(original.ft);
      expect(result.inch).toBeCloseTo(original.inch, 10);
    });
  });
});
