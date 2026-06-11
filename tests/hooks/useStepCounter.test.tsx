import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { useStepCounter } from '~/hooks/useStepCounter';

type HarnessProps = {
  stepCount?: number;
  initialStep?: number;
};

function UseStepCounterHarness({
  stepCount = 3,
  initialStep = 1,
}: HarnessProps) {
  const { currentStep, setStep, incrementStep, decrementStep } = useStepCounter(
    {
      stepCount,
      initialStep,
    },
  );

  return (
    <>
      <output data-testid="current-step">{currentStep}</output>
      <button type="button" onClick={incrementStep}>
        Increment
      </button>
      <button type="button" onClick={decrementStep}>
        Decrement
      </button>
      <button type="button" onClick={() => setStep(0)}>
        Set too low
      </button>
      <button type="button" onClick={() => setStep(stepCount + 1)}>
        Set too high
      </button>
    </>
  );
}

describe('useStepCounter', () => {
  it('initialises currentStep with the provided initial value', () => {
    render(<UseStepCounterHarness initialStep={2} />);

    expect(screen.getByTestId('current-step').textContent).toBe('2');
  });

  it('increments and decrements within bounds', async () => {
    const user = userEvent.setup();

    render(<UseStepCounterHarness initialStep={2} />);

    await user.click(screen.getByRole('button', { name: 'Increment' }));
    expect(screen.getByTestId('current-step').textContent).toBe('3');

    await user.click(screen.getByRole('button', { name: 'Decrement' }));
    expect(screen.getByTestId('current-step').textContent).toBe('2');
  });

  it('clamps setStep values to the available range', async () => {
    const user = userEvent.setup();

    render(<UseStepCounterHarness stepCount={3} initialStep={2} />);

    await user.click(screen.getByRole('button', { name: 'Set too low' }));
    expect(screen.getByTestId('current-step').textContent).toBe('1');

    await user.click(screen.getByRole('button', { name: 'Set too high' }));
    expect(screen.getByTestId('current-step').textContent).toBe('3');
  });
});
