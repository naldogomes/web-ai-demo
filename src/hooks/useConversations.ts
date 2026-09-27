'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { conversationStore } from '@/lib/chat/conversationStore';

/** Saved conversations, most recently updated first. */
export function useConversations() {
    const conversations = useSyncExternalStore(
        conversationStore.subscribe,
        conversationStore.getSnapshot,
        conversationStore.getServerSnapshot,
    );

    return useMemo(
        () => [...conversations].sort((a, b) => b.updatedAt - a.updatedAt),
        [conversations],
    );
}
