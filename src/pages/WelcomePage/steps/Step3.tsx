import styles from './Step.module.css';

export function Step3() {
  return (
    <div className={styles.container}>
      <h2>Choose your target weight</h2>
      <p className={styles.description}>
        Select your desired target weight for the app to track.
      </p>
    </div>
  );
}
