import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { IconButton } from '~/components/IconButton/IconButton';

const icon = <FontAwesomeIcon icon={faPenToSquare} data-testid="icon" />;
const label = 'Test Icon Button';

describe('IconButton', () => {
  it('renders button with icon and label as tooltip', () => {
    render(<IconButton icon={icon} label={label} />);
    const button = screen.getByRole('button', { name: label });
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    // Tooltip should not have the .show class initially
    const tooltip = screen.getByText(label);
    expect(tooltip.className).not.toMatch(/show/);
  });

  it('shows tooltip on hover and focus (class-based)', async () => {
    const user = userEvent.setup();
    render(<IconButton icon={icon} label={label} />);
    const button = screen.getByRole('button', { name: label });
    const tooltip = screen.getByText(label);
    await user.hover(button);
    expect(tooltip.className).toMatch(/show/);
    await user.unhover(button);
    expect(tooltip.className).not.toMatch(/show/);
    await user.tab(); // focus button
    expect(tooltip.className).toMatch(/show/);
    await user.tab(); // blur button
    expect(tooltip.className).not.toMatch(/show/);
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<IconButton icon={icon} label={label} onClick={onClick} />);
    const button = screen.getByRole('button', { name: label });
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<IconButton icon={icon} label={label} disabled />);
    const button = screen.getByRole('button', { name: label });
    expect(button).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<IconButton icon={icon} label={label} className="custom-class" />);
    const button = screen.getByRole('button', { name: label });
    expect(button.className).toMatch(/custom-class/);
  });
});
