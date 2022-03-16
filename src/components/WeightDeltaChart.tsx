import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import WeightContext from '../context/WeightContext';
import { useContext } from 'react';

ChartJS.register(...registerables);


function getDateDiff(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

function WeightDeltaChart() {
  const { weightRecords } = useContext(WeightContext);

  const deltaDates: string[] = [];
  const deltaWeights: number[] = [];

  for (const weightRecord of weightRecords) {
    const prevWeekDate = getDateDiff(weightRecord.date, -7);
    const prevWeekRecord = weightRecords.find((w) => w.date === prevWeekDate);

    if (prevWeekRecord && weightRecord.lbs && prevWeekRecord.lbs) {
      const delta = weightRecord.lbs - prevWeekRecord.lbs;
      deltaDates.push(weightRecord.date);
      deltaWeights.push(delta);
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
          y: {
            beginAtZero: true
          }
        }
      }}
    />
  );
}

export default WeightDeltaChart;