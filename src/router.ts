import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout/AppLayout';
import { OnboardingLayout } from './layouts/OnboardingLayout/OnboardingLayout';
import { HistoryPage } from './pages/HistoryPage/HistoryPage';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';
import { StatsPage } from './pages/StatsPage/StatsPage';
import { WelcomePage } from './pages/WelcomePage/WelcomePage';

export const router = createBrowserRouter([
  {
    Component: OnboardingLayout,
    children: [
      {
        path: '/welcome',
        Component: WelcomePage,
      },
    ],
  },
  {
    Component: AppLayout,
    children: [
      {
        path: '/',
        Component: StatsPage,
      },
      {
        path: '/history',
        Component: HistoryPage,
      },
      {
        path: '/settings',
        Component: SettingsPage,
      },
    ],
  },
]);
