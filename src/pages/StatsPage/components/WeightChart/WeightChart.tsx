import 'chartjs-adapter-date-fns';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Card } from '~/components/Card/Card';
import { ChartTooltip } from '~/components/ChartTooltip/ChartTooltip';
import { ToggleGroup } from '~/components/ToggleGroup/ToggleGroup';
import { useAppTheme } from '~/hooks/useAppTheme';
import { useAppWeight } from '~/hooks/useAppWeight';
import { useChartTooltipState } from '~/hooks/useChartTooltipState';
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
  const [tooltipState, setTooltipState] = useChartTooltipState();

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

  const chartOptions = getWeightChartOptions(
    weightUnit,
    dateRange,
    setTooltipState,
  );

  return (
    <Card>
      <div className={styles.header}>
        <h2>Your Progress</h2>
        <ToggleGroup
          label="Select chart period"
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
              label={period.longLabel}
            >
              {period.label}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup>
      </div>
      <div className={styles.chartWrap}>
        <Line
          aria-label="A chart showing weight data over time"
          data={chartData}
          options={chartOptions}
        />
        <ChartTooltip tooltipState={tooltipState} />
      </div>
    </Card>
  );
}
