import type { DownloadName, HistoryMessage, Issue, Language, ProgressCallback } from './types';

const MODEL_OPTIONS: LanguageModelCreateCoreOptions = {
    expectedInputs: [
        { type: 'text', languages: ['en'] },
        { type: 'audio' },
        { type: 'image' },
    ],
    expectedOutputs: [{ type: 'text', languages: ['en'] }],
};

const TEXT_ONLY_MODEL_OPTIONS: LanguageModelCreateCoreOptions = {
    expectedInputs: [{ type: 'text', languages: ['en'] }],
    expectedOutputs: [{ type: 'text', languages: ['en'] }],
};

const SYSTEM_PROMPT = `You are a helpful AI assistant that responds clearly and objectively.
Use Markdown (headings, lists, bold, code blocks, tables) when it makes the answer easier to read.
Take the whole conversation into account when answering.`;

const needsDownload = (availability: string | null) =>
    availability === 'downloadable' || availability === 'downloading';

export class AIService {
    private current: { conversationId: string; session: LanguageModelSession } | null = null;
    private abortController: AbortController | null = null;

    /**
     * Returns the issues that prevent the app from running in the given language.
     * Translation APIs are only required for Portuguese. An empty list means ready.
     */
    async checkRequirements(language: Language): Promise<Issue[]> {
        const issues: Issue[] = [];
        const needsTranslation = language === 'pt';

        if (!('chrome' in window)) issues.push({ code: 'browser' });
        if (!('LanguageModel' in self)) issues.push({ code: 'prompt-api' });
        if (needsTranslation && !('Translator' in self)) issues.push({ code: 'translator-api' });
        if (needsTranslation && !('LanguageDetector' in self)) issues.push({ code: 'detector-api' });

        if (issues.length > 0) {
            return issues;
        }

        const [modelAvailability, translatorAvailability, detectorAvailability] = await Promise.all([
            LanguageModel.availability(MODEL_OPTIONS),
            needsTranslation ? Translator.availability({ sourceLanguage: 'en', targetLanguage: 'pt' }) : null,
            needsTranslation ? LanguageDetector.availability() : null,
        ]);
        console.log('Availability:', { modelAvailability, translatorAvailability, detectorAvailability });

        if (modelAvailability === 'unavailable') {
            const textOnlyAvailability = await LanguageModel.availability(TEXT_ONLY_MODEL_OPTIONS);
            issues.push({ code: textOnlyAvailability === 'unavailable' ? 'device-unsupported' : 'multimodal-unavailable' });
        }

        if (translatorAvailability === 'unavailable' || translatorAvailability === 'no') {
            issues.push({ code: 'translator-unavailable' });
        }

        const pendingDownloads: DownloadName[] = [];
        if (needsDownload(modelAvailability)) pendingDownloads.push('model');
        if (needsDownload(translatorAvailability)) pendingDownloads.push('translator');
        if (needsDownload(detectorAvailability)) pendingDownloads.push('detector');

        // Only offer the download when nothing else is blocking
        if (pendingDownloads.length > 0 && issues.length === 0) {
            issues.push({ code: 'download-required', items: pendingDownloads });
        }

        return issues;
    }

    /**
     * Downloads the language model. Must be called from a user gesture (click),
     * before any await, otherwise Chrome rejects it with NotAllowedError.
     */
    async downloadModel(onProgress?: ProgressCallback): Promise<void> {
        const session = await LanguageModel.create({
            ...MODEL_OPTIONS,
            monitor(m) {
                m.addEventListener('downloadprogress', (e) => onProgress?.('model', e.loaded / (e.total || 1)));
            },
        });
        session.destroy();
    }

    /**
     * Returns the model session for a conversation. The session keeps the conversation
     * context by itself; when it doesn't exist (another conversation was active, the page
     * was reloaded...) it is recreated from the saved history.
     */
    private async getSession(conversationId: string, history: HistoryMessage[]): Promise<LanguageModelSession> {
        if (this.current?.conversationId === conversationId) {
            return this.current.session;
        }

        // Keep a single session alive to save memory
        this.current?.session.destroy();
        this.current = null;

        const session = await LanguageModel.create({
            ...MODEL_OPTIONS,
            initialPrompts: [
                { role: 'system', content: [{ type: 'text', value: SYSTEM_PROMPT }] },
                ...history
                    .filter((message) => message.content.trim())
                    .map((message): LanguageModelMessage => ({ role: message.role, content: message.content })),
            ],
        });

        this.current = { conversationId, session };
        return session;
    }

    /**
     * Sends a question within a conversation and streams the answer.
     * `history` holds the conversation's previous messages (used only to rebuild the session).
     */
    async *prompt(
        conversationId: string,
        history: HistoryMessage[],
        question: string,
        file: File | null = null,
    ): AsyncGenerator<string> {
        this.abortController?.abort();
        this.abortController = new AbortController();
        const signal = this.abortController.signal;

        const session = await this.getSession(conversationId, history);

        // Build content array with text and optional file
        const content: LanguageModelMessageContent[] = [{ type: 'text', value: question }];

        if (file) {
            const fileType = file.type.split('/')[0];
            if (fileType === 'image' || fileType === 'audio') {
                const blob = new Blob([await file.arrayBuffer()], { type: file.type });
                content.push({ type: fileType, value: blob });
                console.log(`Adding ${fileType} to prompt:`, file.name);
            }
        }

        let completed = false;
        try {
            for await (const chunk of session.promptStreaming([{ role: 'user', content }], { signal })) {
                if (signal.aborted) {
                    break;
                }
                yield chunk;
            }
            completed = !signal.aborted;
        } finally {
            // An interrupted or failed answer may leave the session out of sync with the
            // saved history, so it gets rebuilt from the history on the next question
            if (!completed) {
                this.forget(conversationId);
            }
        }
    }

    /** Discards the model session of a conversation (e.g. when it's deleted). */
    forget(conversationId: string): void {
        if (this.current?.conversationId === conversationId) {
            this.current.session.destroy();
            this.current = null;
        }
    }

    abort(): void {
        this.abortController?.abort();
    }

    isAborted(): boolean {
        return this.abortController?.signal.aborted ?? false;
    }
}
