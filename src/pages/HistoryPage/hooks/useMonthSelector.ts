type UseMonthSelectorParams = {
  selectedMonth: Date;
  onMonthChange: (selectedMonth: Date) => void;
  minDate?: string;
};

export const useMonthSelector = ({
  selectedMonth,
  onMonthChange,
  minDate,
}: UseMonthSelectorParams) => {
  const today = new Date();
  const currentMonth = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1),
  );

  const isPrevMonthDisabled = minDate
    ? selectedMonth <= new Date(minDate)
    : false;
  const isNextMonthDisabled = selectedMonth >= currentMonth;

  const goToPreviousMonth = () => {
    if (isPrevMonthDisabled) return;

    onMonthChange(
      new Date(
        Date.UTC(
          selectedMonth.getUTCFullYear(),
          selectedMonth.getUTCMonth() - 1,
          1,
        ),
      ),
    );
  };

  const goToNextMonth = () => {
    if (isNextMonthDisabled) return;

    onMonthChange(
      new Date(
        Date.UTC(
          selectedMonth.getUTCFullYear(),
          selectedMonth.getUTCMonth() + 1,
          1,
        ),
      ),
    );
  };

  return {
    goToPreviousMonth,
    goToNextMonth,
    isPrevMonthDisabled,
    isNextMonthDisabled,
  };
};
