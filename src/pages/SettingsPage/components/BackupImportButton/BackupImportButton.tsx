import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { useCallback, useRef, useState } from 'react';
import {
  type ActionStatus,
  ActionStatusMessage,
} from '~/components/ActionStatusMessage/ActionStatusMessage';
import { Dialog } from '~/components/Dialog/Dialog';
import buttonStyles from '~/styles/buttons.module.css';
import {
  importAppBackupFromFile,
  performImportData,
} from '~/utils/backup/backupImport';
import type { AppDataBackup } from '~/utils/backup/backupSchema';
import styles from '../DataActionButton.module.css';

export function BackupImportButton() {
  const [backupImportStatus, setBackupImportStatus] =
    useState<ActionStatus | null>(null);
  const [isImportConfirmDialogOpen, setIsImportConfirmDialogOpen] =
    useState(false);
  const [pendingImportData, setPendingImportData] =
    useState<AppDataBackup | null>(null);
  const importFileInputRef = useRef<HTMLInputElement | null>(null);
  const cancelImportButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleImportJSON = useCallback(() => {
    // Click the hidden file input to open file picker
    importFileInputRef.current?.click();
  }, []);

  const performImportDataHandler = useCallback((backup: AppDataBackup) => {
    try {
      performImportData(backup);
      const count = backup.data.weightRecords.length;
      const recordLabel = count === 1 ? 'weight record' : 'weight records';
      const successMessage = [
        `Imported backup: ${count} ${recordLabel}`,
        `height set: ${backup.data.height !== null ? 'yes' : 'no'}`,
        `target weight set: ${backup.data.weightTargetKgs !== null ? 'yes' : 'no'}`,
      ].join(', ');
      setBackupImportStatus({ type: 'success', message: successMessage });
      setIsImportConfirmDialogOpen(false);
      setPendingImportData(null);
    } catch (error) {
      setBackupImportStatus({
        type: 'error',
        message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }, []);

  const handleImportFileSelected = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const result = await importAppBackupFromFile(file);
        if (result.status === 'imported') {
          setBackupImportStatus({ type: 'success', message: result.message });
        } else if (result.status === 'confirm') {
          setPendingImportData(result.backup);
          setIsImportConfirmDialogOpen(true);
        }
      } catch (error) {
        setBackupImportStatus({
          type: 'error',
          message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
      // Reset file input
      event.target.value = '';
    },
    [],
  );

  return (
    <>
      <button
        type="button"
        className={clsx(buttonStyles.button, buttonStyles.neutral)}
        onClick={handleImportJSON}
      >
        <FontAwesomeIcon icon={faUpload} className={styles.icon} />
        Import backup (JSON)
      </button>
      <ActionStatusMessage status={backupImportStatus} />
      <input
        type="file"
        ref={importFileInputRef}
        accept=".json,application/json"
        style={{ display: 'none' }}
        onChange={handleImportFileSelected}
      />
      <Dialog
        isOpen={isImportConfirmDialogOpen}
        title="Import backup?"
        onClose={() => setIsImportConfirmDialogOpen(false)}
        initialFocusRef={cancelImportButtonRef}
        actions={
          <>
            <button
              type="button"
              className={clsx(buttonStyles.button, buttonStyles.neutral)}
              onClick={() => {
                setIsImportConfirmDialogOpen(false);
                setPendingImportData(null);
              }}
              ref={cancelImportButtonRef}
            >
              Cancel
            </button>
            <button
              type="button"
              className={clsx(buttonStyles.button, buttonStyles.primary)}
              onClick={() => {
                if (pendingImportData) {
                  performImportDataHandler(pendingImportData);
                }
              }}
            >
              Import
            </button>
          </>
        }
      >
        This will replace all existing app data with the backup. This action
        cannot be undone. Are you sure you want to continue?
      </Dialog>
    </>
  );
}
