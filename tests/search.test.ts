import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { z } from 'zod';
import {
  SearchResultSchema,
  SearchIndexSchema,
  SearchEngine,
  initializeSearch,
  type SearchResult,
} from '../assets/ts/features/search';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const validResult: SearchResult = {
  title: 'Hello World',
  url: 'https://example.com/hello',
  excerpt: 'A short description',
};

function setupDOM(inputId = 'search-input', resultsId = 'search-results') {
  document.body.innerHTML = `
    <input id="${inputId}" type="text" />
    <div id="${resultsId}"></div>
  `;
}

function getResults(): HTMLElement {
  return document.getElementById('search-results') as HTMLElement;
}

function getInput(): HTMLInputElement {
  return document.getElementById('search-input') as HTMLInputElement;
}

// ---------------------------------------------------------------------------
// Schema validation
// ---------------------------------------------------------------------------

describe('SearchResultSchema', () => {
  it('accepts a valid search result', () => {
    expect(() => SearchResultSchema.parse(validResult)).not.toThrow();
  });

  it('rejects a result with a missing title', () => {
    const { title: _omitted, ...noTitle } = validResult;
    expect(() => SearchResultSchema.parse(noTitle)).toThrow(z.ZodError);
  });

  it('rejects a result with a missing excerpt', () => {
    const { excerpt: _omitted, ...noExcerpt } = validResult;
    expect(() => SearchResultSchema.parse(noExcerpt)).toThrow(z.ZodError);
  });

  it('rejects a result with an invalid URL', () => {
    expect(() => SearchResultSchema.parse({ ...validResult, url: 'not-a-url' })).toThrow(
      z.ZodError,
    );
  });
});

describe('SearchIndexSchema', () => {
  it('accepts an empty array', () => {
    expect(() => SearchIndexSchema.parse([])).not.toThrow();
  });

  it('accepts an array of valid results', () => {
    expect(() => SearchIndexSchema.parse([validResult, validResult])).not.toThrow();
  });

  it('rejects an array that contains an invalid result', () => {
    expect(() => SearchIndexSchema.parse([{ title: 42, url: 'bad', excerpt: '' }])).toThrow(
      z.ZodError,
    );
  });

  it('rejects a non-array value', () => {
    expect(() => SearchIndexSchema.parse(validResult)).toThrow(z.ZodError);
  });
});

// ---------------------------------------------------------------------------
// SearchEngine
// ---------------------------------------------------------------------------

describe('SearchEngine', () => {
  beforeEach(() => {
    setupDOM();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------------------
  // Constructor / initialization
  // -------------------------------------------------------------------------

  describe('constructor', () => {
    it('warns when input element is not found', () => {
      vi.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify([])));
      new SearchEngine('#nonexistent-input', '#search-results');
      expect(console.warn).toHaveBeenCalledWith('Search elements not found');
    });

    it('warns when results element is not found', () => {
      vi.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify([])));
      new SearchEngine('#search-input', '#nonexistent-results');
      expect(console.warn).toHaveBeenCalledWith('Search elements not found');
    });

    it('does not warn when both elements exist', () => {
      vi.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify([])));
      new SearchEngine('#search-input', '#search-results');
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // fetchSearchIndex
  // -------------------------------------------------------------------------

  describe('fetchSearchIndex', () => {
    it('loads valid index data from /index.json', async () => {
      const index = [validResult];
      vi.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify(index)));

      new SearchEngine('#search-input', '#search-results');

      // Allow microtasks to flush
      await vi.waitFor(() => {
        expect(console.info).toHaveBeenCalledWith(
          '[SearchEngine] Loaded 1 search results',
        );
      });
    });

    it('logs a ZodError when the response has invalid shape', async () => {
      const badData = [{ title: 123, url: 'bad', excerpt: null }];
      vi.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify(badData)));

      new SearchEngine('#search-input', '#search-results');

      await vi.waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          '[SearchEngine] Invalid search index format:',
          expect.any(Array),
        );
      });
    });

    it('logs a generic error when fetch rejects', async () => {
      vi.spyOn(global, 'fetch').mockRejectedValue(new Error('network failure'));

      new SearchEngine('#search-input', '#search-results');

      await vi.waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          '[SearchEngine] Failed to fetch search index:',
          expect.any(Error),
        );
      });
    });

    it('fetches from /index.json', async () => {
      const fetchSpy = vi
        .spyOn(global, 'fetch')
        .mockResolvedValue(new Response(JSON.stringify([])));

      new SearchEngine('#search-input', '#search-results');

      await vi.waitFor(() => expect(fetchSpy).toHaveBeenCalledWith('/index.json'));
    });
  });

  // -------------------------------------------------------------------------
  // search / displayResults (via input events)
  // -------------------------------------------------------------------------

  describe('search', () => {
    const index: SearchResult[] = [
      { title: 'TypeScript Guide', url: 'https://example.com/ts', excerpt: 'A guide to TypeScript' },
      { title: 'Go Basics', url: 'https://example.com/go', excerpt: 'Getting started with Go' },
      { title: 'Hugo Static Sites', url: 'https://example.com/hugo', excerpt: 'Build sites with Hugo' },
    ];

    async function buildEngine(): Promise<SearchEngine> {
      vi.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify(index)));
      const engine = new SearchEngine('#search-input', '#search-results');
      // Wait for the index to load
      await vi.waitFor(() =>
        expect(console.info).toHaveBeenCalledWith(`[SearchEngine] Loaded ${index.length} search results`),
      );
      return engine;
    }

    it('clears results when the query is empty', async () => {
      await buildEngine();
      const input = getInput();

      // First put something in results
      input.value = 'TypeScript';
      input.dispatchEvent(new Event('input'));
      expect(getResults().innerHTML).not.toBe('');

      // Now clear
      input.value = '';
      input.dispatchEvent(new Event('input'));
      expect(getResults().innerHTML).toBe('');
    });

    it('clears results when query is only whitespace', async () => {
      await buildEngine();
      const input = getInput();

      input.value = '   ';
      input.dispatchEvent(new Event('input'));
      expect(getResults().innerHTML).toBe('');
    });

    it('finds results that match the title', async () => {
      await buildEngine();
      const input = getInput();

      input.value = 'TypeScript';
      input.dispatchEvent(new Event('input'));

      expect(getResults().innerHTML).toContain('TypeScript Guide');
      expect(getResults().innerHTML).not.toContain('Go Basics');
    });

    it('finds results that match the excerpt', async () => {
      await buildEngine();
      const input = getInput();

      input.value = 'Getting started';
      input.dispatchEvent(new Event('input'));

      expect(getResults().innerHTML).toContain('Go Basics');
      expect(getResults().innerHTML).not.toContain('TypeScript Guide');
    });

    it('is case-insensitive', async () => {
      await buildEngine();
      const input = getInput();

      input.value = 'typescript';
      input.dispatchEvent(new Event('input'));

      expect(getResults().innerHTML).toContain('TypeScript Guide');
    });

    it('returns multiple results when the query matches several items', async () => {
      await buildEngine();
      const input = getInput();

      // "with" appears in both Go and Hugo excerpts
      input.value = 'with';
      input.dispatchEvent(new Event('input'));

      expect(getResults().innerHTML).toContain('Go Basics');
      expect(getResults().innerHTML).toContain('Hugo Static Sites');
    });

    it('shows "No results found" when there are no matches', async () => {
      await buildEngine();
      const input = getInput();

      input.value = 'xyzzy-no-match';
      input.dispatchEvent(new Event('input'));

      expect(getResults().innerHTML).toContain('No results found');
    });
  });

  // -------------------------------------------------------------------------
  // displayResults – rendered HTML
  // -------------------------------------------------------------------------

  describe('displayResults HTML output', () => {
    it('renders anchor links with the correct href', async () => {
      const index: SearchResult[] = [validResult];
      vi.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify(index)));
      const engine = new SearchEngine('#search-input', '#search-results');
      await vi.waitFor(() => expect(console.info).toHaveBeenCalled());

      const input = getInput();
      input.value = 'Hello';
      input.dispatchEvent(new Event('input'));

      const link = getResults().querySelector('a');
      expect(link?.getAttribute('href')).toBe(validResult.url);
    });

    it('renders the title inside an <h3>', async () => {
      const index: SearchResult[] = [validResult];
      vi.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify(index)));
      new SearchEngine('#search-input', '#search-results');
      await vi.waitFor(() => expect(console.info).toHaveBeenCalled());

      const input = getInput();
      input.value = 'Hello';
      input.dispatchEvent(new Event('input'));

      const h3 = getResults().querySelector('h3');
      expect(h3?.textContent).toBe(validResult.title);
    });

    it('renders the excerpt in a <p>', async () => {
      const index: SearchResult[] = [validResult];
      vi.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify(index)));
      new SearchEngine('#search-input', '#search-results');
      await vi.waitFor(() => expect(console.info).toHaveBeenCalled());

      const input = getInput();
      input.value = 'Hello';
      input.dispatchEvent(new Event('input'));

      const p = getResults().querySelector('p');
      expect(p?.textContent).toBe(validResult.excerpt);
    });

    it('wraps each result in a .search-result div', async () => {
      const index: SearchResult[] = [validResult, { ...validResult, title: 'Second' }];
      vi.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify(index)));
      new SearchEngine('#search-input', '#search-results');
      await vi.waitFor(() => expect(console.info).toHaveBeenCalled());

      const input = getInput();
      // 'short' appears in the shared excerpt of both results
      input.value = 'short';
      input.dispatchEvent(new Event('input'));

      const cards = getResults().querySelectorAll('.search-result');
      expect(cards.length).toBe(2);
    });
  });
});

// ---------------------------------------------------------------------------
// initializeSearch
// ---------------------------------------------------------------------------

describe('initializeSearch', () => {
  beforeEach(() => {
    setupDOM();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not throw with the expected DOM elements present', () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response(JSON.stringify([])));
    expect(() => initializeSearch()).not.toThrow();
  });

  it('uses #search-input and #search-results selectors', () => {
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify([])));

    initializeSearch();

    // fetch is called only after the DOM elements are found (no warn)
    expect(console.warn).not.toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledWith('/index.json');
  });
});

