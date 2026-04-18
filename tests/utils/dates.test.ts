import { describe, expect, it } from 'vitest';
import {
  daysBetween,
  formatDate,
  formatDateStr,
  formatDayth,
  getFirstOfMonth,
  MONTH_NAMES,
  MONTH_NAMES_SHORT,
  parseISODate,
  toISODate,
} from '../../src/utils/dates';

describe('dates utils', () => {
  describe('MONTH_NAMES_SHORT', () => {
    it('should have 12 months', () => {
      expect(MONTH_NAMES_SHORT).toHaveLength(12);
    });

    it('should have correct short month names', () => {
      expect(MONTH_NAMES_SHORT[0]).toBe('Jan');
      expect(MONTH_NAMES_SHORT[11]).toBe('Dec');
    });
  });

  describe('MONTH_NAMES', () => {
    it('should have 12 months', () => {
      expect(MONTH_NAMES).toHaveLength(12);
    });

    it('should have correct full month names', () => {
      expect(MONTH_NAMES[0]).toBe('January');
      expect(MONTH_NAMES[11]).toBe('December');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date(2024, 3, 18); // April 18, 2024
      expect(formatDate(date)).toBe('18 Apr 2024');
    });

    it('should format January date', () => {
      const date = new Date(2024, 0, 1);
      expect(formatDate(date)).toBe('1 Jan 2024');
    });

    it('should format December date', () => {
      const date = new Date(2024, 11, 25);
      expect(formatDate(date)).toBe('25 Dec 2024');
    });
  });

  describe('parseISODate', () => {
    it('should parse valid ISO date string', () => {
      const date = parseISODate('2024-04-18');
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(3);
      expect(date.getDate()).toBe(18);
    });

    it('should parse January date', () => {
      const date = parseISODate('2024-01-01');
      expect(date.getMonth()).toBe(0);
      expect(date.getDate()).toBe(1);
    });

    it('should parse December date', () => {
      const date = parseISODate('2024-12-31');
      expect(date.getMonth()).toBe(11);
      expect(date.getDate()).toBe(31);
    });

    it('should throw error for invalid date string', () => {
      expect(() => parseISODate('invalid')).toThrow();
      expect(() => parseISODate('2024-04')).toThrow();
      expect(() => parseISODate('04-18-2024')).toThrow();
    });
  });

  describe('formatDateStr', () => {
    it('should format ISO date string', () => {
      expect(formatDateStr('2024-04-18')).toBe('18 Apr 2024');
    });

    it('should work with different dates', () => {
      expect(formatDateStr('2024-01-01')).toBe('1 Jan 2024');
      expect(formatDateStr('2024-12-25')).toBe('25 Dec 2024');
    });
  });

  describe('getFirstOfMonth', () => {
    it('should return first day of the month', () => {
      const date = new Date(2024, 3, 18); // April 18, 2024
      const first = getFirstOfMonth(date);
      expect(first.getDate()).toBe(1);
      expect(first.getMonth()).toBe(3);
      expect(first.getFullYear()).toBe(2024);
    });

    it('should work for first day of month', () => {
      const date = new Date(2024, 0, 1);
      const first = getFirstOfMonth(date);
      expect(first.getDate()).toBe(1);
    });

    it('should work for last day of month', () => {
      const date = new Date(2024, 3, 30); // Last day of April
      const first = getFirstOfMonth(date);
      expect(first.getDate()).toBe(1);
      expect(first.getMonth()).toBe(3);
    });
  });

  describe('formatDayth', () => {
    it('should format day with correct suffix', () => {
      expect(formatDayth('2024-04-01')).toBe('1st');
      expect(formatDayth('2024-04-02')).toBe('2nd');
      expect(formatDayth('2024-04-03')).toBe('3rd');
      expect(formatDayth('2024-04-04')).toBe('4th');
      expect(formatDayth('2024-04-21')).toBe('21st');
      expect(formatDayth('2024-04-22')).toBe('22nd');
      expect(formatDayth('2024-04-23')).toBe('23rd');
      expect(formatDayth('2024-04-24')).toBe('24th');
    });

    it('should handle teens correctly', () => {
      expect(formatDayth('2024-04-11')).toBe('11th');
      expect(formatDayth('2024-04-12')).toBe('12th');
      expect(formatDayth('2024-04-13')).toBe('13th');
    });
  });

  describe('toISODate', () => {
    it('should convert date to ISO format', () => {
      const date = new Date(2024, 3, 18);
      expect(toISODate(date)).toBe('2024-04-18');
    });

    it('should pad single digit month and day', () => {
      const date = new Date(2024, 0, 5);
      expect(toISODate(date)).toBe('2024-01-05');
    });

    it('should handle December', () => {
      const date = new Date(2024, 11, 31);
      expect(toISODate(date)).toBe('2024-12-31');
    });
  });

  describe('daysBetween', () => {
    it('should calculate days between dates', () => {
      const date1 = new Date(2024, 3, 18);
      const date2 = new Date(2024, 3, 25);
      expect(daysBetween(date1, date2)).toBe(7);
    });

    it('should return zero for same date', () => {
      const date = new Date(2024, 3, 18);
      expect(daysBetween(date, date)).toBe(0);
    });

    it('should return negative for earlier date', () => {
      const date1 = new Date(2024, 3, 25);
      const date2 = new Date(2024, 3, 18);
      expect(daysBetween(date1, date2)).toBe(-7);
    });

    it('should handle month boundaries', () => {
      const date1 = new Date(2024, 3, 30); // April 30
      const date2 = new Date(2024, 4, 1); // May 1
      expect(daysBetween(date1, date2)).toBe(1);
    });
  });

  describe('round-trip conversions', () => {
    it('should handle Date -> ISO -> Date round trip', () => {
      const original = new Date(2024, 3, 18);
      const iso = toISODate(original);
      const parsed = parseISODate(iso);
      expect(parsed.getDate()).toBe(original.getDate());
      expect(parsed.getMonth()).toBe(original.getMonth());
      expect(parsed.getFullYear()).toBe(original.getFullYear());
    });
  });
});
