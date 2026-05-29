import { describe, expect, it } from 'vitest';
import {
  BMI_NORMAL_MAX,
  BMI_NORMAL_MIN,
  BMI_OVERWEIGHT_MAX,
  calculateBMI,
  calculateHealthyWeightRange,
  getBMICategory,
} from '~/utils/bmi';

describe('BMI constants', () => {
  it('should have correct BMI thresholds', () => {
    expect(BMI_NORMAL_MIN).toBe(18.5);
    expect(BMI_NORMAL_MAX).toBe(25);
    expect(BMI_OVERWEIGHT_MAX).toBe(30);
  });
});

describe('calculateBMI', () => {
  it('calculates BMI correctly for known values', () => {
    // 70kg, 1.75m => BMI = 22.857...
    expect(calculateBMI(70, 1.75)).toBeCloseTo(22.857, 3);
    // 50kg, 1.6m => BMI = 19.53125
    expect(calculateBMI(50, 1.6)).toBeCloseTo(19.53125, 5);
  });

  it('returns Infinity for zero height', () => {
    expect(calculateBMI(70, 0)).toBe(Infinity);
  });
});

describe('getBMICategory', () => {
  it('returns correct category for underweight', () => {
    expect(getBMICategory(17)).toBe('underweight');
  });
  it('returns correct category for healthy', () => {
    expect(getBMICategory(20)).toBe('healthy');
    expect(getBMICategory(BMI_NORMAL_MIN)).toBe('healthy');
    expect(getBMICategory(BMI_NORMAL_MAX - 0.01)).toBe('healthy');
  });
  it('returns correct category for overweight', () => {
    expect(getBMICategory(27)).toBe('overweight');
    expect(getBMICategory(BMI_NORMAL_MAX)).toBe('overweight');
    expect(getBMICategory(BMI_OVERWEIGHT_MAX - 0.01)).toBe('overweight');
  });
  it('returns correct category for obese', () => {
    expect(getBMICategory(35)).toBe('obese');
    expect(getBMICategory(BMI_OVERWEIGHT_MAX)).toBe('obese');
    expect(getBMICategory(100)).toBe('obese');
  });
  it('throws for negative BMI', () => {
    expect(() => getBMICategory(-1)).toThrow();
  });
});

describe('calculateHealthyWeightRange', () => {
  it('calculates the correct healthy weight range for a given height', () => {
    const height = 1.75; // meters
    const result = calculateHealthyWeightRange(height);
    expect(result.min).toBeCloseTo(56.65625, 5); // 18.5 * 1.75^2
    expect(result.max).toBeCloseTo(76.5625, 5); // 25 * 1.75^2
  });

  it('returns 0 for both min and max if height is 0', () => {
    const height = 0;
    const result = calculateHealthyWeightRange(height);
    expect(result.min).toBe(0);
    expect(result.max).toBe(0);
  });
});
