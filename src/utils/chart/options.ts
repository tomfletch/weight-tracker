import type { ChartOptions, TooltipItem } from 'chart.js';
import type { WeightUnit } from '~/types/weight';
import { createTooltip } from './createTooltip';
import { formatWeightValueByUnit } from './weightUnits';

export interface BaseChartOptionsInput {
  weightUnit: WeightUnit;
  maxDate?: string;
  minDate?: string;
  yAxisConfig?: {
    beginAtZero?: boolean;
    precision?: number;
  };
}

/**
 * Build a base Chart.js line chart options object with common defaults.
 * Customizations can be provided for x-axis bounds, y-axis behavior, and tooltips.
 */
export function buildBaseLineChartOptions(
  input: BaseChartOptionsInput,
): ChartOptions<'line'> {
  const { weightUnit, maxDate, minDate, yAxisConfig = {} } = input;
  const { beginAtZero = false, precision = 0 } = yAxisConfig;

  const defaultTooltipLabel = (context: TooltipItem<'line'>) => {
    if (context.parsed.y === null) {
      return '';
    }
    return formatWeightValueByUnit(context.parsed.y, weightUnit, 1);
  };

  return {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        filter(tooltipItem: TooltipItem<'line'>) {
          return tooltipItem.datasetIndex === 0;
        },
        position: 'nearest',
        callbacks: {
          label: defaultTooltipLabel,
        },
        external: createTooltip,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: true,
    },
    spanGaps: true,
    clip: false,
    scales: {
      x: {
        type: 'time',
        ...(minDate && { min: minDate }),
        ...(maxDate && { max: maxDate }),
        time: {
          unit: 'day',
        },
      },
      y: {
        beginAtZero,
        grid: {
          color: (line) => (line.tick.value === 0 ? '#d3d3d3' : '#f0f0f0'),
        },
        ticks: {
          precision,
          callback: (value: number | string): string => {
            if (typeof value !== 'number') {
              return '';
            }
            return formatWeightValueByUnit(value, weightUnit, precision);
          },
        },
      },
    },
  };
}
