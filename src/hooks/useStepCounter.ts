import { useState } from 'react';
import { limit } from '~/utils/math';

type UseStepCounterOptions = {
  stepCount: number;
  initialStep?: number;
};

export function useStepCounter({
  stepCount,
  initialStep = 1,
}: UseStepCounterOptions) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const setStep = (newStep: number) => {
    setCurrentStep(() => limit(newStep, 1, stepCount));
  };

  const incrementStep = () => setStep(currentStep + 1);
  const decrementStep = () => setStep(currentStep - 1);

  return { currentStep, setStep, incrementStep, decrementStep };
}
