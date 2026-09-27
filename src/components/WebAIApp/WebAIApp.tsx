'use client';

import '@/i18n';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAIRequirements } from '@/hooks/useAIRequirements';
import type { Attachment } from '@/hooks/useAttachment';
import { useChat } from '@/hooks/useChat';
import { useConversations } from '@/hooks/useConversations';
import { useLanguage } from '@/hooks/useLanguage';
import { ChatView } from '@/components/ChatView/ChatView';
import { Composer } from '@/components/Composer/Composer';
import { ErrorPanel } from '@/components/ErrorPanel/ErrorPanel';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { createConversation, deleteConversation } from '@/lib/chat/conversationStore';
import type { Conversation } from '@/lib/chat/types';
import styles from './WebAIApp.module.css';

export function WebAIApp() {
    const { t } = useTranslation();
    const { language, setLanguage } = useLanguage();
    const { status, issues, progress, isDownloading, downloadModels } = useAIRequirements(language);
    const conversations = useConversations();
    const { generatingId, send, stop, forget } = useChat();

    // null = a new, still empty conversation
    const [activeId, setActiveId] = useState<string | null>(null);
    const activeConversation = conversations.find((conversation) => conversation.id === activeId);

    const handleSend = (question: string, attachment: Attachment | null) => {
        const conversationId = activeConversation?.id ?? createConversation(question);
        setActiveId(conversationId);
        send(conversationId, question, attachment, language);
    };

    const handleDelete = (conversation: Conversation) => {
        if (!window.confirm(t('sidebar.confirmDelete', { title: conversation.title }))) {
            return;
        }

        if (generatingId === conversation.id) stop();
        forget(conversation.id);
        deleteConversation(conversation.id);
        if (conversation.id === activeId) setActiveId(null);
    };

    return (
        <div className={styles.app}>
            <Sidebar
                conversations={conversations}
                activeId={activeConversation?.id ?? null}
                language={language}
                onNewChat={() => setActiveId(null)}
                onSelect={setActiveId}
                onDelete={handleDelete}
                onLanguageChange={setLanguage}
            />

            <main className={styles.main}>
                {status === 'error' ? (
                    <div className={styles.scrollArea}>
                        <ErrorPanel
                            issues={issues}
                            progress={progress}
                            isDownloading={isDownloading}
                            onDownload={downloadModels}
                        />
                    </div>
                ) : (
                    <>
                        <div className={styles.scrollArea}>
                            <ChatView messages={activeConversation?.messages ?? []} />
                        </div>
                        <div className={styles.composerArea}>
                            <Composer
                                disabled={status !== 'ready'}
                                isGenerating={generatingId !== null}
                                onSend={handleSend}
                                onStop={stop}
                            />
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
