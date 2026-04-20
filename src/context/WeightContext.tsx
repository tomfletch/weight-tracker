import type React from 'react';
import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { type WeightRecord, WeightUnit } from '../types/weight';

interface WeightContextInterface {
  weightUnit: WeightUnit;
  setWeightUnit: (weightUnit: WeightUnit) => void;
  weightRecords: WeightRecord[];
  addWeight: (weightRecord: WeightRecord) => void;
  deleteWeight: (date: string) => void;
  weightTargetKgs: number | null;
  setWeightTargetKgs: (weightTarget: number) => void;
}

const WeightContext = createContext<WeightContextInterface | null>(null);

export function useWeightContext() {
  const context = useContext(WeightContext);

  if (!context) {
    throw new Error('useWeightContext must be used within a WeightProvider');
  }

  return context;
}

interface Props {
  children: React.ReactNode;
}

export function WeightProvider({ children }: Props) {
  const [weightRecords, setWeightRecords] = useLocalStorage<WeightRecord[]>(
    'weightRecords',
    [],
  );
  const [weightUnit, setWeightUnit] = useLocalStorage<WeightUnit>(
    'weightUnit',
    WeightUnit.STONES_LBS,
  );
  const [weightTargetKgs, setWeightTargetKgs] = useLocalStorage<number | null>(
    'weightTargetKgs',
    null,
  );

  const compareWeightRecords = (a: WeightRecord, b: WeightRecord): number =>
    a.date.localeCompare(b.date);

  const addWeight = (weightRecord: WeightRecord) => {
    setWeightRecords((prevWeightRecords: WeightRecord[]) => {
      const newWeightRecords = prevWeightRecords.filter(
        (w) => w.date !== weightRecord.date,
      );
      return [...newWeightRecords, weightRecord].sort(compareWeightRecords);
    });
  };

  const deleteWeight = (date: string) => {
    setWeightRecords((prevWeightRecords: WeightRecord[]) =>
      prevWeightRecords.filter((weightRecord) => weightRecord.date !== date),
    );
  };

  return (
    <WeightContext.Provider
      value={{
        weightUnit,
        setWeightUnit,
        weightRecords,
        addWeight,
        deleteWeight,
        weightTargetKgs,
        setWeightTargetKgs,
      }}
    >
      {children}
    </WeightContext.Provider>
  );
}
