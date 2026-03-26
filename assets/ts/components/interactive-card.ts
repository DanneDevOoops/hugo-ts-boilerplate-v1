import { css, html, CSSResult, LitElement } from 'lit';
import { applyTailwindToShadowRoot } from '../utils/tailwind-mixin';

/**
 * Interactive Card - A hybrid Web Component
 *
 * Works seamlessly with HTMX:
 * - HTMX swaps in the HTML containing <interactive-card>
 * - Component hydrates automatically when loaded
 * - Maintains local UI state (expanded/collapsed)
 * - Emits events for parent page to consume
 *
 * {@link LitElement}
 *
 * Example usage:
 * <interactive-card title="Article Title" expanded>
 *   <p>Article content goes here...</p>
 * </interactive-card>
 */
export class InteractiveCard extends LitElement {
  /** @internal */
  static properties = {
    title: { type: String },
    expanded: { type: Boolean, reflect: true },
    liked: { type: Boolean, reflect: true },
    likeCount: { type: Number, attribute: 'like-count' },
  };

  /** @internal */
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /** Heading text shown in the card header. @defaultValue `'Card Title'` */
  declare title: string;

  /** Whether the card content is expanded. Reflected to the `expanded` attribute. @defaultValue `false` */
  declare expanded: boolean;

  /** Whether the current user has liked the card. Reflected to the `liked` attribute. @defaultValue `false` */
  declare liked: boolean;

  /** Number of likes shown beside the like button. Mapped to the `like-count` attribute. @defaultValue `0` */
  declare likeCount: number;

  /** Component-scoped CSS styles. */
  /** @internal */
  static styles: CSSResult = css`
    :host {
      display: block;
      font-family: system-ui, sans-serif;
    }

    .card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #fff;
      overflow: hidden;
      transition: box-shadow 0.2s;
    }

    .card:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }

    .title {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
      flex: 1;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    button {
      border: none;
      background: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      transition: background-color 0.2s;
      font-size: 1.25rem;
    }

    button:hover {
      background: #e5e7eb;
    }

    button:active {
      transform: scale(0.95);
    }

    .like-btn.liked {
      color: #ef4444;
    }

    .content {
      padding: 1rem;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out;
    }

    :host([expanded]) .content {
      max-height: 1000px;
    }

    .expand-icon {
      transition: transform 0.3s;
    }

    :host([expanded]) .expand-icon {
      transform: rotate(180deg);
    }

    .like-count {
      font-size: 0.875rem;
      color: #6b7280;
      margin-left: 0.25rem;
    }
  `;

  constructor() {
    super();
    this.title = 'Card Title';
    this.expanded = false;
    this.liked = false;
    this.likeCount = 0;
  }

  /** @internal */
  connectedCallback(): void {
    super.connectedCallback();
    void applyTailwindToShadowRoot(this);
    console.debug('[interactive-card] Mounted', { title: this.title, expanded: this.expanded });
  }

  /** @internal */
  disconnectedCallback(): void {
    super.disconnectedCallback();
    console.debug('[interactive-card] Unmounted', { title: this.title });
  }

  private toggleExpanded(): void {
    this.expanded = !this.expanded;

    this.dispatchEvent(
      new CustomEvent('card-toggle', {
        detail: { title: this.title, expanded: this.expanded },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private toggleLike(): void {
    this.liked = !this.liked;
    this.likeCount += this.liked ? 1 : -1;

    this.dispatchEvent(
      new CustomEvent('card-liked', {
        detail: {
          title: this.title,
          liked: this.liked,
          likeCount: this.likeCount,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** @internal */
  render() {
    return html`
      <div class="card">
        <div class="header">
          <h3 class="title">${this.title}</h3>
          <div class="actions">
            <button
              class="like-btn ${this.liked ? 'liked' : ''}"
              @click=${this.toggleLike}
              aria-label="${this.liked ? 'Unlike' : 'Like'}"
            >
              ${this.liked ? '❤️' : '🤍'}
              ${this.likeCount > 0 ? html`<span class="like-count">${this.likeCount}</span>` : ''}
            </button>
            <button
              @click=${this.toggleExpanded}
              aria-label="${this.expanded ? 'Collapse' : 'Expand'}"
              aria-expanded="${this.expanded}"
            >
              <span class="expand-icon">${this.expanded ? '▲' : '▼'}</span>
            </button>
          </div>
        </div>
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('interactive-card', InteractiveCard);
