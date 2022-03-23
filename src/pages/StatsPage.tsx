import StatsHeader from '../components/StatsHeader';
import AddWeight from '../components/AddWeight';
import ProgressBar from '../components/ProgressBar';
import WeightChart from '../components/WeightChart';
import StatsBar from '../components/StatsBar';

function StatsPage() {
  return (
    <>
      <StatsHeader />
      <div className="pageContainer">
        <AddWeight />
        <ProgressBar />
        <WeightChart />
        <StatsBar />
      </div>
    </>
  );
}

export default StatsPage;
