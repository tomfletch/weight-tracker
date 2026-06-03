import styles from './Step.module.css';

export function Step1() {
  return (
    <div className={styles.container}>
      <h2>Choose your weight units</h2>
      <p className={styles.description}>
        Select your preferred weight units and add your current weight.
      </p>
    </div>
  );
}
