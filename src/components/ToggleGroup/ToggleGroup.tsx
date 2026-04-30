import { type ReactNode, useCallback } from 'react';
import styles from './ToggleGroup.module.css';
import {
  ToggleGroupContextProvider,
  useToggleGroupContext,
} from './ToggleGroupContext';

type ToggleGroupProps = {
  children: ReactNode;
  value: string;
  onValueChange: (value: string) => void;
};

export function ToggleGroup({
  children,
  value,
  onValueChange,
}: ToggleGroupProps) {
  return (
    <ToggleGroupContextProvider value={value} onValueChange={onValueChange}>
      <div role="radiogroup" className={styles.toggleGroup}>
        {children}
      </div>
    </ToggleGroupContextProvider>
  );
}

type ToggleGroupItemProps = {
  children: ReactNode;
  value: string;
  'aria-label'?: string;
};

ToggleGroup.Item = function ToggleGroupItem({
  children,
  value,
  'aria-label': ariaLabel,
}: ToggleGroupItemProps) {
  const { selectedValue, onSelect, selectNext, selectPrevious, registerValue } =
    useToggleGroupContext();

  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      selectPrevious();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      selectNext();
    }
  };

  const registerRef = useCallback(
    (element: HTMLElement | null) => {
      return registerValue(value, element);
    },
    [value, registerValue],
  );

  return (
    // biome-ignore lint/a11y/useSemanticElements: Custom radio-group behavior with roving tabindex
    <button
      type="button"
      ref={registerRef}
      role="radio"
      tabIndex={value === selectedValue ? 0 : -1}
      aria-checked={value === selectedValue}
      onClick={() => onSelect(value)}
      className={styles.toggleGroupItem}
      onKeyDown={keyDownHandler}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
