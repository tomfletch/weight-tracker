import clsx from 'clsx';
import logo from '~/assets/logo.svg';
import { Card } from '~/components/Card/Card';
import { Steps } from '~/components/Steps/Steps';
import { useStepCounter } from '~/hooks/useStepCounter';
import buttonStyles from '~/styles/buttons.module.css';
import styles from './WelcomePage.module.css';

export function WelcomePage() {
  const { currentStep, incrementStep, decrementStep } = useStepCounter({
    stepCount: 3,
  });

  return (
    <div className={styles.container}>
      <Card className={styles.welcomeCard}>
        <div className={styles.logoContainer}>
          <img src={logo} width="46" height="40" alt="" />
        </div>
        <Card.Title as="h1" className={styles.welcomeTitle}>
          Welcome to Weight Tracker!
        </Card.Title>
        <p className="textLight">Let's get you set up in three simple steps.</p>
        <Steps
          steps={[
            { label: 'Weight' },
            { label: 'Height' },
            { label: 'Target Weight' },
          ]}
          currentStep={currentStep}
        />

        <div className={styles.actions}>
          <button
            type="button"
            className={clsx(buttonStyles.button, buttonStyles.neutral)}
            onClick={decrementStep}
          >
            Back
          </button>
          <button
            type="button"
            className={clsx(buttonStyles.button, buttonStyles.primary)}
            onClick={incrementStep}
          >
            Next
          </button>
        </div>
      </Card>
    </div>
  );
}
