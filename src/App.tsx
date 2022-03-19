import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import StatsPage from './pages/StatsPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import { WeightProvider } from './context/WeightContext';
import './index.css';


function App() {

  return (
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
  );
}

export default App;
