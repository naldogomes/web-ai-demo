'use client';

import { Trans, useTranslation } from 'react-i18next';
import styles from './ErrorPanel.module.css';

const REQUIREMENTS = ['browser', 'os', 'hardware', 'storage', 'internet', 'features'] as const;

export function Requirements() {
    const { t } = useTranslation();

    return (
        <details className={styles.requirements} open>
            <summary className={styles.requirementsSummary}>{t('requirements.summary')}</summary>
            <p className={styles.requirementsIntro}>{t('requirements.intro')}</p>
            <dl className={styles.requirementsGrid}>
                {REQUIREMENTS.map((item) => (
                    <div key={item} className={styles.requirement}>
                        <dt>{t(`requirements.${item}.label`)}</dt>
                        <dd>
                            <Trans i18nKey={`requirements.${item}.description`} components={{ strong: <strong /> }} />
                        </dd>
                    </div>
                ))}
            </dl>
        </details>
    );
}
