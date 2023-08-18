import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useSettingsContext } from '../../../../context/SettingsContext';
import { useWeightContext } from '../../../../context/WeightContext';
import { getFirstOfMonth, MONTH_NAMES, toISODate } from '../../../../utils/dates';
import styles from './Calendar.module.css';

function Calendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(() => getFirstOfMonth(today));

  const { weightRecords } = useWeightContext();
  const { accentColour } = useSettingsContext();

  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

  const month = MONTH_NAMES[currentMonth.getMonth()];
  const year = currentMonth.getFullYear();
  const dayOfMonth = (currentMonth.getDay() - 1) % 7;


  const onPrevMonth = () => {
    setCurrentMonth((prevMonth) => new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1));
  };

  const onNextMonth = () => {
    setCurrentMonth((prevMonth) => new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1));
  };

  const dateHasWeightRecord = (date: Date): boolean => {
    const dateStr = toISODate(date);
    const weightRecord = weightRecords.find((w) => w.date === dateStr);
    return weightRecord !== undefined;
  };

  const calendarDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), currentMonth.getDate() - dayOfMonth);

  const calendarRows = [];

  while (calendarDay < nextMonth) {
    const calendarRow = [];

    for (let i = 0; i < 7; i++) {
      const isDayInCurrentMonth = calendarDay.getMonth() === currentMonth.getMonth();

      calendarRow.push(
        <td
          key={toISODate(calendarDay)}
          className={calendarDay <= today ? styles.pastDate : styles.futureDate}
        >
          {isDayInCurrentMonth && (
            <>
              {calendarDay.getDate()}
              <div
                className={styles.dataDot}
                style={{ backgroundColor: dateHasWeightRecord(calendarDay) ? accentColour : 'transparent' }}
              />
            </>
          )}
        </td>,
      );
      calendarDay.setDate(calendarDay.getDate() + 1);
    }

    calendarRows.push(<tr key={toISODate(calendarDay)}>{calendarRow}</tr>);
  }

  return (
    <div className={`card ${styles.calendar}`}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.arrow}
          onClick={onPrevMonth}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <div className={styles.month}>{month} {year}</div>
        <button
          type="button"
          className={styles.arrow}
          onClick={onNextMonth}
          disabled={nextMonth > today}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      <table className={styles.calendarTable}>
        <thead>
          <tr>
            <th>M</th>
            <th>T</th>
            <th>W</th>
            <th>T</th>
            <th>F</th>
            <th>S</th>
            <th>S</th>
          </tr>
        </thead>
        <tbody>
          {calendarRows}
        </tbody>
      </table>
    </div>
  );
}

export default Calendar;
