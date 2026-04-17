import type React from 'react';
import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { THEME_COLOURS } from '../utils/colours';

interface SettingsContextInterface {
  accentColour: string;
  setAccentColour: (accentColour: string) => void;
}

const SettingsContext = createContext<SettingsContextInterface | null>(null);

export function useSettingsContext() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      'useSettingsContext must be used within a SettingsProvider',
    );
  }

  return context;
}

interface Props {
  children: React.ReactNode;
}

export function SettingsProvider({ children }: Props) {
  const [accentColour, setAccentColour] = useLocalStorage(
    'accentColour',
    THEME_COLOURS[0],
  );

  return (
    <SettingsContext.Provider
      value={{
        accentColour,
        setAccentColour,
      }}
    >
      <div style={{ '--accent-colour': accentColour } as React.CSSProperties}>
        {children}
      </div>
    </SettingsContext.Provider>
  );
}

export default SettingsContext;
