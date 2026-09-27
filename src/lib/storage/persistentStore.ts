type Listener = () => void;

export interface PersistentStore<T> {
    subscribe: (listener: Listener) => () => void;
    getSnapshot: () => T;
    getServerSnapshot: () => T;
    /** Updates the value and notifies subscribers. Pass persist: false for frequent, transient updates. */
    set: (next: T | ((current: T) => T), options?: { persist?: boolean }) => void;
}

/**
 * A value kept in memory and mirrored to localStorage, shaped for useSyncExternalStore.
 * `parse` validates whatever is stored (it receives undefined when nothing is stored).
 * `serverValue` is what the server render sees, where localStorage doesn't exist.
 */
export function createPersistentStore<T>(
    key: string,
    parse: (raw: unknown) => T,
    serverValue: T,
): PersistentStore<T> {
    let value: T | undefined;
    const listeners = new Set<Listener>();

    const load = (): T => {
        try {
            const raw = localStorage.getItem(key);
            return parse(raw === null ? undefined : JSON.parse(raw));
        } catch {
            return parse(undefined);
        }
    };

    const getSnapshot = () => (value ??= load());

    return {
        subscribe(listener) {
            listeners.add(listener);
            return () => {
                listeners.delete(listener);
            };
        },
        getSnapshot,
        getServerSnapshot: () => serverValue,
        set(next, { persist = true } = {}) {
            value = typeof next === 'function' ? (next as (current: T) => T)(getSnapshot()) : next;

            if (persist) {
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                } catch (error) {
                    console.warn(`Could not save "${key}" to localStorage:`, error);
                }
            }

            listeners.forEach((listener) => listener());
        },
    };
}
