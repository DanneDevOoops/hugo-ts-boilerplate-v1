import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HelloCard } from '../assets/ts/components/hello-card';

/**
 * Tests for <hello-card> Lit Web Component.
 *
 * Strategy:
 * - Create a real element, attach it to document.body so connectedCallback fires.
 * - Await `element.updateComplete` (Lit's render promise) before querying the shadow DOM.
 * - Query inside `element.shadowRoot` to reach the rendered template.
 */
describe('HelloCard', () => {
  let element: HelloCard;

  beforeEach(async () => {
    element = new HelloCard();
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    element.remove();
  });

  // ── Default rendering ─────────────────────────────────────────────────────

  describe('default rendering', () => {
    it('renders the default greeting with "friend"', () => {
      const h3 = element.shadowRoot!.querySelector('h3');
      expect(h3?.textContent).toContain('Hello, friend');
    });

    it('renders with a click count of 0', () => {
      const p = element.shadowRoot!.querySelector('p');
      expect(p?.textContent).toContain('0 times');
    });

    it('renders a click button', () => {
      const button = element.shadowRoot!.querySelector('button');
      expect(button).toBeTruthy();
      expect(button?.textContent?.trim()).toBe('Click me');
    });
  });

  // ── Reactive properties ───────────────────────────────────────────────────

  describe('reactive properties', () => {
    it('re-renders when name property changes', async () => {
      element.name = 'World';
      await element.updateComplete;

      const h3 = element.shadowRoot!.querySelector('h3');
      expect(h3?.textContent).toContain('Hello, World');
    });

    it('reflects a custom name set via attribute', async () => {
      const el = new HelloCard();
      el.setAttribute('name', 'Alice');
      document.body.appendChild(el);
      await el.updateComplete;

      const h3 = el.shadowRoot!.querySelector('h3');
      expect(h3?.textContent).toContain('Hello, Alice');
      el.remove();
    });
  });

  // ── Button interaction ────────────────────────────────────────────────────

  describe('click interaction', () => {
    it('increments the count on each click', async () => {
      const button = element.shadowRoot!.querySelector('button')!;

      button.click();
      await element.updateComplete;
      expect(element.shadowRoot!.querySelector('p')?.textContent).toContain('1 times');

      button.click();
      await element.updateComplete;
      expect(element.shadowRoot!.querySelector('p')?.textContent).toContain('2 times');
    });

    it('emits a "count-changed" CustomEvent on each click', async () => {
      const handler = vi.fn();
      element.addEventListener('count-changed', handler);

      const button = element.shadowRoot!.querySelector('button')!;
      button.click();
      await element.updateComplete;

      expect(handler).toHaveBeenCalledOnce();
      expect((handler.mock.calls[0][0] as CustomEvent).detail).toEqual({ count: 1 });
    });

    it('emits count-changed events with incrementing count values', async () => {
      const counts: number[] = [];
      element.addEventListener('count-changed', (e) => {
        counts.push((e as CustomEvent).detail.count);
      });

      const button = element.shadowRoot!.querySelector('button')!;
      button.click();
      button.click();
      button.click();
      await element.updateComplete;

      expect(counts).toEqual([1, 2, 3]);
    });
  });

  // ── Accessibility / tabindex ──────────────────────────────────────────────

  describe('accessibility', () => {
    it('adds tabindex="0" automatically when none is set', () => {
      expect(element.getAttribute('tabindex')).toBe('0');
    });

    it('does not override an existing tabindex attribute', async () => {
      const el = new HelloCard();
      el.setAttribute('tabindex', '2');
      document.body.appendChild(el);
      await el.updateComplete;

      expect(el.getAttribute('tabindex')).toBe('2');
      el.remove();
    });
  });
});

