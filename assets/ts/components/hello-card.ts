import { LitElement, css, html, CSSResult } from 'lit';
import { applyTailwindToShadowRoot } from '../utils/tailwind-mixin';

/**
 * Interactive greeting card web component built with Lit.
 *
 * Renders a greeting, tracks click count, and emits `count-changed`
 * whenever the button is pressed.
 *
 * @module
 * @importTarget ./hello-card.ts
 * 
 * {@link LitElement}
 *
 *
 * @example
 * ```html
 * <hello-card name="Daniel"></hello-card>
 * ```
 *
 * ```mermaid
 * stateDiagram-v2
 *   [*] --> Initialized: constructor()
 *   Initialized --> Connected: connectedCallback()
 *   Connected --> Ready: first render
 *   Ready --> Ready: button click / count += 1
 *   Ready --> EventDispatched: dispatchEvent("count-changed")
 *   EventDispatched --> Ready
 * ```
 */
export class HelloCard extends LitElement {
  /** @internal */
  static properties = {
    name: { type: String },
    count: { type: Number },
  };

  // Keep Shadow DOM, but let host focus move to inner controls.
  /** @internal */
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /** Name displayed in the greeting. @defaultValue `'friend'` */
  declare name: string;

  /** Number of button clicks. @defaultValue `0` */
  declare count: number;

  /** Component-scoped CSS styles. */
  /** @internal */
  static styles: CSSResult = css`
    :host {
      display: block;
      max-width: 320px;
      font-family: system-ui, sans-serif;
      outline: none;
    }

    :host(:focus-visible) {
      outline: 2px solid #2563eb;
      outline-offset: 4px;
      border-radius: 12px;
    }

    .card {
      border: 1px solid #ddd;
      border-radius: 12px;
      padding: 1rem;
      background: #fff;
    }

    button {
      margin-top: 0.75rem;
      border: 0;
      border-radius: 8px;
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      background: #2563eb;
      color: white;
    }
  `;

  constructor() {
    super();
    // Initialize reactive properties in constructor so Lit accessors are used.
    this.name = 'friend';
    this.count = 0;
  }

  /** @internal */
  connectedCallback(): void {
    super.connectedCallback();
    void applyTailwindToShadowRoot(this);

    console.info('[hello-card] initialized', { name: this.name });

    // Host is not focusable by default; enable keyboard focus on <hello-card>.
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
  }

  private readonly onClick = (): void => {
    this.count += 1;

    // Emit an event the page can listen to
    this.dispatchEvent(
      new CustomEvent('count-changed', {
        detail: { count: this.count },
        bubbles: true,
        composed: true,
      }),
    );
  };

  /** @internal */
  render() {
    return html`
      <div class="card">
        <h3>Hello, ${this.name} 👋</h3>
        <p>Clicked ${this.count} times.</p>
        <button @click=${this.onClick}>Click me</button>
      </div>
    `;
  }
}

customElements.define('hello-card', HelloCard);
