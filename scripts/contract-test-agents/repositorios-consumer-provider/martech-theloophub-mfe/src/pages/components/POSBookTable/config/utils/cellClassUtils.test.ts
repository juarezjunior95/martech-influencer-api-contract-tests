import { CellClassParams } from 'ag-grid-community';

import {
  combineCellClasses,
  createCellClasses,
  customCohortCellClass,
  customCountryCellClass,
  customZoneMaturityCellClass,
  getCountryCellDisplayValue,
  isFirstDataRowGlobalSummary,
} from './cellClassUtils';

jest.mock('components/Table/cellClass', () => ({
  cellClass: jest.fn(() => ['base-cell-class']),
}));

describe('getCountryCellDisplayValue / isFirstDataRowGlobalSummary', () => {
  it.each([
    { country: 'Global', expected: 'Global' },
    { country: '  Global  ', expected: 'Global' },
    { country: { value: 'Global' }, expected: 'Global' },
    { country: 123, expected: '123' },
    { country: { value: false }, expected: 'false' },
    { country: { value: null }, expected: '' },
    { country: {}, expected: '' },
  ])('normalizes country $country to $expected', ({ country, expected }) => {
    expect(getCountryCellDisplayValue({ country } as any)).toBe(expected);
  });

  it('returns empty string when data itself is null or undefined', () => {
    expect(getCountryCellDisplayValue(null)).toBe('');
    expect(getCountryCellDisplayValue(undefined)).toBe('');
  });

  it('detects Global summary case-insensitively', () => {
    expect(isFirstDataRowGlobalSummary({ country: 'GLOBAL' } as any)).toBe(
      true,
    );
    expect(isFirstDataRowGlobalSummary({ country: 'USA' } as any)).toBe(false);
    expect(isFirstDataRowGlobalSummary({} as any)).toBe(false);
  });
});

describe('POSBook Cell Class Utils', () => {
  const createMockParams = (
    overrides?: Partial<CellClassParams>,
  ): CellClassParams =>
    ({
      rowIndex: 0,
      colDef: { field: 'test' },
      data: {},
      value: null,
      ...overrides,
    }) as CellClassParams;

  describe('createCellClasses', () => {
    it('should return empty array when no options provided', () => {
      const params = createMockParams();
      const result = createCellClasses(params);

      expect(result).toEqual([]);
    });

    it('should add ag-cell-first-row only when rowIndex is 1 and country is Global', () => {
      const paramsGlobal = createMockParams({
        rowIndex: 1,
        data: { country: 'Global' },
      });
      expect(
        createCellClasses(paramsGlobal, { isFirstRowSpecial: true }),
      ).toContain('ag-cell-first-row');

      const paramsM3 = createMockParams({
        rowIndex: 1,
        data: { country: 'USA' },
      });
      expect(
        createCellClasses(paramsM3, { isFirstRowSpecial: true }),
      ).not.toContain('ag-cell-first-row');

      const paramsRow0 = createMockParams({
        rowIndex: 0,
        data: { country: 'Global' },
      });
      expect(
        createCellClasses(paramsRow0, { isFirstRowSpecial: true }),
      ).not.toContain('ag-cell-first-row');
    });

    it('should add label column classes and merge class', () => {
      const params = createMockParams({
        colDef: { field: 'label' },
        rowIndex: 3,
      });
      const result = createCellClasses(params, {
        labelColumnClasses: ['label-class'],
        mergeRowIndexes: [3, 8],
      });

      expect(result).toContain('label-class');
      expect(result).toContain('ag-cell-merge-col');
    });

    it('should add country column classes for country and maturity_zone fields', () => {
      const paramsCountry = createMockParams({
        colDef: { field: 'country' },
      });
      const resultCountry = createCellClasses(paramsCountry, {
        countryColumnClasses: ['country-class'],
      });
      expect(resultCountry).toEqual(['country-class']);

      const paramsZone = createMockParams({
        colDef: { field: 'maturity_zone' },
      });
      const resultZone = createCellClasses(paramsZone, {
        countryColumnClasses: ['zone-class'],
      });
      expect(resultZone).toEqual(['zone-class']);
    });

    it('should combine all options correctly when first row is Global', () => {
      const params = createMockParams({
        colDef: { field: 'label' },
        rowIndex: 1,
        data: { country: 'Global' },
      });
      const result = createCellClasses(params, {
        isFirstRowSpecial: true,
        labelColumnClasses: ['label-class'],
        mergeRowIndexes: [1, 3],
        countryColumnClasses: ['country-class'],
      });

      expect(result).toContain('ag-cell-first-row');
      expect(result).toContain('label-class');
      expect(result).toContain('ag-cell-merge-col');
    });
  });

  describe('Custom Cell Class Functions', () => {
    it('should return correct classes for customCountryCellClass when first row is Global', () => {
      const paramsRow1 = createMockParams({
        colDef: { field: 'label' },
        rowIndex: 1,
        data: { country: 'Global' },
      });
      const resultRow1 = customCountryCellClass(paramsRow1);
      expect(resultRow1).toContain('ag-cell-first-row');
      expect(resultRow1).toContain('ag-cell-label-col');

      const paramsRow1Country = createMockParams({
        colDef: { field: 'label' },
        rowIndex: 1,
        data: { country: 'USA' },
      });
      expect(customCountryCellClass(paramsRow1Country)).not.toContain(
        'ag-cell-first-row',
      );

      const paramsRow3 = createMockParams({
        colDef: { field: 'label' },
        rowIndex: 3,
      });
      const resultRow3 = customCountryCellClass(paramsRow3);
      expect(resultRow3).toContain('ag-cell-label-col');
      expect(resultRow3).toContain('ag-cell-merge-col');
    });

    it('should return correct classes for customZoneMaturityCellClass when first row is Global', () => {
      const paramsRow1 = createMockParams({
        colDef: { field: 'label' },
        rowIndex: 1,
        data: { country: 'Global' },
      });
      const resultRow1 = customZoneMaturityCellClass(paramsRow1);
      expect(resultRow1).toContain('ag-cell-first-row');
      expect(resultRow1).toContain('ag-cell-label-col');
      expect(resultRow1).toContain('ag-zone-cell-label-col');

      const paramsRow1NotGlobal = createMockParams({
        colDef: { field: 'label' },
        rowIndex: 1,
        data: { country: 'USA' },
      });
      expect(customZoneMaturityCellClass(paramsRow1NotGlobal)).not.toContain(
        'ag-cell-first-row',
      );

      const paramsRow7 = createMockParams({
        colDef: { field: 'label' },
        rowIndex: 7,
      });
      const resultRow7 = customZoneMaturityCellClass(paramsRow7);
      expect(resultRow7).toContain('ag-cell-label-col');
      expect(resultRow7).toContain('ag-zone-cell-label-col');
      expect(resultRow7).toContain('ag-cell-merge-col');
    });

    it('should return correct classes for customCohortCellClass', () => {
      const params = createMockParams({
        colDef: { field: 'label' },
      });
      const result = customCohortCellClass(params);

      expect(result).toContain('ag-cohort-cell-label-col');
    });
  });

  describe('combineCellClasses', () => {
    it('should combine base cellClass with custom classes', () => {
      const params = createMockParams();
      const customFn = jest.fn(() => ['custom-class']);

      const result = combineCellClasses(params, customFn);

      expect(result).toContain('base-cell-class');
      expect(result).toContain('custom-class');
      expect(customFn).toHaveBeenCalledWith(params);
    });
  });
});
