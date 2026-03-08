import { defineConfig } from 'vitest/config';

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

    // Include test files
    include: ['assets/ts/**/*.{test,spec}.ts'],

    // Setup files (if needed)
    // setupFiles: ['./test/setup.ts'],
  },
});

