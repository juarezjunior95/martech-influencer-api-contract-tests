jest.mock('admin-portal-shared-services', () => ({
  useEnvService: () => ({
    getEnv: () => 'DEV',
  }),
}));

jest.mock('components', () => ({
  ErrorContainer: () => null,
}));

import * as exports from './index';

describe('ErrorBoundary index', () => {
  it('should export ErrorBoundary component', () => {
    expect(exports.ErrorBoundary).toBeDefined();
  });

  it('should export ErrorTrigger component', () => {
    expect(exports.ErrorTrigger).toBeDefined();
  });
});
