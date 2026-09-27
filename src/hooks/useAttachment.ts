'use client';

import { useCallback, useRef, useState } from 'react';

export interface Attachment {
    file: File;
    kind: 'image' | 'audio' | 'other';
    previewUrl: string;
}

const kindOf = (file: File): Attachment['kind'] => {
    const type = file.type.split('/')[0];
    return type === 'image' || type === 'audio' ? type : 'other';
};

/** Keeps the selected file and its object URL, revoking old URLs on change. */
export function useAttachment() {
    const [attachment, setAttachment] = useState<Attachment | null>(null);
    const currentUrl = useRef<string | null>(null);

    const select = useCallback((file: File | null) => {
        if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);

        const next = file ? { file, kind: kindOf(file), previewUrl: URL.createObjectURL(file) } : null;
        currentUrl.current = next?.previewUrl ?? null;
        setAttachment(next);
    }, []);

    const clear = useCallback(() => select(null), [select]);

    return { attachment, select, clear };
}
