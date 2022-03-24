import React from 'react';
import styles from './ColourSelect.module.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
};

const colours = ['#00C8FF', '#FF70A9', '#2BC356'];

function ColourSelect({ value, onChange }: Props) {
  return (
    <div className={styles.colourSelect}>
      {colours.map((colour) => (
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
            style={{backgroundColor: colour}}
          ></label>
        </React.Fragment>
      ))}
    </div>
  );
}

export default ColourSelect;
