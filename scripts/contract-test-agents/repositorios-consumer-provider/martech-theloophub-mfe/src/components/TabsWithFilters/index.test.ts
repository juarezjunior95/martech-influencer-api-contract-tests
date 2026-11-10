jest.mock('./TabsWithFilters', () => ({
  TabsWithFilters: () => null,
}));

jest.mock('./TabsWithDynamicFilters', () => ({
  TabsWithDynamicFilters: () => null,
}));

import * as TabsWithFiltersExports from './index';

describe('TabsWithFilters index exports', () => {
  it('should export TabsWithFilters', () => {
    expect(TabsWithFiltersExports.TabsWithFilters).toBeDefined();
  });

  it('should export TabsWithDynamicFilters', () => {
    expect(TabsWithFiltersExports.TabsWithDynamicFilters).toBeDefined();
  });
});
