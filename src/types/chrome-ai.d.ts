// Minimal type declarations for Chrome's built-in AI APIs
// (Prompt API, Translator API and Language Detector API).

type AIAvailability = 'unavailable' | 'downloadable' | 'downloading' | 'available';

interface AIDownloadProgressEvent extends Event {
    readonly loaded: number;
    readonly total: number;
}

interface AICreateMonitor {
    addEventListener(type: 'downloadprogress', listener: (event: AIDownloadProgressEvent) => void): void;
}

type AICreateMonitorCallback = (monitor: AICreateMonitor) => void;

type AIStringStream = ReadableStream<string> & AsyncIterable<string>;

/* ---------- Prompt API ---------- */

type LanguageModelMessageType = 'text' | 'image' | 'audio';

interface LanguageModelExpected {
    type: LanguageModelMessageType;
    languages?: string[];
}

interface LanguageModelMessageContent {
    type: LanguageModelMessageType;
    value: string | Blob;
}

interface LanguageModelMessage {
    role: 'system' | 'user' | 'assistant';
    content: string | LanguageModelMessageContent[];
}

interface LanguageModelCreateCoreOptions {
    expectedInputs?: LanguageModelExpected[];
    expectedOutputs?: LanguageModelExpected[];
}

interface LanguageModelCreateOptions extends LanguageModelCreateCoreOptions {
    initialPrompts?: LanguageModelMessage[];
    monitor?: AICreateMonitorCallback;
    signal?: AbortSignal;
}

interface LanguageModelSession {
    promptStreaming(input: string | LanguageModelMessage[], options?: { signal?: AbortSignal }): AIStringStream;
    destroy(): void;
}

declare const LanguageModel: {
    availability(options?: LanguageModelCreateCoreOptions): Promise<AIAvailability>;
    create(options?: LanguageModelCreateOptions): Promise<LanguageModelSession>;
};

/* ---------- Translator API ---------- */

interface TranslatorOptions {
    sourceLanguage: string;
    targetLanguage: string;
}

interface TranslatorInstance {
    translate(text: string): Promise<string>;
    translateStreaming(text: string): AIStringStream;
    destroy(): void;
}

declare const Translator: {
    // Older Chrome versions answered 'no' instead of 'unavailable'
    availability(options: TranslatorOptions): Promise<AIAvailability | 'no'>;
    create(options: TranslatorOptions & { monitor?: AICreateMonitorCallback }): Promise<TranslatorInstance>;
};

/* ---------- Language Detector API ---------- */

interface LanguageDetectionResult {
    detectedLanguage: string;
    confidence: number;
}

interface LanguageDetectorInstance {
    detect(text: string): Promise<LanguageDetectionResult[]>;
    destroy(): void;
}

declare const LanguageDetector: {
    availability(): Promise<AIAvailability>;
    create(options?: { monitor?: AICreateMonitorCallback }): Promise<LanguageDetectorInstance>;
};
