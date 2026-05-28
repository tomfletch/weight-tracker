import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { useCallback, useState } from 'react';
import {
  type ActionStatus,
  ActionStatusMessage,
} from '~/components/ActionStatusMessage/ActionStatusMessage';
import buttonStyles from '~/styles/buttons.module.css';
import { exportAppBackup } from '~/utils/backup/backupExport';
import styles from '../DataActionButton.module.css';

export function BackupExportButton() {
  const [backupExportStatus, setBackupExportStatus] =
    useState<ActionStatus | null>(null);

  const handleExportJSON = useCallback(() => {
    try {
      const count = exportAppBackup();
      setBackupExportStatus({
        type: 'success',
        message: `Exported backup: ${count} weight record(s).`,
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
