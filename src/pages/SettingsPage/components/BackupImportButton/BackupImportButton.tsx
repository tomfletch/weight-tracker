import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { useCallback, useRef, useState } from 'react';
import {
  type ActionStatus,
  ActionStatusMessage,
} from '~/components/ActionStatusMessage/ActionStatusMessage';
import { Dialog } from '~/components/Dialog/Dialog';
import { useAppStore } from '~/stores/appStore';
import buttonStyles from '~/styles/buttons.module.css';
import {
  hasExistingAppData,
  validateAndParseJSONBackup,
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

  const performImportData = useCallback((backup: AppDataBackup) => {
    try {
      // Replace persisted state atomically while preserving actions.
      useAppStore.setState({
        height: backup.data.height,
        heightUnit: backup.data.heightUnit,
        weightUnit: backup.data.weightUnit,
        weightRecords: backup.data.weightRecords,
        weightTargetKgs: backup.data.weightTargetKgs,
        theme: backup.data.theme,
      });

      const successMessage = [
        `Imported backup: ${backup.data.weightRecords.length} weight record(s)`,
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
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const backup = validateAndParseJSONBackup(content);

          // Check if there's existing data
          const state = useAppStore.getState();
          const existingData = {
            height: state.height,
            heightUnit: state.heightUnit,
            weightUnit: state.weightUnit,
            weightRecords: state.weightRecords,
            weightTargetKgs: state.weightTargetKgs,
            theme: state.theme,
          };

          if (hasExistingAppData(existingData)) {
            // Show confirmation dialog
            setPendingImportData(backup);
            setIsImportConfirmDialogOpen(true);
          } else {
            // No existing data, import directly
            performImportData(backup);
          }
        } catch (error) {
          setBackupImportStatus({
            type: 'error',
            message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          });
        }
      };

      reader.onerror = () => {
        setBackupImportStatus({
          type: 'error',
          message: 'Failed to read file.',
        });
      };

      reader.readAsText(file);

      // Reset file input
      event.target.value = '';
    },
    [performImportData],
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
                  performImportData(pendingImportData);
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
