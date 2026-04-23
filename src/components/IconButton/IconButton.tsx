import { type ReactNode, useState } from 'react';
import styles from './IconButton.module.css';

type IconButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export function IconButton({
  type = 'button',
  icon,
  label,
  onClick,
  disabled,
  className,
}: IconButtonProps) {
  const [isShowingTooltip, setIsShowingTooltip] = useState(false);

  const showTooltip = () => setIsShowingTooltip(true);
  const hideTooltip = () => setIsShowingTooltip(false);

  return (
    <button
      type={type}
      className={`${styles.iconButton} ${className || ''}`}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {icon}
      <div
        className={`${styles.tooltip} ${isShowingTooltip ? styles.show : ''}`}
      >
        {label}
      </div>
    </button>
  );
}
