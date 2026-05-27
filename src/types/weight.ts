import * as z from 'zod/mini';
import { createEnum } from '~/utils/createEnum';

const WEIGHT_UNIT_VALUES = ['LBS', 'STONES_LBS', 'KGS'] as const;

export const weightUnitSchema = z.enum(WEIGHT_UNIT_VALUES);

export const WeightUnit = createEnum(WEIGHT_UNIT_VALUES);

export type WeightUnit = z.infer<typeof weightUnitSchema>;

export interface WeightRecord {
  date: string;
  weightKgs: number;
}
