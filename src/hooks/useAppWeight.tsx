import { useAppStore } from '../stores/appStore';

export const useAppWeight = () => {
  const weightUnit = useAppStore((state) => state.weightUnit);
  const weightRecords = useAppStore((state) => state.weightRecords);
  const weightTargetKgs = useAppStore((state) => state.weightTargetKgs);
  const { setWeightUnit, addWeight, deleteWeight, setWeightTargetKgs } =
    useAppStore((state) => state.actions);

  return {
    weightUnit,
    setWeightUnit,
    weightRecords,
    addWeight,
    deleteWeight,
    weightTargetKgs,
    setWeightTargetKgs,
  };
};
