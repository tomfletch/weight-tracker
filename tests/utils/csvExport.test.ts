import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppStore } from '~/stores/appStore';
import { exportAppWeightsAsCSV } from '~/utils/csvExport';
import * as fileDownload from '~/utils/fileDownload';

// Mock dependencies
vi.mock('~/stores/appStore', () => {
  const weightRecords = [
    { date: '2024-01-01', weightKgs: 70 },
    { date: '2024-01-02', weightKgs: 71.5 },
  ];
  return {
    useAppStore: {
      getState: vi.fn(() => ({ weightRecords })),
    },
  };
});

vi.mock('~/utils/fileDownload', () => ({
  triggerBrowserDownload: vi.fn(),
}));

describe('exportAppWeightsAsCSV', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-05-29T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('exports CSV and triggers download with correct filename and content', () => {
    const count = exportAppWeightsAsCSV();
    expect(count).toBe(2);

    const expectedLines = [
      'date,weight_kgs,weight_lbs,weight_st,weight_lb_remainder',
      '2024-01-01,70,154.32,11,0.32',
      '2024-01-02,71.5,157.63,11,3.63',
    ];
    const expectedCSV = expectedLines.join('\n');

    expect(fileDownload.triggerBrowserDownload).toHaveBeenCalledExactlyOnceWith(
      expectedCSV,
      'weight-tracker_weights_2024-05-29.csv',
      'text/csv;charset=utf-8;',
    );
  });

  it('throws if there are no weight records', () => {
    // @ts-expect-error: Mocking getState to return no records
    vi.mocked(useAppStore.getState).mockReturnValue({
      weightRecords: [],
    });
    expect(() => exportAppWeightsAsCSV()).toThrow(
      'No weight records to export.',
    );
  });
});
