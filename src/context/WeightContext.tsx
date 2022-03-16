import { createContext } from 'react';
import { WeightRecord } from '../components/AddWeight';
import useLocalStorage from '../hooks/useLocalStorage';

interface WeightContextInterface {
  weights: WeightRecord[];
  addWeight: (weightRecort: WeightRecord) => void;
};

const WeightContext = createContext<WeightContextInterface>({} as WeightContextInterface);

type Props = {
  children?: React.ReactNode
};

export function WeightProvider({ children }: Props) {
  const [weights, setWeights] = useLocalStorage('weights', []);

  const addWeight = (weightRecord: WeightRecord) => {
    setWeights((prevWeights: WeightRecord[]) => [...prevWeights, weightRecord]);
  }

  const contextValue = {
    weights,
    addWeight,
  };

  return (
    <WeightContext.Provider value={contextValue}>
      {children}
    </WeightContext.Provider>
  )
}


export default WeightContext;
