import { readFileSync } from 'fs'
import { resolve } from 'path'
import { OptionDefaults } from 'typedoc'

// Dynamically read the name from package.json
const packageJson = JSON.parse(readFileSync(resolve('./package.json'), 'utf-8'))

const projectDocuments = [] // Add any additional markdown documents you want to include here

/** @type {Partial<import("typedoc").TypeDocOptions>} */
const config = {
    // --- Basic options ---
    name: `Development docs - ${packageJson.name}`,
    entryPointStrategy: 'expand',
    entryPoints: ['assets/ts'],
    exclude: ['**/*.test.{js,jsx,ts,tsx}', '**/*.d.ts'],
    out: 'docs/typedoc',
    tsconfig: './tsconfig.json',
    plugin: [],
    includeVersion: true,
    excludeReferences: false,
    visibilityFilters: {
        protected: false,
        private: false,
        inherited: false,
        external: false,
        '@alpha': false,
        '@beta': false,
    },
    logLevel: 'Verbose',
    projectDocuments: projectDocuments,
    hideGenerator: true,
    githubPages: false,
    categorizeByGroup: true,
    groupOrder: [
        'Modules',
        'Classes',
        'Interfaces',
        'Functions',
        'Enums',
        'Variables',
        'Type Aliases',
    ],
    navigationLinks: {},
    sidebarLinks: {},

    // --- TypeDoc display options ---
    excludePrivate: true,
    excludeInternal: true,
    excludeExternals: false,
    excludeProtected: false,
    sort: ['kind', 'alphabetical'],
    categoryOrder: ['*', 'Uncategorized'],
    readme: 'README.md',
    theme: 'default',
    pretty: true,
}

// @ts-expect-error Unused default export, this is definetly used by TypeDoc when generating docs
export default config
