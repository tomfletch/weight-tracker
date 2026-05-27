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
import {
  downloadCSV,
  exportWeightRecordsAsCSV,
  generateWeightCSVFilename,
} from '~/utils/csvExport';
import styles from '../DataActionButton.module.css';

export function ExportWeightsCsvButton() {
  const { weightRecords } = useAppWeight();

  const [csvExportStatus, setCsvExportStatus] = useState<ActionStatus | null>(
    null,
  );

  const handleExportWeightsCSV = useCallback(() => {
    try {
      if (weightRecords.length === 0) {
        setCsvExportStatus({
          type: 'error',
          message: 'No weight records to export.',
        });
        return;
      }

      const csvContent = exportWeightRecordsAsCSV(weightRecords);
      const filename = generateWeightCSVFilename(new Date());
      downloadCSV(csvContent, filename);

      setCsvExportStatus({
        type: 'success',
        message: `Exported ${weightRecords.length} weight record(s).`,
      });
    } catch (error) {
      setCsvExportStatus({
        type: 'error',
        message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }, [weightRecords]);

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
