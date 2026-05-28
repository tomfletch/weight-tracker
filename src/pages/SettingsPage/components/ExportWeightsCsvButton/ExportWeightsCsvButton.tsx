import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { useCallback, useState } from 'react';
import {
  type ActionStatus,
  ActionStatusMessage,
} from '~/components/ActionStatusMessage/ActionStatusMessage';
import { useAppWeight } from '~/hooks/useAppWeight';
import buttonStyles from '~/styles/buttons.module.css';
import { exportAppWeightsAsCSV } from '~/utils/csvExport';
import styles from '../DataActionButton.module.css';

export function ExportWeightsCsvButton() {
  const { weightRecords } = useAppWeight();

  const [csvExportStatus, setCsvExportStatus] = useState<ActionStatus | null>(
    null,
  );

  const handleExportWeightsCSV = useCallback(() => {
    try {
      const count = exportAppWeightsAsCSV();
      setCsvExportStatus({
        type: 'success',
        message: `Exported ${count} weight record(s).`,
      });
    } catch (error) {
      setCsvExportStatus({
        type: 'error',
        message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }, []);

  return (
    <>
      <button
        type="button"
        className={clsx(buttonStyles.button, buttonStyles.neutral)}
        onClick={handleExportWeightsCSV}
        disabled={weightRecords.length === 0}
      >
        <FontAwesomeIcon icon={faDownload} className={styles.icon} />
        Export weights (CSV)
      </button>
      <ActionStatusMessage status={csvExportStatus} />
      {weightRecords.length === 0 && (
        <p className={styles.helpText}>No weight data to export yet.</p>
      )}
    </>
  );
}
