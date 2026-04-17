import type React from 'react';
import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

export enum HeightUnit {
  CM = 'CM',
  FT_IN = 'FT_IN',
  IN = 'IN',
}

interface HeightContextInterface {
  heightUnit: HeightUnit;
  setHeightUnit: (heightUnit: HeightUnit) => void;
  height: number | null;
  setHeight: (height: number | null) => void;
}

const HeightContext = createContext<HeightContextInterface | null>(null);

export function useHeightContext() {
  const context = useContext(HeightContext);

  if (!context) {
    throw new Error('useHeightContext must be used within a HeightProvider');
  }

  return context;
}

interface Props {
  children: React.ReactNode;
}

export function HeightProvider({ children }: Props) {
  const [heightUnit, setHeightUnit] = useLocalStorage(
    'heightUnit',
    HeightUnit.CM,
  );
  const [height, setHeight] = useLocalStorage<number | null>('height', null);

  return (
    <HeightContext.Provider
      value={{
        heightUnit,
        setHeightUnit,
        height,
        setHeight,
      }}
    >
      {children}
    </HeightContext.Provider>
  );
}

export default HeightContext;
