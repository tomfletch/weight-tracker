import { useCallback } from 'react';
import { HeightInput } from '~/components/HeightInput/HeightInput';
import { useAppHeight } from '~/hooks/useAppHeight';
import inputStyles from '~/styles/inputs.module.css';
import { HeightUnit, heightUnitOptions } from '~/types/height';
import styles from './Step.module.css';

export function Step2() {
  const { heightUnit, height, setHeightUnit, setHeight } = useAppHeight();

  const onHeightUnitChange = useCallback(
    (heightUnitStr: string) => {
      const newHeightUnit =
        HeightUnit[heightUnitStr as keyof typeof HeightUnit];
      setHeightUnit(newHeightUnit);
    },
    [setHeightUnit],
  );

  return (
    <div className={styles.container}>
      <div className={styles.stepHeader}>
        <h2>Choose Your Height Units</h2>
        <p className={styles.description}>
          Select your preferred height units and add your current height.
        </p>
      </div>

      <div className={styles.field}>
        <div className={styles.labelContainer}>
          <label className={styles.label} htmlFor="welcome-height-units">
            Height Units
          </label>
        </div>
        <div className={styles.inputContainer}>
          <select
            id="welcome-height-units"
            className={inputStyles.selectInput}
            value={heightUnit}
            onChange={(e) => onHeightUnitChange(e.target.value)}
          >
            {heightUnitOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <HeightInput
          height={height}
          onChange={setHeight}
          label="Height"
          labelClassName={styles.label}
          labelDescriptionClassName={styles.labelDescription}
          labelContainerClassName={styles.labelContainer}
          inputContainerClassName={styles.inputContainer}
        />
        <p className="textLight">Your height is used to calculate your BMI.</p>
      </div>
    </div>
  );
}
