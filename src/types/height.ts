import * as z from 'zod/mini';
import { createEnum } from '~/utils/createEnum';

const HEIGHT_UNIT_VALUES = ['CM', 'FT_IN', 'IN'] as const;

export const heightUnitSchema = z.enum(HEIGHT_UNIT_VALUES);

export const HeightUnit = createEnum(HEIGHT_UNIT_VALUES);

export type HeightUnit = z.infer<typeof heightUnitSchema>;
