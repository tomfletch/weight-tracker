import { type ReactNode, useCallback } from 'react';
import styles from './ToggleGroup.module.css';
import { useToggleGroupContext } from './ToggleGroupContext';

type ToggleGroupItemProps = {
  children: ReactNode;
  value: string;
  label?: string;
};

export function ToggleGroupItem({
  children,
  value,
  label,
}: ToggleGroupItemProps) {
  const {
    selectedValue,
    onSelect,
    selectNext,
    selectPrevious,
    selectFirst,
    selectLast,
    registerValue,
  } = useToggleGroupContext();

  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      selectPrevious();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      selectNext();
    } else if (e.key === 'Home') {
      e.preventDefault();
      selectFirst();
    } else if (e.key === 'End') {
      e.preventDefault();
      selectLast();
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
      aria-label={label}
    >
      {children}
    </button>
  );
}
