import type { Language } from '@/lib/ai';
import { createPersistentStore } from '@/lib/storage/persistentStore';

/** The language the user picked, or null when they never picked one. */
export const languageStore = createPersistentStore<Language | null>(
    'webai.language',
    (raw) => (raw === 'pt' || raw === 'en' ? raw : null),
    null,
);
