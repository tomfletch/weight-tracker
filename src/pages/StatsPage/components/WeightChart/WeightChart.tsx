import { Line } from 'react-chartjs-2';
import { Chart, registerables, TooltipItem } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useContext } from 'react';
import WeightContext, { WeightUnit } from '../../../../context/WeightContext';
import {
  convertKgToLb, formatKg, formatLb, formatLbAsStLb,
} from '../../../../utils/weights';
import SettingsContext from '../../../../context/SettingsContext';
import { formatDate, toISODate } from '../../../../utils/dates';

Chart.register(...registerables);

// const DAY_SECONDS = 60 * 60 * 24;

const showLabelPlugin = {
  id: 'showlabel',
  afterDraw(chart: Chart) {
    const { ctx } = chart;

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      if (!dataset.showLabel) {
        return;
      }

      const meta = chart.getDatasetMeta(datasetIndex);
      const point = meta.data[0];
      ctx.fillStyle = 'red';

      if (point.y > 30) {
        ctx.textBaseline = 'bottom';
        ctx.fillText('Target', point.x + 2, point.y - 2);
      } else {
        ctx.textBaseline = 'top';
        ctx.fillText('Target', point.x + 2, point.y + 2);
      }
    });
  },
};

Chart.register(showLabelPlugin);


function WeightChart() {
  const { weightRecords, weightTargetKgs, weightUnit } = useContext(WeightContext);
  const { accentColour } = useContext(SettingsContext);
  const today = toISODate(new Date());


  if (weightRecords.length === 0) {
    return <div>Not enough data</div>;
  }

  const dates = weightRecords.map((weightRecord) => weightRecord.date);

  if (dates[dates.length - 1] !== today) {
    dates.push(today);
  }

  let weights = weightRecords.map((weightRecord) => weightRecord.weightKgs);
  let targetWeights = dates.map(() => weightTargetKgs);

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
    weights = weights.map((weightKg) => Math.round(convertKgToLb(weightKg) * 10) / 10);
    targetWeights = targetWeights.map((weightKg) => Math.round(convertKgToLb(weightKg) * 10) / 10);

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
        borderColor: 'rgb(255, 0, 0)',
        borderWidth: 1,
        pointRadius: 0,
        hoverRadius: 0,
        hitRadius: 0,
        showLabel: true,
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
            return formatLbAsStLb(context.parsed.y);
          },
        },
        external({ chart }: { chart: Chart}) {
          // Tooltip Element
          let tooltipEl = document.getElementById('chartjsTooltip');

          // Create element on first render
          if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjsTooltip';
            document.body.appendChild(tooltipEl);
          }

          // Hide if no tooltip
          const tooltipModel = chart.tooltip;
          if (!tooltipModel || tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = '0';
            return;
          }

          const date = new Date(chart.tooltip.dataPoints[0].parsed.x);

          // Set Text
          if (tooltipModel.body) {
            const bodyLines = tooltipModel.body.map((bodyItem) => bodyItem.lines);

            let innerHtml = `<div class="date">${formatDate(date)}</div>`;

            bodyLines.forEach((body, i) => {
              innerHtml += `<div>${body}</div>`;
            });

            tooltipEl.innerHTML = innerHtml;
          }

          const position = chart.canvas.getBoundingClientRect();
          // const bodyFont = Chart.helpers.toFont(tooltipModel.options.bodyFont);

          // Display, position, and set styles for font
          tooltipEl.style.opacity = '1';
          tooltipEl.style.position = 'absolute';
          tooltipEl.style.left = `${position.left + window.pageXOffset + tooltipModel.caretX}px`;
          tooltipEl.style.top = `${position.top + window.pageYOffset + tooltipModel.caretY}px`;
          // tooltipEl.style.font = bodyFont.string;
          // tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
          tooltipEl.style.pointerEvents = 'none';
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: true,
    },
    spanGaps: true,
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

export default WeightChart;
