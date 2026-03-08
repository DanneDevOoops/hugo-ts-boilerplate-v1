// Example: Feature module for search functionality
// File: assets/ts/features/search.ts

import { z } from 'zod';

// Zod schema for runtime validation
export const SearchResultSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  excerpt: z.string(),
});

export const SearchIndexSchema = z.array(SearchResultSchema);

// TypeScript type derived from Zod schema (keeps type and validation in sync)
export type SearchResult = z.infer<typeof SearchResultSchema>;

export class SearchEngine {
  private searchIndex: SearchResult[] = [];
  private inputElement: HTMLInputElement | null = null;
  private resultsElement: HTMLElement | null = null;

  constructor(inputSelector: string, resultsSelector: string) {
    this.inputElement = document.querySelector(inputSelector);
    this.resultsElement = document.querySelector(resultsSelector);
    this.initialize();
  }

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

  private highlightQuery(text: string): string {
    // TODO: Implement query highlighting
    return text;
  }
}

export function initializeSearch(): void {
  new SearchEngine('#search-input', '#search-results');
}
