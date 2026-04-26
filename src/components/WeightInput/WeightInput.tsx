import type React from 'react';
import { useEffect, useId, useState } from 'react';
import { useAppWeight } from '~/hooks/useAppWeight';
import { WeightUnit } from '~/types/weight';
import { toFixedNoZero } from '~/utils/numbers';
import {
  convertKgToLb,
  convertKgToStLb,
  convertLbToKg,
  convertStLbToKg,
} from '~/utils/weights';
import styles from './WeightInput.module.css';

interface Props {
  weight: number | null;
  onChange: (weight: number | null) => void;
  label?: string;
  labelClassName?: string;
}

function WeightInputKg({ weight, onChange, label, labelClassName }: Props) {
  const id = useId();
  let initialKgStr = '';

  if (weight) {
    initialKgStr = toFixedNoZero(weight, 1);
  }

  const [isChanged, setIsChanged] = useState(false);
  const [kgStr, setKgStr] = useState(initialKgStr);

  useEffect(() => {
    if (!isChanged) return;

    if (kgStr.length === 0) {
      onChange(null);
      return;
    }

    const newWeight = parseFloat(kgStr);
    onChange(newWeight);
  }, [isChanged, kgStr, onChange]);

  const onKgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setKgStr(val.replace(/[^\d.]/, ''));
    setIsChanged(true);
  };

  const inputAriaLabel = label ? `${label} - Kilograms` : 'Kilograms';

  return (
    <>
      {label && (
        <label htmlFor={id} className={labelClassName}>
          {label}
        </label>
      )}
      <div className={styles.weightInput}>
        <div className={styles.weightField}>
          <input
            id={id}
            type="text"
            inputMode="decimal"
            className={styles.weightInputKg}
            value={kgStr}
            maxLength={5}
            autoComplete="off"
            onChange={onKgChange}
            aria-label={inputAriaLabel}
          />
          <div className={styles.weightUnit} aria-hidden="true">
            kg
          </div>
        </div>
      </div>
    </>
  );
}

function WeightInputStLb({ weight, onChange, label, labelClassName }: Props) {
  const id = useId();
  let initialStStr = '';
  let initialLbStr = '';

  if (weight) {
    const { st, lb } = convertKgToStLb(weight);
    initialStStr = st.toString();
    initialLbStr = toFixedNoZero(lb, 1);
  }

  const [isChanged, setIsChanged] = useState(false);
  const [stStr, setStStr] = useState(initialStStr);
  const [lbStr, setLbStr] = useState(initialLbStr);

  useEffect(() => {
    if (!isChanged) return;

    if (stStr.length === 0 || lbStr.length === 0) {
      onChange(null);
      return;
    }

    const st = parseInt(stStr, 10);
    const lb = parseFloat(lbStr);

    const newWeightKg = convertStLbToKg({ st, lb });
    onChange(newWeightKg);
  }, [isChanged, stStr, lbStr, onChange]);

  const onStoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setStStr(val.replace(/[^\d]/, ''));
    setIsChanged(true);
  };

  const onLbsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLbStr(val.replace(/[^\d.]/, ''));
    setIsChanged(true);
  };

  const stoneLabel = label ? `${label} - Stone` : 'Stone';
  const poundsLabel = label ? `${label} - Pounds` : 'Pounds';

  const inputContent = (
    <div className={styles.weightInput}>
      <div className={styles.weightField}>
        <input
          id={`${id}-stone`}
          type="text"
          inputMode="numeric"
          value={stStr}
          maxLength={2}
          autoComplete="off"
          onChange={onStoneChange}
          aria-label={stoneLabel}
        />
        <div className={styles.weightUnit} aria-hidden="true">
          st
        </div>
      </div>
      <div className={styles.weightField}>
        <input
          id={`${id}-pounds`}
          type="text"
          inputMode="decimal"
          value={lbStr}
          maxLength={4}
          autoComplete="off"
          onChange={onLbsChange}
          aria-label={poundsLabel}
        />
        <div className={styles.weightUnit} aria-hidden="true">
          lb
        </div>
      </div>
    </div>
  );

  if (label) {
    return (
      <>
        <div className={labelClassName} aria-hidden="true">
          {label}
        </div>
        <fieldset className="inputFieldset">
          <legend className="visuallyHidden">{label}</legend>
          {inputContent}
        </fieldset>
      </>
    );
  }

  return inputContent;
}

function WeightInputLb({ weight, onChange, label, labelClassName }: Props) {
  const id = useId();
  let initialLbStr = '';

  if (weight) {
    const lb = convertKgToLb(weight);
    initialLbStr = toFixedNoZero(lb, 1);
  }

  const [isChanged, setIsChanged] = useState(false);
  const [lbStr, setLbStr] = useState(initialLbStr);

  useEffect(() => {
    if (!isChanged) return;

    if (lbStr.length === 0) {
      onChange(null);
      return;
    }

    const lb = parseFloat(lbStr);
    const newWeightKg = convertLbToKg(lb);
    onChange(newWeightKg);
  }, [isChanged, lbStr, onChange]);

  const onLbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLbStr(val.replace(/[^\d.]/, ''));
    setIsChanged(true);
  };

  const inputAriaLabel = label ? `${label} - Pounds` : 'Pounds';

  return (
    <>
      {label && (
        <label htmlFor={id} className={labelClassName}>
          {label}
        </label>
      )}
      <div className={styles.weightInput}>
        <div className={styles.weightField}>
          <input
            id={id}
            type="text"
            inputMode="decimal"
            className={styles.weightInputLb}
            value={lbStr}
            maxLength={5}
            autoComplete="off"
            onChange={onLbChange}
            aria-label={inputAriaLabel}
          />
          <div className={styles.weightUnit} aria-hidden="true">
            lb
          </div>
        </div>
      </div>
    </>
  );
}

export function WeightInput({
  weight,
  onChange,
  label,
  labelClassName,
}: Props) {
  const { weightUnit } = useAppWeight();

  let InputComponent = WeightInputKg;

  if (weightUnit === WeightUnit.STONES_LBS) {
    InputComponent = WeightInputStLb;
  }

  if (weightUnit === WeightUnit.LBS) {
    InputComponent = WeightInputLb;
  }

  return (
    <InputComponent
      weight={weight}
      onChange={onChange}
      label={label}
      labelClassName={labelClassName}
    />
  );
}
