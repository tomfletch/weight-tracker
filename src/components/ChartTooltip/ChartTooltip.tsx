import type { CSSProperties } from 'react';
import type { ChartTooltipState } from '~/hooks/useChartTooltipState';
import styles from './ChartTooltip.module.css';

interface ChartTooltipProps {
  tooltipState: ChartTooltipState;
}

export function ChartTooltip({ tooltipState }: ChartTooltipProps) {
  const tooltipStyle: CSSProperties & {
    '--tooltip-arrow-offset': string;
  } = {
    left: tooltipState.position.left,
    top: tooltipState.position.top,
    '--tooltip-arrow-offset': `${tooltipState.arrowOffset}px`,
    opacity: tooltipState.isVisible ? 1 : 0,
  };

  return (
    <div
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
