import React, { createContext, useContext, useMemo } from 'react';
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
  return useContext(HeightContext)!;
}

interface Props {
  children: React.ReactNode
}

export function HeightProvider({ children }: Props) {
  const [heightUnit, setHeightUnit] = useLocalStorage('heightUnit', HeightUnit.CM);
  const [height, setHeight] = useLocalStorage<number | null>('height', null);

  const contextValue = useMemo(() => ({
    heightUnit,
    setHeightUnit,
    height,
    setHeight,
  }), [
    heightUnit,
    setHeightUnit,
    height,
    setHeight,
  ]);

  return (
    <HeightContext.Provider value={contextValue}>
      {children}
    </HeightContext.Provider>
  );
}


export default HeightContext;
