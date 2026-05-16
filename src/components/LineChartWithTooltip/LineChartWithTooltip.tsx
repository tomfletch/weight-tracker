import type { ChartData, ChartOptions } from 'chart.js';
import { useCallback, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { ChartTooltip } from '~/components/ChartTooltip/ChartTooltip';
import { useChartTooltipState } from '~/hooks/useChartTooltipState';
import {
  DEFAULT_CHART_TOOLTIP_STATE,
  type OnChartTooltipChange,
} from '~/utils/chart/createTooltip';
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
  const [tooltipState, onTooltipChange] = useChartTooltipState();
  const chartWrapRef = useRef<HTMLDivElement>(null);
  const ignoreVisibleTooltipUntilRef = useRef(0);

  const onChartTooltipChange = useCallback<OnChartTooltipChange>(
    (nextState) => {
      if (
        nextState.isVisible &&
        Date.now() < ignoreVisibleTooltipUntilRef.current
      ) {
        return;
      }

      onTooltipChange(nextState);
    },
    [onTooltipChange],
  );

  const options = buildOptions(onChartTooltipChange);

  useEffect(() => {
    const hideTooltipOnOutsideTouch = (event: TouchEvent) => {
      if (!tooltipState.isVisible) {
        return;
      }

      const chartWrap = chartWrapRef.current;
      if (!chartWrap) {
        return;
      }

      const targetNode = event.target;
      if (!(targetNode instanceof Node)) {
        return;
      }

      if (chartWrap.contains(targetNode)) {
        return;
      }

      ignoreVisibleTooltipUntilRef.current = Date.now() + 120;
      onTooltipChange(DEFAULT_CHART_TOOLTIP_STATE);
    };

    document.addEventListener('touchstart', hideTooltipOnOutsideTouch, {
      passive: true,
      capture: true,
    });

    return () => {
      document.removeEventListener('touchstart', hideTooltipOnOutsideTouch, {
        capture: true,
      });
    };
  }, [onTooltipChange, tooltipState.isVisible]);

  return (
    <div className={styles.chartWrap} ref={chartWrapRef}>
      <Line aria-label={ariaLabel} data={data} options={options} />
      <ChartTooltip tooltipState={tooltipState} />
    </div>
  );
}
