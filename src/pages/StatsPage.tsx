import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import WeightContext from '../context/WeightContext';
import { formatWeight } from '../utils/weights';
import styles from './StatsPage.module.css';

function StatsPage() {
  const { weightRecords, weightUnit, weightTargetKgs } = useContext(WeightContext);

  const firstWeight = weightRecords[0].weightKgs;
  const lastWeight = weightRecords[weightRecords.length - 1].weightKgs;
  const lastWeightStr = formatWeight(lastWeight, weightUnit);

  const weightTargetStr = formatWeight(weightTargetKgs, weightUnit);

  const weightChange = lastWeight - firstWeight;
  const weightChangeStr = formatWeight(Math.abs(weightChange), weightUnit);

  return (
    <>
      <div className={styles.ellipse}></div>
      <div className="pageContainer">
        <div className={styles.currentWeightContainer}>
          <span className={styles.currentWeight}>{lastWeightStr}</span>
          <span className={styles.currentWeightLabel}>Current Weight</span>
        </div>
        <div className={styles.headlineStats}>
          <div className={styles.weightTarget}>
            <span className={styles.label}>Target Weight</span>
            <span className={styles.value}>{weightTargetStr}</span>
          </div>
          <div className={styles.weightChange}>
          <span className={styles.label}>Weight Change</span>
          <span className={styles.value}>
            {weightChangeStr}
            {weightChange !== 0  && (
              <FontAwesomeIcon icon={weightChange > 0 ? faChevronUp : faChevronDown} className={styles.weightChangeIcon} />
            )}
          </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default StatsPage;
