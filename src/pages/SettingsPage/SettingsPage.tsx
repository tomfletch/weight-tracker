import { useCallback, useContext } from 'react';
import WeightInput from '../../components/WeightInput/WeightInput';
import SettingsContext from '../../context/SettingsContext';
import WeightContext, { WeightUnit } from '../../context/WeightContext';
import ColourSelect from './ColourSelect/ColourSelect';
import styles from './SettingsPage.module.css';

const weightUnitOptions = [
  {key: WeightUnit.STONES_LBS, name: 'Stone and Pounds (st, lb)'},
  {key: WeightUnit.LBS, name: 'Pounds (lb)'},
  {key: WeightUnit.KGS, name: 'Kilograms (kg)'},
];

function SettingsPage() {
  const { weightUnit, setWeightUnit, weightTargetKgs, setWeightTargetKgs } = useContext(WeightContext);
  const { accentColour, setAccentColour } = useContext(SettingsContext);

  const onTargetWeightChange = useCallback((weight: number | null) => {
    if (!weight) return;
    setWeightTargetKgs(weight);
  }, [setWeightTargetKgs]);

  const onWeightUnitChange = (weightUnitStr: string) => {
    const newWeightUnit: WeightUnit = WeightUnit[weightUnitStr as keyof typeof WeightUnit];
    setWeightUnit(newWeightUnit);
  };

  return (
    <div className={`pageContainer ${styles.settingsPage}`}>
      <div className="card">
        <h2>Settings</h2>
        <div className={styles.field}>
          <label htmlFor="weight-units">Weight Units:</label>
          <select id="weight-units" value={weightUnit} onChange={(e) => onWeightUnitChange(e.target.value)}>
            {weightUnitOptions.map((option) => (
              <option key={option.key} value={option.key}>{option.name}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="target-weight">Target Weight:</label>
          <WeightInput id="target-weight" weight={weightTargetKgs} onChange={onTargetWeightChange} />
        </div>
        <div className={styles.field}>
          <label>Theme Colour:</label>
          <ColourSelect value={accentColour} onChange={setAccentColour} />
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
