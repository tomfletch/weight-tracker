import { describe, expect, it } from 'vitest';
import { calculateHealthyWeightRange } from '~/utils/bmi';

describe('calculateHealthyWeightRange', () => {
  it('should calculate the correct healthy weight range for a given height', () => {
    const height = 1.75; // meters
    const result = calculateHealthyWeightRange(height);

    expect(result.min).toBeCloseTo(56.7, 1); // 18.5 * 1.75^2
    expect(result.max).toBeCloseTo(76.6, 1); // 25 * 1.75^2
  });

  it('should return 0 for both min and max if height is 0', () => {
    const height = 0;
    const result = calculateHealthyWeightRange(height);

    expect(result.min).toBe(0);
    expect(result.max).toBe(0);
  });
});
