/* eslint-disable import/prefer-default-export */

export function toFixedNoZero(n: number, digits: number): string {
  return n.toFixed(digits).replace(/\.?0+$/, '');
}
