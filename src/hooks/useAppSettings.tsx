import { useAppStore } from '~/stores/appStore';

export const useAppSettings = () => {
  const accentColour = useAppStore((state) => state.accentColour);
  const { setAccentColour } = useAppStore((state) => state.actions);

  return { accentColour, setAccentColour };
};
