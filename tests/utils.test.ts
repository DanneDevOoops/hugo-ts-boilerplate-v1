import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Utilities } from '../assets/ts/utils';

describe('Utilities', () => {
  describe('debounce', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('delays execution until the wait time elapses', () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const debounced = Utilities.debounce(fn, 100);

      debounced();

      vi.advanceTimersByTime(99);
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('only invokes once for multiple rapid calls', () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const debounced = Utilities.debounce(fn, 80);

      debounced();
      debounced();
      debounced();

      vi.advanceTimersByTime(80);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('uses the latest arguments from the last call', () => {
      vi.useFakeTimers();
      const fn = vi.fn<(value: string) => void>();
      const debounced = Utilities.debounce(fn, 60);

      debounced('first');
      debounced('last');

      vi.advanceTimersByTime(60);
      expect(fn).toHaveBeenCalledWith('last');
    });
  });

  describe('formatDate', () => {
    it('formats a date in en-US long month style', () => {
      const date = new Date('2024-03-10T12:00:00Z');
      const formatted = Utilities.formatDate(date);

      expect(formatted).toContain('March');
      expect(formatted).toContain('2024');
    });

    it('includes day and year values for another date', () => {
      const date = new Date('2026-12-25T12:00:00Z');
      const formatted = Utilities.formatDate(date);

      expect(formatted).toContain('December');
      expect(formatted).toContain('25');
      expect(formatted).toContain('2026');
    });
  });

  describe('isInViewport', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="test"></div>';
    });

    const setRect = (element: Element, rect: Pick<DOMRect, 'top' | 'left' | 'bottom' | 'right'>) => {
      element.getBoundingClientRect = () => ({
        ...rect,
        width: rect.right - rect.left,
        height: rect.bottom - rect.top,
        x: rect.left,
        y: rect.top,
        toJSON: () => ({}),
      });
    };

    it('returns true when element is fully in viewport', () => {
      const element = document.getElementById('test')!;
      setRect(element, { top: 100, left: 100, bottom: 200, right: 200 });

      expect(Utilities.isInViewport(element)).toBe(true);
    });

    it('treats boundary-aligned elements as visible', () => {
      const element = document.getElementById('test')!;
      setRect(element, {
        top: 0,
        left: 0,
        bottom: window.innerHeight || document.documentElement.clientHeight,
        right: window.innerWidth || document.documentElement.clientWidth,
      });

      expect(Utilities.isInViewport(element)).toBe(true);
    });

    it('returns false when element is above viewport', () => {
      const element = document.getElementById('test')!;
      setRect(element, { top: -1, left: 100, bottom: 99, right: 200 });

      expect(Utilities.isInViewport(element)).toBe(false);
    });

    it('returns false when element exceeds right boundary', () => {
      const element = document.getElementById('test')!;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      setRect(element, { top: 10, left: viewportWidth - 20, bottom: 60, right: viewportWidth + 1 });

      expect(Utilities.isInViewport(element)).toBe(false);
    });

    it('falls back to documentElement dimensions when window dimensions are unavailable', () => {
      const element = document.getElementById('test')!;
      const innerHeightSpy = vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(0);
      const innerWidthSpy = vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(0);

      Object.defineProperty(document.documentElement, 'clientHeight', { value: 400, configurable: true });
      Object.defineProperty(document.documentElement, 'clientWidth', { value: 500, configurable: true });
      setRect(element, { top: 10, left: 10, bottom: 390, right: 490 });

      expect(Utilities.isInViewport(element)).toBe(true);

      innerHeightSpy.mockRestore();
      innerWidthSpy.mockRestore();
    });
  });
});
