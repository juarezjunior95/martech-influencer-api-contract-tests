import {
  convertToOption,
  createSelectAllOption,
  processOptions,
  SELECT_ALL_VALUE,
} from './option';

describe('option utils', () => {
  describe('SELECT_ALL_VALUE', () => {
    it('should be "__select_all__"', () => {
      expect(SELECT_ALL_VALUE).toBe('__select_all__');
    });
  });

  describe('createSelectAllOption', () => {
    it('should create select all option with provided label', () => {
      const result = createSelectAllOption('Select All');

      expect(result).toEqual({
        label: 'Select All',
        value: '__select_all__',
      });
    });

    it('should create select all option with custom label', () => {
      const result = createSelectAllOption('Choose All Items');

      expect(result).toEqual({
        label: 'Choose All Items',
        value: '__select_all__',
      });
    });
  });

  describe('processOptions', () => {
    const simpleOptions = [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' },
    ];

    const groupedOptions = [
      {
        group: 'Group 1',
        values: [
          { label: 'Option 1', value: 'opt1' },
          { label: 'Option 2', value: 'opt2' },
        ],
      },
      {
        group: 'Group 2',
        values: [{ label: 'Option 3', value: 'opt3' }],
      },
    ];

    it('should return isGrouped false for simple options', () => {
      const result = processOptions(simpleOptions, false, false, 'Select All');

      expect(result.isGrouped).toBe(false);
    });

    it('should return isGrouped true for grouped options', () => {
      const result = processOptions(groupedOptions, false, false, 'Select All');

      expect(result.isGrouped).toBe(true);
    });

    it('should return flatOptions for simple options', () => {
      const result = processOptions(simpleOptions, false, false, 'Select All');

      expect(result.flatOptions).toEqual(simpleOptions);
    });

    it('should flatten grouped options', () => {
      const result = processOptions(groupedOptions, false, false, 'Select All');

      expect(result.flatOptions).toHaveLength(3);
      expect(result.flatOptions[0].value).toBe('opt1');
      expect(result.flatOptions[2].value).toBe('opt3');
    });

    it('should add select all option when multiple and showSelectAll are true', () => {
      const result = processOptions(simpleOptions, true, true, 'Select All');

      expect(result.optionsWithSelectAll).toHaveLength(3);
      expect(result.optionsWithSelectAll[0].value).toBe('__select_all__');
    });

    it('should not add select all option when multiple is false', () => {
      const result = processOptions(simpleOptions, false, true, 'Select All');

      expect(result.optionsWithSelectAll).toHaveLength(2);
      expect(result.optionsWithSelectAll[0].value).toBe('opt1');
    });

    it('should not add select all option when showSelectAll is false', () => {
      const result = processOptions(simpleOptions, true, false, 'Select All');

      expect(result.optionsWithSelectAll).toHaveLength(2);
    });

    it('should return groupedOptions for grouped input', () => {
      const result = processOptions(groupedOptions, false, false, 'Select All');

      expect(result.groupedOptions).toBeDefined();
      expect(result.groupedOptions).toHaveLength(2);
      expect(result.groupedOptions?.[0].label).toBe('Group 1');
    });

    it('should add select all group for grouped options when multiple', () => {
      const result = processOptions(groupedOptions, true, true, 'Select All');

      expect(result.groupedOptions).toHaveLength(3);
      expect(result.groupedOptions?.[0].label).toBe('');
      expect(result.groupedOptions?.[0].options[0].value).toBe(
        '__select_all__',
      );
    });

    it('should return undefined groupedOptions for simple options', () => {
      const result = processOptions(simpleOptions, false, false, 'Select All');

      expect(result.groupedOptions).toBeUndefined();
    });
  });

  describe('convertToOption', () => {
    const options = [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' },
    ];

    it('should return null for falsy value', () => {
      expect(convertToOption('', options)).toBeNull();
      expect(convertToOption(null as any, options)).toBeNull();
      expect(convertToOption(undefined as any, options)).toBeNull();
    });

    it('should find option by string value', () => {
      const result = convertToOption('opt1', options);

      expect(result).toEqual({ label: 'Option 1', value: 'opt1' });
    });

    it('should create option for string not in options', () => {
      const result = convertToOption('unknown', options);

      expect(result).toEqual({ label: 'unknown', value: 'unknown' });
    });

    it('should find option by number value', () => {
      const numOptions = [
        { label: 'One', value: 1 },
        { label: 'Two', value: 2 },
      ];

      const result = convertToOption(1, numOptions as any);

      expect(result).toEqual({ label: 'One', value: 1 });
    });

    it('should return Option object as is', () => {
      const option = { label: 'Test', value: 'test' };
      const result = convertToOption(option, options);

      expect(result).toEqual(option);
    });

    it('should convert array of strings to options', () => {
      const result = convertToOption(['opt1', 'opt2'], options);

      expect(result).toEqual([
        { label: 'Option 1', value: 'opt1' },
        { label: 'Option 2', value: 'opt2' },
      ]);
    });

    it('should return array of Option objects as is', () => {
      const optionArray = [
        { label: 'Test 1', value: 'test1' },
        { label: 'Test 2', value: 'test2' },
      ];

      const result = convertToOption(optionArray, options);

      expect(result).toEqual(optionArray);
    });

    it('should handle mixed array of strings and options', () => {
      const mixedArray = ['opt1', { label: 'Custom', value: 'custom' }];

      const result = convertToOption(mixedArray as any, options);

      expect(result).toHaveLength(2);
      expect((result as any)[0]).toEqual({ label: 'Option 1', value: 'opt1' });
      expect((result as any)[1]).toEqual({ label: 'Custom', value: 'custom' });
    });
  });
});
