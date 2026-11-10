import { QuickFilterEngine } from 'domain/Filter';

import { applyFilterRules, QUICK_FILTERS_COMPONENTS } from './index';

jest.mock('domain/Filter', () => ({
  QuickFilterEngine: {
    getInstance: jest.fn(),
  },
}));

describe('QuickFilters rules', () => {
  it('should register product_scope quick filter component', () => {
    expect(QUICK_FILTERS_COMPONENTS.product_scope).toBeDefined();
  });

  it('should pass quick filter component keys to engine', () => {
    const mockFilterFields = jest.fn().mockReturnValue(['product_scope']);
    (QuickFilterEngine.getInstance as jest.Mock).mockReturnValue({
      filterFields: mockFilterFields,
    });

    const result = applyFilterRules(['product_scope'], {
      pageName: 'value-creation_volume-pages',
      appliedFilters: {},
      dataFilters: {},
    });

    expect(QuickFilterEngine.getInstance).toHaveBeenCalledWith(
      Object.keys(QUICK_FILTERS_COMPONENTS),
    );
    expect(result).toEqual(['product_scope']);
  });
});
