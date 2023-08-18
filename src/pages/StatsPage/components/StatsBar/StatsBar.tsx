import { subDays } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowDown, faLongArrowUp } from '@fortawesome/free-solid-svg-icons';
import { WeightRecord, useWeightContext } from '../../../../context/WeightContext';
import { daysBetween } from '../../../../utils/dates';
import { formatWeight } from '../../../../utils/weights';
import styles from './StatsBar.module.css';
import { useHeightContext } from '../../../../context/HeightContext';

const BMI_NORMAL_MIN = 18.5;
const BMI_NORMAL_MAX = 25;
const BMI_OVERWEIGHT_MAX = 30;

function map(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number {
  const fromRange = fromMax - fromMin;
  const toRange = toMax - toMin;

  return ((value - fromMin) / fromRange) * toRange + toMin;
}

function limit(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function RateStatsWidget({ type, startDate }: { type: string, startDate: Date }) {
  const {
    weightRecords,
    getInterpolatedWeight,
    weightUnit,
    weightTargetKgs,
  } = useWeightContext();

  const lastWeightRecord = weightRecords[weightRecords.length - 1];
  const lastWeightDate = new Date(lastWeightRecord.date);
  const lastWeight = lastWeightRecord.weightKgs;
  const targetWeightDelta = weightTargetKgs && weightTargetKgs - lastWeight;

  const startWeight = getInterpolatedWeight(startDate);

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
      icon = <FontAwesomeIcon icon={kgPerWeek > 0 ? faLongArrowUp : faLongArrowDown} className={styles.weightChangeIcon} />;
    }

    currentRate = <>{icon} {formattedWeight} per week</>;

    if (targetWeightDelta && kgPerDay !== 0 && Math.sign(kgPerDay) === Math.sign(targetWeightDelta)) {
      daysUntilTarget = Math.round(targetWeightDelta / kgPerDay);
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
  const { weightRecords } = useWeightContext();
  const { height } = useHeightContext();

  let content;

  if (!height) {
    content = <>Height not set</>;
  } else {
    const weight = weightRecords[weightRecords.length - 1].weightKgs;
    const bmi = weight / (height * height);

    const barMin = BMI_NORMAL_MIN - 1;
    const barMax = BMI_OVERWEIGHT_MAX + 1;

    const mapBar = (value: number) => map(value, barMin, barMax, 0, 100);

    const position = limit(mapBar(bmi), 0, 100);
    const normalMin = mapBar(BMI_NORMAL_MIN);
    const normalMax = mapBar(BMI_NORMAL_MAX);
    const overweightMax = mapBar(BMI_OVERWEIGHT_MAX);

    const normalMid = mapBar((BMI_NORMAL_MIN + BMI_NORMAL_MAX) / 2);
    const overweightMid = mapBar((BMI_NORMAL_MAX + BMI_OVERWEIGHT_MAX) / 2);

    content = (
      <div className={styles.bmiBar}>
        <div className={styles.bmiContainer}>
          <div className={styles.bmi} style={{ left: `${position}%` }}>{bmi.toFixed(1)}</div>
        </div>
        <div className={styles.arrowContainer}>
          <div className={styles.arrow} style={{ left: `${position}%` }} />
        </div>
        <div className={styles.bar}>
          <div className={styles.underweight} style={{ width: `${normalMin}%` }} />
          <div className={styles.normal} style={{ width: `${normalMax - normalMin}%` }} />
          <div className={styles.overweight} style={{ width: `${overweightMax - normalMax}%` }} />
          <div className={styles.obese} style={{ width: `${100 - overweightMax}%` }} />
        </div>
        <div className={styles.labels}>
          <div style={{ left: `${normalMid}%` }}>Healthy</div>
          <div style={{ left: `${overweightMid}%` }}>Overweight</div>
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
  const { weightRecords } = useWeightContext();

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
