// Example: Theme switcher with TypeScript
// File: assets/ts/features/theme-switcher.ts

/** Available theme modes for the site UI. */
export type Theme = 'light' | 'dark' | 'auto';

/**
 * Persists and applies the current color theme for the document.
 *
 * The `'auto'` mode follows the user's operating system preference.
 */
export class ThemeSwitcher {
  private theme: Theme = 'auto';
  private htmlElement: HTMLElement;
  private storageKey = 'app-theme';

  constructor() {
    this.htmlElement = document.documentElement;
    this.loadTheme();
    this.setupMediaQueryListener();
  }

  private loadTheme(): void {
    const stored = localStorage.getItem(this.storageKey) as Theme | null;
    this.theme = stored || 'auto';
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.htmlElement.classList.toggle('dark', prefersDark);
    } else {
      this.htmlElement.classList.toggle('dark', this.theme === 'dark');
    }
  }

  private setupMediaQueryListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (this.theme === 'auto') {
        this.applyTheme();
      }
    });
  }

  /**
   * Sets the active theme and stores the preference in local storage.
   */
  public setTheme(theme: Theme): void {
    this.theme = theme;
    localStorage.setItem(this.storageKey, theme);
    this.applyTheme();
  }

  /**
   * Returns the currently selected theme preference.
   */
  public getTheme(): Theme {
    return this.theme;
  }

  /**
   * Cycles through `light`, `dark`, and `auto` theme modes.
   */
  public toggle(): void {
    if (this.theme === 'light') {
      this.setTheme('dark');
    } else if (this.theme === 'dark') {
      this.setTheme('auto');
    } else {
      this.setTheme('light');
    }
  }
}

// Usage in main.ts:
// const themeSwitcher = new ThemeSwitcher();
//
// // Add click handler to theme button
// document.getElementById('theme-toggle')?.addEventListener('click', () => {
//   themeSwitcher.toggle();
// });
