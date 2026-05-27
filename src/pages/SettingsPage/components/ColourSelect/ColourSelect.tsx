import { useId } from 'react';
import {
  getThemeColours,
  THEMES,
  type Theme,
  type ThemeOption,
} from '~/utils/colours';
import styles from './ColourSelect.module.css';

type ColourSelectProps = {
  value: Theme;
  onChange: (value: Theme) => void;
};

export function ColourSelect({ value, onChange }: ColourSelectProps) {
  return (
    <div className={styles.colourSelect}>
      {THEMES.map((theme) => (
        <ColourSelectOption
          key={theme.name}
          theme={theme}
          isSelected={theme.value === value}
          onSelect={() => onChange(theme.value)}
        />
      ))}
    </div>
  );
}

type ColourSelectOptionProps = {
  theme: ThemeOption;
  isSelected: boolean;
  onSelect: () => void;
};

function ColourSelectOption({
  theme,
  isSelected,
  onSelect,
}: ColourSelectOptionProps) {
  const id = useId();

  return (
    <>
      <input
        id={id}
        className={styles.colourInput}
        type="radio"
        name="theme"
        checked={isSelected}
        onChange={onSelect}
      />
      <label
        htmlFor={id}
        className={styles.colourLabel}
        style={{ backgroundColor: getThemeColours(theme.value).accentColour }}
        aria-label={`Theme ${theme.name}`}
      />
    </>
  );
}
