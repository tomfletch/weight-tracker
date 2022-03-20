import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useState } from 'react';
import SettingsContext from '../context/SettingsContext';
import WeightContext, { WeightRecord } from '../context/WeightContext';
import { convertStsLbsToKg } from '../utils/weights';
import styles from './AddWeight.module.css';

const today = new Date();
const todayStr = today.toISOString().split('T')[0];

function AddWeight() {
  const [date, setDate] = useState(todayStr);
  const [stoneStr, setStoneStr] = useState('');
  const [lbsStr, setLbsStr] = useState('');

  const { addWeight } = useContext(WeightContext);
  const { accentColour } = useContext(SettingsContext);

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
    const kgs = convertStsLbsToKg(stone, lbs);

    const weightRecord: WeightRecord = {
      date,
      weightKgs: kgs
    };
    addWeight(weightRecord);
  };

  return (
    <div className={`card ${styles.addWeight}`}>
      <form onSubmit={onWeightSubmit}>
        <div className={styles.section}>
          <label htmlFor="date">Date:</label>
          <input type="date" id="date" value={date} max={todayStr} onChange={(e) => setDate(e.target.value)} className={styles.dateInput} />
        </div>
        <div className={styles.section}>
          <input type="text" id="stone" value={stoneStr} className={styles.weightInput} maxLength={2} autoComplete="off" onChange={onStoneChange} />
          <label htmlFor="stone">st</label>
          <input type="text" id="lbs" value={lbsStr} className={styles.weightInput} maxLength={4} autoComplete="off" onChange={onLbsChange} />
          <label htmlFor="lbs">lb</label>
        </div>
        <div className={styles.section}>
          <button type="submit" className={styles.addButton} style={{backgroundColor: accentColour}}>
            <FontAwesomeIcon icon={faAdd} />
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddWeight;
