import AddWeight from './components/AddWeight';
import WeightHistory from './components/WeightHistory';
import { WeightProvider } from './context/WeightContext';
import './index.css';

function App() {

  return (
    <WeightProvider>
      <div className="App">
        <AddWeight />
        <WeightHistory />
      </div>
    </WeightProvider>
  );
}

export default App;
