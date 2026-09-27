'use client';

import { useCallback, useState } from 'react';
import { aiService, translationService, describeError, type Language } from '@/lib/ai';
import { appendMessages, getConversation, updateMessage } from '@/lib/chat/conversationStore';
import type { ChatMessage } from '@/lib/chat/types';
import type { Attachment } from './useAttachment';

export function useChat() {
    /** Conversation whose answer is being generated, if any. */
    const [generatingId, setGeneratingId] = useState<string | null>(null);

    const send = useCallback(async (
        conversationId: string,
        question: string,
        attachment: Attachment | null,
        language: Language,
    ) => {
        const history = getConversation(conversationId)?.messages ?? [];

        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: question,
            ...(attachment && attachment.kind !== 'other'
                ? { attachment: { name: attachment.file.name, kind: attachment.kind } }
                : {}),
        };
        const answer: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: '', status: 'streaming' };
        const update = (changes: Partial<ChatMessage>, persist = true) =>
            updateMessage(conversationId, answer.id, changes, { persist });

        appendMessages(conversationId, [userMessage, answer]);
        setGeneratingId(conversationId);

        try {
            let fullResponse = '';
            const stream = aiService.prompt(conversationId, history, question, attachment?.file ?? null);
            for await (const chunk of stream) {
                fullResponse += chunk;
                // Saved only at the end: writing localStorage on every chunk would be wasteful
                update({ content: fullResponse }, false);
            }

            if (aiService.isAborted()) {
                update({ status: 'stopped' });
                return;
            }

            // The model answers in English: translate only when Portuguese is selected
            if (language === 'pt' && fullResponse) {
                update({ status: 'translating' }, false);
                const translation = await translationService.translateToPortuguese(fullResponse);
                update({ translation, status: 'done' });
            } else {
                update({ status: 'done' });
            }
        } catch (error) {
            console.error('Error during AI generation:', error);
            update(aiService.isAborted()
                ? { status: 'stopped' }
                : { status: 'error', error: describeError(error) });
        } finally {
            setGeneratingId(null);
        }
    }, []);

    const stop = useCallback(() => {
        aiService.abort();
    }, []);

    const forget = useCallback((conversationId: string) => {
        aiService.forget(conversationId);
    }, []);

    return { generatingId, send, stop, forget };
}
