import 'htmx.org';
import '@11ty/is-land/is-land.js';
import './components/hello-card';
import './components/interactive-card';
import { setupHTMXBridge, initializeComponents } from './htmx-bridge';

// Hugo site main TypeScript entry point
// Add your site-wide TypeScript code here

console.log('Hugo site loaded with TypeScript via Bun!');

/**
 * Applies the persisted dark-mode preference to the root document element.
 */
function initializeDarkMode(): void {
  const isDark = localStorage.getItem('darkMode') === 'true';
  if (isDark) {
    document.documentElement.classList.add('dark');
  }
}

/**
 * Enables smooth scrolling for in-page anchor navigation.
 */
function initializeSmoothScroll(): void {
  document.documentElement.style.scrollBehavior = 'smooth';
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeDarkMode();
    initializeSmoothScroll();
    setupHTMXBridge();
    initializeComponents();
  });
} else {
  initializeDarkMode();
  initializeSmoothScroll();
  setupHTMXBridge();
  initializeComponents();
}

// Export for use in other modules
export { initializeDarkMode, initializeSmoothScroll };
