import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  test: {
    // Use happy-dom for fast DOM simulation
    environment: 'happy-dom',

    // Enable globals (describe, it, expect) without imports
    globals: true,

    // Coverage settings
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: 'docs/coverage',
      exclude: [
        'node_modules/**',
        'public/**',
        'themes/**',
        'assets/js/**', // Exclude compiled output
        '**/*.config.{js,ts}',
        '**/dist/**',
      ],
    },

    // Include centralized tests and optional colocated tests
    include: [
      'assets/ts/**/*.{test,spec}.ts',
      'tests/**/*.{test,spec}.ts'
    ],

    // Setup files (if needed)
    // setupFiles: ['./test/setup.ts'],
  },
  plugins: [tailwindcss()],
});
