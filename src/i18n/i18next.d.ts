import 'i18next';
import type { pt } from './locales/pt';

// Typed translation keys: t('...') and <Trans i18nKey="..."> are checked against pt.ts
declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'translation';
        resources: {
            translation: typeof pt;
        };
    }
}
