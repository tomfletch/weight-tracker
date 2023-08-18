import StatsHeader from './components/StatsHeader/StatsHeader';
import AddWeight from './components/AddWeight/AddWeight';
import ProgressBar from './components/ProgressBar/ProgressBar';
import WeightChart from './components/WeightChart/WeightChart';
import StatsBar from './components/StatsBar/StatsBar';
import MovingAverageWeightChart from './components/MovingAverageWeightChart/MovingAverageWeightChart';
import MovingAverageDeltaChart from './components/MovingAverageDeltaChart/MovingAverageDeltaChart';
import { useWeightContext } from '../../context/WeightContext';

function StatsPage() {
  const { weightRecords } = useWeightContext();

  return (
    <>
      <StatsHeader />
      <div className="pageContainer">
        <AddWeight />
        {weightRecords.length !== 0 && (
          <>
            <ProgressBar />
            <WeightChart />
            <StatsBar />
            <MovingAverageWeightChart />
            <MovingAverageDeltaChart />
          </>
        )}
      </div>
    </>
  );
}

export default StatsPage;
