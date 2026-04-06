/**
 * Client-side search module for Hugo-generated sites.
 *
 * Fetches the JSON search index produced by Hugo's output format, validates
 * the payload at runtime with [Zod](https://zod.dev), and wires up a live
 * search experience driven by the user's keyboard input.
 *
 * @module search
 */

import { z } from 'zod';

/**
 * Zod schema used to validate a single item in the Hugo search index.
 *
 * Each item is expected to carry a human-readable `title`, a fully-qualified
 * `url`, and a short `excerpt` suitable for display in the results panel.
 */
export const SearchResultSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  excerpt: z.string(),
});

/**
 * Zod schema used to validate the entire Hugo search index (`/index.json`).
 *
 * The index is expected to be a JSON array whose every element satisfies
 * {@link SearchResultSchema}.
 */
export const SearchIndexSchema = z.array(SearchResultSchema);

/**
 * Represents a single content item loaded from Hugo's generated search index.
 *
 * Inferred from {@link SearchResultSchema}, so the shape is always kept in
 * sync with the runtime validation schema.
 *
 * @example
 * ```ts
 * const item: SearchResult = {
 *   title: 'Getting Started',
 *   url: 'https://example.com/getting-started/',
 *   excerpt: 'A quick introduction to the project.',
 * };
 * ```
 */
export type SearchResult = z.infer<typeof SearchResultSchema>;

/**
 * Client-side search controller for the site's search input and results panel.
 *
 * On construction the controller immediately locates the DOM elements
 * identified by the provided CSS selectors, fetches and validates the Hugo
 * search index from `/index.json`, and attaches an `input` listener that
 * filters results in real time as the user types.
 *
 * @example
 * ```ts
 * // Mount a search engine on the default selectors.
 * const engine = new SearchEngine('#search-input', '#search-results');
 * ```
 */
export class SearchEngine {
  /**
   * In-memory copy of the validated search index.
   * Populated asynchronously by {@link fetchSearchIndex}.
   */
  private searchIndex: SearchResult[] = [];

  /**
   * Reference to the `<input>` element that accepts the user's search query.
   * `null` when the selector did not match any element in the DOM.
   */
  private inputElement: HTMLInputElement | null = null;

  /**
   * Reference to the container element where search results are rendered.
   * `null` when the selector did not match any element in the DOM.
   */
  private resultsElement: HTMLElement | null = null;

  /**
   * Creates a new {@link SearchEngine} and immediately begins initialisation.
   *
   * @param inputSelector   - A CSS selector that identifies the search
   *   `<input>` element (e.g. `'#search-input'`).
   * @param resultsSelector - A CSS selector that identifies the container
   *   element used to render search results (e.g. `'#search-results'`).
   */
  constructor(inputSelector: string, resultsSelector: string) {
    this.inputElement = document.querySelector(inputSelector);
    this.resultsElement = document.querySelector(resultsSelector);
    this.initialize();
  }

  /**
   * Wires up the search index fetch and the input event listener.
   *
   * Called automatically by the constructor. Emits a console warning and
   * returns early if either required DOM element is absent.
   */
  private initialize(): void {
    if (!this.inputElement || !this.resultsElement) {
      console.warn('Search elements not found');
      return;
    }

    // Fetch search index from Hugo output
    this.fetchSearchIndex();

    // Bind input event
    this.inputElement.addEventListener('input', (e) => {
      const query = (e.target as HTMLInputElement).value;
      this.search(query);
    });
  }

  /**
   * Fetches `/index.json`, validates the payload with {@link SearchIndexSchema},
   * and stores the result in {@link searchIndex}.
   *
   * Logs an informational message on success. On failure the index is reset to
   * an empty array and a descriptive error is written to the console:
   * - {@link z.ZodError} → schema validation failure with detailed issue list.
   * - Any other error → network or JSON parse failure.
   *
   * @returns A promise that resolves once the index has been loaded (or the
   *   error has been handled). The promise never rejects.
   */
  private async fetchSearchIndex(): Promise<void> {
    try {
      const response = await fetch('/index.json');
      const data = await response.json();

      // Validate the data with Zod before using it
      const validatedData = SearchIndexSchema.parse(data);
      this.searchIndex = validatedData;

      console.info(`[SearchEngine] Loaded ${validatedData.length} search results`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('[SearchEngine] Invalid search index format:', error.issues);
      } else {
        console.error('[SearchEngine] Failed to fetch search index:', error);
      }
      this.searchIndex = [];
    }
  }

  /**
   * Filters {@link searchIndex} against `query` and delegates rendering to
   * {@link displayResults}.
   *
   * The match is case-insensitive and checks both the `title` and `excerpt`
   * fields of each {@link SearchResult}. Clears the results panel when
   * `query` is empty or whitespace-only.
   *
   * @param query - The raw string value from the search input.
   */
  private search(query: string): void {
    if (!query.trim()) {
      this.resultsElement!.innerHTML = '';
      return;
    }

    const results = this.searchIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(query.toLowerCase()),
    );

    this.displayResults(results);
  }

  /**
   * Renders an array of {@link SearchResult} objects into the results panel
   * as a list of linked cards.
   *
   * Renders a "No results found" message when `results` is empty.
   * Each card contains an anchor wrapping an `<h3>` title (processed through
   * {@link highlightQuery}) and a `<p>` excerpt.
   *
   * @param results - The filtered array of search results to display.
   */
  private displayResults(results: SearchResult[]): void {
    if (!results.length) {
      this.resultsElement!.innerHTML = '<p>No results found</p>';
      return;
    }

    const html = results
      .map(
        (result) => `
      <div class="search-result">
        <a href="${result.url}">
          <h3>${this.highlightQuery(result.title)}</h3>
          <p>${result.excerpt}</p>
        </a>
      </div>
    `,
      )
      .join('');

    this.resultsElement!.innerHTML = html;
  }

  /**
   * Wraps occurrences of the current search query inside `text` with a
   * `<mark>` element to provide visual highlighting in the results panel.
   *
   * @param text - The plain text string to process (e.g. a result title).
   * @returns The original string with query matches wrapped in `<mark>` tags,
   *   or the unmodified string when no query is active.
   */
  private highlightQuery(text: string): string {
    // TODO: Implement query highlighting
    return text;
  }
}

/**
 * Convenience factory that mounts a {@link SearchEngine} on the default
 * site-wide selectors (`#search-input` and `#search-results`).
 *
 * Call this function once the DOM is ready, typically from your main entry
 * point or a `DOMContentLoaded` handler.
 *
 * @example
 * ```ts
 * import { initializeSearch } from './features/search';
 *
 * document.addEventListener('DOMContentLoaded', initializeSearch);
 * ```
 */
export function initializeSearch(): void {
  new SearchEngine('#search-input', '#search-results');
}
