import clsx from 'clsx';
import styles from './Steps.module.css';

type StepData = {
  label: string;
};

type StepsProps = {
  steps: StepData[];
  currentStep: number;
};

export function Steps({ steps, currentStep }: StepsProps) {
  return (
    <div className={styles.container}>
      <ol className={styles.steps}>
        {steps.map((step, index) => (
          <Step
            key={step.label}
            number={index + 1}
            label={step.label}
            state={getStepState(index + 1, currentStep)}
          />
        ))}
      </ol>
      <div className={styles.progressBar} />
      <div className={styles.progressFill}></div>
    </div>
  );
}

const getStepState = (stepNumber: number, currentStep: number) => {
  if (stepNumber < currentStep) {
    return 'completed';
  } else if (stepNumber === currentStep) {
    return 'active';
  } else {
    return 'inactive';
  }
};

type StepProps = {
  number: number;
  label: string;
  state: 'inactive' | 'active' | 'completed';
};

function Step({ number, label, state }: StepProps) {
  const className = clsx(styles.step);

  return (
    <li className={className} data-state={state}>
      <span className={styles.stepNumber}>{number}</span>
      <span className={styles.stepLabel}>{label}</span>
    </li>
  );
}
