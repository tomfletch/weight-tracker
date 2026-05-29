import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChartTooltip } from '~/components/ChartTooltip/ChartTooltip';

describe('ChartTooltip', () => {
  const baseState = {
    position: { left: 100, top: 50 },
    arrowOffset: 10,
    isVisible: true,
    data: null,
  };

  it('renders nothing but container when data is null', () => {
    render(<ChartTooltip tooltipState={baseState} />);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toBeEmptyDOMElement();
  });

  it('renders date and lines when data is present', () => {
    const state = {
      ...baseState,
      data: {
        dateLabel: '2026-05-29',
        lines: ['Line 1', 'Line 2'],
      },
    };
    render(<ChartTooltip tooltipState={state} />);
    expect(screen.getByText('2026-05-29')).toBeInTheDocument();
    expect(screen.getByText('Line 1')).toBeInTheDocument();
    expect(screen.getByText('Line 2')).toBeInTheDocument();
  });

  it('applies correct style and aria-hidden when visible', () => {
    const state = {
      ...baseState,
      isVisible: true,
      data: {
        dateLabel: 'Visible',
        lines: [],
      },
    };
    render(<ChartTooltip tooltipState={state} />);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveStyle({ opacity: '1' });
    expect(tooltip).toHaveAttribute('aria-hidden', 'false');
  });

  it('applies correct style and aria-hidden when not visible', () => {
    const state = {
      ...baseState,
      isVisible: false,
      data: {
        dateLabel: 'Hidden',
        lines: [],
      },
    };
    render(<ChartTooltip tooltipState={state} />);
    const tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveStyle({ opacity: '0' });
    expect(tooltip).toHaveAttribute('aria-hidden', 'true');
  });
});
