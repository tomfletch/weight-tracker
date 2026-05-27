import {
  faBullseye,
  faDownload,
  faPaintBrush,
  faRuler,
  faRulerVertical,
  faTrashCan,
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
import buttonStyles from '~/styles/buttons.module.css';
import inputStyles from '~/styles/inputs.module.css';
import { HeightUnit, type HeightUnit as HeightUnitType } from '~/types/height';
import { WeightUnit, type WeightUnit as WeightUnitType } from '~/types/weight';
import { BackupExportButton } from './components/BackupExportButton/BackupExportButton';
import { BackupImportButton } from './components/BackupImportButton/BackupImportButton';
import { ColourSelect } from './components/ColourSelect/ColourSelect';
import { ExportWeightsCsvButton } from './components/ExportWeightsCsvButton/ExportWeightsCsvButton';
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
            <div className={styles.exportButtonsContainer}>
              <BackupExportButton />
              <BackupImportButton />
              <ExportWeightsCsvButton />
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
    </div>
  );
}
