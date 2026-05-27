import * as z from 'zod/mini';
import { heightUnitSchema } from '~/types/height';
import { weightUnitSchema } from '~/types/weight';
import { themeSchema } from '~/utils/colours';

export const weightRecordSchema = z.object({
  date: z.string(),
  weightKgs: z.number(),
});

export const backupDataSchema = z.object({
  height: z.nullable(z.number()),
  heightUnit: heightUnitSchema,
  weightUnit: weightUnitSchema,
  weightRecords: z.array(weightRecordSchema),
  weightTargetKgs: z.nullable(z.number()),
  theme: themeSchema,
});

export const backupSchema = z.object({
  schemaVersion: z.number(),
  exportedAt: z.string(),
  data: backupDataSchema,
});

export type AppBackupData = z.infer<typeof backupDataSchema>;
export type AppDataBackup = z.infer<typeof backupSchema>;
