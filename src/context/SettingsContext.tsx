import { createContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

interface SettingsContextInterface {
  accentColour: string;
  setAccentColour: (accentColour: string) => void;
}

const SettingsContext = createContext<SettingsContextInterface>({} as SettingsContextInterface);

interface Props {
  children?: React.ReactNode
};

export function SettingsProvider({ children }: Props) {
  const [accentColour, setAccentColour] = useLocalStorage('accentColour', '#00c8ff');

  const contextValue = {
    accentColour,
    setAccentColour,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  )
}

export default SettingsContext;
