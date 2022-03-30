import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import StatsPage from './pages/StatsPage/StatsPage';
import HistoryPage from './pages/HistoryPage/HistoryPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import { SettingsProvider } from './context/SettingsContext';
import { WeightProvider } from './context/WeightContext';
import { HeightProvider } from './context/HeightContext';
import './utils/chartjs';
import './index.css';


function App() {
  return (
    <SettingsProvider>
      <WeightProvider>
        <HeightProvider>
          <Router>
            <div className="App">
              <Header />
              <Routes>
                <Route path="/" element={<StatsPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </div>
          </Router>
        </HeightProvider>
      </WeightProvider>
    </SettingsProvider>
  );
}

export default App;
