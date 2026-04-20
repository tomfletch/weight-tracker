export const HeightUnit = {
  CM: 'CM',
  FT_IN: 'FT_IN',
  IN: 'IN',
} as const;

export type HeightUnit = (typeof HeightUnit)[keyof typeof HeightUnit];
