import type { ProgressCallback } from './types';

export class TranslationService {
    private translator: TranslatorInstance | null = null;
    private languageDetector: LanguageDetectorInstance | null = null;
    private pending: Promise<void> | null = null;

    /**
     * Creates the translator and language detector. When their models still need
     * to be downloaded, this must be called from a user gesture (click), otherwise
     * Chrome rejects it with NotAllowedError.
     */
    initialize(onProgress?: ProgressCallback): Promise<void> {
        if (this.translator && this.languageDetector) {
            return Promise.resolve();
        }

        // Reuse an in-flight initialization (e.g. React StrictMode running effects twice)
        this.pending ??= this.create(onProgress).finally(() => {
            this.pending = null;
        });
        return this.pending;
    }

    private async create(onProgress?: ProgressCallback): Promise<void> {
        const monitorFor = (name: 'translator' | 'detector'): AICreateMonitorCallback => (m) => {
            m.addEventListener('downloadprogress', (e) => onProgress?.(name, e.loaded / (e.total || 1)));
        };

        // Both create() calls start synchronously so they share the same user gesture
        const [translator, languageDetector] = await Promise.all([
            Translator.create({ sourceLanguage: 'en', targetLanguage: 'pt', monitor: monitorFor('translator') }),
            LanguageDetector.create({ monitor: monitorFor('detector') }),
        ]);

        this.translator = translator;
        this.languageDetector = languageDetector;
        console.log('Translator and Language Detector initialized');
    }

    async translateToPortuguese(text: string): Promise<string> {
        if (!this.translator) {
            console.warn('Translator not available, returning original text');
            return text;
        }

        try {
            // If already in Portuguese, no need to translate
            const detection = await this.languageDetector?.detect(text);
            if (detection?.[0]?.detectedLanguage === 'pt') {
                return text;
            }

            return await this.translator.translate(text);
        } catch (error) {
            console.error('Translation error:', error);
            return text; // Return original text if translation fails
        }
    }
}
