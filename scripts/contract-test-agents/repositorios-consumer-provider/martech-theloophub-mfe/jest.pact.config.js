/**
 * Config isolada para testes de contrato Pact.
 * Não herda o jest.config.js principal pois:
 *  - Pact precisa de testEnvironment 'node' (não jsdom)
 *  - Não deve carregar setupFiles de browser (testing-library, ResizeObserver, etc.)
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '.*\\.pact\\.test\\.[tj]sx?$',
  testTimeout: 60000,
  maxWorkers: 1,
  roots: ['<rootDir>/src'],
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
    '^pact$': '<rootDir>/src/pact/index.ts',
    '^admin-portal-shared-services$':
      '<rootDir>/src/pact/authentication.mock.ts',
  },
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: { allowJs: true } }],
  },
  // <rootDir> ancora no primeiro node_modules do caminho, evitando
  // match espúrio no segundo node_modules/ aninhado do pact.
  // ESM root-level: colorette, fast-copy, proxy-from-env, proxy-agent-negotiate
  // ESM nested:     tudo sob @pact-foundation/pact/node_modules
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(colorette|fast-copy|proxy-from-env|proxy-agent-negotiate|@pact-foundation/pact/node_modules))',
  ],
};
