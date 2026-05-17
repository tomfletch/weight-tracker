import { useRef } from 'react';
import { Dialog } from '~/components/Dialog/Dialog';
import { WeightInput } from '~/components/WeightInput/WeightInput';
import type { WeightRecord } from '~/types/weight';
import { formatDateStr } from '~/utils/dates';
import styles from './EditWeightDialog.module.css';

type EditWeightDialogProps = {
  record: WeightRecord | null;
  weightKgs: number | null;
  isOpen: boolean;
  onClose: () => void;
  onWeightChange: (weightKgs: number | null) => void;
  onConfirm: (weightKgs: number) => void;
};

export function EditWeightDialog({
  record,
  weightKgs,
  isOpen,
  onClose,
  onWeightChange,
  onConfirm,
}: EditWeightDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Dialog
      isOpen={isOpen}
      title="Edit weight entry"
      onClose={onClose}
      initialFocusRef={cancelButtonRef}
      actions={
        <>
          <button
            type="button"
            className={styles.dialogButton}
            onClick={onClose}
            ref={cancelButtonRef}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`${styles.dialogButton} ${styles.confirmSaveButton}`}
            disabled={weightKgs === null}
            onClick={() => {
              if (weightKgs !== null) {
                onConfirm(weightKgs);
              }
            }}
          >
            Save
          </button>
        </>
      }
    >
      {record && (
        <div className={styles.body}>
          <p className={styles.dateText}>Date: {formatDateStr(record.date)}</p>
          <div className={styles.field}>
            <WeightInput
              key={record.date}
              weight={weightKgs}
              onChange={onWeightChange}
              label="Weight:"
            />
          </div>
        </div>
      )}
    </Dialog>
  );
}
