/** Language of the answer shown to the user. The model always answers in English. */
export type Language = 'pt' | 'en';

export type DownloadName = 'model' | 'translator' | 'detector';

export type IssueCode =
    | 'browser'
    | 'prompt-api'
    | 'translator-api'
    | 'detector-api'
    | 'translator-unavailable'
    | 'multimodal-unavailable'
    | 'device-unsupported'
    | 'download-required'
    | 'download-failed'
    | 'translation-init';

/** Something that prevents the app from running. */
export interface Issue {
    code: IssueCode;
    /** Technical error message, shown as plain text. */
    detail?: string;
    /** Models still pending download (only for download issues). */
    items?: DownloadName[];
}

/** A previous message of the conversation, as the model sees it. */
export interface HistoryMessage {
    role: 'user' | 'assistant';
    content: string;
}

export type DownloadProgress = Partial<Record<DownloadName, number>>;

export type ProgressCallback = (name: DownloadName, fraction: number) => void;

export const describeError = (error: unknown): string =>
    error instanceof Error ? `${error.name}: ${error.message}` : String(error);
