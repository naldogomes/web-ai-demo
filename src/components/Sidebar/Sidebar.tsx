'use client';

import { useTranslation } from 'react-i18next';
import { ConversationList } from '@/components/ConversationList/ConversationList';
import { LanguageSelector } from '@/components/LanguageSelector/LanguageSelector';
import type { Language } from '@/lib/ai';
import type { Conversation } from '@/lib/chat/types';
import styles from './Sidebar.module.css';

interface SidebarProps {
    conversations: Conversation[];
    activeId: string | null;
    language: Language;
    onNewChat: () => void;
    onSelect: (id: string) => void;
    onDelete: (conversation: Conversation) => void;
    onLanguageChange: (language: Language) => void;
}

export function Sidebar({
    conversations,
    activeId,
    language,
    onNewChat,
    onSelect,
    onDelete,
    onLanguageChange,
}: SidebarProps) {
    const { t } = useTranslation();

    return (
        <aside className={styles.sidebar}>
            <header className={styles.brand}>
                <div className={styles.brandMark} aria-hidden="true">AI</div>
                <div>
                    <h1 className={styles.title}>{t('app.title')}</h1>
                    <p className={styles.subtitle}>{t('app.subtitle')}</p>
                </div>
            </header>

            <button type="button" className={styles.newChatButton} onClick={onNewChat}>
                <span className={styles.plus} aria-hidden="true">＋</span>
                {t('sidebar.newChat')}
            </button>

            <ConversationList
                conversations={conversations}
                activeId={activeId}
                onSelect={onSelect}
                onDelete={onDelete}
            />

            <div className={styles.bottom}>
                <LanguageSelector value={language} onChange={onLanguageChange} />

                <footer className={styles.footer}>
                    <span className={styles.statusDot} aria-hidden="true" />
                    {t('app.footer', { year: new Date().getFullYear() })}
                </footer>
            </div>
        </aside>
    );
}
