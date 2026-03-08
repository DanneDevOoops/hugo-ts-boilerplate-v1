/**
 * DOM setup for Bun's native test runner.
 * Registers happy-dom globals so tests that use `document`, `window`, etc. work correctly.
 */
import { Window } from 'happy-dom';

const happyWindow = new Window({ url: 'https://localhost/', width: 1024, height: 768 });

// Expose DOM globals used by tests
Object.defineProperty(globalThis, 'window', {
  value: happyWindow,
  writable: true,
  configurable: true,
});
Object.defineProperty(globalThis, 'document', {
  value: happyWindow.document,
  writable: true,
  configurable: true,
});
Object.defineProperty(globalThis, 'navigator', {
  value: happyWindow.navigator,
  writable: true,
  configurable: true,
});
Object.defineProperty(globalThis, 'location', {
  value: happyWindow.location,
  writable: true,
  configurable: true,
});
Object.defineProperty(globalThis, 'history', {
  value: happyWindow.history,
  writable: true,
  configurable: true,
});
Object.defineProperty(globalThis, 'HTMLElement', {
  value: happyWindow.HTMLElement,
  writable: true,
  configurable: true,
});
Object.defineProperty(globalThis, 'Element', {
  value: happyWindow.Element,
  writable: true,
  configurable: true,
});
Object.defineProperty(globalThis, 'CustomEvent', {
  value: happyWindow.CustomEvent,
  writable: true,
  configurable: true,
});
Object.defineProperty(globalThis, 'Event', {
  value: happyWindow.Event,
  writable: true,
  configurable: true,
});
Object.defineProperty(globalThis, 'MutationObserver', {
  value: happyWindow.MutationObserver,
  writable: true,
  configurable: true,
});

