'use client';

import { useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useAttachment, type Attachment } from '@/hooks/useAttachment';
import styles from './Composer.module.css';

interface ComposerProps {
    disabled: boolean;
    isGenerating: boolean;
    onSend: (question: string, attachment: Attachment | null) => void;
    onStop: () => void;
}

const isSupportedFile = (file: File) => file.type.startsWith('image/') || file.type.startsWith('audio/');

export function Composer({ disabled, isGenerating, onSend, onStop }: ComposerProps) {
    const { t } = useTranslation();
    const [question, setQuestion] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [fileError, setFileError] = useState(false);
    const { attachment, select, clear } = useAttachment();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const attachFile = (file: File | undefined) => {
        if (!file) return;

        if (!isSupportedFile(file)) {
            setFileError(true);
            setTimeout(() => setFileError(false), 3000);
            return;
        }

        setFileError(false);
        select(file);
    };

    const removeAttachment = () => {
        if (fileInputRef.current) fileInputRef.current.value = '';
        clear();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Escape' && isGenerating) {
            event.preventDefault();
            onStop();
            return;
        }

        // Ignore Enter while an IME (e.g. accents on some keyboards) is composing text
        if (event.key !== 'Enter' || event.nativeEvent.isComposing) {
            return;
        }

        event.preventDefault();

        // Alt+Enter inserts a line break at the cursor
        if (event.altKey) {
            const textarea = event.currentTarget;
            textarea.setRangeText('\n', textarea.selectionStart, textarea.selectionEnd, 'end');
            setQuestion(textarea.value);
            return;
        }

        if (isGenerating || !question.trim()) {
            return;
        }

        onSend(question.trim(), attachment);
        setQuestion('');
        removeAttachment();
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        if (disabled || !event.dataTransfer.types.includes('Files')) return;
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        // Ignore leaving towards a child element of the box
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsDragging(false);
        }
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        if (!disabled) attachFile(event.dataTransfer.files[0]);
    };

    return (
        <div className={styles.composer}>
            <div
                className={`${styles.box} ${isDragging ? styles.dragging : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {isDragging && <div className={styles.dropOverlay}>{t('composer.dropHere')}</div>}

                {attachment && (
                    <div className={styles.attachment}>
                        {attachment.kind === 'image' ? (
                            // Object URLs can't go through next/image optimization
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={attachment.previewUrl} alt="" className={styles.thumbnail} />
                        ) : (
                            <span className={styles.fileIcon} aria-hidden="true">🎧</span>
                        )}
                        <span className={styles.fileName}>{attachment.file.name}</span>
                        <button
                            type="button"
                            className={styles.removeButton}
                            onClick={removeAttachment}
                            aria-label={t('composer.removeAttachment')}
                            title={t('composer.removeAttachment')}
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className={styles.inputRow}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,audio/*"
                        hidden
                        onChange={(event: ChangeEvent<HTMLInputElement>) => attachFile(event.target.files?.[0])}
                    />
                    <button
                        type="button"
                        className={styles.attachButton}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled}
                        aria-label={t('composer.attach')}
                        title={t('composer.attach')}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="m21.4 11.1-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5" />
                        </svg>
                    </button>

                    <textarea
                        id="question"
                        name="question"
                        className={styles.textarea}
                        aria-label={t('composer.inputLabel')}
                        placeholder={t('composer.placeholder')}
                        rows={1}
                        value={question}
                        disabled={disabled}
                        onChange={(event) => setQuestion(event.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </div>

            <p className={`${styles.hint} ${fileError ? styles.hintError : ''}`} aria-live="polite">
                {fileError && t('composer.invalidFile')}
                {!fileError && isGenerating && (
                    <Trans i18nKey="composer.generating" components={{ kbd: <kbd /> }} />
                )}
            </p>
        </div>
    );
}
