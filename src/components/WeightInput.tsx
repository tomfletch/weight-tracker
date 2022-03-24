import { useContext, useEffect, useState } from 'react';
import WeightContext, { WeightUnit } from '../context/WeightContext';
import { convertKgToLb, convertKgToStLb, convertLbToKg, convertStLbToKg } from '../utils/weights';
import styles from './WeightInput.module.css';

function toFixedNoZero(n: number, digits: number): string {
  return n.toFixed(digits).replace(/\.?0+$/, '');
}

function WeightInputKg({ weight, onChange }: { weight: number | null, onChange: (weight: number | null) => void}) {
  let initialKgStr = '';

  if (weight) {
    initialKgStr = toFixedNoZero(weight, 1);
  }

  const [isChanged, setIsChanged] = useState(false);
  const [kgStr, setKgStr] = useState(initialKgStr);

  useEffect(() => {
    if (!isChanged) return;

    if (kgStr.length === 0) {
      onChange(null);
      return;
    }

    const newWeight = parseFloat(kgStr);
    onChange(newWeight);
  }, [isChanged, kgStr, onChange]);

  const onKgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setKgStr(val.replace(/[^\d.]/, ''));
    setIsChanged(true);
  }

  return (
    <div className={styles.weightInput}>
      <input type="text" className={styles.weightInputKg} value={kgStr} maxLength={5} autoComplete="off" onChange={onKgChange} />
      <div className={styles.weightUnit}>kg</div>
    </div>
  );
}

function WeightInputStLb({ weight, onChange }: { weight: number | null, onChange: (weight: number | null) => void}) {
  let initialStStr = '';
  let initialLbStr = '';

  if (weight) {
    const { st, lb } = convertKgToStLb(weight);
    initialStStr = st.toString();
    initialLbStr = toFixedNoZero(lb, 1);
  }

  const [isChanged, setIsChanged] = useState(false);
  const [stStr, setStStr] = useState(initialStStr);
  const [lbStr, setLbStr] = useState(initialLbStr);

  useEffect(() => {
    if (!isChanged) return;

    if (stStr.length === 0 || lbStr.length === 0) {
      onChange(null);
      return;
    }

    const st = parseInt(stStr, 10);
    const lb = parseFloat(lbStr);

    const newWeightKg = convertStLbToKg({st, lb});
    onChange(newWeightKg);
  }, [isChanged, stStr, lbStr, onChange]);

  const onStoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setStStr(val.replace(/[^\d]/, ''));
    setIsChanged(true);
  }

  const onLbsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLbStr(val.replace(/[^\d.]/, ''));
    setIsChanged(true);
  }

  return (
    <div className={styles.weightInput}>
      <input type="text" value={stStr} maxLength={2} autoComplete="off" onChange={onStoneChange} />
      <div className={styles.weightUnit}>st</div>
      <input type="text" value={lbStr} maxLength={4} autoComplete="off" onChange={onLbsChange} />
      <div className={styles.weightUnit}>lb</div>
    </div>
  );
}

function WeightInputLb({ weight, onChange }: { weight: number | null, onChange: (weight: number | null) => void}) {
  let initialLbStr = '';

  if (weight) {
    const lb = convertKgToLb(weight);
    initialLbStr = toFixedNoZero(lb, 1);
  }

  const [isChanged, setIsChanged] = useState(false);
  const [lbStr, setLbStr] = useState(initialLbStr);

  useEffect(() => {
    if (!isChanged) return;

    if (lbStr.length === 0) {
      onChange(null);
      return;
    }

    const lb = parseFloat(lbStr);
    const newWeightKg = convertLbToKg(lb);
    onChange(newWeightKg);
  }, [isChanged, lbStr, onChange]);

  const onLbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLbStr(val.replace(/[^\d.]/, ''));
    setIsChanged(true);
  }

  return (
    <div className={styles.weightInput}>
      <input type="text" className={styles.weightInputLb} value={lbStr} maxLength={5} autoComplete="off" onChange={onLbChange} />
      <div className={styles.weightUnit}>lb</div>
    </div>
  );
}

function WeightInput({ weight, onChange }: { weight: number | null, onChange: (weight: number | null) => void}) {
  const { weightUnit } = useContext(WeightContext);

  let InputComponent = WeightInputKg;

  if (weightUnit === WeightUnit.STONES_LBS) {
    InputComponent = WeightInputStLb;
  }

  if (weightUnit === WeightUnit.LBS) {
    InputComponent = WeightInputLb;
  }

  return <InputComponent weight={weight} onChange={onChange} />
}

export default WeightInput;
