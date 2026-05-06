import { useMemo } from 'react';
import { useAppWeight } from '~/hooks/useAppWeight';

export function useMonthWeightRecords(month: Date) {
  const { weightRecords } = useAppWeight();

  return useMemo(() => {
    const monthWeightRecords = weightRecords.filter((record) =>
      record.date.startsWith(month.toISOString().slice(0, 7)),
    );

    monthWeightRecords.sort((a, b) => b.date.localeCompare(a.date));

    return monthWeightRecords;
  }, [weightRecords, month]);
}
