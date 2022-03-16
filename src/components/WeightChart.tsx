import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import WeightContext from '../context/WeightContext';
import { useContext } from 'react';

ChartJS.register(...registerables);


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
        }
      }}
    />
  );
}

export default WeightChart;