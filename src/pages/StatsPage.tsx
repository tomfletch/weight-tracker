import StatsHeader from '../components/StatsHeader';
import AddWeight from '../components/AddWeight';
import ProgressBar from '../components/ProgressBar';
import WeightChart from '../components/WeightChart';

function StatsPage() {
  return (
    <>
      <StatsHeader />
      <div className="pageContainer">
        <AddWeight />
        <ProgressBar />
        <WeightChart />
      </div>
    </>
  );
}

export default StatsPage;
