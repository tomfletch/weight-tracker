import clsx from 'clsx';
import styles from './ActionStatusMessage.module.css';

export type ActionStatus = { type: 'success' | 'error'; message: string };

type ActionStatusMessageProps = {
  status: ActionStatus | null;
  className?: string;
};

export function ActionStatusMessage({
  status,
  className,
}: ActionStatusMessageProps) {
  if (!status) return null;

  return (
    <p
      className={clsx(
        styles.statusMessage,
        status.type === 'error' ? styles.error : styles.success,
        className,
      )}
      role={status.type === 'error' ? 'alert' : 'status'}
    >
      {status.message}
    </p>
  );
}
