import { Line } from 'react-chartjs-2';
import { Chart, TooltipItem } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useContext } from 'react';
import WeightContext, { WeightUnit } from '../../../../context/WeightContext';
import {
  convertKgToLb,
  formatKg,
  formatLb,
  formatLbAsStLb,
} from '../../../../utils/weights';
import SettingsContext from '../../../../context/SettingsContext';
import { formatDate, toISODate } from '../../../../utils/dates';
import { createTooltip } from '../../../../utils/chartjs';

const MOVING_AVERAGE_SIZE = 7;
const MOVING_AVERAGE_OFFSET = (MOVING_AVERAGE_SIZE - 1) / 2;

function MovingAverageWeightChart() {
  const {
    weightRecords,
    getInterpolatedWeight,
    weightTargetKgs,
    weightUnit,
  } = useContext(WeightContext);
  const { accentColour } = useContext(SettingsContext);
  const today = toISODate(new Date());

  const getAverageWeight = (date: Date): number | null => {
    let sumWeight = 0;

    for (let offset = -MOVING_AVERAGE_OFFSET; offset <= MOVING_AVERAGE_OFFSET; offset += 1) {
      const offsetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset);
      const weight = getInterpolatedWeight(offsetDate);
      if (weight === null) return null;
      sumWeight += weight;
    }

    return sumWeight / MOVING_AVERAGE_SIZE;
  };


  if (weightRecords.length === 0) {
    return <div>Not enough data</div>;
  }

  const firstDate = new Date(weightRecords[0].date);
  const lastDate = new Date(weightRecords[weightRecords.length - 1].date);
  const currentDate = new Date(firstDate.getTime());

  const dates = [];
  let weights = [];
  let targetWeights = [];

  while (currentDate <= lastDate) {
    dates.push(toISODate(currentDate));
    targetWeights.push(weightTargetKgs);
    weights.push(getAverageWeight(currentDate));

    currentDate.setDate(currentDate.getDate() + 1);
  }


  if (weightUnit !== WeightUnit.KGS) {
    weights = weights.map((weightKg) => weightKg && Math.round(convertKgToLb(weightKg) * 10) / 10);
    targetWeights = targetWeights.map((weightKg) => Math.round(convertKgToLb(weightKg) * 10) / 10);
  }

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Moving Average Weight',
        data: weights,
        borderColor: accentColour,
        borderWidth: 1,
        backgroundColor: accentColour,
        hitRadius: 500,
      },
      {
        label: 'Target Weight',
        data: targetWeights,
        borderColor: '#e65424',
        borderWidth: 1,
        pointRadius: 0,
        hoverRadius: 0,
        hitRadius: 0,
        showLabel: true,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        filter(tooltipItem: TooltipItem<'line'>) {
          return tooltipItem.datasetIndex === 0;
        },
        position: 'nearest' as const,
        callbacks: {
          label(context: TooltipItem<'line'>) {
            if (weightUnit === WeightUnit.KGS) {
              return formatKg(context.parsed.y);
            }
            if (weightUnit === WeightUnit.LBS) {
              return formatLb(context.parsed.y);
            }
            if (weightUnit === WeightUnit.STONES_LBS) {
              return formatLbAsStLb(context.parsed.y);
            }
            return '';
          },
        },
        external: createTooltip,
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: true,
    },
    spanGaps: true,
    clip: false,
    scales: {
      x: {
        type: 'time' as const,
        max: today,
        time: {
          unit: 'day' as const,
        },
      },
      y: {
        ticks: {
          callback: (value: number | string): string => {
            if (typeof value === 'number') {
              if (weightUnit === WeightUnit.KGS) {
                return formatKg(value, 0);
              }
              if (weightUnit === WeightUnit.LBS) {
                return formatLb(value, 0);
              }
              if (weightUnit === WeightUnit.STONES_LBS) {
                return formatLbAsStLb(value, 0);
              }
            }

            return '';
          },
        },
      },
    },
  };

  return (
    <div className="card">
      <Line
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
}

export default MovingAverageWeightChart;
