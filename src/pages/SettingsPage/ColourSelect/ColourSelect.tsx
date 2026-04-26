import { useId } from 'react';
import { THEME_COLOURS, type ThemeColour } from '~/utils/colours';
import styles from './ColourSelect.module.css';

type ColourSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ColourSelect({ value, onChange }: ColourSelectProps) {
  return (
    <div className={styles.colourSelect}>
      {THEME_COLOURS.map((colour) => (
        <ColourSelectOption
          key={colour.name}
          colour={colour}
          isSelected={colour.value === value}
          onSelect={() => onChange(colour.value)}
        />
      ))}
    </div>
  );
}

type ColourSelectOptionProps = {
  colour: ThemeColour;
  isSelected: boolean;
  onSelect: () => void;
};

function ColourSelectOption({
  colour,
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
        name="colour"
        checked={isSelected}
        onChange={onSelect}
      />
      <label
        htmlFor={id}
        className={styles.colourLabel}
        style={{ backgroundColor: colour.value }}
        aria-label={`Color ${colour.name}`}
      />
    </>
  );
}
