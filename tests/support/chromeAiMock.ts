/** Answer the mocked model gives to a question. */
export const mockedAnswer = (question: string) => `Mocked answer to: ${question}`;

/**
 * Replaces Chrome's built-in Prompt API with a deterministic fake, so tests run in
 * Playwright's Chromium without Gemini Nano. Pass it to `page.addInitScript`: it is
 * serialized and runs in the page before the app, so it can't use anything from
 * this module's scope — `answerPrefix` must match `mockedAnswer`.
 */
export function installChromeAIMock(answerPrefix = 'Mocked answer to: ') {
    const questionOf = (input: string | LanguageModelMessage[]) => {
        if (typeof input === 'string') return input;
        const content = input.at(-1)?.content ?? '';
        if (typeof content === 'string') return content;
        return content.map((part) => (typeof part.value === 'string' ? part.value : '')).join('');
    };

    const session: LanguageModelSession = {
        promptStreaming(input) {
            // Emit word by word to exercise the app's streaming path
            const chunks = `${answerPrefix}${questionOf(input)}`.split(/(?<= )/);
            return new ReadableStream<string>({
                async pull(controller) {
                    await new Promise((resolve) => setTimeout(resolve, 20));
                    const chunk = chunks.shift();
                    if (chunk === undefined) controller.close();
                    else controller.enqueue(chunk);
                },
            }) as AIStringStream;
        },
        destroy() {},
    };

    const languageModel: typeof LanguageModel = {
        availability: async () => 'available',
        create: async () => session,
    };

    // AIService checks for window.chrome to detect a Chrome browser
    Object.assign(window, { chrome: {}, LanguageModel: languageModel });
}
