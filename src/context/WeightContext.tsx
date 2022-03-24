import { createContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

export enum WeightUnit {
  LBS = 'LBS',
  STONES_LBS = 'STONES_LBS',
  KGS = 'KGS',
};

export interface WeightRecord {
  date: string;
  weightKgs: number;
}

interface WeightContextInterface {
  weightUnit: WeightUnit;
  setWeightUnit: (weightUnit: WeightUnit) => void;
  weightRecords: WeightRecord[];
  addWeight: (weightRecort: WeightRecord) => void;
  deleteWeight: (date: string) => void;
  weightTargetKgs: number;
  setWeightTargetKgs: (weightTarget: number) => void;
};

const WeightContext = createContext<WeightContextInterface>({} as WeightContextInterface);

type Props = {
  children?: React.ReactNode
};

export function WeightProvider({ children }: Props) {
  const [weightRecords, setWeightRecords] = useLocalStorage('weightRecords', []);
  const [weightUnit, setWeightUnit] = useLocalStorage('weightUnit', WeightUnit.LBS);
  const [weightTargetKgs, setWeightTargetKgs] = useLocalStorage('weightTargetKgs', {value: 154, unit: WeightUnit.LBS});

  const compareWeightRecords = (a: WeightRecord, b: WeightRecord): number => {
    return a.date.localeCompare(b.date);
  };

  const addWeight = (weightRecord: WeightRecord) => {
    setWeightRecords((prevWeightRecords: WeightRecord[]) => {
      const newWeightRecords = prevWeightRecords.filter((w) => w.date !== weightRecord.date);
      return [...newWeightRecords, weightRecord].sort(compareWeightRecords);
    });
  };

  const deleteWeight = (date: string) => {
    setWeightRecords((prevWeightRecords: WeightRecord[]) => {
      return prevWeightRecords.filter((weightRecord) => weightRecord.date !== date);
    });
  };

  const contextValue = {
    weightUnit,
    setWeightUnit,
    weightRecords,
    addWeight,
    deleteWeight,
    weightTargetKgs,
    setWeightTargetKgs,
  };

  return (
    <WeightContext.Provider value={contextValue}>
      {children}
    </WeightContext.Provider>
  )
}


export default WeightContext;
