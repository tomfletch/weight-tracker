import { HeightUnit } from '../types/height';
import { type WeightRecord, WeightUnit } from '../types/weight';
import { THEME_COLOURS } from '../utils/colours';

const APP_STORE_KEY = 'appStore';

const LEGACY_KEYS = {
  accentColour: 'accentColour',
  height: 'height',
  heightUnit: 'heightUnit',
  weightRecords: 'weightRecords',
  weightTargetKgs: 'weightTargetKgs',
  weightUnit: 'weightUnit',
} as const;

function deleteLegacyKeys(): void {
  for (const key of Object.values(LEGACY_KEYS)) {
    localStorage.removeItem(key);
  }
}

function tryParseStoredValue(raw: string | null): unknown {
  if (raw === null) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function isWeightUnit(value: unknown): value is WeightUnit {
  return (
    value === WeightUnit.KGS ||
    value === WeightUnit.LBS ||
    value === WeightUnit.STONES_LBS
  );
}

function isHeightUnit(value: unknown): value is HeightUnit {
  return (
    value === HeightUnit.CM ||
    value === HeightUnit.IN ||
    value === HeightUnit.FT_IN
  );
}

function isWeightRecord(value: unknown): value is WeightRecord {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.date === 'string' &&
    typeof candidate.weightKgs === 'number' &&
    Number.isFinite(candidate.weightKgs)
  );
}

function getLegacyWeightRecords(): WeightRecord[] {
  const parsed = tryParseStoredValue(
    localStorage.getItem(LEGACY_KEYS.weightRecords),
  );

  if (!Array.isArray(parsed)) {
    return [];
  }

  const uniqueByDate = new Map<string, WeightRecord>();
  for (const record of parsed) {
    if (isWeightRecord(record)) {
      uniqueByDate.set(record.date, record);
    }
  }

  return [...uniqueByDate.values()].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}

/**
 * One-off migration from legacy context localStorage keys to the zustand key.
 * Remove this module after rollout window when all users have migrated.
 */
export function runLegacyLocalStorageToAppStoreMigration(): void {
  if (typeof window === 'undefined') {
    return;
  }

  // If appStore already exists, this client has already moved over.
  if (localStorage.getItem(APP_STORE_KEY) !== null) {
    deleteLegacyKeys();
    return;
  }

  const hasLegacyData = Object.values(LEGACY_KEYS).some(
    (key) => localStorage.getItem(key) !== null,
  );

  if (!hasLegacyData) {
    return;
  }

  const weightUnitRaw = tryParseStoredValue(
    localStorage.getItem(LEGACY_KEYS.weightUnit),
  );
  const heightUnitRaw = tryParseStoredValue(
    localStorage.getItem(LEGACY_KEYS.heightUnit),
  );
  const weightTargetRaw = tryParseStoredValue(
    localStorage.getItem(LEGACY_KEYS.weightTargetKgs),
  );
  const heightRaw = tryParseStoredValue(
    localStorage.getItem(LEGACY_KEYS.height),
  );
  const accentRaw = tryParseStoredValue(
    localStorage.getItem(LEGACY_KEYS.accentColour),
  );

  const persistedPayload = {
    state: {
      height:
        typeof heightRaw === 'number' && Number.isFinite(heightRaw)
          ? heightRaw
          : null,
      heightUnit: isHeightUnit(heightUnitRaw) ? heightUnitRaw : HeightUnit.CM,
      weightUnit: isWeightUnit(weightUnitRaw)
        ? weightUnitRaw
        : WeightUnit.STONES_LBS,
      weightRecords: getLegacyWeightRecords(),
      weightTargetKgs:
        typeof weightTargetRaw === 'number' && Number.isFinite(weightTargetRaw)
          ? weightTargetRaw
          : null,
      accentColour:
        typeof accentRaw === 'string' ? accentRaw : THEME_COLOURS[0],
    },
    version: 0,
  };

  localStorage.setItem(APP_STORE_KEY, JSON.stringify(persistedPayload));
  deleteLegacyKeys();
}
