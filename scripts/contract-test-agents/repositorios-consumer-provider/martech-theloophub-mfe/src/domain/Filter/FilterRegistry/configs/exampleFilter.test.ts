import { exampleFilterConfig } from './exampleFilter';

describe('exampleFilterConfig', () => {
  it('should return filter config with correct structure', () => {
    const result = exampleFilterConfig('testKey');

    expect(result).toHaveProperty('key', 'testKey');
    expect(result).toHaveProperty('order', 1000);
    expect(result).toHaveProperty('calculator');
    expect(result).toHaveProperty('metadata');
  });

  it('should return defaultValue when filterEntry has default value', () => {
    const result = exampleFilterConfig('testKey');
    const filterData = {
      testKey: {
        default: { value: 'defaultValue' },
      },
    };

    const calculated = result.calculator(filterData as any, {});

    expect(calculated).toBe('defaultValue');
  });

  it('should return null when filterEntry does not have default value', () => {
    const result = exampleFilterConfig('testKey');
    const filterData = {
      testKey: {
        values: [],
      },
    };

    const calculated = result.calculator(filterData as any, {});

    expect(calculated).toBeNull();
  });

  it('should return null when filterEntry is not an object', () => {
    const result = exampleFilterConfig('testKey');
    const filterData = {
      testKey: 'stringValue',
    };

    const calculated = result.calculator(filterData as any, {});

    expect(calculated).toBeNull();
  });

  it('should return null when filterEntry does not exist', () => {
    const result = exampleFilterConfig('testKey');
    const filterData = {};

    const calculated = result.calculator(filterData as any, {});

    expect(calculated).toBeNull();
  });

  it('should return number when defaultValue is a number', () => {
    const result = exampleFilterConfig('testKey');
    const filterData = {
      testKey: {
        default: { value: 42 },
      },
    };

    const calculated = result.calculator(filterData as any, {});

    expect(calculated).toBe(42);
  });

  it('should return null when defaultValue is undefined', () => {
    const result = exampleFilterConfig('testKey');
    const filterData = {
      testKey: {
        default: {},
      },
    };

    const calculated = result.calculator(filterData as any, {});

    expect(calculated).toBeNull();
  });

  it('should have correct metadata', () => {
    const result = exampleFilterConfig('testKey');

    expect(result.metadata.displayName).toBe('testKey');
    expect(result.metadata.description).toBe('Example filter: testKey');
  });
});
