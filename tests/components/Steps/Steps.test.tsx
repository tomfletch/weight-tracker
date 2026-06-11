import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Steps } from '~/components/Steps/Steps';

describe('Steps', () => {
  const steps = [
    { label: 'First step' },
    { label: 'Second step' },
    { label: 'Third step' },
  ];

  it('renders each step with the correct number and label', () => {
    render(<Steps steps={steps} currentStep={2} />);

    const stepItems = screen.getAllByRole('listitem');
    expect(stepItems).toHaveLength(3);
    expect(screen.getByText('First step')).toBeInTheDocument();
    expect(screen.getByText('Second step')).toBeInTheDocument();
    expect(screen.getByText('Third step')).toBeInTheDocument();

    expect(stepItems[0]).toHaveAttribute('data-state', 'completed');
    expect(stepItems[1]).toHaveAttribute('data-state', 'active');
    expect(stepItems[2]).toHaveAttribute('data-state', 'inactive');
  });

  it('marks the first step active when currentStep is 1', () => {
    render(<Steps steps={steps} currentStep={1} />);

    const stepItems = screen.getAllByRole('listitem');
    expect(stepItems[0]).toHaveAttribute('data-state', 'active');
    expect(stepItems[1]).toHaveAttribute('data-state', 'inactive');
    expect(stepItems[2]).toHaveAttribute('data-state', 'inactive');
  });
});
