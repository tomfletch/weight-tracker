import type { CSSProperties } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { GlobalErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { useAppTheme } from './hooks/useAppTheme';
import './index.css';
import { AppLayout } from './layouts/AppLayout/AppLayout';
import { OnboardingLayout } from './layouts/OnboardingLayout/OnboardingLayout';
import { HistoryPage } from './pages/HistoryPage/HistoryPage';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';
import { StatsPage } from './pages/StatsPage/StatsPage';
import './utils/chart/chartjs';

export function App() {
  const { accentColour } = useAppTheme();
  const appStyle = {
    '--colour-accent': accentColour,
  } as CSSProperties;

  return (
    <GlobalErrorBoundary>
      <Router>
        <div style={appStyle}>
          <Routes>
            <Route element={<OnboardingLayout />}>
              <Route path="/welcome" element={null} />
            </Route>
            <Route element={<AppLayout />}>
              <Route path="/" element={<StatsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </GlobalErrorBoundary>
  );
}
