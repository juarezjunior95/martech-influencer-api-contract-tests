jest.mock('components', () => ({
  Skeleton: () => null,
}));

jest.mock('components/NoDataYet/NoDataYet', () => ({
  __esModule: true,
  default: () => null,
}));

import * as exports from './index';

describe('DataStateHandler index', () => {
  it('should export DataStateHandler component', () => {
    expect(exports.DataStateHandler).toBeDefined();
  });
});
