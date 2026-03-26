/**
 * HTMX Bridge - Manages Web Component lifecycle across HTMX swaps
 *
 * This module ensures that Web Components are properly initialized
 * when HTMX swaps in new content containing custom elements.
 */

// Track all component initializers
const componentInitializers: Array<() => void> = [];

/**
 * Register a component initializer that will run on HTMX swaps
 * @param initializer - Function to run after HTMX content is swapped
 */
export function registerComponentInitializer(initializer: () => void): void {
  componentInitializers.push(initializer);
}

/**
 * Initialize all components in the given container
 * @param container - DOM element to scan for components (defaults to document)
 */
export function initializeComponents(container: Document | Element = document): void {
  componentInitializers.forEach((init) => init());

  // Dispatch custom event for component hydration
  const event = new CustomEvent('components:initialized', {
    detail: { container },
    bubbles: true,
    composed: true,
  });
  container.dispatchEvent(event);
}

/**
 * Setup HTMX event listeners for component lifecycle management
 */
export function setupHTMXBridge(): void {
  // Initialize components after HTMX loads new content
  document.body.addEventListener('htmx:load', (event) => {
    const target = (event as CustomEvent).detail.elt;
    console.debug('[htmx-bridge] Content loaded, initializing components', target);
    initializeComponents(target);
  });

  // Optional: Handle before swap for cleanup
  document.body.addEventListener('htmx:beforeSwap', (event) => {
    const target = (event as CustomEvent).detail.target;
    console.debug('[htmx-bridge] Before swap', target);

    // Dispatch cleanup event for components that need it
    const cleanupEvent = new CustomEvent('components:beforeCleanup', {
      detail: { target },
      bubbles: true,
      composed: true,
    });
    target.dispatchEvent(cleanupEvent);
  });

  // Optional: Handle swap errors
  document.body.addEventListener('htmx:responseError', (event) => {
    const detail = (event as CustomEvent).detail;
    console.error('[htmx-bridge] Response error', detail);
  });

  console.info('[htmx-bridge] Initialized');
}
