import type { ChartData, ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ChartTooltip } from '~/components/ChartTooltip/ChartTooltip';
import { useChartTooltipInteraction } from '~/hooks/useChartTooltipState';
import type { OnChartTooltipChange } from '~/utils/chart/createTooltip';
import styles from './LineChartWithTooltip.module.css';

interface LineChartWithTooltipProps {
  ariaLabel: string;
  data: ChartData<'line'>;
  buildOptions: (onTooltipChange: OnChartTooltipChange) => ChartOptions<'line'>;
}

export function LineChartWithTooltip({
  ariaLabel,
  data,
  buildOptions,
}: LineChartWithTooltipProps) {
  const { tooltipState, onTooltipChange, chartWrapRef } =
    useChartTooltipInteraction();

  const options = buildOptions(onTooltipChange);

  return (
    <div className={styles.chartWrap} ref={chartWrapRef}>
      <Line aria-label={ariaLabel} data={data} options={options} />
      <ChartTooltip tooltipState={tooltipState} />
    </div>
  );
}
