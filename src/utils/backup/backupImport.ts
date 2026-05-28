import { APP_STORE_VERSION, useAppStore } from '~/stores/appStore';
import { HeightUnit } from '~/types/height';
import type { WeightRecord } from '~/types/weight';
import { WeightUnit } from '~/types/weight';
import {
  type AppBackupData,
  type AppDataBackup,
  backupSchema,
} from '~/utils/backup/backupSchema';
import type { Theme } from '~/utils/colours';
import { parseISODate } from '~/utils/dates';
import { isValidWeight } from '~/utils/weights';

export async function importAppBackupFromFile(
  file: File,
): Promise<
  | { status: 'imported'; message: string }
  | { status: 'confirm'; backup: AppDataBackup }
> {
  const content = await readFileAsText(file);
  const backup = validateAndParseJSONBackup(content);

  // Check if there's existing data
  const state = useAppStore.getState();
  const existingData = {
    height: state.height,
    heightUnit: state.heightUnit,
    weightUnit: state.weightUnit,
    weightRecords: state.weightRecords,
    weightTargetKgs: state.weightTargetKgs,
    theme: state.theme,
  };

  if (hasExistingAppData(existingData)) {
    // UI should confirm before importing
    return { status: 'confirm', backup };
  } else {
    // No existing data, import directly
    performImportData(backup);
    const count = backup.data.weightRecords.length;
    const recordLabel = count === 1 ? 'weight record' : 'weight records';
    return {
      status: 'imported',
      message: [
        `Imported backup: ${count} ${recordLabel}`,
        `height set: ${backup.data.height !== null ? 'yes' : 'no'}`,
        `target weight set: ${backup.data.weightTargetKgs !== null ? 'yes' : 'no'}`,
      ].join(', '),
    };
  }
}

export function performImportData(backup: AppDataBackup) {
  useAppStore.setState({
    height: backup.data.height,
    heightUnit: backup.data.heightUnit,
    weightUnit: backup.data.weightUnit,
    weightRecords: backup.data.weightRecords,
    weightTargetKgs: backup.data.weightTargetKgs,
    theme: backup.data.theme,
  });
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
}

/**
 * Validate and parse JSON backup file.
 * Throws descriptive errors if validation fails.
 */
function validateAndParseJSONBackup(jsonContent: string): AppDataBackup {
  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonContent);
  } catch (error) {
    throw new Error(
      `Invalid JSON: ${error instanceof Error ? error.message : 'Parse error'}`,
    );
  }

  // Perform structural validation via zod
  const structureResult = backupSchema.safeParse(parsed);
  if (!structureResult.success) {
    const issue = structureResult.error.issues[0];
    throw new Error(
      `Invalid backup structure: ${issue.path.join('.')} ${issue.message}`,
    );
  }

  const backup = structureResult.data;

  // Semantic validation with specific error messages
  if (backup.schemaVersion !== APP_STORE_VERSION) {
    throw new Error(
      `Schema version mismatch: expected ${APP_STORE_VERSION}, got ${backup.schemaVersion}. Please export a fresh backup or update the app.`,
    );
  }

  const data = backup.data;

  const validatedRecords: WeightRecord[] = [];
  for (let i = 0; i < data.weightRecords.length; i++) {
    const record = data.weightRecords[i];
    try {
      validatedRecords.push(validateWeightRecord(record));
    } catch (error) {
      throw new Error(
        `Invalid weight record at index ${i}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }

  if (data.weightTargetKgs !== null && !isValidWeight(data.weightTargetKgs)) {
    throw new Error('Invalid weightTargetKgs: must be a positive number.');
  }

  return {
    schemaVersion: APP_STORE_VERSION,
    exportedAt: backup.exportedAt,
    data: {
      height: data.height,
      heightUnit: data.heightUnit,
      weightUnit: data.weightUnit,
      weightRecords: validatedRecords,
      weightTargetKgs: data.weightTargetKgs,
      theme: data.theme,
    },
  };
}

function validateWeightRecord(record: WeightRecord): WeightRecord {
  try {
    parseISODate(record.date);
  } catch {
    throw new Error(
      `Invalid date format: ${record.date}. Expected YYYY-MM-DD.`,
    );
  }

  if (!isValidWeight(record.weightKgs)) {
    throw new Error(
      `Invalid weight: ${record.weightKgs}. Must be a positive number.`,
    );
  }

  return record;
}

function hasExistingAppData(state: {
  height: AppBackupData['height'];
  heightUnit: AppBackupData['heightUnit'];
  weightUnit: AppBackupData['weightUnit'];
  weightRecords: AppBackupData['weightRecords'];
  weightTargetKgs: AppBackupData['weightTargetKgs'];
  theme: AppBackupData['theme'];
}): boolean {
  const defaultHeight = null;
  const defaultHeightUnit = HeightUnit.CM;
  const defaultWeightUnit = WeightUnit.STONES_LBS;
  const defaultTheme: Theme = 'blue';

  if (state.height !== defaultHeight) return true;
  if (state.heightUnit !== defaultHeightUnit) return true;
  if (state.weightUnit !== defaultWeightUnit) return true;
  if (state.weightRecords.length > 0) return true;
  if (state.weightTargetKgs !== null) return true;
  if (state.theme !== defaultTheme) return true;

  return false;
}
