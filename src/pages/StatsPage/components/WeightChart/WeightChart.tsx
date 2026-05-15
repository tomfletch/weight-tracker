import 'chartjs-adapter-date-fns';
import { useState } from 'react';
import { Card } from '~/components/Card/Card';
import { LineChartWithTooltip } from '~/components/LineChartWithTooltip/LineChartWithTooltip';
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
      <LineChartWithTooltip
        ariaLabel="A chart showing weight data over time"
        data={chartData}
        buildOptions={(onTooltipChange) =>
          getWeightChartOptions(weightUnit, dateRange, onTooltipChange)
        }
      />
    </Card>
  );
}
