import { useAppStore } from '~/stores/appStore';

export const useAppSettings = () => {
  const theme = useAppStore((state) => state.theme);
  const { setTheme, clearAllData } = useAppStore((state) => state.actions);

  return { theme, setTheme, clearAllData };
};
