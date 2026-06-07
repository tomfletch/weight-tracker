import { useCallback } from 'react';
import { WeightInput } from '~/components/WeightInput/WeightInput';
import { useAppHeight } from '~/hooks/useAppHeight';
import { useAppWeight } from '~/hooks/useAppWeight';
import { calculateHealthyWeightRange } from '~/utils/bmi';
import { formatWeight } from '~/utils/weights';
import styles from './Step.module.css';

export function Step3() {
  const { weightTargetKgs, setWeightTargetKgs } = useAppWeight();

  const onTargetWeightChange = useCallback(
    (weight: number | null) => {
      if (weight === null) return;
      setWeightTargetKgs(weight);
    },
    [setWeightTargetKgs],
  );

  return (
    <div className={styles.container}>
      <div className={styles.stepHeader}>
        <h2>Choose Your Target Weight</h2>
        <p className={styles.description}>
          Select your desired target weight for the app to track.
        </p>
      </div>

      <div className={styles.field}>
        <HealthyWeightRange />
        <WeightInput
          weight={weightTargetKgs}
          onChange={onTargetWeightChange}
          label="Target Weight (optional)"
          labelClassName={styles.label}
          labelDescriptionClassName={styles.labelDescription}
          labelContainerClassName={styles.labelContainer}
          inputContainerClassName={styles.inputContainer}
        />
        <TargetWeightLoss />
      </div>
    </div>
  );
}

function HealthyWeightRange() {
  const { weightUnit } = useAppWeight();
  const { height } = useAppHeight();

  if (!height) return null;

  const { min, max } = calculateHealthyWeightRange(height);

  const minFormatted = formatWeight(min, weightUnit);
  const maxFormatted = formatWeight(max, weightUnit);

  return (
    <p className="textLight">
      Based on your height, your healthy weight range is between{' '}
      <strong>{minFormatted}</strong> and <strong>{maxFormatted}</strong>.
    </p>
  );
}

function TargetWeightLoss() {
  const { weightTargetKgs, weightRecords, weightUnit } = useAppWeight();

  if (weightRecords.length === 0) return null;

  const currentWeight = weightRecords[weightRecords.length - 1].weightKgs;

  if (!weightTargetKgs) return null;

  const weightLossKgs = currentWeight - weightTargetKgs;

  if (weightLossKgs <= 0) return null;

  const weightLossFormatted = formatWeight(weightLossKgs, weightUnit);

  return (
    <p className="textLight">
      This means you will be aiming to lose{' '}
      <strong>{weightLossFormatted}</strong>.
    </p>
  );
}
