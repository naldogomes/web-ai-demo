export type MessageStatus = 'streaming' | 'translating' | 'done' | 'stopped' | 'error';

export interface MessageAttachment {
    name: string;
    kind: 'image' | 'audio';
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    /** Text as sent to / received from the model (the model answers in English). */
    content: string;
    /** Portuguese translation of an assistant answer, when Portuguese was selected. */
    translation?: string;
    /** Only the file's name and type are saved; the file itself isn't persisted. */
    attachment?: MessageAttachment;
    status?: MessageStatus;
    error?: string;
}

export interface Conversation {
    id: string;
    title: string;
    createdAt: number;
    updatedAt: number;
    messages: ChatMessage[];
}
