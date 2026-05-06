import { useState } from 'react';

type UseMonthSelectorParams = {
  minDate?: string;
};

export const useMonthSelector = ({ minDate }: UseMonthSelectorParams) => {
  const today = new Date();
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const isPrevMonthDisabled = minDate
    ? selectedMonth <= new Date(minDate)
    : false;
  const isNextMonthDisabled = selectedMonth >= currentMonth;

  const goToPreviousMonth = () => {
    if (isPrevMonthDisabled) return;

    setSelectedMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    if (isNextMonthDisabled) return;

    setSelectedMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
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
