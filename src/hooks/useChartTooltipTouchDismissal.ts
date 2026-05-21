import { useEffect } from 'react';
import type { ChartTooltipChangeState } from '~/utils/chart/createTooltip';

export function useChartTooltipTouchDismissal({
  tooltipChangeState,
  chartWrapRef,
  onDismiss,
}: {
  tooltipChangeState: ChartTooltipChangeState;
  chartWrapRef: React.RefObject<HTMLDivElement | null>;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const hideTooltipOnOutsideTouch = (event: TouchEvent) => {
      if (!tooltipChangeState.isVisible) {
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

      onDismiss();
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
  }, [tooltipChangeState.isVisible, chartWrapRef, onDismiss]);
}
