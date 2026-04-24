import { useId } from 'react';
import { Card } from '~/components/Card/Card';
import { useAppHeight } from '~/hooks/useAppHeight';
import { useAppWeight } from '~/hooks/useAppWeight';
import {
  BMI_NORMAL_MAX,
  BMI_NORMAL_MIN,
  BMI_OVERWEIGHT_MAX,
  calculateBMI,
  getBMICategory,
} from '~/utils/bmi';
import { limit, map } from '~/utils/math';
import styles from './StatsBar.module.css';

export function BMIWidget() {
  return (
    <Card className={`${styles.statsWidget} ${styles.bmiWidget}`}>
      <Card.Title>BMI</Card.Title>
      <BMIWidgetContent />
    </Card>
  );
}

function BMIWidgetContent() {
  const { weightRecords } = useAppWeight();
  const { height } = useAppHeight();

  const bmiDescriptionId = useId();

  if (!height) {
    return <>Height not set</>;
  }

  const weight = weightRecords[weightRecords.length - 1].weightKgs;
  const bmi = calculateBMI(weight, height);

  const barMin = BMI_NORMAL_MIN - 1;
  const barMax = BMI_OVERWEIGHT_MAX + 1;

  const mapBar = (value: number) => map(value, barMin, barMax, 0, 100);

  const position = limit(mapBar(bmi), 0, 100);
  const normalMin = mapBar(BMI_NORMAL_MIN);
  const normalMax = mapBar(BMI_NORMAL_MAX);
  const overweightMax = mapBar(BMI_OVERWEIGHT_MAX);

  const normalMid = mapBar((BMI_NORMAL_MIN + BMI_NORMAL_MAX) / 2);
  const overweightMid = mapBar((BMI_NORMAL_MAX + BMI_OVERWEIGHT_MAX) / 2);

  return (
    <div
      className={styles.bmiBar}
      role="img"
      aria-label={`Your BMI is ${bmi.toFixed(1)}, which is considered ${getBMICategory(bmi)}.`}
      aria-describedby={bmiDescriptionId}
    >
      <div className={styles.bmiContainer}>
        <div className={styles.bmi} style={{ left: `${position}%` }}>
          {bmi.toFixed(1)}
        </div>
      </div>
      <div className={styles.arrowContainer}>
        <div className={styles.arrow} style={{ left: `${position}%` }} />
      </div>
      <div className={styles.bar}>
        <div
          className={styles.underweight}
          style={{ width: `${normalMin}%` }}
        />
        <div
          className={styles.normal}
          style={{ width: `${normalMax - normalMin}%` }}
        />
        <div
          className={styles.overweight}
          style={{ width: `${overweightMax - normalMax}%` }}
        />
        <div
          className={styles.obese}
          style={{ width: `${100 - overweightMax}%` }}
        />
      </div>
      <div className={styles.labels}>
        <div style={{ left: `${normalMid}%` }}>Healthy</div>
        <div style={{ left: `${overweightMid}%` }}>Overweight</div>
      </div>
      <div id={bmiDescriptionId} className="visuallyHidden">
        <p>BMI categories:</p>
        <ul>
          <li>Underweight: less than {BMI_NORMAL_MIN}</li>
          <li>
            Healthy: between {BMI_NORMAL_MIN} and {BMI_NORMAL_MAX}
          </li>
          <li>
            Overweight: between {BMI_NORMAL_MAX} and {BMI_OVERWEIGHT_MAX}
          </li>
          <li>Obese: greater than {BMI_OVERWEIGHT_MAX}</li>
        </ul>
      </div>
    </div>
  );
}
