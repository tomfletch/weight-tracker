import { useAppWeight } from '../../hooks/useAppWeight';
import { AddWeight } from './components/AddWeight/AddWeight';
import { MovingAverageDeltaChart } from './components/MovingAverageDeltaChart/MovingAverageDeltaChart';
import { MovingAverageWeightChart } from './components/MovingAverageWeightChart/MovingAverageWeightChart';
import { ProgressBar } from './components/ProgressBar/ProgressBar';
import { StatsBar } from './components/StatsBar/StatsBar';
import { StatsHeader } from './components/StatsHeader/StatsHeader';
import { WeightChart } from './components/WeightChart/WeightChart';

export function StatsPage() {
  const { weightRecords } = useAppWeight();

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
