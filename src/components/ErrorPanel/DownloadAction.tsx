'use client';

import { useTranslation } from 'react-i18next';
import type { DownloadName, DownloadProgress } from '@/lib/ai';
import styles from './ErrorPanel.module.css';

interface DownloadActionProps {
    items: DownloadName[];
    progress: DownloadProgress;
    isDownloading: boolean;
    onDownload: () => void;
}

export function DownloadAction({ items, progress, isDownloading, onDownload }: DownloadActionProps) {
    const { t } = useTranslation();

    const statusLabel = (fraction: number | undefined) => {
        if (fraction === undefined) {
            return isDownloading ? t('errorPanel.downloadStatus.starting') : t('errorPanel.downloadStatus.pending');
        }
        const percent = Math.round(fraction * 100);
        return percent >= 100 ? t('errorPanel.downloadStatus.done') : `${percent}%`;
    };

    return (
        <div className={styles.issueAction}>
            <ul className={styles.downloadList}>
                {items.map((name) => (
                    <li key={name}>
                        <div className={styles.downloadLabel}>
                            <span>{t(`downloads.${name}`)}</span>
                            <span className={styles.downloadPercent}>{statusLabel(progress[name])}</span>
                        </div>
                        <div className={styles.progress}>
                            <div
                                className={styles.progressBar}
                                style={{ width: `${Math.round((progress[name] ?? 0) * 100)}%` }}
                            />
                        </div>
                    </li>
                ))}
            </ul>

            {/* onDownload runs synchronously inside the click so Chrome sees the user gesture */}
            <button type="button" className={styles.primaryButton} disabled={isDownloading} onClick={onDownload}>
                {isDownloading ? t('errorPanel.downloading') : t('errorPanel.downloadModels')}
            </button>
        </div>
    );
}
