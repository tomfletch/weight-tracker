import { createContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

export enum HeightUnit {
  CM = 'CM',
  FT_IN = 'FT_IN',
  IN = 'IN',
};

interface HeightContextInterface {
  heightUnit: HeightUnit;
  setHeightUnit: (heightUnit: HeightUnit) => void;
  height: number | null;
  setHeight: (height: number | null) => void;
};

const HeightContext = createContext<HeightContextInterface>({} as HeightContextInterface);

interface Props {
  children?: React.ReactNode
};

export function HeightProvider({ children }: Props) {
  const [heightUnit, setHeightUnit] = useLocalStorage('heightUnit', HeightUnit.CM);
  const [height, setHeight] = useLocalStorage('height', null);

  const contextValue = {
    heightUnit,
    setHeightUnit,
    height,
    setHeight,
  };

  return (
    <HeightContext.Provider value={contextValue}>
      {children}
    </HeightContext.Provider>
  )
}


export default HeightContext;
