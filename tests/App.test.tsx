import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from '../src/App';
import { useAppStore } from '../src/stores/appStore';

const navigateTo = (path: string) => {
  window.history.replaceState({}, '', path);
  // Trigger a popstate event to notify React Router
  window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
};

describe('App', () => {
  beforeEach(() => {
    useAppStore.setState({ hasCompletedOnboarding: true });
  });

  it('navigates via header links and shows correct page', async () => {
    render(<App />);
    const user = userEvent.setup();

    // Start on StatsPage
    expect(
      screen.getByRole('heading', { level: 1, name: /stats/i }),
    ).toBeInTheDocument();

    // Go to HistoryPage
    await user.click(screen.getByRole('link', { name: /history/i }));
    expect(
      screen.getByRole('heading', { level: 1, name: /history/i }),
    ).toBeInTheDocument();

    // Go to SettingsPage
    await user.click(screen.getByRole('link', { name: /settings/i }));
    expect(
      screen.getByRole('heading', { level: 1, name: /settings/i }),
    ).toBeInTheDocument();

    // Go back to StatsPage
    await user.click(screen.getByRole('link', { name: /stats/i }));
    expect(
      screen.getByRole('heading', { level: 1, name: /stats/i }),
    ).toBeInTheDocument();
  });
  it('renders the header and skip link', () => {
    render(<App />);
    expect(screen.getByText(/skip to content/i)).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders StatsPage by default', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: /stats/i }),
    ).toBeInTheDocument();
  });

  it('renders HistoryPage on /history', () => {
    navigateTo('/history');
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: /history/i }),
    ).toBeInTheDocument();
  });

  it('renders SettingsPage on /settings', () => {
    navigateTo('/settings');
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: /settings/i }),
    ).toBeInTheDocument();
  });
});
