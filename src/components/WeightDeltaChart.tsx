import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import WeightContext, { WeightUnit } from '../context/WeightContext';
import { useContext } from 'react';
import { convertKgsToLbs, formatKgs, formatLbs } from '../utils/weights';

ChartJS.register(...registerables);


function getDateDiff(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

function WeightDeltaChart() {
  const { weightRecords, weightUnit } = useContext(WeightContext);

  if (weightRecords.length === 0) {
    return <div>Not enough data</div>
  }

  const deltaDates: string[] = [];
  const deltaWeights: number[] = [];

  for (const weightRecord of weightRecords) {
    const prevWeekDate = getDateDiff(weightRecord.date, -7);
    const prevWeekRecord = weightRecords.find((w) => w.date === prevWeekDate);

    if (prevWeekRecord && weightRecord.weightKgs && prevWeekRecord.weightKgs) {
      const delta = weightRecord.weightKgs - prevWeekRecord.weightKgs;
      deltaDates.push(weightRecord.date);

      if (weightUnit === WeightUnit.LBS || weightUnit === WeightUnit.STONES_LBS) {
        deltaWeights.push(convertKgsToLbs(delta));
      } else {
        deltaWeights.push(delta);
      }
    }
  }

  return (
    <Line
      data={{
        labels: deltaDates,
        datasets: [
          {
            label: 'Weight',
            data: deltaWeights,
            borderColor: 'rgb(0,200,255)',
            borderWidth: 1,
            backgroundColor: 'rgb(0,200,255)',
          },
        ],
      }}
      options={{
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value: number | string): string => {
                if (typeof value === 'number') {
                  if (weightUnit === WeightUnit.KGS) {
                    return formatKgs(value, 0);
                  }
                  if (weightUnit === WeightUnit.LBS || weightUnit === WeightUnit.STONES_LBS) {
                    return formatLbs(value, 0);
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

export default WeightDeltaChart;