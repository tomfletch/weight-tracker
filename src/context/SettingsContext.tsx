import React, { createContext, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { THEME_COLOURS } from '../utils/colours';

interface SettingsContextInterface {
  accentColour: string;
  setAccentColour: (accentColour: string) => void;
}

const SettingsContext = createContext<SettingsContextInterface | null>(null);

export function useSettingsContext() {
  return useContext(SettingsContext)!;
}

interface Props {
  children: React.ReactNode
}

export function SettingsProvider({ children }: Props) {
  const [accentColour, setAccentColour] = useLocalStorage('accentColour', THEME_COLOURS[0]);

  const contextValue = useMemo(() => ({
    accentColour,
    setAccentColour,
  }), [
    accentColour,
    setAccentColour,
  ]);

  return (
    <SettingsContext.Provider value={contextValue}>
      <div style={{ '--accent-colour': accentColour } as React.CSSProperties}>
        {children}
      </div>
    </SettingsContext.Provider>
  );
}

export default SettingsContext;
