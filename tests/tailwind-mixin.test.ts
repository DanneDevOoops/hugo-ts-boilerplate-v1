import { beforeEach, describe, expect, it, vi } from 'vitest';

const MODULE_PATH = '../assets/ts/utils/tailwind-mixin';

async function loadModule() {
  vi.resetModules();
  return import(MODULE_PATH);
}

function makeHostWithShadowRoot() {
  const element = document.createElement('div');
  const shadowRoot = element.attachShadow({ mode: 'open' });
  shadowRoot.adoptedStyleSheets = [];

  return {
    host: { shadowRoot } as unknown as { shadowRoot: ShadowRoot },
    shadowRoot,
  };
}

describe('tailwind-mixin', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('returns early when host has no shadow root', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const { applyTailwindToShadowRoot } = await loadModule();

    await applyTailwindToShadowRoot({} as never);

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('adopts a constructable stylesheet and avoids duplicate insertion', async () => {
    const { host, shadowRoot } = makeHostWithShadowRoot();
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => '.card { color: red; }',
    } as Response);

    const { applyTailwindToShadowRoot } = await loadModule();

    await applyTailwindToShadowRoot(host as never);
    await applyTailwindToShadowRoot(host as never);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(shadowRoot.adoptedStyleSheets.length).toBe(1);
  });

  it('falls back to a style tag when constructable stylesheets are unavailable', async () => {
    const OriginalCSSStyleSheet = globalThis.CSSStyleSheet;
    class LegacyStyleSheet {}
    Object.defineProperty(globalThis, 'CSSStyleSheet', {
      value: LegacyStyleSheet,
      configurable: true,
      writable: true,
    });

    const { host, shadowRoot } = makeHostWithShadowRoot();
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => '.fallback { display: block; }',
    } as Response);

    const { applyTailwindToShadowRoot } = await loadModule();

    await applyTailwindToShadowRoot(host as never);
    await applyTailwindToShadowRoot(host as never);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(shadowRoot.querySelectorAll('style[data-tailwind-shadow]').length).toBe(1);

    Object.defineProperty(globalThis, 'CSSStyleSheet', {
      value: OriginalCSSStyleSheet,
      configurable: true,
      writable: true,
    });
  });

  it('skips stylesheet injection when the fetch response is not ok', async () => {
    const { host, shadowRoot } = makeHostWithShadowRoot();
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      text: async () => '.unused { color: blue; }',
    } as Response);

    const { applyTailwindToShadowRoot } = await loadModule();

    await applyTailwindToShadowRoot(host as never);

    expect(shadowRoot.adoptedStyleSheets.length).toBe(0);
    expect(shadowRoot.querySelector('style[data-tailwind-shadow]')).toBeNull();
  });

  it('swallows stylesheet fetch errors', async () => {
    const { host, shadowRoot } = makeHostWithShadowRoot();
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'));

    const { applyTailwindToShadowRoot } = await loadModule();

    await expect(applyTailwindToShadowRoot(host as never)).resolves.toBeUndefined();
    expect(shadowRoot.adoptedStyleSheets.length).toBe(0);
  });
});

