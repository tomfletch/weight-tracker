import { getThemeColours } from '~/utils/colours';
import { useAppSettings } from './useAppSettings';

export const useAppTheme = () => {
  const { theme } = useAppSettings();
  return getThemeColours(theme);
};
