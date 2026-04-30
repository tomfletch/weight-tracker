import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

type ToggleGroupContextValue = {
  selectedValue: string;
  onSelect: (value: string) => void;
  selectNext: () => void;
  selectPrevious: () => void;
  registerValue: (value: string, element: HTMLElement | null) => () => void;
};

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

export function ToggleGroupContextProvider({
  children,
  value,
  onValueChange,
}: {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
}) {
  const [values, setValues] = useState<string[]>([]);
  const itemElementsRef = useRef<Map<string, HTMLElement>>(new Map());

  const registerValue = useCallback(
    (value: string, element: HTMLElement | null) => {
      if (element) {
        itemElementsRef.current.set(value, element);
        setValues((prev) => (prev.includes(value) ? prev : [...prev, value]));
      }

      return () => {
        itemElementsRef.current.delete(value);
        setValues((prev) => prev.filter((v) => v !== value));
      };
    },
    [],
  );

  const focusValue = useCallback((nextValue: string) => {
    itemElementsRef.current.get(nextValue)?.focus();
  }, []);

  const selectNext = useCallback(() => {
    if (values.length === 0) return;
    const currentIndex = values.indexOf(value);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % values.length;
    const nextValue = values[nextIndex];
    onValueChange(nextValue);
    focusValue(nextValue);
  }, [values, value, onValueChange, focusValue]);

  const selectPrevious = useCallback(() => {
    if (values.length === 0) return;
    const currentIndex = values.indexOf(value);
    if (currentIndex === -1) return;
    const previousIndex = (currentIndex - 1 + values.length) % values.length;
    const previousValue = values[previousIndex];
    onValueChange(previousValue);
    focusValue(previousValue);
  }, [values, value, onValueChange, focusValue]);

  const contextValue: ToggleGroupContextValue = useMemo(
    () => ({
      selectedValue: value,
      onSelect: onValueChange,
      selectNext,
      selectPrevious,
      registerValue,
    }),
    [value, onValueChange, selectNext, selectPrevious, registerValue],
  );

  return (
    <ToggleGroupContext.Provider value={contextValue}>
      {children}
    </ToggleGroupContext.Provider>
  );
}

export function useToggleGroupContext() {
  const context = useContext(ToggleGroupContext);
  if (!context) {
    throw new Error(
      'useToggleGroupContext must be used within a ToggleGroupContextProvider',
    );
  }
  return context;
}
