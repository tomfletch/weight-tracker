import { APP_STORE_VERSION } from '~/stores/appStore';
import type { AppBackupData, AppDataBackup } from '~/utils/backup/backupSchema';
import { toISODate } from '~/utils/dates';
import { triggerBrowserDownload } from '~/utils/fileDownload';

/**
 * Generate JSON backup content from persisted app state.
 */
export function createAppDataBackup(
  persistedState: AppBackupData,
): AppDataBackup {
  return {
    schemaVersion: APP_STORE_VERSION,
    exportedAt: new Date().toISOString(),
    data: persistedState,
  };
}

/**
 * Trigger a browser download of JSON backup content.
 */
export function downloadJSON(content: string, filename: string): void {
  triggerBrowserDownload(content, filename, 'application/json;charset=utf-8;');
}

/**
 * Generate a dated JSON backup filename.
 */
export function generateBackupFilename(date: Date): string {
  return `weight-tracker_backup_${toISODate(date)}.json`;
}
