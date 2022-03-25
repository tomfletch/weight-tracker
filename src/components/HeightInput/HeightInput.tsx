import { useContext, useEffect, useState } from 'react';
import HeightContext, { HeightUnit } from '../../context/HeightContext';
import { convertCmToM, convertFtInToM, convertInToM, convertMToCm, convertMToFtIn, convertMToIn } from '../../utils/height';
import { toFixedNoZero } from '../../utils/numbers';
import styles from './HeightInput.module.css';

interface Props {
  id: string;
  height: number | null;
  onChange: (height: number | null) => void;
};

function HeightInputCm({ id, height, onChange }: Props) {
  let initialStr = '';

  if (height) {
    const heightCm = convertMToCm(height);
    initialStr = toFixedNoZero(heightCm, 1);
  }

  const [isChanged, setIsChanged] = useState(false);
  const [heightStr, setHeightStr] = useState(initialStr);

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
  }

  return (
    <div className={styles.heightInput}>
      <input id={id} type="text" value={heightStr} maxLength={5} autoComplete="off" onChange={onCmChange} />
      <div className={styles.heightUnit}>cm</div>
    </div>
  );
}

function HeightInputIn({ id, height, onChange }: Props) {
  let initialStr = '';

  if (height) {
    const heightIn = convertMToIn(height);
    initialStr = toFixedNoZero(heightIn, 1);
  }

  const [isChanged, setIsChanged] = useState(false);
  const [heightStr, setHeightStr] = useState(initialStr);

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
  }

  return (
    <div className={styles.heightInput}>
      <input id={id} type="text" value={heightStr} maxLength={5} autoComplete="off" onChange={onInChange} />
      <div className={styles.heightUnit}>in</div>
    </div>
  );
}

function HeightInputFtIn({ id, height, onChange }: Props) {
  let initialFtStr = '';
  let initialInStr = '';

  if (height) {
    const { ft, inch } = convertMToFtIn(height);
    initialFtStr = ft.toString();
    initialInStr = toFixedNoZero(inch, 1);
  }

  const [isChanged, setIsChanged] = useState(false);
  const [ftStr, setFtStr] = useState(initialFtStr);
  const [inStr, setInStr] = useState(initialInStr);

  useEffect(() => {
    if (!isChanged) return;

    if (ftStr.length === 0 || inStr.length === 0) {
      onChange(null);
      return;
    }

    const ft = parseInt(ftStr, 10);
    const inch = parseFloat(inStr);

    const newWeightKg = convertFtInToM({ft, inch});
    onChange(newWeightKg);
  }, [isChanged, ftStr, inStr, onChange]);

  const onFtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFtStr(val.replace(/[^\d]/, ''));
    setIsChanged(true);
  }

  const onInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInStr(val.replace(/[^\d.]/, ''));
    setIsChanged(true);
  }

  return (
    <div className={styles.heightInput}>
      <input id={id} type="text" value={ftStr} maxLength={2} autoComplete="off" onChange={onFtChange} />
      <div className={styles.heightUnit}>ft</div>
      <input type="text" value={inStr} maxLength={4} autoComplete="off" onChange={onInChange} />
      <div className={styles.heightUnit}>in</div>
    </div>
  );
}

function WeightInput({ id, height, onChange }: Props) {
  const { heightUnit } = useContext(HeightContext);

  let InputComponent = HeightInputCm;

  if (heightUnit === HeightUnit.IN) {
    InputComponent = HeightInputIn;
  }

  if (heightUnit === HeightUnit.FT_IN) {
    InputComponent = HeightInputFtIn;
  }

  return <InputComponent id={id} height={height} onChange={onChange} />
}

export default WeightInput;
