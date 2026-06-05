import { useCallback } from 'react';
import { WeightInput } from '~/components/WeightInput/WeightInput';
import { useAppWeight } from '~/hooks/useAppWeight';
import inputStyles from '~/styles/inputs.module.css';
import { WeightUnit, weightUnitOptions } from '~/types/weight';
import { toISODate } from '~/utils/dates';
import styles from './Step.module.css';

export function Step1() {
  const { weightUnit, weightRecords, setWeightUnit, addWeight, deleteWeight } =
    useAppWeight();

  const todayStr = toISODate(new Date());
  const currentWeight =
    weightRecords.find((record) => record.date === todayStr)?.weightKgs ?? null;

  const onWeightUnitChange = useCallback(
    (weightUnitStr: string) => {
      const newWeightUnit =
        WeightUnit[weightUnitStr as keyof typeof WeightUnit];
      setWeightUnit(newWeightUnit);
    },
    [setWeightUnit],
  );

  const onWeightChange = useCallback(
    (weight: number | null) => {
      if (weight === null) {
        deleteWeight(todayStr);
        return;
      }
      addWeight({ date: todayStr, weightKgs: weight });
    },
    [addWeight, deleteWeight, todayStr],
  );

  return (
    <div className={styles.container}>
      <div className={styles.stepHeader}>
        <h2>Choose Your Weight Units</h2>
        <p className={styles.description}>
          Select your preferred weight units and add your current weight.
        </p>
      </div>

      <div className={styles.field}>
        <div className={styles.labelContainer}>
          <label className={styles.label} htmlFor="welcome-weight-units">
            Weight Units
          </label>
        </div>
        <div className={styles.inputContainer}>
          <select
            id="welcome-weight-units"
            className={inputStyles.selectInput}
            value={weightUnit}
            onChange={(e) => onWeightUnitChange(e.target.value)}
          >
            {weightUnitOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <WeightInput
          weight={currentWeight}
          onChange={onWeightChange}
          label="Current Weight"
          labelClassName={styles.label}
          labelDescriptionClassName={styles.labelDescription}
          labelContainerClassName={styles.labelContainer}
          inputContainerClassName={styles.inputContainer}
        />
      </div>
    </div>
  );
}
