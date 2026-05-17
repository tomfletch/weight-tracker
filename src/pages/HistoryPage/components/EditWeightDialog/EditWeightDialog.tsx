import { useId, useRef, useState } from 'react';
import { Dialog } from '~/components/Dialog/Dialog';
import { WeightInput } from '~/components/WeightInput/WeightInput';
import type { WeightRecord } from '~/types/weight';
import { formatDateStr } from '~/utils/dates';
import { isValidWeight } from '~/utils/weights';
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
  const errorId = useId();
  const [touched, setTouched] = useState(false);

  const canSave = isValidWeight(weightKgs);
  const showError = touched && !canSave;

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
            onClick={() => {
              if (canSave) {
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
              onChange={(weight) => {
                setTouched(true);
                onWeightChange(weight);
              }}
              label="Weight:"
              isInvalid={showError}
              ariaDescribedby={showError ? errorId : undefined}
            />
          </div>
          {showError && (
            <p className={styles.errorMessage} role="alert" id={errorId}>
              Enter a valid weight to save
            </p>
          )}
        </div>
      )}
    </Dialog>
  );
}
