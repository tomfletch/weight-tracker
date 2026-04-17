import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { HeightProvider } from './context/HeightContext';
import { SettingsProvider } from './context/SettingsContext';
import { WeightProvider } from './context/WeightContext';
import './index.css';
import { History } from './pages/HistoryPage/HistoryPage';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';
import { StatsPage } from './pages/StatsPage/StatsPage';
import './utils/chartjs';

export function App() {
  return (
    <SettingsProvider>
      <WeightProvider>
        <HeightProvider>
          <Router>
            <div className="App">
              <Header />
              <Routes>
                <Route path="/" element={<StatsPage />} />
                <Route path="/history" element={<History />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </div>
          </Router>
        </HeightProvider>
      </WeightProvider>
    </SettingsProvider>
  );
}
