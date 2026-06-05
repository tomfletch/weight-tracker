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

const steps = [
  { number: 1, label: 'Weight', Component: Step1 },
  { number: 2, label: 'Height', Component: Step2 },
  { number: 3, label: 'Target Weight', Component: Step3 },
];

const lastStepNumber = steps[steps.length - 1].number;

export function WelcomePage() {
  const { setOnboardingCompleted } = useAppSettings();

  const { currentStep, incrementStep, decrementStep } = useStepCounter({
    stepCount: 3,
  });

  return (
    <div className={styles.container}>
      <Card className={styles.welcomeCard}>
        <div className={styles.welcomeHeader}>
          <div className={styles.logoContainer}>
            <img src={logo} width="46" height="40" alt="" />
          </div>
          <Card.Title as="h1" className={styles.welcomeTitle}>
            Welcome to Weight Tracker!
          </Card.Title>
          <p className="textLight">
            Let's get you set up in three simple steps.
          </p>
        </div>
        <Steps steps={steps} currentStep={currentStep} />

        <div className={styles.stepContent}>
          {steps.map((step) => (
            <div
              key={step.number}
              className={styles.step}
              aria-hidden={step.number !== currentStep}
            >
              <step.Component />
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          {currentStep > 1 && (
            <button
              type="button"
              className={clsx(buttonStyles.button, buttonStyles.neutral)}
              onClick={decrementStep}
            >
              Back
            </button>
          )}
          <button
            type="button"
            className={clsx(
              buttonStyles.button,
              buttonStyles.primary,
              styles.nextButton,
            )}
            onClick={() => {
              if (currentStep === lastStepNumber) {
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
