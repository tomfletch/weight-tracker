import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import StatsPage from './pages/StatsPage/StatsPage';
import HistoryPage from './pages/HistoryPage/HistoryPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import { WeightProvider } from './context/WeightContext';
import { SettingsProvider } from './context/SettingsContext';
import './index.css';


function App() {

  return (
    <SettingsProvider>
      <WeightProvider>
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
      </WeightProvider>
    </SettingsProvider>
  );
}

export default App;
