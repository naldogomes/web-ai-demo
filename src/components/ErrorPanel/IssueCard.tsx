'use client';

import { Trans, useTranslation } from 'react-i18next';
import type { DownloadName, DownloadProgress, Issue } from '@/lib/ai';
import { ChromeUrl } from './ChromeUrl';
import { DownloadAction } from './DownloadAction';
import { DOWNLOAD_ISSUES, ISSUE_STEPS } from './issueSteps';
import styles from './ErrorPanel.module.css';

interface IssueCardProps {
    issue: Issue;
    number: number;
    progress: DownloadProgress;
    isDownloading: boolean;
    onDownload: () => void;
}

const ALL_DOWNLOADS: DownloadName[] = ['model', 'translator', 'detector'];

// Tags used inside the translated steps
const STEP_COMPONENTS = { strong: <strong />, url: <ChromeUrl /> };

export function IssueCard({ issue, number, progress, isDownloading, onDownload }: IssueCardProps) {
    const { t } = useTranslation();

    return (
        <li className={styles.issue}>
            <div className={styles.issueHead}>
                <span className={styles.issueNumber}>{number}</span>
                <div>
                    <h3 className={styles.issueTitle}>{t(`issues.${issue.code}.title`)}</h3>
                    <p className={styles.issueDescription}>{t(`issues.${issue.code}.description`)}</p>
                </div>
            </div>

            {issue.detail && <p className={styles.issueDetail}>{issue.detail}</p>}

            <ol className={styles.issueSteps}>
                {ISSUE_STEPS[issue.code].map((step) => (
                    <li key={step}>
                        <Trans i18nKey={`steps.${step}`} components={STEP_COMPONENTS} />
                    </li>
                ))}
            </ol>

            {DOWNLOAD_ISSUES.includes(issue.code) && (
                <DownloadAction
                    items={issue.items ?? ALL_DOWNLOADS}
                    progress={progress}
                    isDownloading={isDownloading}
                    onDownload={onDownload}
                />
            )}
        </li>
    );
}
