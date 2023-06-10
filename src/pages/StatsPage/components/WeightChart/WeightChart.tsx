import { Line } from 'react-chartjs-2';
import { Chart, TooltipItem } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useContext, useState } from 'react';
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
import styles from './WeightChart.module.css';

// const PERIODS = ['ALL', '1Y', '3M', '1M'];
const PERIODS = [
  { key: 'ALL', label: 'All Time' },
  { key: '1Y', label: '1 Year' },
  { key: '3M', label: '3 Months' },
  { key: '1M', label: '1 Month' },
];

function insertDate(newDate: string, dates: string[]) {
  let newIndex = 0;
  while (newIndex < dates.length && dates[newIndex] < newDate) {
    newIndex++;
  }

  if (newDate !== dates[newIndex]) {
    dates.splice(newIndex, 0, newDate);
  }
}

function WeightChart() {
  const { weightRecords, weightTargetKgs, weightUnit } = useContext(WeightContext);
  const { accentColour } = useContext(SettingsContext);
  const [period, setPeriod] = useState<typeof PERIODS[0]>(PERIODS[0]);

  if (weightRecords.length === 0) {
    return <div>Not enough data</div>;
  }

  const dates = weightRecords.map((weightRecord) => weightRecord.date);

  const endDate = new Date();
  const endDateStr = toISODate(endDate);

  const startDateALL = new Date(dates[0]);

  const startDate1Y = new Date();
  startDate1Y.setFullYear(endDate.getFullYear() - 1);

  const startDate3M = new Date();
  startDate3M.setMonth(endDate.getMonth() - 3);

  const startDate1M = new Date();
  startDate1M.setMonth(endDate.getMonth() - 1);

  let startDate = startDateALL;

  if (period.key === '1Y') {
    startDate = startDate1Y;
  } else if (period.key === '3M') {
    startDate = startDate3M;
  } else if (period.key === '1M') {
    startDate = startDate1M;
  }

  const startDateStr = toISODate(startDate);

  insertDate(toISODate(startDateALL), dates);
  insertDate(toISODate(startDate1Y), dates);
  insertDate(toISODate(startDate3M), dates);
  insertDate(toISODate(startDate1M), dates);
  insertDate(endDateStr, dates);

  let weights = dates.map((date) => {
    const weightRecord = weightRecords.find((wr) => wr.date === date);
    return weightRecord?.weightKgs || null;
  });
  let targetWeights = dates.map((d, index) => {
    if (d === startDateStr || d === endDateStr) {
      return weightTargetKgs;
    }
    return null;
  });

  // const firstDate = new Date(dates[0]).getTime() / 1000;

  // const days = dates.map((d) => (new Date(d).getTime() / 1000 - firstDate) / DAY_SECONDS);

  // let sumX = 0;
  // let sumY = 0;
  // let sumXX = 0;
  // let sumXY = 0;

  // const N = days.length;

  // for (let i = 0; i < N; i++) {
  //   const x = days[i];
  //   const y = weights[i];

  //   sumX += x;
  //   sumY += y;
  //   sumXX += x * x;
  //   sumXY += x * y;
  // }

  // const m = (N * sumXY - sumX*sumY) / (N * sumXX - sumX*sumX);
  // const b = (sumY - m * sumX) / N;

  // let regressionWeightStart = b;
  // let regressionWeightEnd = m*days[N-1] + b;

  if (weightUnit !== WeightUnit.KGS) {
    weights = weights.map((weightKg) => weightKg && Math.round(convertKgToLb(weightKg) * 10) / 10);
    targetWeights = targetWeights.map((weightKg) => weightKg && Math.round(convertKgToLb(weightKg) * 10) / 10);

    // regressionWeightStart = convertKgToLb(regressionWeightStart);
    // regressionWeightEnd = convertKgToLb(regressionWeightEnd);
  }

  // const regressionWeights = new Array(N).fill(undefined);
  // regressionWeights[0] = regressionWeightStart;
  // regressionWeights[N-1] = regressionWeightEnd;

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Weight',
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
        animation: false,
      },
      // {
      //   label: 'Line of Best Fit',
      //   data: regressionWeights,
      //   borderColor: 'rgba(255, 0, 0, 0.8)',
      //   borderWidth: 1,
      //   borderDash: [3,3],
      //   pointRadius: 0,
      // },
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
        min: toISODate(startDate),
        max: endDateStr,
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
      <div className={styles.tabs}>
        {PERIODS.map((p) => (
          <button
            type="button"
            className={`${styles.tab} ${p.key === period.key ? styles.active : ''}`}
            onClick={() => setPeriod(p)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <Line
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
}

export default WeightChart;
