'use client';

import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { ChatMessage } from '@/lib/chat/types';
import { MessageBubble } from './MessageBubble';
import styles from './ChatView.module.css';

interface ChatViewProps {
    messages: ChatMessage[];
}

export function ChatView({ messages }: ChatViewProps) {
    const { t } = useTranslation();
    const endRef = useRef<HTMLDivElement>(null);

    // Follow the conversation as messages arrive and the answer streams in
    const lastMessage = messages.at(-1);
    useEffect(() => {
        endRef.current?.scrollIntoView({ block: 'end' });
    }, [messages.length, lastMessage?.content, lastMessage?.status]);

    if (messages.length === 0) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor"
                        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
                    </svg>
                </div>
                <h2 className={styles.emptyTitle}>{t('chat.emptyTitle')}</h2>
                <p className={styles.emptyText}>{t('chat.emptyText')}</p>
            </div>
        );
    }

    return (
        <div className={styles.messages} aria-live="polite">
            {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={endRef} />
        </div>
    );
}
