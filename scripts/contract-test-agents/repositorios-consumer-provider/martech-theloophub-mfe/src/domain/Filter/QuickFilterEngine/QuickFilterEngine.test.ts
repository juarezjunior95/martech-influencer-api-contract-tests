import { FilterDataStructure } from 'models/Filters';

import FilterRegistry from '../FilterRegistry/FilterRegistry';
import QuickFilterEngine, { QuickFilterContext } from './QuickFilterEngine';

jest.mock('../FilterRegistry/FilterRegistry');

describe('QuickFilterEngine', () => {
  let engine: QuickFilterEngine;
  let mockRegistry: jest.Mocked<FilterRegistry>;

  const mockContext: QuickFilterContext = {
    fieldKey: 'country',
    pageName: 'test-page',
    appliedFilters: {},
    dataFilters: {} as FilterDataStructure,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (QuickFilterEngine as any).instance = null;

    mockRegistry = {
      has: jest.fn(),
      get: jest.fn(),
    } as any;

    (FilterRegistry.getInstance as jest.Mock).mockReturnValue(mockRegistry);

    engine = QuickFilterEngine.getInstance([
      'zone',
      'country',
      'brands',
      'sub_brands',
    ]);
  });

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = QuickFilterEngine.getInstance(['zone']);
      const instance2 = QuickFilterEngine.getInstance(['zone']);

      expect(instance1).toBe(instance2);
    });
  });

  describe('isRegisteredInFilterRegistry rule', () => {
    it('should return true when field is registered', () => {
      mockRegistry.has.mockReturnValue(true);
      mockRegistry.get.mockReturnValue({
        validator: jest.fn().mockReturnValue(true),
      } as any);

      const result = engine.validateField({
        ...mockContext,
        appliedFilters: { country: 'ABI' },
      });

      expect(mockRegistry.has).toHaveBeenCalledWith('country');
      expect(result).toBe(true);
    });

    it('should return false when field is not registered', () => {
      mockRegistry.has.mockReturnValue(false);

      const result = engine.validateField(mockContext);

      expect(result).toBe(false);
    });
  });

  describe('hasQuickFilterComponent rule', () => {
    it('should return true when component is available', () => {
      mockRegistry.has.mockReturnValue(true);
      mockRegistry.get.mockReturnValue({
        validator: jest.fn().mockReturnValue(true),
      } as any);

      const result = engine.validateField({
        ...mockContext,
        fieldKey: 'country',
        appliedFilters: { country: 'ABI' },
      });

      expect(result).toBe(true);
    });

    it('should return false when component is not available', () => {
      mockRegistry.has.mockReturnValue(true);
      mockRegistry.get.mockReturnValue({
        validator: jest.fn().mockReturnValue(true),
      } as any);

      const result = engine.validateField({
        ...mockContext,
        fieldKey: 'nonexistent',
      });

      expect(result).toBe(false);
    });

    it('should return false when quickFilter is disabled in metadata', () => {
      mockRegistry.has.mockReturnValue(true);
      mockRegistry.get.mockReturnValue({
        metadata: { quickFilter: false },
        validator: jest.fn().mockReturnValue(true),
      } as any);

      const result = engine.validateField({
        ...mockContext,
        fieldKey: 'zone',
        appliedFilters: { country: 'ABI' },
      });

      expect(result).toBe(false);
    });
  });

  describe('dependenciesAreSatisfied rule', () => {
    beforeEach(() => {
      mockRegistry.has.mockReturnValue(true);
      mockRegistry.get.mockReturnValue({
        validator: jest.fn().mockReturnValue(true),
      } as any);
    });

    it('should show country when zone is not ABI', () => {
      const result = engine.validateField({
        ...mockContext,
        fieldKey: 'country',
        appliedFilters: { zone: 'LATAM' },
      });

      expect(result).toBe(true);
    });

    it('should hide brands when brands is All', () => {
      const result = engine.validateField({
        ...mockContext,
        fieldKey: 'brands',
        appliedFilters: { brands: 'All' },
      });

      expect(result).toBe(false);
    });

    it('should show brands normally when sub_brands is selected on non-PT pages', () => {
      const result = engine.validateField({
        ...mockContext,
        fieldKey: 'brands',
        appliedFilters: { brands: 'Brahma', sub_brands: 'Brahma Chopp' },
      });

      expect(result).toBe(true);
    });

    it('should show brands chip when sub_brands is selected on Performance Tool', () => {
      const result = engine.validateField({
        ...mockContext,
        fieldKey: 'brands',
        pageName: 'value-creation/performance-tool/volume',
        appliedFilters: { brands: 'All', sub_brands: 'Brahma Chopp' },
      });

      expect(result).toBe(true);
    });

    it('should hide sub_brands chip on Performance Tool', () => {
      const result = engine.validateField({
        ...mockContext,
        fieldKey: 'sub_brands',
        pageName: 'value-creation/performance-tool/volume',
        appliedFilters: { sub_brands: 'Brahma Chopp' },
      });

      expect(result).toBe(false);
    });

    it('should show sub_brands chip on non-PT pages when value is not All', () => {
      const result = engine.validateField({
        ...mockContext,
        fieldKey: 'sub_brands',
        appliedFilters: { sub_brands: 'Brahma Chopp' },
      });

      expect(result).toBe(true);
    });
  });

  describe('hasAvailableOptions rule', () => {
    it('should return true when dataFilters is not provided', () => {
      mockRegistry.has.mockReturnValue(true);
      mockRegistry.get.mockReturnValue({
        validator: jest.fn().mockReturnValue(true),
      } as any);

      const result = engine.validateField({
        ...mockContext,
        fieldKey: 'country',
        appliedFilters: { country: 'ABI' },
        dataFilters: undefined,
      });

      expect(result).toBe(true);
    });

    it('should call validator with correct params', () => {
      const mockValidator = jest.fn().mockReturnValue(true);
      mockRegistry.has.mockReturnValue(true);
      mockRegistry.get.mockReturnValue({
        validator: mockValidator,
      } as any);

      const dataFilters = {} as FilterDataStructure;
      const appliedFilters = { zone: 'LATAM', country: 'ABI' };
      engine.validateField({
        ...mockContext,
        fieldKey: 'country',
        appliedFilters,
        dataFilters,
      });

      expect(mockValidator).toHaveBeenCalledWith(
        dataFilters,
        'ABI',
        appliedFilters,
      );
    });

    it('should return false when config is not found', () => {
      mockRegistry.has.mockReturnValue(true);
      mockRegistry.get.mockReturnValue(null);

      const result = engine.validateField(mockContext);

      expect(result).toBe(false);
    });
  });

  describe('validateField', () => {
    it('should return true when all rules pass', () => {
      mockRegistry.has.mockReturnValue(true);
      mockRegistry.get.mockReturnValue({
        validator: jest.fn().mockReturnValue(true),
      } as any);

      const result = engine.validateField({
        ...mockContext,
        fieldKey: 'country',
        appliedFilters: { country: 'ABI' },
      });

      expect(result).toBe(true);
    });

    it('should return false when any rule fails', () => {
      mockRegistry.has.mockReturnValue(false);

      const result = engine.validateField(mockContext);

      expect(result).toBe(false);
    });
  });

  describe('filterFields', () => {
    beforeEach(() => {
      mockRegistry.has.mockReturnValue(true);
      mockRegistry.get.mockReturnValue({
        validator: jest.fn().mockReturnValue(true),
      } as any);
    });

    it('should filter fields based on rules', () => {
      const fields = ['country', 'brands'];
      const result = engine.filterFields(fields, {
        pageName: 'test-page',
        appliedFilters: { zone: 'ABI', brands: 'SKOL' },
        dataFilters: {} as FilterDataStructure,
      });

      expect(result).toContain('country');
      expect(result).toContain('brands');
    });

    it('should return empty array when no fields pass rules', () => {
      const fields = ['nonexistent1', 'nonexistent2'];
      const result = engine.filterFields(fields, {
        pageName: 'test-page',
        appliedFilters: {},
        dataFilters: {} as FilterDataStructure,
      });

      expect(result).toEqual([]);
    });

    it('should return all valid fields when all pass rules', () => {
      mockRegistry.get.mockReturnValue({
        validator: jest.fn().mockReturnValue(true),
      } as any);

      const fields = ['country', 'brands'];
      const result = engine.filterFields(fields, {
        pageName: 'test-page',
        appliedFilters: { country: 'ABI', brands: 'SKOL' },
        dataFilters: {} as FilterDataStructure,
      });

      expect(result).toHaveLength(2);
      expect(result).toContain('country');
      expect(result).toContain('brands');
    });
  });

  describe('addRule', () => {
    it('should add custom rule', () => {
      const initialRulesCount = engine.getRules().length;
      const customRule = jest.fn().mockReturnValue(true);

      engine.addRule(customRule);

      expect(engine.getRules().length).toBe(initialRulesCount + 1);
    });

    it('should apply custom rule in validateField', () => {
      const customRule = jest.fn().mockReturnValue(false);
      mockRegistry.has.mockReturnValue(true);
      mockRegistry.get.mockReturnValue({
        validator: jest.fn().mockReturnValue(true),
      } as any);

      engine.addRule(customRule);
      const result = engine.validateField({
        ...mockContext,
        fieldKey: 'brands',
        appliedFilters: { brands: 'SKOL' },
      });

      expect(customRule).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('getRules', () => {
    it('should return copy of rules array', () => {
      const rules1 = engine.getRules();
      const rules2 = engine.getRules();

      expect(rules1).toEqual(rules2);
      expect(rules1).not.toBe(rules2);
    });

    it('should return all initialized rules', () => {
      const rules = engine.getRules();

      expect(rules.length).toBeGreaterThanOrEqual(4);
    });
  });
});
