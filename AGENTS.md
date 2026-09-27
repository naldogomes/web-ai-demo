<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.
<!-- END:nextjs-agent-rules -->

# Web AI Demo — agent guide

An AI chat that runs **entirely in the browser** using Chrome's built-in AI APIs:
Prompt API (Gemini Nano), Translator API and Language Detector API. There is no
backend, no API keys and no database — conversations live in `localStorage`.
See `README.md` for the user-facing overview and folder map.

Stack: Next.js 16 (App Router) · React 19 · TypeScript (strict) · CSS Modules · i18next.

## Commands

```bash
npm run dev          # http://localhost:3000
npm run build        # production build (also type-checks)
npm run lint         # ESLint (next core-web-vitals + typescript)
npx tsc --noEmit     # type check only
```

There is no test suite. Before finishing a change, `npm run lint` and `npx tsc --noEmit`
must pass. Behavior involving the AI APIs can only be checked in Chrome 138+ desktop
with the models downloaded; say so when a change could not be verified in the browser.

## Architecture

Dependencies flow one way: `app/` → `components/` → `hooks/` → `lib/`.

- `src/app/` — routes only. `page.tsx` and `layout.tsx` are Server Components; keep them
  thin and render client components from `components/`.
- `src/components/<Name>/<Name>.tsx` + `<Name>.module.css` — UI. `WebAIApp` composes the
  app and is the only place that wires hooks together.
- `src/hooks/` — client state (`'use client'`). Bridge between React and `lib/`.
- `src/lib/` — plain TypeScript, **no React**:
  - `lib/ai/` — `AIService` (model sessions, streaming, requirement checks) and
    `TranslationService`. Use the shared instances exported from `@/lib/ai`.
  - `lib/chat/` — conversation types and store operations.
  - `lib/storage/persistentStore.ts` — `localStorage`-backed store shaped for
    `useSyncExternalStore`. New persisted state should use it.
- `src/types/chrome-ai.d.ts` — hand-written ambient types for the Chrome AI APIs. Extend
  it when you use an API option or method it doesn't declare yet; don't use `any`.
- `src/i18n/` — i18next setup and strings.

## Rules that are easy to break

**Server rendering / hydration**
- Components that use hooks, browser APIs or event handlers need `'use client'`.
- Never touch `window`, `navigator`, `localStorage` or the AI globals at module load or
  during render. Read browser state through `useSyncExternalStore` with a server
  snapshot (see `useLanguage`, `useConversations`), or inside effects/handlers.
- i18next always initializes in English so server and first client render match;
  `useLanguage()` switches language after hydration. Don't change that order.

**Chrome AI APIs**
- A model download only works inside a user gesture: every `*.create()` that may
  download must start **synchronously in the click handler, before any `await`**,
  or Chrome throws `NotAllowedError` (see `useAIRequirements.downloadModels`).
- Only one `LanguageModelSession` is alive at a time (the open conversation's). It is
  rebuilt from saved history when switching conversations, after reload, or after an
  aborted/failed answer. Call `aiService.forget(id)` when a conversation goes away.
- The model is configured for English in and out. Portuguese answers are produced by
  translating the finished English answer; translation APIs are required only for `pt`.
- New blocking conditions become an `IssueCode` in `lib/ai/types.ts`, a check in
  `AIService.checkRequirements`, and matching strings/steps in `ErrorPanel`.

**Persistence**
- `localStorage` keys use the `webai.` prefix.
- A store's `parse` function must accept anything (old formats, corrupt data,
  `undefined`) and return a valid value — this is the only migration layer.
- Pass `{ persist: false }` for high-frequency updates (e.g. streaming chunks) and
  persist once at the end.
- Attachments are never persisted; only their name and kind are.

**Interface strings (i18n)**
- No hard-coded UI text. Add every key to `src/i18n/locales/pt.ts` first (it defines the
  `Translation` type), then to `en.ts`; TypeScript rejects missing or extra keys.
- Use `t('...')` for plain text and `<Trans i18nKey="...">` for strings with inline tags
  (`<strong>`, `<kbd>`, `<url>`). Use i18next plural suffixes (`_one`, `_other`).

## Code style

Match the existing code:

- 4-space indentation, single quotes, semicolons, trailing commas in multi-line lists.
- Named exports for components and hooks (`export function Composer`); default exports
  only where Next.js requires them (`page.tsx`, `layout.tsx`, configs).
- Import through the `@/` alias (`@/lib/ai`, `@/hooks/useChat`).
- Props as an `interface <Name>Props`; use `import type` for type-only imports.
- Styling: CSS Modules per component, colors and radii from the tokens in
  `src/app/globals.css` (`var(--primary)`, …). No inline styles or new global CSS
  unless it's a new token.
- Code, identifiers and comments in English. Comments explain *why*, not what;
  short JSDoc on exported functions whose behavior isn't obvious.
- Don't add dependencies unless the task needs them; prefer platform APIs.

## Working in this repo

- Read the relevant guide in `node_modules/next/dist/docs/01-app/` before using any
  Next.js API you haven't seen in this codebase.
- Keep `README.md`'s structure section in sync when adding or moving folders.
- Commit only when asked. Commit messages: short imperative summary in English.
