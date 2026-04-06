import type { LitElement } from 'lit';

// Hugo fingerprints bundle filenames, so resolve the active stylesheet URL at runtime.
const FALLBACK_STYLESHEET_URL = '/css/main.bundle.css';
const MAIN_BUNDLE_PATTERN = /\/css\/main\.bundle(?:\.min)?\..+\.css$/;

let cachedSheet: CSSStyleSheet | null = null;
let cachedCssText: string | null = null;
let loadingPromise: Promise<void> | null = null;

function resolveBundledStylesheetUrl(): string {
  const links = Array.from(
    document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"][href]'),
  );
  const matched = links.find((link) => MAIN_BUNDLE_PATTERN.test(link.getAttribute('href') ?? ''));
  return matched?.href ?? FALLBACK_STYLESHEET_URL;
}

async function ensureTailwindStylesheet(): Promise<void> {
  if (cachedSheet || cachedCssText) {
    return;
  }

  if (!loadingPromise) {
    loadingPromise = (async () => {
      try {
        const response = await fetch(resolveBundledStylesheetUrl(), { credentials: 'same-origin' });
        if (!response.ok) {
          return;
        }

        const cssText = await response.text();
        cachedCssText = cssText;

        if ('replaceSync' in CSSStyleSheet.prototype) {
          const sheet = new CSSStyleSheet();
          sheet.replaceSync(cssText);
          cachedSheet = sheet;
        }
      } catch {
        // Ignore network errors; component-local styles still work.
      }
    })().finally(() => {
      loadingPromise = null;
    });
  }

  await loadingPromise;
}

/**
 * Applies the site's bundled Tailwind stylesheet to a Lit component shadow root.
 *
 * Uses constructable stylesheets when available and falls back to injecting a
 * scoped `<style>` tag when they are not supported.
 *
 * {@link LitElement}
 *
 */
export async function applyTailwindToShadowRoot(host: LitElement): Promise<void> {
  if (!(host.shadowRoot instanceof ShadowRoot)) {
    return;
  }

  await ensureTailwindStylesheet();

  if (cachedSheet) {
    if (!host.shadowRoot.adoptedStyleSheets.includes(cachedSheet)) {
      host.shadowRoot.adoptedStyleSheets = [...host.shadowRoot.adoptedStyleSheets, cachedSheet];
    }
    return;
  }

  if (cachedCssText && !host.shadowRoot.querySelector('style[data-tailwind-shadow]')) {
    const styleTag = document.createElement('style');
    styleTag.setAttribute('data-tailwind-shadow', '');
    styleTag.textContent = cachedCssText;
    host.shadowRoot.append(styleTag);
  }
}
