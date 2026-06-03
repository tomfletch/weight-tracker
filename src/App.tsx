import type { CSSProperties } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout/AppLayout';
import { useAppTheme } from './hooks/useAppTheme';
import './index.css';
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
    <Router>
      <div style={appStyle}>
        <Routes>
          <Route path="/welcome" element={null} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<StatsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}
