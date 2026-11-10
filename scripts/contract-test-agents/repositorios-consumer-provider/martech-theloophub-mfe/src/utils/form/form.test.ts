import {
  getAllValuesForMultiSelect,
  revertValuesFilteredOnSelect,
} from './form';

describe('form', () => {
  describe('revertValuesFilteredOnSelect', () => {
    it('should return options not in filtered values', () => {
      const valuesFiltered = ['a', 'b'];
      const allOptions = ['a', 'b', 'c', 'd'];

      const result = revertValuesFilteredOnSelect(valuesFiltered, allOptions);

      expect(result).toEqual(['c', 'd']);
    });

    it('should return all options when filtered is empty', () => {
      const valuesFiltered: string[] = [];
      const allOptions = ['a', 'b', 'c'];

      const result = revertValuesFilteredOnSelect(valuesFiltered, allOptions);

      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should return empty when all options are filtered', () => {
      const valuesFiltered = ['a', 'b', 'c'];
      const allOptions = ['a', 'b', 'c'];

      const result = revertValuesFilteredOnSelect(valuesFiltered, allOptions);

      expect(result).toEqual([]);
    });

    it('should handle undefined allOptions', () => {
      const valuesFiltered = ['a', 'b'];
      const allOptions = undefined;

      const result = revertValuesFilteredOnSelect(
        valuesFiltered,
        allOptions as any,
      );

      expect(result).toBeUndefined();
    });

    it('should handle numeric string comparisons', () => {
      const valuesFiltered = ['1', '2'];
      const allOptions = [1, 2, 3, 4];

      const result = revertValuesFilteredOnSelect(
        valuesFiltered,
        allOptions as any,
      );

      expect(result).toEqual([3, 4]);
    });
  });

  describe('getAllValuesForMultiSelect', () => {
    it('should flatten all values from filter options', () => {
      const filterOptions = [
        {
          label: 'Group 1',
          values: [
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
          ],
        },
        { label: 'Group 2', values: [{ value: 'c', label: 'C' }] },
      ];

      const result = getAllValuesForMultiSelect(filterOptions as any);

      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should return empty array when no values', () => {
      const filterOptions = [{ label: 'Group 1', values: [] }];

      const result = getAllValuesForMultiSelect(filterOptions as any);

      expect(result).toEqual([]);
    });

    it('should handle undefined filterOptions', () => {
      const result = getAllValuesForMultiSelect(undefined as any);

      expect(result).toBeUndefined();
    });

    it('should handle single group with multiple values', () => {
      const filterOptions = [
        {
          label: 'Group',
          values: [
            { value: '1', label: 'One' },
            { value: '2', label: 'Two' },
            { value: '3', label: 'Three' },
          ],
        },
      ];

      const result = getAllValuesForMultiSelect(filterOptions as any);

      expect(result).toEqual(['1', '2', '3']);
    });

    it('should handle multiple groups with single values', () => {
      const filterOptions = [
        { label: 'Group 1', values: [{ value: 'x', label: 'X' }] },
        { label: 'Group 2', values: [{ value: 'y', label: 'Y' }] },
        { label: 'Group 3', values: [{ value: 'z', label: 'Z' }] },
      ];

      const result = getAllValuesForMultiSelect(filterOptions as any);

      expect(result).toEqual(['x', 'y', 'z']);
    });
  });
});
