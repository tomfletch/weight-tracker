import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useSettingsContext } from '../../../../context/SettingsContext';
import { WeightRecord, useWeightContext } from '../../../../context/WeightContext';
import WeightInput from '../../../../components/WeightInput/WeightInput';
import styles from './AddWeight.module.css';
import { toISODate } from '../../../../utils/dates';

const today = new Date();
const todayStr = toISODate(today);

function AddWeight() {
  const [date, setDate] = useState(todayStr);
  const [weight, setWeight] = useState<number | null>(null);

  const { addWeight } = useWeightContext();
  const { accentColour } = useSettingsContext();

  const onWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!weight) return;

    const weightRecord: WeightRecord = {
      date,
      weightKgs: weight,
    };
    addWeight(weightRecord);
  };

  return (
    <div className={styles.addWeightContainer}>
      <div className={`card ${styles.addWeight}`}>
        <form onSubmit={onWeightSubmit}>
          <div className={styles.formFields}>
            <div className={`${styles.field} ${styles.dateSection}`}>
              <label htmlFor="date-input">Date:</label>
              <input id="date-input" type="date" value={date} max={todayStr} onChange={(e) => setDate(e.target.value)} className={styles.dateInput} />
            </div>
            <div className={styles.field}>
              <label htmlFor="weight-input">Weight:</label>
              <WeightInput id="weight-input" weight={weight} onChange={(newWeight) => setWeight(newWeight)} />
            </div>
          </div>
          <button type="submit" className={styles.addButton} style={{ backgroundColor: accentColour }}>
            <FontAwesomeIcon icon={faAdd} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddWeight;
