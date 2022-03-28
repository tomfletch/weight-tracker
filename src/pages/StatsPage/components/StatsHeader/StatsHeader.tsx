import { faLongArrowDown, faLongArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import SettingsContext from '../../../../context/SettingsContext';
import WeightContext from '../../../../context/WeightContext';
import { formatWeight } from '../../../../utils/weights';
import styles from './StatsHeader.module.css';

function StatsHeader() {
  const { weightRecords, weightUnit, weightTargetKgs } = useContext(WeightContext);
  const { accentColour } = useContext(SettingsContext);

  const firstWeight = weightRecords[0].weightKgs;
  const lastWeight = weightRecords[weightRecords.length - 1].weightKgs;
  const lastWeightStr = formatWeight(lastWeight, weightUnit);

  const weightTargetStr = formatWeight(weightTargetKgs, weightUnit);

  const weightChange = lastWeight - firstWeight;
  const weightChangeStr = formatWeight(Math.abs(weightChange), weightUnit);

  return (
    <>
      <div className={styles.ellipse} />
      <div className={styles.currentWeightContainer} style={{ backgroundColor: accentColour }}>
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
            {weightChange !== 0 && (
            <FontAwesomeIcon icon={weightChange > 0 ? faLongArrowUp : faLongArrowDown} className={styles.weightChangeIcon} />
            )}
          </span>
        </div>
      </div>
    </>
  );
}

export default StatsHeader;
