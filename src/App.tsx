import type { CSSProperties } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { Header } from './components/Header/Header';
import { useAppSettings } from './hooks/useAppSettings';
import './index.css';
import { History } from './pages/HistoryPage/HistoryPage';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';
import { StatsPage } from './pages/StatsPage/StatsPage';
import './utils/chartjs';

export function App() {
  const { accentColour } = useAppSettings();

  return (
    <Router>
      <div
        className="App"
        style={{ '--accent-colour': accentColour } as CSSProperties}
      >
        <Header />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<StatsPage />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  );
}
