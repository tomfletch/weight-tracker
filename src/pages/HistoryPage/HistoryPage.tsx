import { useState } from 'react';
import { Card } from '~/components/Card/Card';
import { useAppWeight } from '~/hooks/useAppWeight';
import { HistoryTable } from './components/HistoryTable/HistoryTable';
import { MonthSelector } from './components/MonthSelector/MonthSelector';
import styles from './HistoryPage.module.css';
import { useMonthWeightRecords } from './hooks/useMonthWeightRecords';

export function HistoryPage() {
  const { weightRecords } = useAppWeight();

  const minDate = weightRecords.length > 0 ? weightRecords[0].date : undefined;

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
  });

  const monthWeightRecords = useMonthWeightRecords(selectedMonth);

  return (
    <div className="pageContainer">
      <header className={styles.header}>
        <h1>History</h1>
        <p className="textLight">Review your past entries and progress.</p>
      </header>
      <Card>
        <MonthSelector
          selectedMonth={selectedMonth}
          minDate={minDate}
          onMonthChange={setSelectedMonth}
        />
        {monthWeightRecords.length === 0 ? (
          <div className={styles.emptyState}>No entries for this month.</div>
        ) : (
          <HistoryTable
            monthWeightRecords={monthWeightRecords}
            allWeightRecords={weightRecords}
          />
        )}
      </Card>
    </div>
  );
}
