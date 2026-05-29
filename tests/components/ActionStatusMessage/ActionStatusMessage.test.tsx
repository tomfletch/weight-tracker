import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  type ActionStatus,
  ActionStatusMessage,
} from '~/components/ActionStatusMessage/ActionStatusMessage';

const successStatus: ActionStatus = {
  type: 'success',
  message: 'Operation successful!',
};
const errorStatus: ActionStatus = {
  type: 'error',
  message: 'Something went wrong.',
};

describe('ActionStatusMessage', () => {
  it('renders nothing when status is null', () => {
    const { container } = render(<ActionStatusMessage status={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders success message with correct role and class', () => {
    render(<ActionStatusMessage status={successStatus} />);
    const msg = screen.getByRole('status');
    expect(msg).toHaveTextContent(successStatus.message);
    expect(msg.className).toMatch(/success/);
  });

  it('renders error message with correct role and class', () => {
    render(<ActionStatusMessage status={errorStatus} />);
    const msg = screen.getByRole('alert');
    expect(msg).toHaveTextContent(errorStatus.message);
    expect(msg.className).toMatch(/error/);
  });

  it('applies custom className if provided', () => {
    render(
      <ActionStatusMessage status={successStatus} className="custom-class" />,
    );
    const msg = screen.getByRole('status');
    expect(msg.className).toMatch(/custom-class/);
  });
});
