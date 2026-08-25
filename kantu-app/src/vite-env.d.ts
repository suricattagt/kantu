/// <reference types="vite/client" />

/** Injected at build time via vite.config.ts `define` — changes on every
 * production build so the app can detect and reset a stale local build. */
declare const __BUILD_ID__: string;
