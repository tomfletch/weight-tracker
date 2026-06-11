import { ColourSelect } from '~/components/ColourSelect/ColourSelect';
import { useAppSettings } from '~/hooks/useAppSettings';
import styles from './Step.module.css';

export function Step4() {
  const { theme, setTheme } = useAppSettings();

  return (
    <div className={styles.container}>
      <div className={styles.stepHeader}>
        <h2>Choose Your Theme</h2>
        <p className={styles.description}>
          Pick a colour theme for the app. This will update the accent colour
          across the interface.
        </p>
      </div>

      <div className={`${styles.field} ${styles.fieldCenter}`}>
        <ColourSelect value={theme} onChange={setTheme} />
      </div>
    </div>
  );
}
