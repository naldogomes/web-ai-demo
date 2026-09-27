'use client';

import { Children, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ErrorPanel.module.css';

/**
 * A chrome:// address with a copy button (pages can't link to chrome:// URLs).
 * Used through <Trans> as the <url>…</url> tag, so the address arrives as children.
 */
export function ChromeUrl({ children }: { children?: ReactNode }) {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const url = Children.toArray(children).join('');

    const copy = async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <span className={styles.flag}>
            <code className={styles.flagCode}>{url}</code>
            <button type="button" className={styles.copyButton} onClick={copy}>
                {copied ? t('errorPanel.copied') : t('errorPanel.copy')}
            </button>
        </span>
    );
}
