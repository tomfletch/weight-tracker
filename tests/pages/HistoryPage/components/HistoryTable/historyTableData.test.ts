import { describe, expect, it } from 'vitest';
import {
  createHistoryTableRow,
  getChangeIndicator,
} from '~/pages/HistoryPage/components/HistoryTable/historyTableData';
import type { WeightRecord } from '~/types/weight';
import { DAY_NAMES_SHORT, daysBetween } from '~/utils/dates';

function makeRecord(date: string, weightKgs: number): WeightRecord {
  return { date, weightKgs } as WeightRecord;
}

function expectedDayOfWeek(dateString: string): string {
  const d = new Date(dateString);
  return DAY_NAMES_SHORT[(d.getUTCDay() + 6) % 7];
}

describe('historyTableData', () => {
  describe('getChangeIndicator', () => {
    it('returns noChange when weight change is undefined', () => {
      expect(getChangeIndicator(undefined, 80, 82)).toBe('noChange');
    });

    it('returns noChange when weight change is 0', () => {
      expect(getChangeIndicator(0, 80, 82)).toBe('noChange');
    });

    it('uses fallback behavior when target is null', () => {
      expect(getChangeIndicator(0.4, null, 82)).toBe('worsen');
      expect(getChangeIndicator(-0.4, null, 82)).toBe('improve');
    });

    it('detects movement towards/away from goal when current is above goal', () => {
      expect(getChangeIndicator(-0.5, 80, 85)).toBe('improve');
      expect(getChangeIndicator(0.5, 80, 85)).toBe('worsen');
    });

    it('detects movement towards/away from goal when current is below goal', () => {
      expect(getChangeIndicator(0.5, 80, 75)).toBe('improve');
      expect(getChangeIndicator(-0.5, 80, 75)).toBe('worsen');
    });
  });

  describe('createHistoryTableRow', () => {
    it('shows change, day gap and weekday for a record with earlier history', () => {
      const current = makeRecord('2024-01-10T00:00:00.000Z', 80);
      const previous = makeRecord('2024-01-08T00:00:00.000Z', 79.5);
      const allWeightRecords = [previous, current];

      const row = createHistoryTableRow(current, allWeightRecords, null);

      expect(row.record).toBe(current);
      expect(row.date.toISOString()).toBe(current.date);
      expect(row.dayOfMonth).toBe(10);
      expect(row.dayOfWeek).toBe(expectedDayOfWeek(current.date));

      expect(row.weightChange).toBeCloseTo(0.5, 10);
      expect(row.daysBetweenRecords).toBe(
        daysBetween(new Date(previous.date), new Date(current.date)),
      );
      expect(row.changeIndicator).toBe('worsen');
    });

    it('compares against the immediately earlier historical entry for change and gap', () => {
      const prevFromAll = makeRecord('2024-01-08T00:00:00.000Z', 79.5);
      const targetRecord = makeRecord('2024-01-05T00:00:00.000Z', 79);

      const allWeightRecords = [
        makeRecord('2024-01-12T00:00:00.000Z', 80),
        prevFromAll,
        targetRecord,
        makeRecord('2024-01-01T00:00:00.000Z', 78.8),
      ];

      const row = createHistoryTableRow(targetRecord, allWeightRecords, 80);

      expect(row.weightChange).toBeCloseTo(-0.5, 10);
      expect(row.daysBetweenRecords).toBe(
        daysBetween(new Date(prevFromAll.date), new Date(targetRecord.date)),
      );
      expect(row.changeIndicator).toBe('worsen');
    });

    it('shows no change indicator and default gap when there is no earlier entry', () => {
      const onlyRecord = makeRecord('2024-02-01T00:00:00.000Z', 82);
      const allWeightRecords = [onlyRecord];

      const row = createHistoryTableRow(onlyRecord, allWeightRecords, 80);

      expect(row.weightChange).toBeUndefined();
      expect(row.daysBetweenRecords).toBe(1);
      expect(row.changeIndicator).toBe('noChange');
      expect(row.dayOfMonth).toBe(1);
      expect(row.dayOfWeek).toBe(expectedDayOfWeek(onlyRecord.date));
    });
  });
});
