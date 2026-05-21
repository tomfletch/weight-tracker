import { useCallback, useRef, useState } from 'react';
import {
  type ChartTooltipChangeState,
  DEFAULT_CHART_TOOLTIP_STATE,
  type OnChartTooltipChange,
} from '~/utils/chart/createTooltip';

function areTooltipLinesEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((line, index) => line === b[index]);
}

function isSameTooltipState(
  previousState: ChartTooltipChangeState,
  nextState: ChartTooltipChangeState,
): boolean {
  // If both tooltips are not visible, we consider them the same
  if (!previousState.isVisible && !nextState.isVisible) {
    return true;
  }

  // If visibility changes, they are not the same
  if (previousState.isVisible !== nextState.isVisible) {
    return false;
  }

  return (
    previousState.position.left === nextState.position.left &&
    previousState.position.top === nextState.position.top &&
    previousState.data?.dateLabel === nextState.data?.dateLabel &&
    areTooltipLinesEqual(
      previousState.data?.lines ?? [],
      nextState.data?.lines ?? [],
    )
  );
}

function getNextTooltipChangeState(
  previousState: ChartTooltipChangeState,
  nextState: ChartTooltipChangeState,
): ChartTooltipChangeState {
  // If the tooltip state is the same, return previous state
  if (isSameTooltipState(previousState, nextState)) {
    return previousState;
  }

  // If tooltip is being hidden, preserve previous position
  if (previousState.isVisible && !nextState.isVisible) {
    return {
      ...previousState,
      isVisible: false,
    };
  }

  return nextState;
}

export function useChartTooltipChangeHandler() {
  const [tooltipChangeState, setTooltipChangeState] =
    useState<ChartTooltipChangeState>(DEFAULT_CHART_TOOLTIP_STATE);
  const ignoreVisibleTooltipUntilRef = useRef(0);

  const onTooltipChange = useCallback<OnChartTooltipChange>((nextState) => {
    if (
      nextState.isVisible &&
      Date.now() < ignoreVisibleTooltipUntilRef.current
    ) {
      return;
    }

    setTooltipChangeState((previousState) =>
      getNextTooltipChangeState(previousState, nextState),
    );
  }, []);

  const temporarilyIgnoreTooltipChange = useCallback(() => {
    ignoreVisibleTooltipUntilRef.current = Date.now() + 120;
  }, []);

  return {
    tooltipChangeState,
    onTooltipChange,
    temporarilyIgnoreTooltipChange,
  };
}
