import { readFileSync } from 'fs'
import { resolve } from 'path'
import { OptionDefaults } from 'typedoc'
// import type { NavigationJSON } from 'typedoc-plugin-markdown'

// Dynamically read the name from package.json
const packageJson = JSON.parse(readFileSync(resolve('./package.json'), 'utf-8'))

const projectDocuments = [] // Add any additional markdown documents you want to include here

/** @type {Partial<import("typedoc").TypeDocOptionMap> & import('typedoc-plugin-merge-modules').Config} */
const config = {
  // --- Basic options ---
  name: `Development docs - ${packageJson.name}`,
  entryPointStrategy: 'expand', // required for rename-defaults plugin to work properly!
  entryPoints: ['assets/ts/'],
  exclude: ['**/*.test.{js,jsx,ts,tsx}', '**/*.d.ts'],
  tsconfig: './tsconfig.json',
  cacheBust: true,
  useTsLinkResolution: true,
  plugin: [
    // --- Themes ---
    'typedoc-material-theme',

    // --- Plugins ---
    'typedoc-plugin-import-target',
    'typedoc-plugin-missing-exports',
    'typedoc-plugin-rename-defaults',

    // 'typedoc-plugin-md',
    // 'typedoc-plugin-markdown',
    // 'typedoc-plugin-frontmatter',

    // --- Links & Structure ---
    'typedoc-plugin-merge-modules',
    'typedoc-plugin-dt-links',
    'typedoc-plugin-mdn-links',
    'typedoc-plugin-redirect',
    'typedoc-plugin-language-switcher',

    // --- AI prepare ---
    '@to-skills/typedoc',

    // --- Diagrams & Coverage---
    'typedoc-plugin-coverage',
    '@boneskull/typedoc-plugin-mermaid',
    'typedoc-umlclass',
  ],

  redirects: {
    // If the value starts with http[s]://, it will redirect to an external site.
    'example.html': 'https://example.com',
    // If the value starts with a slash, the link will be included verbatim.
    'contact.html': '/cgi-bin/contact.php',
    // Otherwise, the link will be interpreted relative to the output directory.
    'DocsClass.html': 'api/classes/DocsClass.html',
    // If the key ends with a trailing slash, "/index.html" will be appended to form
    // the output file name. The following two entries are equivalent.
    'options/': 'documents/Options.html',
    'options/index.html': 'documents/Options.html',
  },

  // --- TypeDoc display options ------------------------------------
  languages: ['en-us', 'sv-se'],
  highlightLanguages: [...OptionDefaults.highlightLanguages, 'toml', 'mermaid'],
  pretty: true,
  includeVersion: true,
  excludeReferences: false,
  visibilityFilters: {
    protected: false,
    private: false,
    inherited: true,
    external: true,
    '@alpha': false,
    '@beta': false,
  },
  excludePrivate: true,
  excludeInternal: true,
  excludeExternals: false,
  excludeProtected: false,
  sort: ['kind', 'alphabetical'],
  categoryOrder: ['*', 'Uncategorized'],
  readme: 'README.md',
  logLevel: 'Info',

  compilerOptions: {
    skipLibCheck: true,
    strictNullChecks: false,
  },

  // Theme Options - typedoc-material-theme -------------------------
  // themeColor: '#cb9820',

  // Plugin - typedoc-plugin-coverage -------------------------------
  router: 'kind-dir',
  coverageLabel: 'Documentation',
  coverageColor: '#cb9820',
  coverageOutputPath: 'docs/typedoc/badges/typedoc-coverage.svg',
  coverageOutputType: 'all',
  coverageSvgWidth: 200,

  // Plugin - typedoc-plugin-dt-links -------------------------------
  // If set, and an @types package is referenced which is newer than
  // this plugin, produces a warning as this plugin won't be able to
  // produce a stable link.
  warnOnUnstableDtLink: false, // default: true

  // Plugin - typedoc-plugin-missing-exports ------------------------
  internalModule: true,
  collapseInternalModule: false,
  // placeInternalsInOwningModule: true,
  includeDocCommentReferences: true,

  // Plugin - @boneskull/typedoc-plugin-mermaid ---------------------
  ignoredHighlightLanguages: ['mermaid'],
  mermaidSource: 'cdn',
  mermaidCdnUrl: 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs',

  // Plugin - typedoc-plugin-merge-modules --------------------------
  mergeModulesRenameDefaults: false,
  mergeModulesMergeMode: 'module', // options: "project", "module", "module-category", "off"

  // Plugin - typedoc-plugin-import-target --------------------------
  importTarget: {
    // Force "ts" language for code blocks
    codeBlockLang: 'ts',
    // Ignore package.json "exports" field
    ignorePackageExports: true,
    // Write your own injection logic
    inject(reflection, name, importTarget, lang) {
      // ...
    },
  },

  // Plugin - @to-skills/typedoc ------------------------------------
  skillsOutDir: 'docs/typedoc/skills',
  skillsPerPackage: true,
  skillsIncludeExamples: true,
  skillsIncludeSignatures: true,
  skillsMaxTokens: 4000,
  skillsNamePrefix: 'Development',
  skillsLicense: 'MIT',
  llmsTxt: true,
  llmsTxtOutDir: 'docs/typedoc/llms',

  //
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

  externalSymbolLinkMappings: {
    'lit-element': {
      LitElement: 'https://lit.dev/docs/api/LitElement/',
    },
  },

  outputs: [
    {
      name: 'html', // built-in HTML renderer
      path: 'docs/typedoc/html/',
      cleanOutputDir: true,
      options: {
        navigation: {
          includeCategories: true,
          includeGroups: true,
          excludeReferences: false,
          includeFolders: true,
        },
      },
    },
    {
      name: 'json',
      path: 'docs/typedoc/json/typedoc.json',
      cleanOutputDir: true,
    },
    // {
    //   name: 'markdown',
    //   path: 'docs/typedoc/md/',
    //   structure: 'member',
    //   cleanOutputDir: true,
    // },
  ],

  // TODO: Fix this config to not fail on markdown output.
  // Plugin Options - typedoc-umlclass
  umlClassDiagram: {
    type: 'detailed',
    location: 'embed',
    format: 'png',
    legendType: 'only-included',
    hideShadow: false,
    memberOrder: 'private-to-public',
    topDownLayoutMaxSiblings: 10,
    visibilityStyle: 'text',
    generatorProcessCount: 4,
    hideProgressBar: false,
    createPlantUmlFiles: true,
    position: 'above',
    verboseOutput: false, // TODO: Only for debug, turn this option off in CICD or production.
  },
};

// @ts-expect-error Unused default export, this is definetly used by TypeDoc when generating docs
export default config
