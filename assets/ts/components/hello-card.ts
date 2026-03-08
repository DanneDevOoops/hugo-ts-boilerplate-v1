import { LitElement, css, html, CSSResult } from 'lit';

export class HelloCard extends LitElement {
  static properties = {
    name: { type: String },
    count: { type: Number },
  };

  // Keep Shadow DOM, but let host focus move to inner controls.
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  declare name: string;
  declare count: number;

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

  connectedCallback(): void {
    super.connectedCallback();

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
