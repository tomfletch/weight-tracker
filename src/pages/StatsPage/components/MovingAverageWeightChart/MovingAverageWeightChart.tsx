import type { ChartData, ChartOptions } from 'chart.js';
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
  getMovingAverageWeightChartData,
  getMovingAverageWeightChartOptions,
} from './chartData';
import styles from './MovingAverageWeightChart.module.css';

export function MovingAverageWeightChart() {
  const { weightRecords, weightTargetKgs, weightUnit } = useAppWeight();
  const { accentColour } = useAppTheme();
  const [movingAveragePeriod, setMovingAveragePeriod] = useState<
    7 | 14 | 21 | 28
  >(7);
  const [tooltipState, setTooltipState] = useChartTooltipState();

  if (weightRecords.length === 0) {
    return <div>Not enough data</div>;
  }

  const chartData: ChartData<'line'> = getMovingAverageWeightChartData({
    weightRecords,
    weightTargetKgs,
    weightUnit,
    accentColour,
    movingAverageSize: movingAveragePeriod,
  });

  const chartOptions: ChartOptions<'line'> = getMovingAverageWeightChartOptions(
    weightUnit,
    undefined,
    setTooltipState,
  );

  return (
    <Card>
      <div className={styles.chartHeader}>
        <Card.Title>
          Weight Trend ({movingAveragePeriod} Day Average)
        </Card.Title>
        <ToggleGroup
          label="Select moving average period"
          value={movingAveragePeriod.toString()}
          onValueChange={(val) =>
            setMovingAveragePeriod(parseInt(val, 10) as 7 | 14 | 21 | 28)
          }
        >
          <ToggleGroup.Item value="7">7D</ToggleGroup.Item>
          <ToggleGroup.Item value="14">14D</ToggleGroup.Item>
          <ToggleGroup.Item value="21">21D</ToggleGroup.Item>
          <ToggleGroup.Item value="28">28D</ToggleGroup.Item>
        </ToggleGroup>
      </div>
      <p className="textLight">
        Shows your weight trend using a {movingAveragePeriod}-day moving
        average, smoothing daily fluctuations.
      </p>
      <div className={styles.chartWrap}>
        <Line
          aria-label="A chart showing moving average weight over time"
          data={chartData}
          options={chartOptions}
        />
        <ChartTooltip tooltipState={tooltipState} />
      </div>
    </Card>
  );
}
