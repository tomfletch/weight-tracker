import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ColourSelect } from '~/components/ColourSelect/ColourSelect';
import { THEMES, type Theme } from '~/utils/colours';

type HarnessProps = {
  initialValue?: Theme;
  onChange?: (value: Theme) => void;
};

function ColourSelectHarness({
  initialValue = 'blue',
  onChange,
}: HarnessProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <>
      <ColourSelect
        value={value}
        onChange={(nextValue) => {
          onChange?.(nextValue);
          setValue(nextValue);
        }}
      />
      <output data-testid="selected-value">{value}</output>
    </>
  );
}

describe('ColourSelect', () => {
  it('renders a radio for each theme option', () => {
    render(<ColourSelectHarness />);

    THEMES.forEach((theme) => {
      expect(
        screen.getByRole('radio', { name: `Theme ${theme.name}` }),
      ).toBeInTheDocument();
    });
  });

  it('marks the selected theme as checked', () => {
    render(<ColourSelectHarness initialValue="pink" />);

    expect(screen.getByRole('radio', { name: 'Theme Pink' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Theme Blue' })).not.toBeChecked();
  });

  it('calls onChange when a new theme is selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<ColourSelectHarness initialValue="blue" onChange={onChange} />);

    await user.click(screen.getByRole('radio', { name: 'Theme Green' }));

    expect(onChange).toHaveBeenCalledWith('green');
    expect(screen.getByTestId('selected-value').textContent).toBe('green');
  });
});
