export const WeightUnit = {
  LBS: 'LBS',
  STONES_LBS: 'STONES_LBS',
  KGS: 'KGS',
} as const;

export type WeightUnit = (typeof WeightUnit)[keyof typeof WeightUnit];

export interface WeightRecord {
  date: string;
  weightKgs: number;
}
