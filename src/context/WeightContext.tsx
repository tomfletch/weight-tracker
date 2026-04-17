import type React from 'react';
import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { daysBetween, parseISODate } from '../utils/dates';

export const WeightUnit = {
  LBS: 'LBS',
  STONES_LBS: 'STONES_LBS',
  KGS: 'KGS',
} as const;

export type WeightUnit = (typeof WeightUnit)[keyof typeof WeightUnit];

export interface WeightRecord {
  date: string;
  weightKgs: number;
}

interface WeightContextInterface {
  weightUnit: WeightUnit;
  setWeightUnit: (weightUnit: WeightUnit) => void;
  weightRecords: WeightRecord[];
  getInterpolatedWeight: (date: Date) => number | null;
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

  const getInterpolatedWeight = (date: Date): number | null => {
    let nearestRecordBefore: WeightRecord | null = null;
    let nearestRecordAfter: WeightRecord | null = null;

    for (const weightRecord of weightRecords) {
      const weightRecordDate = parseISODate(weightRecord.date);

      if (weightRecordDate.getTime() === date.getTime()) {
        return weightRecord.weightKgs;
      }

      if (
        weightRecordDate < date &&
        (!nearestRecordBefore ||
          weightRecordDate > parseISODate(nearestRecordBefore.date))
      ) {
        nearestRecordBefore = weightRecord;
      }

      if (
        weightRecordDate > date &&
        (!nearestRecordAfter ||
          weightRecordDate < parseISODate(nearestRecordAfter.date))
      ) {
        nearestRecordAfter = weightRecord;
      }
    }

    if (!nearestRecordBefore || !nearestRecordAfter) {
      return null;
    }

    const beforeDate = parseISODate(nearestRecordBefore.date);
    const afterDate = parseISODate(nearestRecordAfter.date);

    const deltaDays = daysBetween(beforeDate, afterDate);
    const targetDays = daysBetween(beforeDate, date);

    const deltaWeight =
      nearestRecordAfter.weightKgs - nearestRecordBefore.weightKgs;
    const targetDeltaWeight = (deltaWeight / deltaDays) * targetDays;

    const interpolatedWeight =
      nearestRecordBefore.weightKgs + targetDeltaWeight;

    return interpolatedWeight;
  };

  return (
    <WeightContext.Provider
      value={{
        weightUnit,
        setWeightUnit,
        weightRecords,
        getInterpolatedWeight,
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

export default WeightContext;
