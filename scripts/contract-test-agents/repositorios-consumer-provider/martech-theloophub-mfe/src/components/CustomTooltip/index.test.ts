jest.mock('hooks', () => ({
  useGoogleAnalytics: () => jest.fn(),
}));

import * as exports from './index';

describe('CustomTooltip index', () => {
  it('should export CustomTooltip component', () => {
    expect(exports.CustomTooltip).toBeDefined();
  });
});
