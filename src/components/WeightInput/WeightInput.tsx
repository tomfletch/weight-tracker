import clsx from 'clsx';
import type React from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import { useAppWeight } from '~/hooks/useAppWeight';
import inputStyles from '~/styles/inputs.module.css';
import { WeightUnit } from '~/types/weight';
import { toFixedNoZero } from '~/utils/numbers';
import {
  convertKgToLb,
  convertKgToStLb,
  convertLbToKg,
  convertStLbToKg,
} from '~/utils/weights';

interface Props {
  weight: number | null;
  onChange: (weight: number | null) => void;
  label?: string;
  labelClassName?: string;
  labelDescription?: string;
  labelDescriptionClassName?: string;
  labelContainerClassName?: string;
  inputContainerClassName?: string;
  isInvalid?: boolean;
  ariaDescribedby?: string;
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
  isInvalid,
  ariaDescribedby,
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
    if (!Number.isFinite(newWeight)) {
      onChange(null);
      return;
    }
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
      <div className={clsx(inputStyles.compoundInput, inputContainerClassName)}>
        <div className={inputStyles.compoundField}>
          <input
            id={id}
            type="text"
            inputMode="decimal"
            className={clsx(
              inputStyles.textInput,
              inputStyles.numberInput,
              isInvalid && inputStyles.invalid,
            )}
            value={kgStr}
            maxLength={5}
            autoComplete="off"
            onChange={onKgChange}
            aria-label={inputAriaLabel}
            aria-invalid={isInvalid}
            aria-describedby={ariaDescribedby}
          />
          <div aria-hidden="true">kg</div>
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
  isInvalid,
  ariaDescribedby,
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

    if (!Number.isFinite(st) || !Number.isFinite(lb)) {
      onChange(null);
      return;
    }

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
    <div className={inputStyles.compoundInput}>
      <div className={inputStyles.compoundField}>
        <input
          ref={firstInputRef}
          id={`${id}-stone`}
          className={clsx(
            inputStyles.textInput,
            inputStyles.numberInput,
            isInvalid && inputStyles.invalid,
          )}
          type="text"
          inputMode="numeric"
          value={stStr}
          maxLength={2}
          autoComplete="off"
          onChange={onStoneChange}
          aria-label={stoneLabel}
          aria-invalid={isInvalid}
          aria-describedby={ariaDescribedby}
        />
        <div aria-hidden="true">st</div>
      </div>
      <div className={inputStyles.compoundField}>
        <input
          id={`${id}-pounds`}
          className={clsx(
            inputStyles.textInput,
            inputStyles.numberInput,
            isInvalid && inputStyles.invalid,
          )}
          type="text"
          inputMode="decimal"
          value={lbStr}
          maxLength={4}
          autoComplete="off"
          onChange={onLbsChange}
          aria-label={poundsLabel}
          aria-invalid={isInvalid}
          aria-describedby={ariaDescribedby}
        />
        <div aria-hidden="true">lb</div>
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
          className={clsx(inputStyles.inputFieldset, inputContainerClassName)}
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
  isInvalid,
  ariaDescribedby,
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
    if (!Number.isFinite(lb)) {
      onChange(null);
      return;
    }
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
      <div className={clsx(inputStyles.compoundInput, inputContainerClassName)}>
        <div className={inputStyles.compoundField}>
          <input
            id={id}
            type="text"
            inputMode="decimal"
            className={clsx(
              inputStyles.textInput,
              inputStyles.numberInput,
              isInvalid && inputStyles.invalid,
            )}
            value={lbStr}
            maxLength={5}
            autoComplete="off"
            onChange={onLbChange}
            aria-label={inputAriaLabel}
            aria-invalid={isInvalid}
            aria-describedby={ariaDescribedby}
          />
          <div aria-hidden="true">lb</div>
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
  isInvalid,
  ariaDescribedby,
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
      isInvalid={isInvalid}
      ariaDescribedby={ariaDescribedby}
    />
  );
}
