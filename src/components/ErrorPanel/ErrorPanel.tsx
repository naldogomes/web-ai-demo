'use client';

import { useTranslation } from 'react-i18next';
import type { DownloadProgress, Issue } from '@/lib/ai';
import { IssueCard } from './IssueCard';
import { Requirements } from './Requirements';
import styles from './ErrorPanel.module.css';

interface ErrorPanelProps {
    issues: Issue[];
    progress: DownloadProgress;
    isDownloading: boolean;
    onDownload: () => void;
}

export function ErrorPanel({ issues, progress, isDownloading, onDownload }: ErrorPanelProps) {
    const { t } = useTranslation();

    return (
        <section className={styles.panel}>
            <header className={styles.header}>
                <div className={styles.icon} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 9v4M12 17h.01" />
                        <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
                    </svg>
                </div>
                <div>
                    <h2 className={styles.title}>{t('errorPanel.title')}</h2>
                    <p className={styles.count}>{t('errorPanel.count', { count: issues.length })}</p>
                </div>
            </header>

            <ol className={styles.issueList}>
                {issues.map((issue, index) => (
                    <IssueCard
                        key={issue.code}
                        issue={issue}
                        number={index + 1}
                        progress={progress}
                        isDownloading={isDownloading}
                        onDownload={onDownload}
                    />
                ))}
            </ol>

            <Requirements />

            <button type="button" className={styles.secondaryButton} onClick={() => location.reload()}>
                {t('errorPanel.reload')}
            </button>
        </section>
    );
}
