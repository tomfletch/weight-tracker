import 'chartjs-adapter-date-fns';
import { useId, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Card } from '~/components/Card/Card';
import { TabList } from '~/components/TabList/TabList';
import { useAppSettings } from '~/hooks/useAppSettings';
import { useAppWeight } from '~/hooks/useAppWeight';
import {
  CHART_PERIODS,
  type ChartPeriod,
  getWeightChartData,
  getWeightChartDateRange,
  getWeightChartOptions,
} from './chartData';

export function WeightChart() {
  const weightChartId = useId();
  const { weightRecords, weightTargetKgs, weightUnit } = useAppWeight();
  const { accentColour } = useAppSettings();
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
      <TabList>
        {CHART_PERIODS.map((period) => (
          <TabList.Tab
            key={period.key}
            isActive={period.key === selectedPeriod.key}
            onSelect={() => setSelectedPeriod(period)}
            controls={weightChartId}
          >
            {period.label}
          </TabList.Tab>
        ))}
      </TabList>
      <Line
        id={weightChartId}
        aria-label="A chart showing weight data over time"
        data={chartData}
        options={chartOptions}
      />
    </Card>
  );
}
