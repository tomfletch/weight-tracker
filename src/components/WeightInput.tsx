import { useContext, useEffect, useState } from 'react';
import WeightContext from '../context/WeightContext';
import { convertKgToStLb, convertStLbToKg } from '../utils/weights';
import styles from './WeightInput.module.css';

function WeightInput({ weight, onChange }: { weight: number | null, onChange: (weight: number | null) => void}) {
  const { weightUnit } = useContext(WeightContext);

  let initialStStr = '';
  let initialLbStr = '';

  if (weight) {
    const { st, lb } = convertKgToStLb(weight);
    initialStStr = st.toString();
    initialLbStr = lb.toFixed(1);
  }

  const [stStr, setStStr] = useState(initialStStr);
  const [lbStr, setLbStr] = useState(initialLbStr);

  useEffect(() => {
    if (stStr.length === 0 || lbStr.length === 0) {
      onChange(null);
      return;
    }

    const st = parseInt(stStr, 10);
    const lb = parseFloat(lbStr);

    const newWeightKg = convertStLbToKg({st, lb});
    onChange(newWeightKg);
  }, [stStr, lbStr, onChange]);

  const onStoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setStStr(val.replace(/[^\d]/, ''));
  }

  const onLbsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLbStr(val.replace(/[^\d.]/, ''));
  }

  return (
    <div className={styles.weightInput}>
      <input type="text" id="target-weight" value={stStr} maxLength={2} autoComplete="off" onChange={onStoneChange} />
      <div className={styles.weightUnit}>st</div>
      <input type="text" id="lbs" value={lbStr} maxLength={4} autoComplete="off" onChange={onLbsChange} />
      <div className={styles.weightUnit}>lb</div>
    </div>
  );
}

export default WeightInput;
