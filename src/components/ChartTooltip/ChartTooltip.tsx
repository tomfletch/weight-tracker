import { type CSSProperties, useLayoutEffect, useRef, useState } from 'react';
import type { ChartTooltipState } from '~/utils/chart/createTooltip';
import styles from './ChartTooltip.module.css';

interface ChartTooltipProps {
  tooltipState: ChartTooltipState;
}

const TOOLTIP_WIDTH = 120;
const TOOLTIP_HALF_WIDTH = TOOLTIP_WIDTH / 2;
const VIEWPORT_PADDING = 8;
const ARROW_EDGE_PADDING = 10;

export function ChartTooltip({ tooltipState }: ChartTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [positionState, setPositionState] = useState(() => ({
    left: tooltipState.position.left,
    arrowOffset: 0,
  }));

  useLayoutEffect(() => {
    const updateTooltipPosition = () => {
      const tooltip = tooltipRef.current;
      if (!tooltip) {
        return;
      }

      const offsetParent = tooltip.offsetParent;
      if (!(offsetParent instanceof HTMLElement)) {
        setPositionState({
          left: tooltipState.position.left,
          arrowOffset: 0,
        });
        return;
      }

      const rawLeft = tooltipState.position.left;
      const parentRect = offsetParent.getBoundingClientRect();
      const minLeft = VIEWPORT_PADDING - parentRect.left + TOOLTIP_HALF_WIDTH;
      const maxLeft =
        window.innerWidth -
        VIEWPORT_PADDING -
        parentRect.left -
        TOOLTIP_HALF_WIDTH;

      const clampedLeft = Math.min(Math.max(rawLeft, minLeft), maxLeft);
      const maxArrowOffset = TOOLTIP_HALF_WIDTH - ARROW_EDGE_PADDING;
      const arrowOffset = Math.min(
        Math.max(rawLeft - clampedLeft, -maxArrowOffset),
        maxArrowOffset,
      );

      setPositionState({
        left: clampedLeft,
        arrowOffset,
      });
    };

    updateTooltipPosition();

    if (!tooltipState.isVisible) {
      return;
    }

    window.addEventListener('resize', updateTooltipPosition);
    window.addEventListener('scroll', updateTooltipPosition, true);

    return () => {
      window.removeEventListener('resize', updateTooltipPosition);
      window.removeEventListener('scroll', updateTooltipPosition, true);
    };
  }, [tooltipState.isVisible, tooltipState.position.left]);

  const tooltipStyle: CSSProperties & {
    '--tooltip-arrow-offset': string;
  } = {
    left: positionState.left,
    top: tooltipState.position.top,
    '--tooltip-arrow-offset': `${positionState.arrowOffset}px`,
    opacity: tooltipState.isVisible ? 1 : 0,
  };

  return (
    <div
      ref={tooltipRef}
      className={styles.chartTooltip}
      style={tooltipStyle}
      aria-hidden={!tooltipState.isVisible}
    >
      {tooltipState.data ? (
        <>
          <div className={styles.chartTooltipDate}>
            {tooltipState.data.dateLabel}
          </div>
          {tooltipState.data.lines.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </>
      ) : null}
    </div>
  );
}
