'use client';

import { useCallback, useEffect, useState } from 'react';
import {
    aiService,
    translationService,
    describeError,
    type DownloadName,
    type DownloadProgress,
    type Issue,
    type Language,
} from '@/lib/ai';

export type AppStatus = 'checking' | 'ready' | 'error';

interface CheckResult {
    language: Language;
    issues: Issue[];
}

/** Checks every requirement for the language and initializes translation when needed. Resolves to [] when ready. */
async function prepareEnvironment(language: Language): Promise<Issue[]> {
    const issues = await aiService.checkRequirements(language);
    if (issues.length > 0 || language !== 'pt') {
        return issues;
    }

    try {
        await translationService.initialize();
        return [];
    } catch (error) {
        console.error('Error initializing translation:', error);
        return [
            error instanceof Error && error.name === 'NotAllowedError'
                ? { code: 'download-required', items: ['translator', 'detector'] }
                : { code: 'translation-init', detail: describeError(error) },
        ];
    }
}

export function useAIRequirements(language: Language) {
    const [result, setResult] = useState<CheckResult | null>(null);
    const [progress, setProgress] = useState<DownloadProgress>({});
    const [isDownloading, setIsDownloading] = useState(false);

    // Re-check whenever the language changes (Portuguese also requires translation)
    useEffect(() => {
        let active = true;
        prepareEnvironment(language).then((issues) => {
            if (active) setResult({ language, issues });
        });
        return () => {
            active = false;
        };
    }, [language]);

    // Keep showing the last issues while a new check runs, to avoid flicker
    const issues = result?.issues ?? [];
    let status: AppStatus = 'ready';
    if (issues.length > 0) status = 'error';
    else if (result?.language !== language) status = 'checking';

    // Must be called synchronously from a click: every create() call starts
    // before the first await so Chrome accepts the user gesture.
    const downloadModels = useCallback(() => {
        const onProgress = (name: DownloadName, fraction: number) =>
            setProgress((current) => ({ ...current, [name]: fraction }));

        const downloads = Promise.all([
            aiService.downloadModel(onProgress),
            language === 'pt' ? translationService.initialize(onProgress) : null,
        ]);

        setProgress({});
        setIsDownloading(true);

        downloads
            .then(() => prepareEnvironment(language))
            .catch((error: unknown): Issue[] => {
                console.error('Error downloading models:', error);
                return [{ code: 'download-failed', detail: describeError(error) }];
            })
            .then((found) => setResult({ language, issues: found }))
            .finally(() => setIsDownloading(false));
    }, [language]);

    return { status, issues, progress, isDownloading, downloadModels };
}
