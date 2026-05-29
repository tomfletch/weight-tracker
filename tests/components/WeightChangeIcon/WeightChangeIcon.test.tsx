import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WeightChangeIcon } from '~/components/WeightChangeIcon/WeightChangeIcon';

describe('WeightChangeIcon', () => {
  it('renders down arrow and correct aria-label for negative weightChange', () => {
    render(<WeightChangeIcon weightChange={-1.5} />);
    const icon = screen.getByLabelText('Weight decreasing');
    expect(icon).toBeInTheDocument();
    expect(icon).toBeInstanceOf(SVGElement);
    expect(icon).toHaveAttribute('data-icon', 'arrow-down-long');
  });

  it('renders up arrow and correct aria-label for positive weightChange', () => {
    render(<WeightChangeIcon weightChange={2.3} />);
    const icon = screen.getByLabelText('Weight increasing');
    expect(icon).toBeInTheDocument();
    expect(icon).toBeInstanceOf(SVGElement);
    expect(icon).toHaveAttribute('data-icon', 'arrow-up-long');
  });

  it('renders equals icon and correct aria-label for zero weightChange', () => {
    render(<WeightChangeIcon weightChange={0} />);
    const icon = screen.getByLabelText('No weight change');
    expect(icon).toBeInTheDocument();
    expect(icon).toBeInstanceOf(SVGElement);
    expect(icon).toHaveAttribute('data-icon', 'equals');
  });

  it('applies custom className', () => {
    render(<WeightChangeIcon weightChange={1} className="custom-class" />);
    const icon = screen.getByLabelText('Weight increasing');
    expect(icon.classList.contains('custom-class')).toBe(true);
  });
});
