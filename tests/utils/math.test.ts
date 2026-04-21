import { describe, expect, it } from 'vitest';
import { limit, map } from '~/utils/math';

describe('math utils', () => {
  describe('map', () => {
    it('maps values proportionally between ranges', () => {
      expect(map(5, 0, 10, 0, 100)).toBe(50);
      expect(map(25, 0, 100, 0, 1)).toBe(0.25);
    });

    it('maps range boundaries to target boundaries', () => {
      expect(map(0, 0, 10, 100, 200)).toBe(100);
      expect(map(10, 0, 10, 100, 200)).toBe(200);
    });

    it('supports reversed output ranges', () => {
      expect(map(0, 0, 10, 100, 0)).toBe(100);
      expect(map(10, 0, 10, 100, 0)).toBe(0);
      expect(map(2.5, 0, 10, 100, 0)).toBe(75);
    });

    it('supports values outside the source range', () => {
      expect(map(-5, 0, 10, 0, 100)).toBe(-50);
      expect(map(15, 0, 10, 0, 100)).toBe(150);
    });
  });

  describe('limit', () => {
    it('returns the value when already in range', () => {
      expect(limit(5, 0, 10)).toBe(5);
      expect(limit(0, 0, 10)).toBe(0);
      expect(limit(10, 0, 10)).toBe(10);
    });

    it('clamps to min when value is below min', () => {
      expect(limit(-1, 0, 10)).toBe(0);
      expect(limit(-100, -10, 10)).toBe(-10);
    });

    it('clamps to max when value is above max', () => {
      expect(limit(11, 0, 10)).toBe(10);
      expect(limit(100, -10, 10)).toBe(10);
    });
  });
});
