import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { Header } from './components/Header/Header';
import './index.css';
import { History } from './pages/HistoryPage/HistoryPage';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';
import { StatsPage } from './pages/StatsPage/StatsPage';
import './utils/chartjs';

export function App() {
  return (
    <Router>
      <div className="App">
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
