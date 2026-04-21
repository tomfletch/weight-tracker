export function map(
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number,
): number {
  const fromRange = fromMax - fromMin;
  const toRange = toMax - toMin;

  return ((value - fromMin) / fromRange) * toRange + toMin;
}

export function limit(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
