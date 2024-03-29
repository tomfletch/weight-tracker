import { useCallback } from 'react';
import HeightInput from '../../components/HeightInput/HeightInput';
import WeightInput from '../../components/WeightInput/WeightInput';
import { HeightUnit, useHeightContext } from '../../context/HeightContext';
import { useSettingsContext } from '../../context/SettingsContext';
import { WeightUnit, useWeightContext } from '../../context/WeightContext';
import ColourSelect from './ColourSelect/ColourSelect';
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

function SettingsPage() {
  const {
    weightUnit, setWeightUnit, weightTargetKgs, setWeightTargetKgs,
  } = useWeightContext();
  const { accentColour, setAccentColour } = useSettingsContext();
  const {
    heightUnit, setHeightUnit, height, setHeight,
  } = useHeightContext();

  const onTargetWeightChange = useCallback((weight: number | null) => {
    if (!weight) return;
    setWeightTargetKgs(weight);
  }, [setWeightTargetKgs]);

  const onWeightUnitChange = (weightUnitStr: string) => {
    const newWeightUnit: WeightUnit = WeightUnit[weightUnitStr as keyof typeof WeightUnit];
    setWeightUnit(newWeightUnit);
  };

  const onHeightUnitChange = (heightUnitStr: string) => {
    const newHeightUnit: HeightUnit = HeightUnit[heightUnitStr as keyof typeof HeightUnit];
    setHeightUnit(newHeightUnit);
  };

  return (
    <div className={`pageContainer ${styles.settingsPage}`}>
      <div className="card">
        <h2>Settings</h2>
        <div className={styles.field}>
          <label htmlFor="weight-units">Weight Units</label>
          <select id="weight-units" value={weightUnit} onChange={(e) => onWeightUnitChange(e.target.value)}>
            {weightUnitOptions.map((option) => (
              <option key={option.key} value={option.key}>{option.name}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="target-weight">Target Weight</label>
          <WeightInput id="target-weight" weight={weightTargetKgs} onChange={onTargetWeightChange} />
        </div>
        <div className={styles.field}>
          <label htmlFor="height-units">Height Units</label>
          <select id="height-units" value={heightUnit} onChange={(e) => onHeightUnitChange(e.target.value)}>
            {heightUnitOptions.map((option) => (
              <option key={option.key} value={option.key}>{option.name}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="height">Height</label>
          <HeightInput id="height" height={height} onChange={setHeight} />
        </div>
        <div className={styles.field}>
          <label>Theme Colour</label>
          <ColourSelect value={accentColour} onChange={setAccentColour} />
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
