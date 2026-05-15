import { useCallback, useState } from 'react';
import type {
  ChartTooltipState,
  OnChartTooltipChange,
} from '~/utils/chart/createTooltip';

export const DEFAULT_CHART_TOOLTIP_STATE: ChartTooltipState = {
  isVisible: false,
  position: {
    left: 0,
    top: 0,
  },
  data: null,
};

function areTooltipLinesEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((line, index) => line === b[index]);
}

function isSameVisibleTooltipState(
  previousState: ChartTooltipState,
  nextState: ChartTooltipState,
): boolean {
  if (!previousState.isVisible || !nextState.isVisible) {
    return false;
  }

  if (
    previousState.position.left !== nextState.position.left ||
    previousState.position.top !== nextState.position.top
  ) {
    return false;
  }

  if (!previousState.data || !nextState.data) {
    return previousState.data === nextState.data;
  }

  return (
    previousState.data.dateLabel === nextState.data.dateLabel &&
    areTooltipLinesEqual(previousState.data.lines, nextState.data.lines)
  );
}

export function useChartTooltipState() {
  const [tooltipState, setTooltipState] = useState<ChartTooltipState>(
    DEFAULT_CHART_TOOLTIP_STATE,
  );

  const onTooltipChange = useCallback<OnChartTooltipChange>((nextState) => {
    setTooltipState((previousState) => {
      if (nextState.isVisible) {
        if (isSameVisibleTooltipState(previousState, nextState)) {
          return previousState;
        }
        return nextState;
      }

      if (!previousState.isVisible) {
        return previousState;
      }

      // Keep the previous anchor/content while fading out to avoid a visual jump.
      return {
        ...previousState,
        isVisible: false,
      };
    });
  }, []);

  return [tooltipState, onTooltipChange] as const;
}
