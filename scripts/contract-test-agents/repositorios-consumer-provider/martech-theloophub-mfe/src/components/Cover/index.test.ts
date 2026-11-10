jest.mock('assets/logo.png', () => 'logo.png');

jest.mock('components', () => ({
  Skeleton: () => null,
}));

import * as exports from './index';

describe('Cover index', () => {
  it('should export Cover component', () => {
    expect(exports.Cover).toBeDefined();
  });
});
