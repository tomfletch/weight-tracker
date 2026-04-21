import { Card } from '~/components/Card/Card';
import { useAppSettings } from '~/hooks/useAppSettings';
import { useAppWeight } from '~/hooks/useAppWeight';
import { formatWeight } from '~/utils/weights';
import styles from './ProgressBar.module.css';

export function ProgressBar() {
  const { weightRecords, weightUnit, weightTargetKgs } = useAppWeight();
  const { accentColour } = useAppSettings();

  if (weightRecords.length === 0 || !weightTargetKgs) return null;

  const startWeight = weightRecords[0].weightKgs;
  const targetWeight = weightTargetKgs;
  const currentWeight = weightRecords[weightRecords.length - 1].weightKgs;

  const startWeightStr = formatWeight(startWeight, weightUnit);
  const targetWeightStr = formatWeight(targetWeight, weightUnit);

  const weightChangeTarget = targetWeight - startWeight;
  const weightChangeProgress = currentWeight - startWeight;

  let weightChangePercent = weightChangeProgress / weightChangeTarget;
  weightChangePercent = Math.max(0, Math.min(1, weightChangePercent));

  const weightChangePercentStr = `${Math.round(weightChangePercent * 100)}%`;

  const valueSideThreshold = 0.5;

  return (
    <Card>
      <div className={styles.progressBarContainer}>
        <div className={styles.weight}>{startWeightStr}</div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressBarFill}
            style={{
              width: `${weightChangePercent * 100}%`,
              backgroundColor: accentColour,
            }}
          >
            {weightChangePercent >= valueSideThreshold && (
              <div className={styles.value}>{weightChangePercentStr}</div>
            )}
          </div>
          <div className={styles.progressBarEmpty}>
            {weightChangePercent < valueSideThreshold && (
              <div className={styles.value} style={{ color: accentColour }}>
                {weightChangePercentStr}
              </div>
            )}
          </div>
        </div>
        <div className={styles.weight}>{targetWeightStr}</div>
      </div>
      <div className={styles.labels}>
        <span>Start Weight</span>
        <span>Target Weight</span>
      </div>
    </Card>
  );
}
