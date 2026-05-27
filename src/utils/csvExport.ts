import type { WeightRecord } from '~/types/weight';
import { toISODate } from '~/utils/dates';
import { triggerBrowserDownload } from '~/utils/fileDownload';
import { convertKgToLb, convertLbToStLb } from '~/utils/weights';

/**
 * Export weight records as CSV.
 * Columns: date, weight_kgs, weight_lbs, weight_st, weight_lb_remainder
 * Sorted oldest first.
 */
export function exportWeightRecordsAsCSV(records: WeightRecord[]): string {
  const headers = [
    'date',
    'weight_kgs',
    'weight_lbs',
    'weight_st',
    'weight_lb_remainder',
  ];

  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));

  const rows = sorted.map((record) => {
    const weightLbs = convertKgToLb(record.weightKgs);
    const { st, lb } = convertLbToStLb(weightLbs);

    return [
      record.date,
      record.weightKgs.toString(),
      weightLbs.toFixed(2),
      st.toString(),
      lb.toFixed(2),
    ];
  });

  const csvHeader = headers.join(',');
  const csvRows = rows
    .map((row) => row.map(escapeCSVField).join(','))
    .join('\n');

  return `${csvHeader}\n${csvRows}`;
}

function escapeCSVField(field: string): string {
  if (field.includes(',') || field.includes('\n') || field.includes('"')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

/**
 * Trigger a browser download of CSV content.
 */
export function downloadCSV(content: string, filename: string): void {
  triggerBrowserDownload(content, filename, 'text/csv;charset=utf-8;');
}

/**
 * Generate a dated CSV filename for weight export.
 */
export function generateWeightCSVFilename(date: Date): string {
  return `weight-tracker_weights_${toISODate(date)}.csv`;
}
