import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { useCallback, useState } from 'react';
import {
  type ActionStatus,
  ActionStatusMessage,
} from '~/components/ActionStatusMessage/ActionStatusMessage';
import { useAppStore } from '~/stores/appStore';
import buttonStyles from '~/styles/buttons.module.css';
import {
  createAppDataBackup,
  downloadJSON,
  generateBackupFilename,
} from '~/utils/backup/backupExport';
import styles from '../DataActionButton.module.css';

export function BackupExportButton() {
  const [backupExportStatus, setBackupExportStatus] =
    useState<ActionStatus | null>(null);

  const handleExportJSON = useCallback(() => {
    try {
      // Use the current store snapshot so the downloaded backup matches persisted app data.
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

      setBackupExportStatus({
        type: 'success',
        message: `Exported backup: ${persistedState.weightRecords.length} weight record(s).`,
      });
    } catch (error) {
      setBackupExportStatus({
        type: 'error',
        message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }, []);

  return (
    <>
      <button
        type="button"
        className={clsx(buttonStyles.button, buttonStyles.neutral)}
        onClick={handleExportJSON}
      >
        <FontAwesomeIcon icon={faDownload} className={styles.icon} />
        Export backup (JSON)
      </button>
      <ActionStatusMessage status={backupExportStatus} />
    </>
  );
}
