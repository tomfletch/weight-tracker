import { Card } from '~/components/Card/Card';
import { WeightChangeIcon } from '~/components/WeightChangeIcon/WeightChangeIcon';
import { useAppWeight } from '~/hooks/useAppWeight';
import { daysBetween, parseISODate } from '~/utils/dates';
import { interpolateWeightAtDate } from '~/utils/weightInterpolation';
import { formatWeight } from '~/utils/weights';
import styles from './StatsBar.module.css';

type RateStatsWidgetProps = {
  type: string;
  startDate: Date;
};

export function RateStatsWidget({ type, startDate }: RateStatsWidgetProps) {
  const { weightRecords, weightUnit, weightTargetKgs } = useAppWeight();

  const lastWeightRecord = weightRecords[weightRecords.length - 1];
  const lastWeightDate = parseISODate(lastWeightRecord.date);
  const lastWeight = lastWeightRecord.weightKgs;
  const targetWeightDelta = weightTargetKgs && weightTargetKgs - lastWeight;

  const startWeight = interpolateWeightAtDate(startDate, weightRecords);

  let currentRate = <>Unknown</>;
  let daysUntilTarget = null;

  if (startWeight !== null) {
    const weightDelta = lastWeight - startWeight;
    const daysDelta = daysBetween(startDate, lastWeightDate);

    const kgPerDay = weightDelta / daysDelta;
    const kgPerWeek = kgPerDay * 7;

    const formattedWeight = formatWeight(Math.abs(kgPerWeek), weightUnit);

    if (kgPerWeek === 0) {
      currentRate = <span className={styles.weightchange}>No change</span>;
    } else {
      currentRate = (
        <>
          <span className={styles.weightChange}>
            <WeightChangeIcon
              weightChange={kgPerWeek}
              className={styles.weightChangeIcon}
            />{' '}
            {formattedWeight}
          </span>
          per week
        </>
      );
    }

    if (
      targetWeightDelta &&
      kgPerDay !== 0 &&
      Math.sign(kgPerDay) === Math.sign(targetWeightDelta)
    ) {
      daysUntilTarget = Math.round(targetWeightDelta / kgPerDay);
    }
  }

  return (
    <Card className={styles.statsWidget}>
      <Card.Title>{type} Rate</Card.Title>
      <p>{currentRate}</p>
      {daysUntilTarget && <p>Days until target: {daysUntilTarget}</p>}
    </Card>
  );
}
