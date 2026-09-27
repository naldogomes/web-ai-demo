import { createPersistentStore } from '@/lib/storage/persistentStore';
import type { ChatMessage, Conversation } from './types';

const STORAGE_KEY = 'webai.conversations';
const TITLE_MAX_LENGTH = 48;
const NO_CONVERSATIONS: Conversation[] = [];

/** Answers that were still being generated when the page closed are marked as stopped. */
const parseConversations = (raw: unknown): Conversation[] => {
    if (!Array.isArray(raw)) return [];

    return (raw as Conversation[]).map((conversation) => ({
        ...conversation,
        messages: conversation.messages.map((message) =>
            message.status === 'streaming' || message.status === 'translating'
                ? { ...message, status: 'stopped' }
                : message,
        ),
    }));
};

export const conversationStore = createPersistentStore(STORAGE_KEY, parseConversations, NO_CONVERSATIONS);

const titleFrom = (question: string) => {
    const singleLine = question.trim().replace(/\s+/g, ' ');
    return singleLine.length > TITLE_MAX_LENGTH ? `${singleLine.slice(0, TITLE_MAX_LENGTH)}…` : singleLine;
};

export function getConversation(id: string): Conversation | undefined {
    return conversationStore.getSnapshot().find((conversation) => conversation.id === id);
}

export function createConversation(firstQuestion: string): string {
    const now = Date.now();
    const conversation: Conversation = {
        id: crypto.randomUUID(),
        title: titleFrom(firstQuestion),
        createdAt: now,
        updatedAt: now,
        messages: [],
    };
    conversationStore.set((list) => [conversation, ...list]);
    return conversation.id;
}

export function deleteConversation(id: string): void {
    conversationStore.set((list) => list.filter((conversation) => conversation.id !== id));
}

export function appendMessages(conversationId: string, messages: ChatMessage[]): void {
    conversationStore.set((list) =>
        list.map((conversation) =>
            conversation.id === conversationId
                ? { ...conversation, updatedAt: Date.now(), messages: [...conversation.messages, ...messages] }
                : conversation,
        ),
    );
}

export function updateMessage(
    conversationId: string,
    messageId: string,
    changes: Partial<ChatMessage>,
    options?: { persist?: boolean },
): void {
    conversationStore.set(
        (list) =>
            list.map((conversation) =>
                conversation.id === conversationId
                    ? {
                          ...conversation,
                          messages: conversation.messages.map((message) =>
                              message.id === messageId ? { ...message, ...changes } : message,
                          ),
                      }
                    : conversation,
            ),
        options,
    );
}
