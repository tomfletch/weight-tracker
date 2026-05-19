import clsx from 'clsx';
import { useRef } from 'react';
import { Dialog } from '~/components/Dialog/Dialog';
import { useAppWeight } from '~/hooks/useAppWeight';
import buttonStyles from '~/styles/buttons.module.css';
import type { WeightRecord } from '~/types/weight';
import { formatDateStr } from '~/utils/dates';
import { formatWeight } from '~/utils/weights';

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
            className={clsx(buttonStyles.button, buttonStyles.neutral)}
            onClick={onClose}
            ref={cancelButtonRef}
          >
            Cancel
          </button>
          <button
            type="button"
            className={clsx(buttonStyles.button, buttonStyles.danger)}
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
