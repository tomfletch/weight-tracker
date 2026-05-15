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

function getBodyLines(tooltip: TooltipModel<'line'>): string[] {
  if (!tooltip.body) {
    return [];
  }

  return tooltip.body.flatMap((bodyItem) => bodyItem.lines);
}

export function createTooltip(onTooltipChange?: OnChartTooltipChange) {
  const emitTooltipChange = onTooltipChange ?? (() => {});

  return ({ tooltip }: { tooltip: TooltipModel<'line'> }) => {
    if (tooltip.opacity === 0) {
      emitTooltipChange({
        isVisible: false,
        position: {
          left: 0,
          top: 0,
        },
        data: null,
      });
      return;
    }

    const parsedX = tooltip.dataPoints[0]?.parsed.x;
    if (typeof parsedX !== 'number') {
      emitTooltipChange({
        isVisible: false,
        position: {
          left: 0,
          top: 0,
        },
        data: null,
      });
      return;
    }

    emitTooltipChange({
      isVisible: true,
      position: {
        left: tooltip.caretX,
        top: tooltip.caretY,
      },
      data: {
        dateLabel: formatDate(new Date(parsedX)),
        lines: getBodyLines(tooltip),
      },
    });
  };
}
