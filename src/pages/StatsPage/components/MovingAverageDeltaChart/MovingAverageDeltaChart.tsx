import type { ChartData } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useState } from 'react';
import { Card } from '~/components/Card/Card';
import { LineChartWithTooltip } from '~/components/LineChartWithTooltip/LineChartWithTooltip';
import { ToggleGroup } from '~/components/ToggleGroup/ToggleGroup';
import { useAppTheme } from '~/hooks/useAppTheme';
import { useAppWeight } from '~/hooks/useAppWeight';
import {
  getMovingAverageDeltaChartData,
  getMovingAverageDeltaChartOptions,
} from './chartData';
import styles from './MovingAverageDeltaChart.module.css';

export function MovingAverageDeltaChart() {
  const { weightRecords, weightUnit } = useAppWeight();
  const { accentColour } = useAppTheme();
  const [movingAveragePeriod, setMovingAveragePeriod] = useState<
    7 | 14 | 21 | 28
  >(7);

  if (weightRecords.length === 0) {
    return <div>Not enough data</div>;
  }

  const chartData: ChartData<'line'> = getMovingAverageDeltaChartData({
    weightRecords,
    weightUnit,
    accentColour,
    movingAverageSize: movingAveragePeriod,
  });

  return (
    <Card>
      <div className={styles.chartHeader}>
        <Card.Title>
          Weight Change ({movingAveragePeriod} Day Average)
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
        Shows how your {movingAveragePeriod}-day average weight is changing over
        time.
      </p>
      <LineChartWithTooltip
        ariaLabel="A chart showing change in moving average weight over time"
        data={chartData}
        buildOptions={(onTooltipChange) =>
          getMovingAverageDeltaChartOptions(
            weightUnit,
            undefined,
            onTooltipChange,
          )
        }
      />
    </Card>
  );
}
