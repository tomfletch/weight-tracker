import clsx from 'clsx';
import logo from '~/assets/logo.svg';
import { Card } from '~/components/Card/Card';
import { Steps } from '~/components/Steps/Steps';
import { useAppSettings } from '~/hooks/useAppSettings';
import { useStepCounter } from '~/hooks/useStepCounter';
import buttonStyles from '~/styles/buttons.module.css';
import { Step1 } from './steps/Step1';
import { Step2 } from './steps/Step2';
import { Step3 } from './steps/Step3';
import styles from './WelcomePage.module.css';

const stepComponents = [Step1, Step2, Step3];

export function WelcomePage() {
  const { setOnboardingCompleted } = useAppSettings();

  const { currentStep, incrementStep, decrementStep } = useStepCounter({
    stepCount: 3,
  });

  const StepComponent = stepComponents[currentStep - 1];

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

        <div className={styles.stepContent}>
          <StepComponent />
        </div>

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
            onClick={() => {
              if (currentStep === stepComponents.length) {
                setOnboardingCompleted();
              } else {
                incrementStep();
              }
            }}
          >
            Next
          </button>
        </div>
      </Card>
    </div>
  );
}
