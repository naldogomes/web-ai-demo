'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import i18n from '@/i18n';
import type { Language } from '@/lib/ai';
import { languageStore } from '@/lib/storage/languageStore';

const DEFAULT_LANGUAGE: Language = 'en';

/** Maps the browser's preferred language to a supported one (pt or en). */
function getBrowserLanguage(): Language {
    const preferred = (navigator.languages?.[0] ?? navigator.language ?? '').toLowerCase();
    if (preferred.startsWith('pt')) return 'pt';
    if (preferred.startsWith('en')) return 'en';
    return DEFAULT_LANGUAGE;
}

// The browser language never changes while the page is open
const subscribeToNothing = () => () => {};

/**
 * Language of the whole app (interface and answers): the saved choice, otherwise the
 * browser's language, otherwise English. Keeps i18next and <html lang> in sync.
 */
export function useLanguage() {
    const saved = useSyncExternalStore(languageStore.subscribe, languageStore.getSnapshot, languageStore.getServerSnapshot);

    // null during server rendering, where navigator doesn't exist
    const browserLanguage = useSyncExternalStore(subscribeToNothing, getBrowserLanguage, () => null);

    const language: Language = saved ?? browserLanguage ?? DEFAULT_LANGUAGE;

    useEffect(() => {
        i18n.changeLanguage(language);
        document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
    }, [language]);

    const setLanguage = useCallback((next: Language) => languageStore.set(next), []);

    return { language, setLanguage };
}
