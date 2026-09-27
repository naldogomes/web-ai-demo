'use client';

import { useTranslation } from 'react-i18next';
import type { Language } from '@/lib/ai';
import styles from './LanguageSelector.module.css';

// Each language is shown in its own name, whatever the current interface language
const OPTIONS: { value: Language; label: string }[] = [
    { value: 'pt', label: 'Português' },
    { value: 'en', label: 'English' },
];

interface LanguageSelectorProps {
    value: Language;
    onChange: (language: Language) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
    const { t } = useTranslation();

    return (
        <fieldset className={styles.panel}>
            <legend className={styles.title}>{t('sidebar.language')}</legend>
            <div className={styles.options}>
                {OPTIONS.map((option) => (
                    <label key={option.value} className={styles.option}>
                        <input
                            type="radio"
                            name="language"
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => onChange(option.value)}
                            className={styles.radio}
                        />
                        <span className={styles.optionLabel} lang={option.value}>{option.label}</span>
                    </label>
                ))}
            </div>
        </fieldset>
    );
}
