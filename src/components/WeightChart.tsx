import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import 'chartjs-adapter-moment';
import WeightContext from '../context/WeightContext';
import { useContext } from 'react';
import { convertLbsToStLb } from '../utils/weightConversion';

ChartJS.register(...registerables);

function formatTick(value: number | string): string {
  if (typeof value === 'number') {
    return convertLbsToStLb(value, 0);
  }
  return '';
}


function WeightChart() {
  const { weightRecords } = useContext(WeightContext);

  const dates = weightRecords.map((weightRecord) => weightRecord.date);
  const weights = weightRecords.map((weightRecord) => weightRecord.lbs);

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
            ticks: {
              callback: (value) => formatTick(value)
            }
          }
        }
      }}
    />
  );
}

export default WeightChart;