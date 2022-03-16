import React, { useContext, useState } from 'react';
import WeightContext from '../context/WeightContext';
import styles from './AddWeight.module.css';

const today = new Date();
const todayStr = today.toISOString().split('T')[0];

export interface WeightRecord {
  date: string;
  lbs: number;
}

function AddWeight() {
  const [date, setDate] = useState(todayStr);
  const [stoneStr, setStoneStr] = useState('');
  const [lbsStr, setLbsStr] = useState('');

  const { addWeight } = useContext(WeightContext);

  const onStoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setStoneStr(val.replace(/[^\d]/, ''));
  }

  const onLbsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLbsStr(val.replace(/[^\d.]/, ''));
  }

  const onWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stone = parseInt(stoneStr, 10);
    const lbs = parseFloat(lbsStr);

    const totalLbs = stone * 14 + lbs;

    const weightRecord: WeightRecord = {
      date,
      lbs: totalLbs
    };
    addWeight(weightRecord);
  };

  return (
    <form onSubmit={onWeightSubmit}>
      <div className={styles.section}>
        <label htmlFor="date">Date:</label>
        <input type="date" id="date" value={date} max={todayStr} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className={styles.section}>
        <label>Weight:</label>
        <input type="text" id="stone" value={stoneStr} className={styles.weightInput} maxLength={2} autoComplete="off" onChange={onStoneChange} />
        <label htmlFor="stone">stone</label>
        <input type="text" id="lbs" value={lbsStr} className={styles.weightInput} maxLength={4} autoComplete="off" onChange={onLbsChange} />
        <label htmlFor="lbs">lbs</label>
      </div>
      <button type="submit">Add</button>
    </form>
  )
}

export default AddWeight;
