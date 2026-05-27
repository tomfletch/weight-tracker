import {
  faBullseye,
  faDownload,
  faPaintBrush,
  faRuler,
  faRulerVertical,
  faTrashCan,
  faUpload,
  faWeightScale,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { useCallback, useRef, useState } from 'react';
import { Card } from '~/components/Card/Card';
import { Dialog } from '~/components/Dialog/Dialog';
import { HeightInput } from '~/components/HeightInput/HeightInput';
import { WeightInput } from '~/components/WeightInput/WeightInput';
import { useAppHeight } from '~/hooks/useAppHeight';
import { useAppSettings } from '~/hooks/useAppSettings';
import { useAppWeight } from '~/hooks/useAppWeight';
import { useAppStore } from '~/stores/appStore';
import buttonStyles from '~/styles/buttons.module.css';
import inputStyles from '~/styles/inputs.module.css';
import { HeightUnit, type HeightUnit as HeightUnitType } from '~/types/height';
import { WeightUnit, type WeightUnit as WeightUnitType } from '~/types/weight';
import {
  createAppDataBackup,
  downloadJSON,
  generateBackupFilename,
} from '~/utils/backup/backupExport';
import {
  hasExistingAppData,
  validateAndParseJSONBackup,
} from '~/utils/backup/backupImport';
import type { AppDataBackup } from '~/utils/backup/backupSchema';
import {
  downloadCSV,
  exportWeightRecordsAsCSV,
  generateWeightCSVFilename,
} from '~/utils/csvExport';
import { ColourSelect } from './ColourSelect/ColourSelect';
import styles from './SettingsPage.module.css';

const weightUnitOptions = [
  { key: WeightUnit.STONES_LBS, name: 'Stone and Pounds (st, lb)' },
  { key: WeightUnit.LBS, name: 'Pounds (lb)' },
  { key: WeightUnit.KGS, name: 'Kilograms (kg)' },
];

const heightUnitOptions = [
  { key: HeightUnit.CM, name: 'Centimeters (cm)' },
  { key: HeightUnit.FT_IN, name: 'Feet and Inches (ft, in)' },
  { key: HeightUnit.IN, name: 'Inches (in)' },
];

type ActionStatus = { type: 'success' | 'error'; message: string } | null;

export function SettingsPage() {
  const {
    weightUnit,
    setWeightUnit,
    weightTargetKgs,
    setWeightTargetKgs,
    weightRecords,
  } = useAppWeight();
  const { theme, setTheme, clearAllData } = useAppSettings();
  const { heightUnit, setHeightUnit, height, setHeight } = useAppHeight();
  const [isDeleteAllDataDialogOpen, setIsDeleteAllDataDialogOpen] =
    useState(false);
  const cancelDeleteAllDataButtonRef = useRef<HTMLButtonElement | null>(null);

  const [backupExportStatus, setBackupExportStatus] =
    useState<ActionStatus>(null);
  const [backupImportStatus, setBackupImportStatus] =
    useState<ActionStatus>(null);
  const [csvExportStatus, setCsvExportStatus] = useState<ActionStatus>(null);
  const importFileInputRef = useRef<HTMLInputElement | null>(null);

  // Import confirmation
  const [isImportConfirmDialogOpen, setIsImportConfirmDialogOpen] =
    useState(false);
  const [pendingImportData, setPendingImportData] =
    useState<AppDataBackup | null>(null);
  const cancelImportButtonRef = useRef<HTMLButtonElement | null>(null);

  const onTargetWeightChange = useCallback(
    (weight: number | null) => {
      if (!weight) return;
      setWeightTargetKgs(weight);
    },
    [setWeightTargetKgs],
  );

  const onWeightUnitChange = (weightUnitStr: string) => {
    const newWeightUnit: WeightUnitType =
      WeightUnit[weightUnitStr as keyof typeof WeightUnit];
    setWeightUnit(newWeightUnit);
  };

  const onHeightUnitChange = (heightUnitStr: string) => {
    const newHeightUnit: HeightUnitType =
      HeightUnit[heightUnitStr as keyof typeof HeightUnit];
    setHeightUnit(newHeightUnit);
  };

  const handleExportWeightsCSV = useCallback(() => {
    try {
      if (weightRecords.length === 0) {
        setCsvExportStatus({
          type: 'error',
          message: 'No weight records to export.',
        });
        return;
      }

      const csvContent = exportWeightRecordsAsCSV(weightRecords);
      const filename = generateWeightCSVFilename(new Date());
      downloadCSV(csvContent, filename);

      setCsvExportStatus({
        type: 'success',
        message: `Exported ${weightRecords.length} weight record(s).`,
      });
    } catch (error) {
      setCsvExportStatus({
        type: 'error',
        message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }, [weightRecords]);

  const handleExportJSON = useCallback(() => {
    try {
      // Get the current persisted state from store
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
    <div className="pageContainer">
      <header className={styles.header}>
        <h1>Settings</h1>
        <p className="textLight">Customise your preferences and goals.</p>
      </header>
      <Card>
        <div className={styles.field}>
          <div className={styles.icon} aria-hidden={true}>
            <FontAwesomeIcon icon={faWeightScale} fontSize={30} />
          </div>
          <div className={styles.labelContainer}>
            <label className={styles.label} htmlFor="weight-units">
              Weight Units
            </label>
            <p className={styles.labelDescription}>
              Select the units you want to use for weight.
            </p>
          </div>
          <div className={styles.inputContainer}>
            <select
              id="weight-units"
              className={inputStyles.selectInput}
              value={weightUnit}
              onChange={(e) => onWeightUnitChange(e.target.value)}
            >
              {weightUnitOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.icon} aria-hidden={true}>
            <FontAwesomeIcon icon={faBullseye} fontSize={30} />
          </div>
          <WeightInput
            weight={weightTargetKgs}
            onChange={onTargetWeightChange}
            label="Target Weight"
            labelClassName={styles.label}
            labelDescription="Set your goal weight."
            labelDescriptionClassName={styles.labelDescription}
            labelContainerClassName={styles.labelContainer}
            inputContainerClassName={styles.inputContainer}
          />
        </div>
        <div className={styles.field}>
          <div className={styles.icon} aria-hidden={true}>
            <FontAwesomeIcon icon={faRuler} fontSize={30} />
          </div>
          <div className={styles.labelContainer}>
            <label className={styles.label} htmlFor="height-units">
              Height Units
            </label>
            <p className={styles.labelDescription}>
              Select the units you want to use for height.
            </p>
          </div>
          <div className={styles.inputContainer}>
            <select
              id="height-units"
              className={inputStyles.selectInput}
              value={heightUnit}
              onChange={(e) => onHeightUnitChange(e.target.value)}
            >
              {heightUnitOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.icon} aria-hidden={true}>
            <FontAwesomeIcon icon={faRulerVertical} fontSize={30} />
          </div>
          <HeightInput
            height={height}
            onChange={setHeight}
            label="Height"
            labelClassName={styles.label}
            labelDescription="Enter your height for BMI calculations."
            labelDescriptionClassName={styles.labelDescription}
            labelContainerClassName={styles.labelContainer}
            inputContainerClassName={styles.inputContainer}
          />
        </div>
        <fieldset className={clsx(inputStyles.inputFieldset, styles.fieldset)}>
          <legend className="visuallyHidden">Theme</legend>
          <div className={styles.field}>
            <div className={styles.icon} aria-hidden={true}>
              <FontAwesomeIcon icon={faPaintBrush} fontSize={30} />
            </div>
            <div className={styles.labelContainer}>
              <span className={styles.label} aria-hidden="true">
                Theme
              </span>
              <p className={styles.labelDescription}>
                Choose a colour theme for the app.
              </p>
            </div>
            <div className={styles.inputContainer}>
              <ColourSelect value={theme} onChange={setTheme} />
            </div>
          </div>
        </fieldset>

        <div className={styles.field}>
          <div className={styles.icon} aria-hidden={true}>
            <FontAwesomeIcon icon={faDownload} fontSize={30} />
          </div>
          <div className={styles.labelContainer}>
            <div className={styles.label}>Export & Import</div>
            <p className={styles.labelDescription}>
              Backup your data or export weight records for analysis.
            </p>
          </div>
          <div className={styles.inputContainer}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <button
                type="button"
                className={clsx(buttonStyles.button, buttonStyles.neutral)}
                onClick={handleExportJSON}
              >
                <FontAwesomeIcon
                  icon={faDownload}
                  style={{ marginRight: '0.5rem' }}
                />
                Export backup (JSON)
              </button>
              {backupExportStatus && (
                <p
                  className={styles.labelDescription}
                  style={{
                    margin: 0,
                    color:
                      backupExportStatus.type === 'error'
                        ? '#d32f2f'
                        : '#2e7d32',
                  }}
                  role={
                    backupExportStatus.type === 'error' ? 'alert' : 'status'
                  }
                >
                  {backupExportStatus.message}
                </p>
              )}
              <button
                type="button"
                className={clsx(buttonStyles.button, buttonStyles.neutral)}
                onClick={handleImportJSON}
              >
                <FontAwesomeIcon
                  icon={faUpload}
                  style={{ marginRight: '0.5rem' }}
                />
                Import backup (JSON)
              </button>
              {backupImportStatus && (
                <p
                  className={styles.labelDescription}
                  style={{
                    margin: 0,
                    color:
                      backupImportStatus.type === 'error'
                        ? '#d32f2f'
                        : '#2e7d32',
                  }}
                  role={
                    backupImportStatus.type === 'error' ? 'alert' : 'status'
                  }
                >
                  {backupImportStatus.message}
                </p>
              )}
              <button
                type="button"
                className={clsx(buttonStyles.button, buttonStyles.neutral)}
                onClick={handleExportWeightsCSV}
                disabled={weightRecords.length === 0}
              >
                <FontAwesomeIcon
                  icon={faDownload}
                  style={{ marginRight: '0.5rem' }}
                />
                Export weights (CSV)
              </button>
              {csvExportStatus && (
                <p
                  className={styles.labelDescription}
                  style={{
                    margin: 0,
                    color:
                      csvExportStatus.type === 'error' ? '#d32f2f' : '#2e7d32',
                  }}
                  role={csvExportStatus.type === 'error' ? 'alert' : 'status'}
                >
                  {csvExportStatus.message}
                </p>
              )}
              {weightRecords.length === 0 && (
                <p className={styles.labelDescription} style={{ margin: 0 }}>
                  No weight data to export yet.
                </p>
              )}
              <input
                type="file"
                ref={importFileInputRef}
                accept=".json,application/json"
                style={{ display: 'none' }}
                onChange={handleImportFileSelected}
              />
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.icon} aria-hidden={true}>
            <FontAwesomeIcon icon={faTrashCan} fontSize={30} />
          </div>
          <div className={styles.labelContainer}>
            <div className={styles.label}>Delete all data</div>
            <p className={styles.labelDescription}>
              Permanently remove all data including weight records and settings.
            </p>
          </div>
          <div className={styles.inputContainer}>
            <button
              type="button"
              className={clsx(buttonStyles.button, buttonStyles.danger)}
              onClick={() => setIsDeleteAllDataDialogOpen(true)}
            >
              Delete all data
            </button>
          </div>
        </div>
      </Card>

      <Dialog
        isOpen={isDeleteAllDataDialogOpen}
        title="Delete all data?"
        onClose={() => setIsDeleteAllDataDialogOpen(false)}
        initialFocusRef={cancelDeleteAllDataButtonRef}
        actions={
          <>
            <button
              type="button"
              className={clsx(buttonStyles.button, buttonStyles.neutral)}
              onClick={() => setIsDeleteAllDataDialogOpen(false)}
              ref={cancelDeleteAllDataButtonRef}
            >
              Cancel
            </button>
            <button
              type="button"
              className={clsx(buttonStyles.button, buttonStyles.danger)}
              onClick={() => {
                clearAllData();
                setIsDeleteAllDataDialogOpen(false);
              }}
            >
              Delete all data
            </button>
          </>
        }
      >
        This will permanently delete all app data and restore defaults. This
        action cannot be undone.
      </Dialog>

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
    </div>
  );
}
