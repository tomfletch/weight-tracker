import type { ReactNode, RefObject } from 'react';
import { useEffect, useId, useRef } from 'react';
import styles from './Dialog.module.css';

type DialogProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  actions?: ReactNode;
  initialFocusRef?: RefObject<HTMLElement | null>;
};

export function Dialog({
  isOpen,
  title,
  onClose,
  children,
  actions,
  initialFocusRef,
}: DialogProps) {
  const titleId = useId();

  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    initialFocusRef?.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [initialFocusRef, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <button
        type="button"
        className={styles.backdrop}
        onClick={() => onCloseRef.current()}
        aria-label="Close dialog"
      />
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h3 id={titleId} className={styles.title}>
          {title}
        </h3>
        <div className={styles.body}>{children}</div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  );
}
