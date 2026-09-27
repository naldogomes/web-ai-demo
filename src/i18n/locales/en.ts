import type { Translation } from './pt';

export const en: Translation = {
    app: {
        title: 'Web AI Demo',
        subtitle: 'AI running locally in your browser',
        footer: 'Web AI Demo · {{year}}',
    },
    sidebar: {
        newChat: 'New chat',
        conversations: 'Chats',
        noConversations: 'Your chats will appear here.',
        deleteConversation: 'Delete chat',
        confirmDelete: 'Delete the chat "{{title}}"? This cannot be undone.',
        language: 'Language',
    },
    chat: {
        emptyTitle: 'How can I help?',
        emptyText: 'Ask a question below to start a chat.',
        assistant: 'Assistant',
        thinking: 'Thinking...',
        translating: 'Translating answer...',
        stopped: 'Answer stopped.',
        error: 'Error: {{message}}',
    },
    composer: {
        inputLabel: 'Your message',
        placeholder: 'Ask anything...',
        attach: 'Attach image or audio (in English)',
        removeAttachment: 'Remove attachment',
        dropHere: 'Drop the image or audio here',
        invalidFile: 'Only image or audio files are accepted.',
        generating: 'Generating answer... <kbd>Esc</kbd> to stop',
    },
    errorPanel: {
        title: 'Web AI Demo could not start',
        count_one: 'We found 1 item that needs your attention.',
        count_other: 'We found {{count}} items that need your attention.',
        reload: 'Done, reload page',
        copy: 'Copy',
        copied: 'Copied!',
        downloadModels: 'Download models',
        downloading: 'Downloading... keep this tab open',
        downloadStatus: {
            pending: 'pending',
            starting: 'starting...',
            done: 'done',
        },
    },
    downloads: {
        model: 'Gemini Nano (language model)',
        translator: 'English → Portuguese translator',
        detector: 'Language detector',
    },
    requirements: {
        summary: 'Requirements to run the project',
        intro: 'All AI runs locally on your computer with the Gemini Nano model built into Chrome, so there are minimum software and hardware requirements:',
        browser: {
            label: 'Browser',
            description: 'Google Chrome 138 or later for desktop (or Chrome Canary). It does not work on Chrome for Android/iOS or in other browsers.',
        },
        os: {
            label: 'Operating system',
            description: 'Windows 10 or 11, macOS 13 (Ventura) or later, Linux, or ChromeOS on a Chromebook Plus.',
        },
        hardware: {
            label: 'GPU or CPU',
            description: 'GPU with more than 4 GB of VRAM <strong>or</strong> CPU with 4 or more cores and 16 GB of RAM or more.',
        },
        storage: {
            label: 'Storage',
            description: "At least 22 GB free on the Chrome profile's disk. If free space drops below 10 GB, Chrome removes the model.",
        },
        internet: {
            label: 'Internet',
            description: 'An unmetered connection for the initial model download. After that, everything works offline.',
        },
        features: {
            label: 'Chrome features',
            description: 'Prompt API enabled, with multimodal input for images and audio. For answers in Portuguese, also the Translator API and the Language Detector API.',
        },
    },
    steps: {
        installChrome: 'Install <strong>Google Chrome</strong> 138 or later (or <strong>Chrome Canary</strong>).',
        openInChrome: 'Open this same address in Chrome.',
        nextSteps: 'If anything is still missing, this screen will show the next steps.',
        enablePromptApi: 'Open <url>chrome://flags/#prompt-api-for-gemini-nano</url> and select <strong>Enabled</strong>.',
        enableMultimodal: 'To attach images and audio, open <url>chrome://flags/#prompt-api-for-gemini-nano-multimodal-input</url> and select <strong>Enabled</strong>.',
        enableMultimodalOnly: 'Open <url>chrome://flags/#prompt-api-for-gemini-nano-multimodal-input</url> and select <strong>Enabled</strong>.',
        bypassPerf: 'Optional, if your hardware is borderline: open <url>chrome://flags/#optimization-guide-on-device-model</url> and select <strong>Enabled BypassPerfRequirement</strong>.',
        relaunch: 'Click <strong>Relaunch</strong> at the bottom of the flags page to restart Chrome, then reload this page.',
        updateChrome138: 'Update Chrome to version 138 or later at <url>chrome://settings/help</url>. The API is enabled by default in those versions.',
        updateChrome: 'Update Chrome at <url>chrome://settings/help</url>.',
        enableTranslationFlag: 'On older versions, open <url>chrome://flags/#translation-api</url> and select <strong>Enabled</strong>.',
        enableDetectionFlag: 'On older versions, open <url>chrome://flags/#language-detection-api</url> and select <strong>Enabled</strong>.',
        installLanguagePacks: 'Open <url>chrome://on-device-translation-internals</url> and install the <strong>en</strong> and <strong>pt</strong> language packs.',
        checkLanguagePacks: 'Open <url>chrome://on-device-translation-internals</url> and check that the <strong>en</strong> and <strong>pt</strong> packs are installed.',
        reloadPage: 'Reload this page.',
        switchToEnglish: "If you don't need answers in Portuguese, select <strong>English</strong> under <strong>Language</strong> in the sidebar. Translation is then no longer required.",
        checkHardware: 'Check that your computer meets the requirements listed below (especially GPU/RAM and disk space).',
        deviceDiagnostics: "Open <url>chrome://on-device-internals</url> to see Chrome's diagnosis of your device.",
        bypassPerfDevice: 'If your hardware is close to the minimum, try <url>chrome://flags/#optimization-guide-on-device-model</url> with <strong>Enabled BypassPerfRequirement</strong> and restart Chrome.',
        freeSpace: 'Make sure you have at least <strong>22 GB free</strong> on disk and an unmetered connection.',
        clickDownload: 'Click <strong>Download models</strong> and keep this tab open until it finishes.',
        trackStatus: 'Optionally, follow the status at <url>chrome://on-device-internals</url>.',
        checkSpaceConnection: 'Check free disk space (at least 22 GB) and your internet connection.',
        retryDownload: 'Click <strong>Download models</strong> to try again.',
    },
    issues: {
        'browser': {
            title: 'Unsupported browser',
            description: 'The built-in AI APIs used by this project only exist in Google Chrome for desktop.',
        },
        'prompt-api': {
            title: 'Prompt API disabled',
            description: 'The API that talks to the Gemini Nano model is not available in your Chrome.',
        },
        'translator-api': {
            title: 'Translator API disabled',
            description: 'Model answers are translated to Portuguese with the Translator API, which is not available.',
        },
        'detector-api': {
            title: 'Language Detector API disabled',
            description: 'The Language Detector API, used to identify the language of the answer, is not available.',
        },
        'translator-unavailable': {
            title: 'English → Portuguese translation unavailable',
            description: 'Chrome does not offer the translation pack for these two languages on this device.',
        },
        'multimodal-unavailable': {
            title: 'Image and audio input disabled',
            description: 'The model works with text, but this project also accepts images and audio, and that feature is not enabled.',
        },
        'device-unsupported': {
            title: 'Unsupported device',
            description: 'Chrome reported that the Gemini Nano model cannot run on this computer.',
        },
        'download-required': {
            title: 'AI models need to be downloaded',
            description: 'The models run on your computer and need to be downloaded only once. For security, Chrome only starts this download after a click on the page.',
        },
        'download-failed': {
            title: 'The download did not finish',
            description: 'An error occurred while downloading the AI models.',
        },
        'translation-init': {
            title: 'Translation failed to start',
            description: 'The translator or the language detector could not be initialized.',
        },
    },
};
