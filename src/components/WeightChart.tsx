import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';
import WeightContext, { WeightUnit } from '../context/WeightContext';
import { useContext } from 'react';
import { convertKgsToLbs, formatKgs, formatLbs, formatLbsAsStsLbs } from '../utils/weights';

Chart.register(...registerables);

// const DAY_SECONDS = 60 * 60 * 24;

const showLabelPlugin = {
  id: 'showlabel',
  afterDraw: function(chart: Chart) {
    const ctx = chart.ctx;

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      if (!dataset.showLabel) {
        return;
      }

      const meta = chart.getDatasetMeta(datasetIndex);
      const point = meta.data[0];
      ctx.fillStyle = 'red';

      if ( point.y > 30) {
        ctx.textBaseline = 'bottom';
        ctx.fillText('Target', point.x + 2, point.y - 2);
      } else {
        ctx.textBaseline = 'top';
        ctx.fillText('Target', point.x + 2, point.y + 2);
      }

    });
  }
};

Chart.register(showLabelPlugin);


function WeightChart() {
  const { weightRecords, weightTargetKgs, weightUnit } = useContext(WeightContext);

  if (weightRecords.length === 0) {
    return <div>Not enough data</div>
  }

  const dates = weightRecords.map((weightRecord) => weightRecord.date);
  let weights = weightRecords.map((weightRecord) => weightRecord.weightKgs);
  let targetWeights = weightRecords.map(() => weightTargetKgs);

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
    weights = weights.map((weightKg) => Math.round(convertKgsToLbs(weightKg) * 10)/10);
    targetWeights = targetWeights.map((weightKg) => Math.round(convertKgsToLbs(weightKg) * 10)/10);

    // regressionWeightStart = convertKgsToLbs(regressionWeightStart);
    // regressionWeightEnd = convertKgsToLbs(regressionWeightEnd);
  }

  // const regressionWeights = new Array(N).fill(undefined);
  // regressionWeights[0] = regressionWeightStart;
  // regressionWeights[N-1] = regressionWeightEnd;

  return (
    <Line
      data={{
        labels: dates,
        datasets: [
          {
            label: 'Weight',
            data: weights,
            borderColor: 'rgb(0,200,255)',
            borderWidth: 1,
            backgroundColor: 'rgb(0,200,255)',
          },
          {
            label: 'Target Weight',
            data: targetWeights,
            borderColor: 'rgb(255, 0, 0)',
            borderWidth: 1,
            pointRadius: 0,
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
      }}
      options={{
        plugins: {
          legend: {
            display: false
          }
        },
        spanGaps: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day'
            }
          },
          y: {
            ticks: {
              callback: (value: number | string): string => {
                if (typeof value === 'number') {
                  if (weightUnit === WeightUnit.KGS) {
                    return formatKgs(value, 0);
                  }
                  if (weightUnit === WeightUnit.LBS) {
                    return formatLbs(value, 0);
                  }
                  if (weightUnit === WeightUnit.STONES_LBS) {
                    return formatLbsAsStsLbs(value, 0);
                  }
                }

                return '';
              }
            }
          }
        }
      }}
    />
  );
}

export default WeightChart;