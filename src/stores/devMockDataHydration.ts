import { useAppStore } from '~/stores/appStore';
import { HeightUnit } from '~/types/height';
import { type WeightRecord, WeightUnit } from '~/types/weight';
import { toISODate } from '~/utils/dates';

let hasAppliedMockData = false;

function buildMockWeightRecords(totalDays: number): WeightRecord[] {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - (totalDays - 1));

  const records: WeightRecord[] = [];

  for (let i = 0; i < totalDays; i += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    // A smooth downward trend with slight deterministic variation.
    const baseWeightKgs = 86;
    const trend = i * 0.035;
    const cycle = Math.sin(i / 5) * 0.45;
    const microCycle = Math.cos(i / 2.75) * 0.15;
    const randomNoise = (Math.random() - 0.5) * 0.4;

    records.push({
      date: toISODate(date),
      weightKgs: Number(
        (baseWeightKgs - trend + cycle + microCycle + randomNoise).toFixed(2),
      ),
    });
  }

  return records;
}

function applyMockData() {
  if (hasAppliedMockData) {
    return;
  }

  const state = useAppStore.getState();

  // Avoid clobbering existing user data from persisted storage.
  if (state.height !== null || state.weightRecords.length > 0) {
    hasAppliedMockData = true;
    return;
  }

  useAppStore.setState({
    height: 1.78,
    heightUnit: HeightUnit.CM,
    weightUnit: WeightUnit.KGS,
    weightTargetKgs: 79,
    weightRecords: buildMockWeightRecords(120),
  });

  hasAppliedMockData = true;
}

export function initDevMockDataHydration() {
  const shouldUseMockData =
    import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_DATA === 'true';

  if (!shouldUseMockData) {
    return;
  }

  if (useAppStore.persist.hasHydrated()) {
    applyMockData();
    return;
  }

  const unsubscribe = useAppStore.persist.onFinishHydration(() => {
    applyMockData();
    unsubscribe();
  });
}
