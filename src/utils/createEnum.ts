/**
 * Creates an enum-like object from an array of string values,
 * preserving literal types for each key-value pair.
 *
 * @example
 * const HEIGHT_UNIT_VALUES = ['CM', 'FT_IN', 'IN'] as const;
 * const HeightUnit = createEnum(HEIGHT_UNIT_VALUES);
 * // HeightUnit.CM has type 'CM', not 'CM' | 'FT_IN' | 'IN'
 */
export function createEnum<const T extends readonly string[]>(values: T) {
  return Object.fromEntries(values.map((v) => [v, v])) as {
    [K in T[number]]: K;
  };
}
