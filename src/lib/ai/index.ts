import { AIService } from './aiService';
import { TranslationService } from './translationService';

// Shared instances for the whole app. Constructors don't touch browser APIs,
// so importing this module during server rendering is safe.
export const aiService = new AIService();
export const translationService = new TranslationService();

export * from './types';
