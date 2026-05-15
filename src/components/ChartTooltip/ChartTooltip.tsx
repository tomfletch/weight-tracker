import type { ChartTooltipState } from '~/utils/chart/createTooltip';
import styles from './ChartTooltip.module.css';

interface ChartTooltipProps {
  tooltipState: ChartTooltipState;
}

export function ChartTooltip({ tooltipState }: ChartTooltipProps) {
  const tooltipStyle = {
    left: tooltipState.position.left,
    top: tooltipState.position.top,
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
