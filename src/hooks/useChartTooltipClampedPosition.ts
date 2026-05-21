import { useLayoutEffect, useState } from 'react';
import type { ChartTooltipChangeState } from '~/utils/chart/createTooltip';
import { limit } from '~/utils/math';

const TOOLTIP_WIDTH = 120;
const TOOLTIP_HALF_WIDTH = TOOLTIP_WIDTH / 2;
const VIEWPORT_PADDING = 8;
const ARROW_EDGE_PADDING = 10;

const MAX_ARROW_OFFSET = TOOLTIP_HALF_WIDTH - ARROW_EDGE_PADDING;

function getClampedTooltipPosition(
  windowWidth: number,
  parentLeft: number,
  rawLeft: number,
) {
  const minLeft = VIEWPORT_PADDING - parentLeft + TOOLTIP_HALF_WIDTH;
  const maxLeft =
    windowWidth - VIEWPORT_PADDING - parentLeft - TOOLTIP_HALF_WIDTH;

  const clampedLeft = limit(rawLeft, minLeft, maxLeft);

  const arrowOffset = limit(
    rawLeft - clampedLeft,
    -MAX_ARROW_OFFSET,
    MAX_ARROW_OFFSET,
  );

  return { left: clampedLeft, arrowOffset };
}

export function useChartTooltipClampedPosition({
  tooltipChangeState,
  chartWrapRef,
}: {
  tooltipChangeState: ChartTooltipChangeState;
  chartWrapRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [clampedPosition, setClampedPosition] = useState(() => ({
    left: tooltipChangeState.position.left,
    arrowOffset: 0,
  }));

  useLayoutEffect(() => {
    const updateTooltipPosition = () => {
      const parentRect = chartWrapRef.current?.getBoundingClientRect();
      if (!parentRect) {
        return;
      }

      const positionState = getClampedTooltipPosition(
        window.innerWidth,
        parentRect.left,
        tooltipChangeState.position.left,
      );

      setClampedPosition(positionState);
    };

    updateTooltipPosition();

    if (!tooltipChangeState.isVisible) {
      return;
    }

    window.addEventListener('resize', updateTooltipPosition);
    window.addEventListener('scroll', updateTooltipPosition, true);

    return () => {
      window.removeEventListener('resize', updateTooltipPosition);
      window.removeEventListener('scroll', updateTooltipPosition, true);
    };
  }, [
    tooltipChangeState.isVisible,
    tooltipChangeState.position.left,
    chartWrapRef,
  ]);

  return clampedPosition;
}
