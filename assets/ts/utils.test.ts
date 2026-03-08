import { describe, it, expect, beforeEach } from 'vitest';
import { Utilities } from './utils';

describe('Utilities', () => {
  describe('debounce', () => {
    it('should delay function execution', async () => {
      let callCount = 0;
      const fn = () => callCount++;
      const debounced = Utilities.debounce(fn, 100);

      debounced();
      debounced();
      debounced();

      expect(callCount).toBe(0);

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(callCount).toBe(1);
    });

    it('should only call function once after multiple rapid calls', async () => {
      let callCount = 0;
      const fn = () => callCount++;
      const debounced = Utilities.debounce(fn, 50);

      debounced();
      debounced();
      debounced();
      debounced();

      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(callCount).toBe(1);
    });
  });

  describe('formatDate', () => {
    it('should format date to readable string', () => {
      const date = new Date('2024-03-10T12:00:00Z');
      const formatted = Utilities.formatDate(date);

      expect(formatted).toContain('March');
      expect(formatted).toContain('10');
      expect(formatted).toContain('2024');
    });

    it('should handle different dates', () => {
      const date = new Date('2026-12-25T00:00:00Z');
      const formatted = Utilities.formatDate(date);

      expect(formatted).toContain('December');
      expect(formatted).toContain('25');
      expect(formatted).toContain('2026');
    });
  });

  describe('isInViewport', () => {
    beforeEach(() => {
      // Mock getBoundingClientRect
      document.body.innerHTML = '<div id="test"></div>';
    });

    it('should return true for element in viewport', () => {
      const element = document.getElementById('test')!;

      // Mock the method to return viewport-visible coordinates
      element.getBoundingClientRect = () => ({
        top: 100,
        left: 100,
        bottom: 200,
        right: 200,
        width: 100,
        height: 100,
        x: 100,
        y: 100,
        toJSON: () => ({}),
      });

      expect(Utilities.isInViewport(element)).toBe(true);
    });

    it('should return false for element above viewport', () => {
      const element = document.getElementById('test')!;

      // Mock the method to return above-viewport coordinates
      element.getBoundingClientRect = () => ({
        top: -100,
        left: 100,
        bottom: -10,
        right: 200,
        width: 100,
        height: 90,
        x: 100,
        y: -100,
        toJSON: () => ({}),
      });

      expect(Utilities.isInViewport(element)).toBe(false);
    });
  });
});
