import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type React from 'react';
import { useState } from 'react';
import { Card } from '~/components/Card/Card';
import { IconButton } from '~/components/IconButton/IconButton';
import { WeightInput } from '~/components/WeightInput/WeightInput';
import { useAppWeight } from '~/hooks/useAppWeight';
import type { WeightRecord } from '~/types/weight';
import { toISODate } from '~/utils/dates';
import styles from './AddWeight.module.css';

const today = new Date();
const todayStr = toISODate(today);

export function AddWeight() {
  const [date, setDate] = useState(todayStr);
  const [weight, setWeight] = useState<number | null>(null);

  const { addWeight } = useAppWeight();

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
      <Card className={styles.addWeight}>
        <form onSubmit={onWeightSubmit}>
          <div className={styles.formFields}>
            <div className={`${styles.field} ${styles.dateSection}`}>
              <label htmlFor="date-input">Date:</label>
              <input
                id="date-input"
                type="date"
                value={date}
                max={todayStr}
                onChange={(e) => setDate(e.target.value)}
                className={styles.dateInput}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="weight-input">Weight:</label>
              <WeightInput
                id="weight-input"
                weight={weight}
                onChange={(newWeight) => setWeight(newWeight)}
              />
            </div>
          </div>
          <IconButton
            type="submit"
            label="Add weight"
            className={styles.addButton}
            icon={<FontAwesomeIcon icon={faPlus} />}
          />
        </form>
      </Card>
    </div>
  );
}
