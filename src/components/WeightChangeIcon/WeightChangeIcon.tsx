import {
  faEquals,
  faLongArrowDown,
  faLongArrowUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type WeightChangeIconProps = {
  weightChange: number;
  className?: string;
};

export function WeightChangeIcon({
  weightChange,
  className,
}: WeightChangeIconProps) {
  return (
    <FontAwesomeIcon
      className={className}
      icon={getIcon(weightChange)}
      aria-label={getAriaLabel(weightChange)}
    />
  );
}

function getIcon(weightChange: number) {
  if (weightChange < 0) {
    return faLongArrowDown;
  }

  if (weightChange > 0) {
    return faLongArrowUp;
  }

  return faEquals;
}

function getAriaLabel(weightChange: number) {
  if (weightChange < 0) {
    return 'Weight decreasing';
  }

  if (weightChange > 0) {
    return 'Weight increasing';
  }

  return 'No weight change';
}
