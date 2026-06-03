import { useAppStore } from '~/stores/appStore';

export const useAppSettings = () => {
  const theme = useAppStore((state) => state.theme);
  const { setTheme, clearAllData, setOnboardingCompleted } = useAppStore(
    (state) => state.actions,
  );
  const { hasCompletedOnboarding } = useAppStore((state) => state);

  return {
    theme,
    setTheme,
    clearAllData,
    setOnboardingCompleted,
    hasCompletedOnboarding,
  };
};
