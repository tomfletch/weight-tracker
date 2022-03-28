
interface FtIn {
  ft: number,
  inch: number
}

const IN_PER_M = 39.3701;
const IN_PER_F = 12;

export function convertCmToM(cm: number): number {
  return cm / 100;
}

export function convertMToCm(m: number): number {
  return m * 100;
}

export function convertInToM(inches: number): number {
  return inches / IN_PER_M;
}

export function convertMToIn(m: number): number {
  return m * IN_PER_M;
}

export function convertInToFtIn(totalIn: number): FtIn {
  const ft = Math.floor(totalIn / IN_PER_F);
  const inch = totalIn % IN_PER_F;
  return { ft, inch };
}

export function convertFtInToM({ ft, inch }: FtIn): number {
  const totalIn = (ft * IN_PER_F) + inch;
  return convertInToM(totalIn);
}

export function convertMToFtIn(m: number): FtIn {
  const totalIn = convertMToIn(m);
  return convertInToFtIn(totalIn);
}
