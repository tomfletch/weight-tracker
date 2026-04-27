import type { CSSProperties } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import styles from './App.module.css';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { Header } from './components/Header/Header';
import { useAppTheme } from './hooks/useAppTheme';
import './index.css';
import { History } from './pages/HistoryPage/HistoryPage';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';
import { StatsPage } from './pages/StatsPage/StatsPage';
import './utils/chart/chartjs';

export function App() {
  const { accentColour } = useAppTheme();
  const appStyle = {
    '--accent-colour': accentColour,
  } as CSSProperties;

  return (
    <Router>
      <div className={styles.App} style={appStyle}>
        <a href="#main-content" className={styles.skipToContent}>
          Skip to content
        </a>
        <Header />
        <main id="main-content">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<StatsPage />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </Router>
  );
}
