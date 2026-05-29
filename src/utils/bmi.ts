export const BMI_NORMAL_MIN = 18.5;
export const BMI_NORMAL_MAX = 25;
export const BMI_OVERWEIGHT_MAX = 30;

const BMI_CATEGORIES: { name: string; max: number }[] = [
  { name: 'underweight', max: BMI_NORMAL_MIN },
  { name: 'healthy', max: BMI_NORMAL_MAX },
  { name: 'overweight', max: BMI_OVERWEIGHT_MAX },
  { name: 'obese', max: Infinity },
];

export function calculateBMI(weightKgs: number, heightM: number): number {
  return weightKgs / (heightM * heightM);
}

export function getBMICategory(bmi: number): string {
  if (bmi < 0) {
    throw new Error(`Invalid BMI value: ${bmi}`);
  }

  for (const category of BMI_CATEGORIES) {
    if (bmi < category.max) {
      return category.name;
    }
  }
  throw new Error(`Invalid BMI value: ${bmi}`);
}

export function calculateHealthyWeightRange(heightM: number): {
  min: number;
  max: number;
} {
  const min = BMI_NORMAL_MIN * (heightM * heightM);
  const max = BMI_NORMAL_MAX * (heightM * heightM);
  return { min, max };
}
