import StatsHeader from './components/StatsHeader/StatsHeader';
import AddWeight from './components/AddWeight/AddWeight';
import ProgressBar from './components/ProgressBar/ProgressBar';
import WeightChart from './components/WeightChart/WeightChart';
import StatsBar from './components/StatsBar/StatsBar';
import MovingAverageWeightChart from './components/MovingAverageWeightChart/MovingAverageWeightChart';

function StatsPage() {
  return (
    <>
      <StatsHeader />
      <div className="pageContainer">
        <AddWeight />
        <ProgressBar />
        <WeightChart />
        <StatsBar />
        <MovingAverageWeightChart />
      </div>
    </>
  );
}

export default StatsPage;
