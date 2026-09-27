'use client';

import { useTranslation } from 'react-i18next';
import { Markdown } from '@/components/Markdown/Markdown';
import type { ChatMessage } from '@/lib/chat/types';
import styles from './ChatView.module.css';

function AttachmentChip({ attachment }: { attachment: NonNullable<ChatMessage['attachment']> }) {
    return (
        <span className={styles.attachmentChip}>
            <span aria-hidden="true">{attachment.kind === 'image' ? '🖼️' : '🎧'}</span>
            {attachment.name}
        </span>
    );
}

function AssistantStatus({ message }: { message: ChatMessage }) {
    const { t } = useTranslation();

    switch (message.status) {
        case 'streaming':
            return message.content ? null : <p className={styles.status}>{t('chat.thinking')}</p>;
        case 'translating':
            return <p className={styles.status}>{t('chat.translating')}</p>;
        case 'stopped':
            return <p className={styles.status}>{t('chat.stopped')}</p>;
        case 'error':
            return <p className={styles.error}>{t('chat.error', { message: message.error ?? '' })}</p>;
        default:
            return null;
    }
}

export function MessageBubble({ message }: { message: ChatMessage }) {
    const { t } = useTranslation();

    if (message.role === 'user') {
        return (
            <div className={`${styles.row} ${styles.userRow}`}>
                <div className={styles.userBubble}>
                    {message.attachment && <AttachmentChip attachment={message.attachment} />}
                    <p className={styles.userText}>{message.content}</p>
                </div>
            </div>
        );
    }

    // While translating, keep showing the original answer until the translation arrives
    const text = message.translation ?? message.content;

    return (
        <div className={`${styles.row} ${styles.assistantRow}`}>
            <div className={styles.avatar} aria-label={t('chat.assistant')}>AI</div>
            <div className={styles.assistantBubble}>
                {text && <Markdown>{text}</Markdown>}
                <AssistantStatus message={message} />
            </div>
        </div>
    );
}
