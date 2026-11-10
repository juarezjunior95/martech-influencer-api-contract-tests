const isCI = Boolean(process.env.CI || process.env.TF_BUILD);

const babelTranspiledNodeModulePattern = [
  '@hexa-ui',
  '@reduxjs',
  'uuid',
  'query-string',
  'decode-uri-component',
  'split-on-first',
  'filter-obj',
  'admin-portal-shared-services',
  'martech-portal-shared-services',
  'jspdf',
  'fflate',
  'fast-png',
  'react-markdown',
  'remark.*',
  'rehype.*',
  'unified',
  'vfile.*',
  'unist.*',
  'mdast.*',
  'micromark.*',
  'hast-.*',
  'hastscript',
  'estree-.*',
  'devlop',
  'html-url-attributes',
  'html-void-elements',
  'parse5',
  'trim-lines',
  'property-information',
  'space-separated-tokens',
  'comma-separated-tokens',
  'web-namespaces',
  'decode-named-character-reference',
  'character-entities',
  'mdurl',
  'uc\\.micro',
  'bail',
  'trough',
  'is-plain-obj',
  'zwitch',
  'extend',
  'escape-string-regexp',
  'ccount',
  'markdown-table',
  'longest-streak',
].join('|');

const ciWorkerTuning = isCI
  ? {
      maxWorkers: process.env.JEST_MAX_WORKERS || '100%',
      workerIdleMemoryLimit: process.env.JEST_WORKER_IDLE_MEMORY_LIMIT || '35%',
    }
  : {};

const ciReporting = isCI
  ? {
      testResultsProcessor: 'jest-sonar-reporter',
      reporters: [
        'default',
        [
          'jest-junit',
          {
            suiteName: 'jest tests',
            outputDirectory: './reports/',
            outputName: 'junit.xml',
            classNameTemplate: '{classname} - {title}',
            titleTemplate: '{classname} - {title}',
            ancestorSeparator: ' > ',
            usePathForSuiteName: 'true',
          },
        ],
      ],
    }
  : {};

module.exports = {
  clearMocks: true,
  // Caminho estável (raiz do repo) para cache de transformação/haste — fácil de cachear no CI (ex.: Cache@2 no Azure).
  cacheDirectory: '<rootDir>/.jest-cache',
  roots: ['<rootDir>/src'],
  testEnvironment: 'jest-environment-jsdom',
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/config/setupTests.ts'],
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  testRegex: '((\\.|/*.)(test))\\.[tj]sx?$',
  coverageDirectory: 'reports',
  coverageReporters: ['cobertura', 'html', 'lcov', 'text-summary', 'text'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/__mocks/**/*',
    '!src/**/mocks/**/*',
    '!src/**/*.styles.{ts,tsx}',
    '!src/**/*.style.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/types/**/*.{ts,tsx}',
    '!src/martech-theloophub-mfe.tsx',
    '!src/config/featureToggle.ts',
    '!src/models/**/*.ts',
    '!src/theme/**/*.{ts,tsx}',
    '!src/**/schemas/**/*.ts',
    '!src/**/enums/**/*.ts',
    '!src/shared/Styles/**/*.ts',
    '!src/shared/constants.tsx',
    '!src/**/constants/**/*.{ts,tsx}',
    'src/pages/components/PortfolioPerformance/constants/**/*.{ts,tsx}',
    'src/pages/components/PnlTable/config/constants/**/*.{ts,tsx}',
    'src/pages/pillars/PortfolioBrand/BrandAnalysis/tabs/BrandPower/components/BipTable/config/constants/headerConfigs.ts',
    '!src/**/formatters/**',
    '!src/Api/**/*.ts',
    '!src/pages/development/**/*',
    '!src/**/plugins/index.ts',
    '!src/**/examples/**/*.tsx',
    '!src/**/Icon/**/*.tsx',
  ],

  coverageThreshold: {
    global: {
      branches: 75,
      lines: 85,
      functions: 80,
      statements: 85,
    },
  },
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
    '\\.css$': 'identity-obj-proxy',
    '\\.(svg|png|pdf)$': '<rootDir>/config/mocks/fileMock.ts',
    '^@reduxjs/toolkit/query/react$':
      '<rootDir>/node_modules/@reduxjs/toolkit/dist/query/react/cjs/rtk-query-react.development.cjs',
    '^@reduxjs/toolkit/query$':
      '<rootDir>/node_modules/@reduxjs/toolkit/dist/query/cjs/rtk-query.development.cjs',
    '^@reduxjs/toolkit$':
      '<rootDir>/node_modules/@reduxjs/toolkit/dist/cjs/redux-toolkit.development.cjs',
    '^redux/(.*)$': '<rootDir>/src/redux/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    `node_modules/(?!(${babelTranspiledNodeModulePattern})/)`,
  ],

  ...ciWorkerTuning,
  ...ciReporting,
};
