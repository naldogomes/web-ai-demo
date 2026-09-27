import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en';
import { pt } from './locales/pt';

export const resources = {
    pt: { translation: pt },
    en: { translation: en },
} as const;

// Always start in English so the server-rendered HTML and the first client render
// match. useLanguage() switches to the user's language right after hydration.
if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        interpolation: { escapeValue: false }, // React already escapes
        initAsync: false,
    });
}

export default i18n;
