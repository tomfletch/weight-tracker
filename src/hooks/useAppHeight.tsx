import { useAppStore } from '../stores/appStore';

export const useAppHeight = () => {
  const height = useAppStore((state) => state.height);
  const heightUnit = useAppStore((state) => state.heightUnit);
  const { setHeight, setHeightUnit } = useAppStore((state) => state.actions);

  return { height, heightUnit, setHeight, setHeightUnit };
};
