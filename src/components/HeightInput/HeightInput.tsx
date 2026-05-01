import type React from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import { useAppHeight } from '~/hooks/useAppHeight';
import inputStyles from '~/styles/inputs.module.css';
import { HeightUnit } from '~/types/height';
import {
  convertCmToM,
  convertFtInToM,
  convertInToM,
  convertMToCm,
  convertMToFtIn,
  convertMToIn,
} from '~/utils/height';
import { toFixedNoZero } from '~/utils/numbers';

interface Props {
  height: number | null;
  onChange: (height: number | null) => void;
  label?: string;
  labelClassName?: string;
  labelDescription?: string;
  labelDescriptionClassName?: string;
  labelContainerClassName?: string;
  inputContainerClassName?: string;
}

function HeightInputCm({
  height,
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
  const [heightStr, setHeightStr] = useState(() => {
    if (!height) return '';

    const heightCm = convertMToCm(height);
    return toFixedNoZero(heightCm, 1);
  });

  useEffect(() => {
    if (!isChanged) return;

    if (heightStr.length === 0) {
      onChange(null);
      return;
    }

    const newHeightCm = parseFloat(heightStr);
    const newHeight = convertCmToM(newHeightCm);
    onChange(newHeight);
  }, [isChanged, heightStr, onChange]);

  const onCmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHeightStr(val.replace(/[^\d.]/, ''));
    setIsChanged(true);
  };

  const inputAriaLabel = label ? `${label} - Centimeters` : 'Centimeters';

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
        className={[inputStyles.compoundInput, inputContainerClassName]
          .filter(Boolean)
          .join(' ')}
      >
        <div className={inputStyles.compoundField}>
          <input
            id={id}
            className={`${inputStyles.textInput} ${inputStyles.numberInput}`}
            type="text"
            inputMode="decimal"
            value={heightStr}
            maxLength={5}
            autoComplete="off"
            onChange={onCmChange}
            aria-label={inputAriaLabel}
          />
          <div aria-hidden="true">cm</div>
        </div>
      </div>
    </>
  );
}

function HeightInputIn({
  height,
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
  const [heightStr, setHeightStr] = useState(() => {
    if (!height) return '';

    const heightIn = convertMToIn(height);
    return toFixedNoZero(heightIn, 1);
  });

  useEffect(() => {
    if (!isChanged) return;

    if (heightStr.length === 0) {
      onChange(null);
      return;
    }

    const newHeightIn = parseFloat(heightStr);
    const newHeight = convertInToM(newHeightIn);
    onChange(newHeight);
  }, [isChanged, heightStr, onChange]);

  const onInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHeightStr(val.replace(/[^\d.]/, ''));
    setIsChanged(true);
  };

  const inputAriaLabel = label ? `${label} - Inches` : 'Inches';

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
        className={[inputStyles.compoundInput, inputContainerClassName]
          .filter(Boolean)
          .join(' ')}
      >
        <div className={inputStyles.compoundField}>
          <input
            id={id}
            className={`${inputStyles.textInput} ${inputStyles.numberInput}`}
            type="text"
            inputMode="decimal"
            value={heightStr}
            maxLength={5}
            autoComplete="off"
            onChange={onInChange}
            aria-label={inputAriaLabel}
          />
          <div aria-hidden="true">in</div>
        </div>
      </div>
    </>
  );
}

function HeightInputFtIn({
  height,
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

  const initialHeightFtIn = height ? convertMToFtIn(height) : null;
  const [ftStr, setFtStr] = useState(() => {
    if (!initialHeightFtIn) return '';
    return initialHeightFtIn.ft.toString();
  });
  const [inStr, setInStr] = useState(() => {
    if (!initialHeightFtIn) return '';
    return toFixedNoZero(initialHeightFtIn.inch, 1);
  });

  useEffect(() => {
    if (!isChanged) return;

    if (ftStr.length === 0 || inStr.length === 0) {
      onChange(null);
      return;
    }

    const ft = parseInt(ftStr, 10);
    const inch = parseFloat(inStr);

    const newHeight = convertFtInToM({ ft, inch });
    onChange(newHeight);
  }, [isChanged, ftStr, inStr, onChange]);

  const onFtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFtStr(val.replace(/[^\d]/, ''));
    setIsChanged(true);
  };

  const onInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInStr(val.replace(/[^\d.]/, ''));
    setIsChanged(true);
  };

  const feetLabel = label ? `${label} - Feet` : 'Feet';
  const inchesLabel = label ? `${label} - Inches` : 'Inches';

  const inputContent = (
    <div className={inputStyles.compoundInput}>
      <div className={inputStyles.compoundField}>
        <input
          ref={firstInputRef}
          id={`${id}-feet`}
          className={`${inputStyles.textInput} ${inputStyles.numberInput}`}
          type="text"
          inputMode="numeric"
          value={ftStr}
          maxLength={2}
          autoComplete="off"
          onChange={onFtChange}
          aria-label={feetLabel}
        />
        <div aria-hidden="true">ft</div>
      </div>
      <div className={inputStyles.compoundField}>
        <input
          id={`${id}-inches`}
          className={`${inputStyles.textInput} ${inputStyles.numberInput}`}
          type="text"
          inputMode="decimal"
          value={inStr}
          maxLength={4}
          autoComplete="off"
          onChange={onInChange}
          aria-label={inchesLabel}
        />
        <div aria-hidden="true">in</div>
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
          className={[inputStyles.inputFieldset, inputContainerClassName]
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

export function HeightInput({
  height,
  onChange,
  label,
  labelClassName,
  labelDescription,
  labelDescriptionClassName,
  labelContainerClassName,
  inputContainerClassName,
}: Props) {
  const { heightUnit } = useAppHeight();

  let InputComponent = HeightInputCm;

  if (heightUnit === HeightUnit.IN) {
    InputComponent = HeightInputIn;
  }

  if (heightUnit === HeightUnit.FT_IN) {
    InputComponent = HeightInputFtIn;
  }

  return (
    <InputComponent
      height={height}
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
