import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HeightUnit } from '~/types/height';
import { type WeightRecord, WeightUnit } from '~/types/weight';
import { DEFAULT_THEME, normaliseTheme, type Theme } from '~/utils/colours';
import { isValidWeight } from '~/utils/weights';

/**
 * Current schema version for app store data.
 * Used for JSON backups to ensure forward/backward compatibility.
 */
export const APP_STORE_VERSION = 1;

type AppState = {
  // Height
  height: number | null;
  heightUnit: HeightUnit;

  // Weight
  weightUnit: WeightUnit;
  weightRecords: WeightRecord[];
  weightTargetKgs: number | null;

  // Settings
  theme: Theme;

  actions: {
    // Height
    setHeight: (height: number | null) => void;
    setHeightUnit: (heightUnit: HeightUnit) => void;

    // Weight
    setWeightUnit: (weightUnit: WeightUnit) => void;
    addWeight: (weightRecord: WeightRecord) => void;
    deleteWeight: (date: string) => void;
    setWeightTargetKgs: (weightTarget: number) => void;

    // Settings
    setTheme: (theme: Theme) => void;
    clearAllData: () => void;
  };
};

const initialAppState: Omit<AppState, 'actions'> = {
  // Height
  height: null,
  heightUnit: HeightUnit.CM,

  // Weight
  weightUnit: WeightUnit.STONES_LBS,
  weightRecords: [],
  weightTargetKgs: null,

  // Settings
  theme: DEFAULT_THEME,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialAppState,

      actions: {
        // Height
        setHeight: (height) => set({ height }),
        setHeightUnit: (heightUnit) => set({ heightUnit }),

        // Weight
        setWeightUnit: (weightUnit) => set({ weightUnit }),
        addWeight: (weightRecord) =>
          set((state) => {
            if (!isValidWeight(weightRecord.weightKgs)) {
              return state;
            }
            const newWeightRecords = state.weightRecords.filter(
              (w) => w.date !== weightRecord.date,
            );
            return {
              weightRecords: [...newWeightRecords, weightRecord].sort((a, b) =>
                a.date.localeCompare(b.date),
              ),
            };
          }),
        deleteWeight: (date) =>
          set((state) => ({
            weightRecords: state.weightRecords.filter(
              (weightRecord) => weightRecord.date !== date,
            ),
          })),
        setWeightTargetKgs: (weightTargetKgs) => set({ weightTargetKgs }),

        // Settings
        setTheme: (theme) => set({ theme: normaliseTheme(theme) }),
        clearAllData: () => {
          useAppStore.persist.clearStorage();
          set({ ...initialAppState });
        },
      },
    }),
    {
      name: 'appStore',
      version: APP_STORE_VERSION,
      partialize: (state) => {
        const { actions, ...persistedState } = state;
        return persistedState;
      },
    },
  ),
);
