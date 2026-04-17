import React from 'react';
import { THEME_COLOURS } from '../../../utils/colours';
import styles from './ColourSelect.module.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function ColourSelect({ value, onChange }: Props) {
  return (
    <div className={styles.colourSelect}>
      {THEME_COLOURS.map((colour) => (
        <React.Fragment key={colour}>
          <input
            id={`colour-${colour}`}
            className={styles.colourInput}
            type="radio"
            name="colour"
            checked={colour === value}
            onChange={() => onChange(colour)}
          />
          <label
            htmlFor={`colour-${colour}`}
            className={styles.colourLabel}
            style={{ backgroundColor: colour }}
            aria-label={`Color ${colour}`}
          />
        </React.Fragment>
      ))}
    </div>
  );
}
