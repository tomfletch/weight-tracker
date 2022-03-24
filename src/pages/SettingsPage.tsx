import { useContext } from 'react';
import WeightInput from '../components/WeightInput';
import WeightContext, { WeightUnit } from '../context/WeightContext';
import styles from './SettingsPage.module.css';

const weightUnitOptions = [
  {key: WeightUnit.STONES_LBS, name: 'Stone and Pounds (st, lb)'},
  {key: WeightUnit.LBS, name: 'Pounds (lb)'},
  {key: WeightUnit.KGS, name: 'Kilograms (kg)'},
];

function SettingsPage() {
  const { weightUnit, setWeightUnit, weightTargetKgs, setWeightTargetKgs } = useContext(WeightContext);

  const onTargetWeightChange = (weight: number | null) => {
    if (!weight) return;
    setWeightTargetKgs(weight);
  };

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
          <WeightInput weight={weightTargetKgs} onChange={onTargetWeightChange} />
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
