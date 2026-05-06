import { useState } from 'react';

type UseMonthSelectorParams = {
  minDate?: string;
};

export const useMonthSelector = ({ minDate }: UseMonthSelectorParams) => {
  const today = new Date();
  const currentMonth = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1),
  );

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const isPrevMonthDisabled = minDate
    ? selectedMonth <= new Date(minDate)
    : false;
  const isNextMonthDisabled = selectedMonth >= currentMonth;

  const goToPreviousMonth = () => {
    if (isPrevMonthDisabled) return;

    setSelectedMonth(
      (prev) =>
        new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth() - 1, 1)),
    );
  };

  const goToNextMonth = () => {
    if (isNextMonthDisabled) return;

    setSelectedMonth(
      (prev) =>
        new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth() + 1, 1)),
    );
  };

  return {
    selectedMonth,
    goToPreviousMonth,
    goToNextMonth,
    isPrevMonthDisabled,
    isNextMonthDisabled,
  };
};
