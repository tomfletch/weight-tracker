import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ToggleGroup } from '~/components/ToggleGroup/ToggleGroup';

type HarnessProps = {
  initialValue?: string;
  label?: string;
  onValueChange?: (value: string) => void;
  showMonth?: boolean;
};

function ToggleGroupHarness({
  initialValue = 'week',
  label = 'Select period',
  onValueChange,
  showMonth = true,
}: HarnessProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <>
      <ToggleGroup
        label={label}
        value={value}
        onValueChange={(nextValue) => {
          onValueChange?.(nextValue);
          setValue(nextValue);
        }}
      >
        <ToggleGroup.Item value="day" label="Day">
          Day
        </ToggleGroup.Item>
        <ToggleGroup.Item value="week" label="Week">
          Week
        </ToggleGroup.Item>
        {showMonth && (
          <ToggleGroup.Item value="month" label="Month">
            Month
          </ToggleGroup.Item>
        )}
      </ToggleGroup>
      <output data-testid="selected-value">{value}</output>
    </>
  );
}

function DynamicToggleGroupHarness() {
  const [showMonth, setShowMonth] = useState(true);

  return (
    <>
      <button type="button" onClick={() => setShowMonth(false)}>
        Remove Month
      </button>
      <ToggleGroupHarness initialValue="week" showMonth={showMonth} />
    </>
  );
}

describe('ToggleGroup', () => {
  it('renders a labelled radiogroup and radios', () => {
    render(<ToggleGroupHarness />);

    expect(
      screen.getByRole('radiogroup', { name: 'Select period' }),
    ).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Day' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Week' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Month' })).toBeTruthy();
  });

  it('sets checked state and roving tabindex for selected item', () => {
    render(<ToggleGroupHarness initialValue="week" />);

    const day = screen.getByRole('radio', { name: 'Day' });
    const week = screen.getByRole('radio', { name: 'Week' });
    const month = screen.getByRole('radio', { name: 'Month' });

    expect(day.getAttribute('aria-checked')).toBe('false');
    expect(week.getAttribute('aria-checked')).toBe('true');
    expect(month.getAttribute('aria-checked')).toBe('false');

    expect(day.tabIndex).toBe(-1);
    expect(week.tabIndex).toBe(0);
    expect(month.tabIndex).toBe(-1);
  });

  it('updates selected value and emits onValueChange on click', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<ToggleGroupHarness onValueChange={onValueChange} />);

    await user.click(screen.getByRole('radio', { name: 'Month' }));

    expect(onValueChange).toHaveBeenCalledWith('month');
    expect(screen.getByTestId('selected-value').textContent).toBe('month');
  });

  it('supports ArrowLeft/ArrowUp and ArrowRight/ArrowDown navigation with wrapping', async () => {
    const user = userEvent.setup();
    render(<ToggleGroupHarness initialValue="week" />);

    const week = screen.getByRole('radio', { name: 'Week' });
    week.focus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByTestId('selected-value').textContent).toBe('month');

    const month = screen.getByRole('radio', { name: 'Month' });
    month.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByTestId('selected-value').textContent).toBe('day');

    const day = screen.getByRole('radio', { name: 'Day' });
    day.focus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByTestId('selected-value').textContent).toBe('month');

    month.focus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByTestId('selected-value').textContent).toBe('week');

    week.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByTestId('selected-value').textContent).toBe('month');
  });

  it('supports Home and End keys', async () => {
    const user = userEvent.setup();
    render(<ToggleGroupHarness initialValue="week" />);

    const week = screen.getByRole('radio', { name: 'Week' });
    week.focus();

    await user.keyboard('{Home}');
    expect(screen.getByTestId('selected-value').textContent).toBe('day');

    const day = screen.getByRole('radio', { name: 'Day' });
    day.focus();
    await user.keyboard('{End}');
    expect(screen.getByTestId('selected-value').textContent).toBe('month');
  });

  it('updates tabindex as selection changes', async () => {
    const user = userEvent.setup();
    render(<ToggleGroupHarness initialValue="day" />);

    const day = screen.getByRole('radio', { name: 'Day' });
    const month = screen.getByRole('radio', { name: 'Month' });

    expect(day.tabIndex).toBe(0);
    expect(month.tabIndex).toBe(-1);

    await user.click(month);

    expect(day.tabIndex).toBe(-1);
    expect(month.tabIndex).toBe(0);
  });

  it('removes unmounted items from keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<DynamicToggleGroupHarness />);

    const week = screen.getByRole('radio', { name: 'Week' });
    week.focus();

    await user.click(screen.getByRole('button', { name: 'Remove Month' }));
    screen.getByRole('radio', { name: 'Week' }).focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.queryByRole('radio', { name: 'Month' })).toBeNull();
    expect(screen.getByTestId('selected-value').textContent).toBe('day');
  });
});
