import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HeightUnit } from '~/types/height';
import { type WeightRecord, WeightUnit } from '~/types/weight';
import { THEME_COLOURS } from '~/utils/colours';

type AppState = {
  // Height
  height: number | null;
  heightUnit: HeightUnit;

  // Weight
  weightUnit: WeightUnit;
  weightRecords: WeightRecord[];
  weightTargetKgs: number | null;

  // Settings
  accentColour: string;

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
    setAccentColour: (accentColour: string) => void;
  };
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Height
      height: null,
      heightUnit: HeightUnit.CM,

      // Weight
      weightUnit: WeightUnit.STONES_LBS,
      weightRecords: [],
      weightTargetKgs: null,

      // Settings
      accentColour: THEME_COLOURS[0].value,

      actions: {
        // Height
        setHeight: (height) => set({ height }),
        setHeightUnit: (heightUnit) => set({ heightUnit }),

        // Weight
        setWeightUnit: (weightUnit) => set({ weightUnit }),
        addWeight: (weightRecord) =>
          set((state) => {
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
        setAccentColour: (accentColour) => set({ accentColour }),
      },
    }),
    {
      name: 'appStore',
      partialize: (state) => {
        const { actions, ...persistedState } = state;
        return persistedState;
      },
    },
  ),
);
