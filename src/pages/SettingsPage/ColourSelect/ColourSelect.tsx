import React from 'react';
import styles from './ColourSelect.module.css';
import { THEME_COLOURS } from '../../../utils/colours';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

function ColourSelect({ value, onChange }: Props) {
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
          />
        </React.Fragment>
      ))}
    </div>
  );
}

export default ColourSelect;
