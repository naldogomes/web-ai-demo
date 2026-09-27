import type { IssueCode } from '@/lib/ai';
import type { pt } from '@/i18n/locales/pt';

export type StepKey = keyof typeof pt.steps;

/** Steps shown for each issue, as keys of `steps` in the translation files. */
export const ISSUE_STEPS: Record<IssueCode, StepKey[]> = {
    'browser': ['installChrome', 'openInChrome', 'nextSteps'],
    'prompt-api': ['enablePromptApi', 'enableMultimodal', 'bypassPerf', 'relaunch'],
    'translator-api': ['updateChrome138', 'enableTranslationFlag', 'relaunch', 'switchToEnglish'],
    'detector-api': ['updateChrome138', 'enableDetectionFlag', 'relaunch', 'switchToEnglish'],
    'translator-unavailable': ['updateChrome', 'installLanguagePacks', 'reloadPage', 'switchToEnglish'],
    'multimodal-unavailable': ['enableMultimodalOnly', 'relaunch'],
    'device-unsupported': ['checkHardware', 'deviceDiagnostics', 'bypassPerfDevice'],
    'download-required': ['freeSpace', 'clickDownload', 'trackStatus'],
    'download-failed': ['checkSpaceConnection', 'retryDownload'],
    'translation-init': ['checkLanguagePacks', 'reloadPage', 'switchToEnglish'],
};

/** Issues that offer the "Download models" button. */
export const DOWNLOAD_ISSUES: IssueCode[] = ['download-required', 'download-failed'];
