import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InteractiveCard } from '../assets/ts/components/interactive-card';

/**
 * Tests for <interactive-card> Lit Web Component.
 *
 * Strategy:
 * - Create a real element, attach it to document.body so connectedCallback fires.
 * - Await `element.updateComplete` (Lit's render promise) before querying the shadow DOM.
 * - Query inside `element.shadowRoot` to reach the rendered template.
 *
 * Button order in the rendered template:
 *   buttons[0] → .like-btn  (like / unlike)
 *   buttons[1] → expand / collapse toggle
 */
describe('InteractiveCard', () => {
  let element: InteractiveCard;

  // Helper: grabs all buttons from the shadow root.
  const getButtons = (el: InteractiveCard) =>
    el.shadowRoot!.querySelectorAll<HTMLButtonElement>('button');

  beforeEach(async () => {
    element = new InteractiveCard();
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    element.remove();
  });

  // ── Default / initial state ───────────────────────────────────────────────

  describe('initial state', () => {
    it('renders the default title "Card Title"', () => {
      const h3 = element.shadowRoot!.querySelector('h3.title');
      expect(h3?.textContent?.trim()).toBe('Card Title');
    });

    it('is not expanded by default', () => {
      expect(element.expanded).toBe(false);
    });

    it('does not have the "expanded" reflected attribute by default', () => {
      expect(element.hasAttribute('expanded')).toBe(false);
    });

    it('is not liked by default', () => {
      expect(element.liked).toBe(false);
    });

    it('has a likeCount of 0 by default', () => {
      expect(element.likeCount).toBe(0);
    });

    it('renders two action buttons', () => {
      expect(getButtons(element).length).toBe(2);
    });
  });

  // ── Reactive properties ───────────────────────────────────────────────────

  describe('reactive properties', () => {
    it('renders a custom title set via property', async () => {
      element.title = 'My Article';
      await element.updateComplete;

      const h3 = element.shadowRoot!.querySelector('h3.title');
      expect(h3?.textContent?.trim()).toBe('My Article');
    });

    it('renders a custom title set via attribute', async () => {
      const el = new InteractiveCard();
      el.setAttribute('title', 'From Attribute');
      document.body.appendChild(el);
      await el.updateComplete;

      const h3 = el.shadowRoot!.querySelector('h3.title');
      expect(h3?.textContent?.trim()).toBe('From Attribute');
      el.remove();
    });
  });

  // ── Expand / collapse ─────────────────────────────────────────────────────

  describe('expand / collapse', () => {
    it('sets expanded to true when the toggle button is clicked', async () => {
      const expandBtn = getButtons(element)[1];
      expandBtn.click();
      await element.updateComplete;

      expect(element.expanded).toBe(true);
    });

    it('reflects the "expanded" attribute on the host element', async () => {
      const expandBtn = getButtons(element)[1];
      expandBtn.click();
      await element.updateComplete;

      expect(element.hasAttribute('expanded')).toBe(true);
    });

    it('collapses when the toggle button is clicked a second time', async () => {
      element.expanded = true;
      await element.updateComplete;

      const expandBtn = getButtons(element)[1];
      expandBtn.click();
      await element.updateComplete;

      expect(element.expanded).toBe(false);
      expect(element.hasAttribute('expanded')).toBe(false);
    });

    it('emits a "card-toggle" CustomEvent with correct detail on expand', async () => {
      const handler = vi.fn();
      element.addEventListener('card-toggle', handler);

      const expandBtn = getButtons(element)[1];
      expandBtn.click();
      await element.updateComplete;

      expect(handler).toHaveBeenCalledOnce();
      expect((handler.mock.calls[0][0] as CustomEvent).detail).toMatchObject({
        title: 'Card Title',
        expanded: true,
      });
    });

    it('emits "card-toggle" with expanded:false when collapsing', async () => {
      element.expanded = true;
      await element.updateComplete;

      const handler = vi.fn();
      element.addEventListener('card-toggle', handler);

      const expandBtn = getButtons(element)[1];
      expandBtn.click();
      await element.updateComplete;

      expect((handler.mock.calls[0][0] as CustomEvent).detail).toMatchObject({
        expanded: false,
      });
    });

    it('updates the aria-expanded attribute on the toggle button', async () => {
      const expandBtn = getButtons(element)[1];
      expect(expandBtn.getAttribute('aria-expanded')).toBe('false');

      expandBtn.click();
      await element.updateComplete;

      expect(expandBtn.getAttribute('aria-expanded')).toBe('true');
    });
  });

  // ── Like / unlike ─────────────────────────────────────────────────────────

  describe('like / unlike', () => {
    it('sets liked to true when the like button is clicked', async () => {
      const likeBtn = element.shadowRoot!.querySelector<HTMLButtonElement>('.like-btn')!;
      likeBtn.click();
      await element.updateComplete;

      expect(element.liked).toBe(true);
    });

    it('increments likeCount to 1 on first like', async () => {
      const likeBtn = element.shadowRoot!.querySelector<HTMLButtonElement>('.like-btn')!;
      likeBtn.click();
      await element.updateComplete;

      expect(element.likeCount).toBe(1);
    });

    it('decrements likeCount back to 0 when unliked', async () => {
      element.liked = true;
      element.likeCount = 1;
      await element.updateComplete;

      const likeBtn = element.shadowRoot!.querySelector<HTMLButtonElement>('.like-btn')!;
      likeBtn.click();
      await element.updateComplete;

      expect(element.liked).toBe(false);
      expect(element.likeCount).toBe(0);
    });

    it('emits a "card-liked" CustomEvent with correct detail on like', async () => {
      const handler = vi.fn();
      element.addEventListener('card-liked', handler);

      const likeBtn = element.shadowRoot!.querySelector<HTMLButtonElement>('.like-btn')!;
      likeBtn.click();
      await element.updateComplete;

      expect(handler).toHaveBeenCalledOnce();
      expect((handler.mock.calls[0][0] as CustomEvent).detail).toMatchObject({
        title: 'Card Title',
        liked: true,
        likeCount: 1,
      });
    });

    it('emits "card-liked" with liked:false and correct count when unliked', async () => {
      element.liked = true;
      element.likeCount = 3;
      await element.updateComplete;

      const handler = vi.fn();
      element.addEventListener('card-liked', handler);

      const likeBtn = element.shadowRoot!.querySelector<HTMLButtonElement>('.like-btn')!;
      likeBtn.click();
      await element.updateComplete;

      expect((handler.mock.calls[0][0] as CustomEvent).detail).toMatchObject({
        liked: false,
        likeCount: 2,
      });
    });

    it('adds the "liked" CSS class to the like button when liked', async () => {
      const likeBtn = element.shadowRoot!.querySelector<HTMLButtonElement>('.like-btn')!;
      likeBtn.click();
      await element.updateComplete;

      // Re-query after re-render to get the updated class list
      const updatedBtn = element.shadowRoot!.querySelector<HTMLButtonElement>('.like-btn')!;
      expect(updatedBtn.classList.contains('liked')).toBe(true);
    });

    it('removes the "liked" CSS class from the like button when unliked', async () => {
      element.liked = true;
      await element.updateComplete;

      const likeBtn = element.shadowRoot!.querySelector<HTMLButtonElement>('.like-btn')!;
      likeBtn.click();
      await element.updateComplete;

      const updatedBtn = element.shadowRoot!.querySelector<HTMLButtonElement>('.like-btn')!;
      expect(updatedBtn.classList.contains('liked')).toBe(false);
    });
  });

  // ── Slot / content projection ─────────────────────────────────────────────

  describe('slot content', () => {
    it('projects slotted content into the card body', async () => {
      const el = new InteractiveCard();
      el.innerHTML = '<p id="slotted-p">Hello from slot</p>';
      document.body.appendChild(el);
      await el.updateComplete;

      // Slotted content lives in the light DOM, not the shadow DOM.
      const slottedP = el.querySelector('#slotted-p');
      expect(slottedP?.textContent).toBe('Hello from slot');
      el.remove();
    });
  });
});

