'use client';

import { useTranslation } from 'react-i18next';
import type { Conversation } from '@/lib/chat/types';
import styles from './ConversationList.module.css';

interface ConversationListProps {
    conversations: Conversation[];
    activeId: string | null;
    onSelect: (id: string) => void;
    onDelete: (conversation: Conversation) => void;
}

export function ConversationList({ conversations, activeId, onSelect, onDelete }: ConversationListProps) {
    const { t } = useTranslation();

    return (
        <nav className={styles.section} aria-label={t('sidebar.conversations')}>
            <h2 className={styles.heading}>{t('sidebar.conversations')}</h2>

            {conversations.length === 0 ? (
                <p className={styles.empty}>{t('sidebar.noConversations')}</p>
            ) : (
                <ul className={styles.list}>
                    {conversations.map((conversation) => (
                        <li
                            key={conversation.id}
                            className={`${styles.item} ${conversation.id === activeId ? styles.active : ''}`}
                        >
                            <button
                                type="button"
                                className={styles.selectButton}
                                onClick={() => onSelect(conversation.id)}
                                aria-current={conversation.id === activeId ? 'page' : undefined}
                                title={conversation.title}
                            >
                                {conversation.title}
                            </button>
                            <button
                                type="button"
                                className={styles.deleteButton}
                                onClick={() => onDelete(conversation)}
                                aria-label={`${t('sidebar.deleteConversation')}: ${conversation.title}`}
                                title={t('sidebar.deleteConversation')}
                            >
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
}
