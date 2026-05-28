import { APP_STORE_VERSION, useAppStore } from '~/stores/appStore';
import type { AppBackupData, AppDataBackup } from '~/utils/backup/backupSchema';
import { toISODate } from '~/utils/dates';
import { triggerBrowserDownload } from '~/utils/fileDownload';

export function exportAppBackup(): number {
  const state = useAppStore.getState();
  const persistedState = {
    height: state.height,
    heightUnit: state.heightUnit,
    weightUnit: state.weightUnit,
    weightRecords: state.weightRecords,
    weightTargetKgs: state.weightTargetKgs,
    theme: state.theme,
  };

  const backup = createAppDataBackup(persistedState);
  const jsonContent = JSON.stringify(backup, null, 2);
  const filename = generateBackupFilename(new Date());
  downloadJSON(jsonContent, filename);

  return persistedState.weightRecords.length;
}

function createAppDataBackup(persistedState: AppBackupData): AppDataBackup {
  return {
    schemaVersion: APP_STORE_VERSION,
    exportedAt: new Date().toISOString(),
    data: persistedState,
  };
}

function generateBackupFilename(date: Date): string {
  return `weight-tracker_backup_${toISODate(date)}.json`;
}

function downloadJSON(content: string, filename: string): void {
  triggerBrowserDownload(content, filename, 'application/json;charset=utf-8;');
}
