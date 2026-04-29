export const THEMES = [
  { name: 'Blue', value: 'blue', colours: { accentColour: '#0078c8' } },
  { name: 'Pink', value: 'pink', colours: { accentColour: '#df0072' } },
  { name: 'Green', value: 'green', colours: { accentColour: '#00892a' } },
] as const;

export type Theme = (typeof THEMES)[number]['value'];

export type ThemeOption = {
  name: string;
  value: Theme;
};

export const DEFAULT_THEME = THEMES[0].value;

export function getThemeColours(theme: Theme) {
  const themeObj = THEMES.find((t) => t.value === theme);

  if (!themeObj) {
    throw new Error(`Invalid theme: ${theme}`);
  }

  return themeObj.colours;
}

export function isValidTheme(value: string): value is Theme {
  return THEMES.some((theme) => theme.value === value);
}

export function normaliseTheme(value: string): Theme {
  return isValidTheme(value) ? value : DEFAULT_THEME;
}
