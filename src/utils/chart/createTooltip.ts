import type { TooltipModel } from 'chart.js';
import { formatDate } from '../dates';

export interface ChartTooltipState {
  isVisible: boolean;
  position: {
    left: number;
    top: number;
  };
  data: {
    dateLabel: string;
    lines: string[];
  } | null;
}

export type OnChartTooltipChange = (state: ChartTooltipState) => void;

export const DEFAULT_CHART_TOOLTIP_STATE: ChartTooltipState = {
  isVisible: false,
  position: {
    left: 0,
    top: 0,
  },
  data: null,
};

function getBodyLines(tooltip: TooltipModel<'line'>): string[] {
  if (!tooltip.body) {
    return [];
  }

  return tooltip.body.flatMap((bodyItem) => bodyItem.lines);
}

export function createTooltip(onTooltipChange?: OnChartTooltipChange) {
  const emitTooltipChange = onTooltipChange ?? (() => {});

  return ({ tooltip }: { tooltip: TooltipModel<'line'> }) => {
    const hasNoDataPoints = tooltip.dataPoints.length === 0;

    if (tooltip.opacity === 0 || hasNoDataPoints) {
      emitTooltipChange(DEFAULT_CHART_TOOLTIP_STATE);
      return;
    }

    const parsedX = tooltip.dataPoints[0]?.parsed.x;
    const left = tooltip.caretX;
    const top = tooltip.caretY;

    if (
      typeof parsedX !== 'number' ||
      !Number.isFinite(parsedX) ||
      !Number.isFinite(left) ||
      !Number.isFinite(top)
    ) {
      emitTooltipChange(DEFAULT_CHART_TOOLTIP_STATE);
      return;
    }

    emitTooltipChange({
      isVisible: true,
      position: {
        left,
        top,
      },
      data: {
        dateLabel: formatDate(new Date(parsedX)),
        lines: getBodyLines(tooltip),
      },
    });
  };
}
