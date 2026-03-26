/**
 * Shared browser utility helpers used across the site's TypeScript modules.
 */
export const Utilities = {
  /**
   * Debounce a function
   */
  debounce(func: (...args: unknown[]) => unknown, delay: number): (...args: unknown[]) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (...args: unknown[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },

  /**
   * Format date to readable string
   */
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  },

  /**
   * Check if element is in viewport
   */
  isInViewport(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },
};
