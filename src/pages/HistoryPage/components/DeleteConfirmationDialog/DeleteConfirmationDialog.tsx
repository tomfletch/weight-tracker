import { useRef } from 'react';
import { Dialog } from '~/components/Dialog/Dialog';
import { useAppWeight } from '~/hooks/useAppWeight';
import type { WeightRecord } from '~/types/weight';
import { formatDateStr } from '~/utils/dates';
import { formatWeight } from '~/utils/weights';
import styles from './DeleteConfirmationDialog.module.css';

type DeleteConfirmationDialogProps = {
  record: WeightRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteConfirmationDialog({
  record,
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  const { weightUnit } = useAppWeight();
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Dialog
      isOpen={isOpen}
      title="Delete weight entry?"
      onClose={onClose}
      initialFocusRef={cancelButtonRef}
      actions={
        <>
          <button
            type="button"
            className={`${styles.dialogButton} ${styles.cancelButton}`}
            onClick={onClose}
            ref={cancelButtonRef}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`${styles.dialogButton} ${styles.confirmDeleteButton}`}
            onClick={onConfirm}
          >
            Delete
          </button>
        </>
      }
    >
      {record && (
        <>
          Delete your entry for {formatDateStr(record.date)} (
          {formatWeight(record.weightKgs, weightUnit)})? This cannot be undone.
        </>
      )}
    </Dialog>
  );
}
