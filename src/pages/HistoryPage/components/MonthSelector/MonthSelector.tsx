import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from '~/components/IconButton/IconButton';
import { formatMonth } from '~/utils/dates';
import { useMonthSelector } from '../../hooks/useMonthSelector';
import styles from './MonthSelector.module.css';

type MonthSelectorProps = {
  selectedMonth: Date;
  minDate?: string;
  onMonthChange: (selectedMonth: Date) => void;
};

export function MonthSelector({
  selectedMonth,
  minDate,
  onMonthChange,
}: MonthSelectorProps) {
  const {
    goToPreviousMonth,
    goToNextMonth,
    isPrevMonthDisabled,
    isNextMonthDisabled,
  } = useMonthSelector({ selectedMonth, onMonthChange, minDate });

  return (
    <header className={styles.monthHeader}>
      <IconButton
        label="Previous Month"
        icon={<FontAwesomeIcon icon={faChevronLeft} />}
        onClick={goToPreviousMonth}
        disabled={isPrevMonthDisabled}
      />
      <h2>{formatMonth(selectedMonth)}</h2>
      <IconButton
        label="Next Month"
        icon={<FontAwesomeIcon icon={faChevronRight} />}
        onClick={goToNextMonth}
        disabled={isNextMonthDisabled}
      />
    </header>
  );
}
