import 'chartjs-adapter-date-fns';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Card } from '~/components/Card/Card';
import { ToggleGroup } from '~/components/ToggleGroup/ToggleGroup';
import { useAppTheme } from '~/hooks/useAppTheme';
import { useAppWeight } from '~/hooks/useAppWeight';
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
  const { accentColour } = useAppTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod>(
    CHART_PERIODS[0],
  );

  if (weightRecords.length === 0) {
    return <div>Not enough data</div>;
  }

  const dateRange = getWeightChartDateRange({
    weightRecords,
    periodKey: selectedPeriod.key,
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
    <Card>
      <div className={styles.header}>
        <h2>Your Progress</h2>
        <ToggleGroup
          value={selectedPeriod.key}
          onValueChange={(value) => {
            const newPeriod = CHART_PERIODS.find((p) => p.key === value);
            if (newPeriod) {
              setSelectedPeriod(newPeriod);
            }
          }}
        >
          {CHART_PERIODS.map((period) => (
            <ToggleGroup.Item
              key={period.key}
              value={period.key}
              aria-label={period.longLabel}
            >
              {period.label}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup>
      </div>
      <Line
        aria-label="A chart showing weight data over time"
        data={chartData}
        options={chartOptions}
      />
    </Card>
  );
}
