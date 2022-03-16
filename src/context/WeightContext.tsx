import { createContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

export enum WeightUnit {
  LBS = 'LBS',
  STONES_LBS = 'STONES_LBS',
  KGS = 'KGS',
};

export interface WeightRecord {
  date: string;
  lbs?: number;
  kgs?: number;
}

interface WeightContextInterface {
  weightUnit: WeightUnit;
  weightRecords: WeightRecord[];
  addWeight: (weightRecort: WeightRecord) => void;
};

const WeightContext = createContext<WeightContextInterface>({} as WeightContextInterface);

type Props = {
  children?: React.ReactNode
};

export function WeightProvider({ children }: Props) {
  const [weightRecords, setWeightRecords] = useLocalStorage('weightRecords', []);
  const [weightUnit, setWeightUnit] = useLocalStorage('weightUnit', WeightUnit.LBS);

  const addWeight = (weightRecord: WeightRecord) => {
    setWeightRecords((prevWeights: WeightRecord[]) => [...prevWeights, weightRecord]);
  }

  const contextValue = {
    weightUnit,
    weightRecords,
    addWeight,
  };

  return (
    <WeightContext.Provider value={contextValue}>
      {children}
    </WeightContext.Provider>
  )
}


export default WeightContext;
