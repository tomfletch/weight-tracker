import type { ReactNode } from 'react';
import styles from './ToggleGroup.module.css';
import { ToggleGroupContextProvider } from './ToggleGroupContext';
import { ToggleGroupItem } from './ToggleGroupItem';

type ToggleGroupProps = {
  label?: string;
  children: ReactNode;
  value: string;
  onValueChange: (value: string) => void;
};

export function ToggleGroup({
  label,
  children,
  value,
  onValueChange,
}: ToggleGroupProps) {
  return (
    <ToggleGroupContextProvider value={value} onValueChange={onValueChange}>
      <div role="radiogroup" aria-label={label} className={styles.toggleGroup}>
        {children}
      </div>
    </ToggleGroupContextProvider>
  );
}

ToggleGroup.Item = ToggleGroupItem;
