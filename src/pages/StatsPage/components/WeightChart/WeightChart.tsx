import 'chartjs-adapter-date-fns';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useAppSettings } from '../../../../hooks/useAppSettings';
import { useAppWeight } from '../../../../hooks/useAppWeight';
import {
  CHART_PERIODS,
  type ChartPeriod,
  getWeightChartData,
  getWeightChartDateRange,
  getWeightChartOptions,
} from './chartData';
import styles from './WeightChart.module.css';

export function WeightChart() {
  const { weightRecords, weightTargetKgs, weightUnit } = useAppWeight();
  const { accentColour } = useAppSettings();
  const [period, setPeriod] = useState<ChartPeriod>(CHART_PERIODS[0]);

  if (weightRecords.length === 0) {
    return <div>Not enough data</div>;
  }

  const dateRange = getWeightChartDateRange({
    weightRecords,
    periodKey: period.key,
  });

  const chartData = getWeightChartData({
    weightRecords,
    weightTargetKgs,
    weightUnit,
    accentColour,
    dateRange,
  });

  const chartOptions = getWeightChartOptions(weightUnit, dateRange);

  return (
    <div className="card">
      <div className={styles.tabs}>
        {CHART_PERIODS.map((p) => (
          <button
            key={p.key}
            type="button"
            className={`${styles.tab} ${p.key === period.key ? styles.active : ''}`}
            onClick={() => setPeriod(p)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}
