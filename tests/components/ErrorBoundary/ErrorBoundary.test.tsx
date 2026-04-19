import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from '../../../src/components/ErrorBoundary/ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

const ChildContent = () => <div>Child content</div>;

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for error boundary tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should render children when there is no error', () => {
    render(
      <BrowserRouter>
        <ErrorBoundary>
          <ChildContent />
        </ErrorBoundary>
      </BrowserRouter>,
    );

    expect(screen.getByText('Child content')).toBeTruthy();
  });

  it('should render error fallback when child component throws', () => {
    render(
      <BrowserRouter>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      </BrowserRouter>,
    );

    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(
      screen.getByText(/The app ran into an unexpected error/),
    ).toBeTruthy();
  });

  it('should display a reload button in the error fallback', () => {
    render(
      <BrowserRouter>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      </BrowserRouter>,
    );

    const reloadButton = screen.getByRole('button', { name: /Reload app/i });
    expect(reloadButton).toBeTruthy();
  });

  it('should call window.location.reload when reload button is clicked', async () => {
    const originalLocation = window.location;
    const reloadMock = vi.fn();

    Object.defineProperty(window, 'location', {
      value: { ...originalLocation, reload: reloadMock },
      writable: true,
    });

    render(
      <BrowserRouter>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      </BrowserRouter>,
    );

    const reloadButton = screen.getByRole('button', { name: /Reload app/i });
    const user = userEvent.setup();
    await user.click(reloadButton);

    expect(reloadMock).toHaveBeenCalled();
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  it('should log error to console when error is caught', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error');

    render(
      <BrowserRouter>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      </BrowserRouter>,
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Application crashed in ErrorBoundary',
      expect.any(Error),
      expect.any(Object),
    );
  });
});
