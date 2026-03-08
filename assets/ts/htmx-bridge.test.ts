import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setupHTMXBridge, initializeComponents, registerComponentInitializer } from './htmx-bridge';

describe('HTMX Bridge', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('registerComponentInitializer', () => {
    it('should register an initializer function', () => {
      const initializer = vi.fn();
      registerComponentInitializer(initializer);

      initializeComponents();

      expect(initializer).toHaveBeenCalledTimes(1);
    });

    it('should register multiple initializers', () => {
      const init1 = vi.fn();
      const init2 = vi.fn();

      registerComponentInitializer(init1);
      registerComponentInitializer(init2);

      initializeComponents();

      expect(init1).toHaveBeenCalledTimes(1);
      expect(init2).toHaveBeenCalledTimes(1);
    });
  });

  describe('initializeComponents', () => {
    it('should dispatch components:initialized event', () => {
      const eventHandler = vi.fn();
      document.addEventListener('components:initialized', eventHandler);

      initializeComponents();

      expect(eventHandler).toHaveBeenCalledTimes(1);
      expect(eventHandler.mock.calls[0][0]).toBeInstanceOf(CustomEvent);
    });

    it('should work with custom container', () => {
      const container = document.createElement('div');
      const eventHandler = vi.fn();
      container.addEventListener('components:initialized', eventHandler);

      initializeComponents(container);

      expect(eventHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('setupHTMXBridge', () => {
    it('should set up event listeners', () => {
      const addEventListenerSpy = vi.spyOn(document.body, 'addEventListener');

      setupHTMXBridge();

      expect(addEventListenerSpy).toHaveBeenCalledWith('htmx:load', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('htmx:beforeSwap', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('htmx:responseError', expect.any(Function));
    });

    it('should handle htmx:load event', () => {
      setupHTMXBridge();

      const mockElement = document.createElement('div');
      const event = new CustomEvent('htmx:load', {
        detail: { elt: mockElement },
      });

      const eventHandler = vi.fn();
      mockElement.addEventListener('components:initialized', eventHandler);

      document.body.dispatchEvent(event);

      expect(eventHandler).toHaveBeenCalled();
    });

    it('should handle htmx:beforeSwap event', () => {
      const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
      setupHTMXBridge();

      const mockElement = document.createElement('div');
      const event = new CustomEvent('htmx:beforeSwap', {
        detail: { target: mockElement },
      });

      document.body.dispatchEvent(event);

      expect(consoleSpy).toHaveBeenCalledWith('[htmx-bridge] Before swap', mockElement);
    });
  });
});

