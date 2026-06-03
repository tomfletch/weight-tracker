import { Card } from '~/components/Card/Card';
import styles from './WelcomePage.module.css';

export function WelcomePage() {
  return (
    <div className={styles.container}>
      <Card className={styles.welcomeCard}>
        <Card.Title as="h1">Welcome to Weight Tracker</Card.Title>
        <p>
          This app helps you track your weight over time and visualize your
          progress.
        </p>
      </Card>
    </div>
  );
}
