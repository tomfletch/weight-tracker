import AddWeight from './components/AddWeight';
import { WeightProvider } from './context/WeightContext';
import './index.css';

function App() {

  return (
    <WeightProvider>
      <div className="App">
        <AddWeight />
      </div>
    </WeightProvider>
  );
}

export default App;
