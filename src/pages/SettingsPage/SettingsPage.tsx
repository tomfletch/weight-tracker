import { useCallback } from 'react';
import { Card } from '~/components/Card/Card';
import { HeightInput } from '~/components/HeightInput/HeightInput';
import { WeightInput } from '~/components/WeightInput/WeightInput';
import { useAppHeight } from '~/hooks/useAppHeight';
import { useAppSettings } from '~/hooks/useAppSettings';
import { useAppWeight } from '~/hooks/useAppWeight';
import { HeightUnit, type HeightUnit as HeightUnitType } from '~/types/height';
import { WeightUnit, type WeightUnit as WeightUnitType } from '~/types/weight';
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

export function SettingsPage() {
  const { weightUnit, setWeightUnit, weightTargetKgs, setWeightTargetKgs } =
    useAppWeight();
  const { theme, setTheme } = useAppSettings();
  const { heightUnit, setHeightUnit, height, setHeight } = useAppHeight();

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
      <Card>
        <Card.Title as="h1">Settings</Card.Title>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="weight-units">
            Weight Units
          </label>
          <select
            id="weight-units"
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
        <div className={styles.field}>
          <WeightInput
            weight={weightTargetKgs}
            onChange={onTargetWeightChange}
            label="Target Weight"
            labelClassName={styles.label}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="height-units">
            Height Units
          </label>
          <select
            id="height-units"
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
        <div className={styles.field}>
          <HeightInput
            height={height}
            onChange={setHeight}
            label="Height"
            labelClassName={styles.label}
          />
        </div>
        <fieldset className="inputFieldset">
          <legend className="visuallyHidden">Theme</legend>
          <div className={styles.field}>
            <span className={styles.label} aria-hidden="true">
              Theme
            </span>
            <ColourSelect value={theme} onChange={setTheme} />
          </div>
        </fieldset>
      </Card>
    </div>
  );
}
