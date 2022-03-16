import AddWeight from './components/AddWeight';
import WeightChart from './components/WeightChart';
import WeightDeltaChart from './components/WeightDeltaChart';
import WeightHistory from './components/WeightHistory';
import { WeightProvider } from './context/WeightContext';
import './index.css';

function App() {

  return (
    <WeightProvider>
      <div className="App">
        <AddWeight />
        <WeightHistory />
        <WeightChart />
        <WeightDeltaChart />
      </div>
    </WeightProvider>
  );
}

export default App;
