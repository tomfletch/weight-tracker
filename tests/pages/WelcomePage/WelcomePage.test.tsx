import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { WelcomePage } from '../../../src/pages/WelcomePage/WelcomePage';
import { useAppStore } from '../../../src/stores/appStore';

const resetAppStore = () => {
  useAppStore.setState({
    hasCompletedOnboarding: false,
    height: null,
    heightUnit: 'CM',
    weightUnit: 'STONES_LBS',
    weightRecords: [],
    weightTargetKgs: null,
    theme: 'blue',
  });
};

describe('WelcomePage', () => {
  beforeEach(() => {
    resetAppStore();
  });

  it('renders the welcome heading and first step', () => {
    render(<WelcomePage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /welcome to weight tracker/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /choose your weight units/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /back/i }),
    ).not.toBeInTheDocument();
  });

  it('advances through all onboarding steps and shows finish on the last step', async () => {
    const user = userEvent.setup();

    render(<WelcomePage />);

    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /choose your height units/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /choose your target weight/i,
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /choose your theme/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /finish/i })).toBeInTheDocument();
  });

  it('completes onboarding when finish is clicked', async () => {
    const user = userEvent.setup();

    render(<WelcomePage />);

    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /finish/i }));

    expect(useAppStore.getState().hasCompletedOnboarding).toBe(true);
  });
});
