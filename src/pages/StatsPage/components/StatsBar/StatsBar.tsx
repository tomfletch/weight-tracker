import { useContext } from 'react';
import { subDays } from 'date-fns';
import WeightContext, { WeightRecord } from '../../../../context/WeightContext';
import { daysBetween } from '../../../../utils/dates';
import { formatWeight } from '../../../../utils/weights';
import styles from './StatsBar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowDown, faLongArrowUp } from '@fortawesome/free-solid-svg-icons';
import HeightContext from '../../../../context/HeightContext';

const BMI_NORMAL_MIN = 18.5;
const BMI_NORMAL_MAX = 25;
const BMI_OVERWEIGHT_MAX = 30;

function map(value: number, from_min: number, from_max: number, to_min: number, to_max: number): number {
  const from_range = from_max - from_min;
  const to_range = to_max - to_min;

  return (value - from_min) / from_range * to_range + to_min;
}

function limit(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function interpolateWeight(weightRecords: WeightRecord[], date: Date): number | null {
  let nearestRecordBefore: WeightRecord | null = null;
  let nearestRecordAfter: WeightRecord | null = null;

  for (const weightRecord of weightRecords) {
    const weightRecordDate = new Date(weightRecord.date);

    if (weightRecordDate.getTime() === date.getTime()) {
      return weightRecord.weightKgs;
    }

    if (weightRecordDate < date && (!nearestRecordBefore || weightRecordDate > new Date(nearestRecordBefore.date))) {
      nearestRecordBefore = weightRecord;
    }

    if (weightRecordDate > date && (!nearestRecordAfter || weightRecordDate < new Date(nearestRecordAfter.date))) {
      nearestRecordAfter = weightRecord;
    }
  }

  if (!nearestRecordBefore || !nearestRecordAfter) {
    return null;
  }

  const beforeDate = new Date(nearestRecordBefore.date);
  const afterDate = new Date(nearestRecordAfter.date);

  const deltaDays = daysBetween(beforeDate, afterDate);
  const targetDays = daysBetween(beforeDate, date);

  const deltaWeight = nearestRecordAfter.weightKgs - nearestRecordBefore.weightKgs;
  const targetDeltaWeight = deltaWeight / deltaDays * targetDays;

  const interpolatedWeight = nearestRecordBefore.weightKgs + targetDeltaWeight;

  return interpolatedWeight;
}

function RateStatsWidget({ type, startDate }: { type: string, startDate: Date }) {
  const { weightRecords, weightUnit, weightTargetKgs } = useContext(WeightContext);

  const lastWeightRecord = weightRecords[weightRecords.length - 1];
  const lastWeightDate = new Date(lastWeightRecord.date);
  const lastWeight = lastWeightRecord.weightKgs;
  const targetWeightDelta = weightTargetKgs - lastWeight;

  const startWeight = interpolateWeight(weightRecords, startDate);

  let currentRate = <>Unknown</>;
  let daysUntilTarget = null;

  if (startWeight !== null) {
    const weightDelta = lastWeight - startWeight;
    const daysDelta = daysBetween(startDate, lastWeightDate);

    const kgPerDay = weightDelta / daysDelta;
    const kgPerWeek = kgPerDay * 7;

    const formattedWeight = formatWeight(Math.abs(kgPerWeek), weightUnit);

    let icon = null;

    if (kgPerWeek !== 0) {
        icon = <FontAwesomeIcon icon={kgPerWeek > 0 ? faLongArrowUp : faLongArrowDown} className={styles.weightChangeIcon} />
    }

    currentRate = <>{icon} {formattedWeight} per week</>;

    if (kgPerDay !== 0 && Math.sign(kgPerDay) === Math.sign(targetWeightDelta)) {
      daysUntilTarget = Math.round(targetWeightDelta / kgPerDay)
    }
  }

  return (
    <div className={`card ${styles.statsWidget}`}>
      <div className={styles.title}>{type} Rate</div>
      <p>{currentRate}</p>
      {daysUntilTarget && (
        <p>Days until target: {daysUntilTarget}</p>
      )}
    </div>
  );
}

function BMIWidget() {
  const { weightRecords } = useContext(WeightContext);
  const { height } = useContext(HeightContext);

  let content;

  if (!height) {
    content = <>Height not set</>;
  } else {
    const weight = weightRecords[weightRecords.length - 1].weightKgs;
    const bmi = weight / (height*height);

    const bar_min = BMI_NORMAL_MIN - 1;
    const bar_max = BMI_OVERWEIGHT_MAX + 1;

    const map_bar = (value: number) => map(value, bar_min, bar_max, 0, 100);

    const position = limit(map_bar(bmi), 0, 100);
    const normal_min = map_bar(BMI_NORMAL_MIN);
    const normal_max = map_bar(BMI_NORMAL_MAX);
    const overweight_max = map_bar(BMI_OVERWEIGHT_MAX);

    const normal_mid = map_bar((BMI_NORMAL_MIN + BMI_NORMAL_MAX) / 2);
    const overweight_mid = map_bar((BMI_NORMAL_MAX + BMI_OVERWEIGHT_MAX) / 2);

    content = (
      <div className={styles.bmiBar}>
        <div className={styles.bmiContainer}>
          <div className={styles.bmi} style={{left: `${position}%`}}>{bmi.toFixed(1)}</div>
        </div>
        <div className={styles.arrowContainer}>
          <div className={styles.arrow} style={{left: `${position}%`}}></div>
        </div>
        <div className={styles.bar}>
          <div className={styles.underweight} style={{width: `${normal_min}%`}}></div>
          <div className={styles.normal} style={{width: `${normal_max - normal_min}%`}}></div>
          <div className={styles.overweight} style={{width: `${overweight_max - normal_max}%`}}></div>
          <div className={styles.obese} style={{width: `${100 - overweight_max}%`}}></div>
        </div>
        <div className={styles.labels}>
          <div style={{left: `${normal_mid}%`}}>Healthy</div>
          <div style={{left: `${overweight_mid}%`}}>Overweight</div>
        </div>
      </div>
    );
  }



  return (
    <div className={`card ${styles.statsWidget}`}>
      <div className={styles.title}>BMI</div>
      {content}
    </div>
  );
}

function StatsBar() {
  const { weightRecords } = useContext(WeightContext);

  const firstRecordDate = new Date(weightRecords[0].date);
  const lastRecordDate = new Date(weightRecords[weightRecords.length - 1].date);
  const weekAgoDate = subDays(lastRecordDate, 7);

  return (
    <div className={styles.statsBar}>
      <RateStatsWidget type="All Time" startDate={firstRecordDate} />
      <RateStatsWidget type="Current" startDate={weekAgoDate} />
      <BMIWidget />
    </div>
  );
}

export default StatsBar;
