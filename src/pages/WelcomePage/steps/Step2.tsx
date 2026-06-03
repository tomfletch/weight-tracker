import styles from './Step.module.css';

export function Step2() {
  return (
    <div className={styles.container}>
      <h2>Choose your height units</h2>
      <p className={styles.description}>
        Select your preferred height units and add your current height.
      </p>
    </div>
  );
}
