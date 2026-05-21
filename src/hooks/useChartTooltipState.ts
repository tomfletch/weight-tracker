import { useRef } from 'react';
import type { ChartTooltipChangeState } from '~/utils/chart/createTooltip';
import { DEFAULT_CHART_TOOLTIP_STATE } from '~/utils/chart/createTooltip';
import { useChartTooltipChangeHandler } from './useChartTooltipChangeHandler';
import { useChartTooltipClampedPosition } from './useChartTooltipClampedPosition';
import { useChartTooltipTouchDismissal } from './useChartTooltipTouchDismissal';

export type ChartTooltipState = ChartTooltipChangeState & {
  arrowOffset: number;
};

export function useChartTooltipInteraction() {
  const {
    tooltipChangeState,
    onTooltipChange,
    temporarilyIgnoreTooltipChange,
  } = useChartTooltipChangeHandler();

  const chartWrapRef = useRef<HTMLDivElement>(null);

  useChartTooltipTouchDismissal({
    tooltipChangeState,
    chartWrapRef,
    onDismiss: () => {
      temporarilyIgnoreTooltipChange();
      onTooltipChange(DEFAULT_CHART_TOOLTIP_STATE);
    },
  });

  const clampedPosition = useChartTooltipClampedPosition({
    tooltipChangeState,
    chartWrapRef,
  });

  const tooltipState: ChartTooltipState = {
    ...tooltipChangeState,
    position: {
      top: tooltipChangeState.position.top,
      left: clampedPosition.left,
    },
    arrowOffset: clampedPosition.arrowOffset,
  };

  return { tooltipState, onTooltipChange, chartWrapRef };
}
