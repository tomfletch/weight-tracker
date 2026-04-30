import type React from 'react';
import { useEffect, useId, useRef, useState } from 'react';
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
  labelDescription?: string;
  labelDescriptionClassName?: string;
  labelContainerClassName?: string;
  inputContainerClassName?: string;
}

function WeightInputKg({
  weight,
  onChange,
  label,
  labelClassName,
  labelDescription,
  labelDescriptionClassName,
  labelContainerClassName,
  inputContainerClassName,
}: Props) {
  const id = useId();

  const [isChanged, setIsChanged] = useState(false);
  const [kgStr, setKgStr] = useState(() => {
    if (!weight) return '';
    return toFixedNoZero(weight, 1);
  });

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
        <div className={labelContainerClassName}>
          <label htmlFor={id} className={labelClassName}>
            {label}
          </label>
          {labelDescription && (
            <p className={labelDescriptionClassName}>{labelDescription}</p>
          )}
        </div>
      )}
      <div
        className={[styles.weightInput, inputContainerClassName]
          .filter(Boolean)
          .join(' ')}
      >
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

function WeightInputStLb({
  weight,
  onChange,
  label,
  labelClassName,
  labelDescription,
  labelDescriptionClassName,
  labelContainerClassName,
  inputContainerClassName,
}: Props) {
  const id = useId();
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [isChanged, setIsChanged] = useState(false);

  const initialWeightStLb = weight ? convertKgToStLb(weight) : null;
  const [stStr, setStStr] = useState(() => {
    if (!initialWeightStLb) return '';
    return initialWeightStLb.st.toString();
  });
  const [lbStr, setLbStr] = useState(() => {
    if (!initialWeightStLb) return '';
    return toFixedNoZero(initialWeightStLb.lb, 1);
  });

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
          ref={firstInputRef}
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
        <div className={labelContainerClassName}>
          <div
            className={labelClassName}
            aria-hidden="true"
            onClick={() => {
              firstInputRef.current?.focus();
            }}
          >
            {label}
          </div>
          {labelDescription && (
            <p className={labelDescriptionClassName}>{labelDescription}</p>
          )}
        </div>
        <fieldset
          className={['inputFieldset', inputContainerClassName]
            .filter(Boolean)
            .join(' ')}
        >
          <legend className="visuallyHidden">{label}</legend>
          {inputContent}
        </fieldset>
      </>
    );
  }

  return inputContent;
}

function WeightInputLb({
  weight,
  onChange,
  label,
  labelClassName,
  labelDescription,
  labelDescriptionClassName,
  labelContainerClassName,
  inputContainerClassName,
}: Props) {
  const id = useId();

  const [isChanged, setIsChanged] = useState(false);
  const [lbStr, setLbStr] = useState(() => {
    if (!weight) return '';
    const lb = convertKgToLb(weight);
    return toFixedNoZero(lb, 1);
  });

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
        <div className={labelContainerClassName}>
          <label htmlFor={id} className={labelClassName}>
            {label}
          </label>
          {labelDescription && (
            <p className={labelDescriptionClassName}>{labelDescription}</p>
          )}
        </div>
      )}
      <div
        className={[styles.weightInput, inputContainerClassName]
          .filter(Boolean)
          .join(' ')}
      >
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
  labelDescription,
  labelDescriptionClassName,
  labelContainerClassName,
  inputContainerClassName,
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
      labelDescription={labelDescription}
      labelDescriptionClassName={labelDescriptionClassName}
      labelContainerClassName={labelContainerClassName}
      inputContainerClassName={inputContainerClassName}
    />
  );
}
