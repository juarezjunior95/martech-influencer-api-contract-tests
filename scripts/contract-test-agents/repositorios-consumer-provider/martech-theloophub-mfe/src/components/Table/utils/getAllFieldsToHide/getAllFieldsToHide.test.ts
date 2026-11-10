import { getAllFieldsToHide } from './getAllFieldsToHide';

describe('getAllFieldsToHide', () => {
  it('should return empty array when filter is undefined', () => {
    const result = getAllFieldsToHide(undefined);

    expect(result).toEqual([]);
  });

  it('should return empty array when fieldsToHide is undefined', () => {
    const result = getAllFieldsToHide({});

    expect(result).toEqual([]);
  });

  it('should return fields from single string', () => {
    const filter = { fieldsToHide: ['field1'] };
    const result = getAllFieldsToHide(filter);

    expect(result).toEqual(['field1']);
  });

  it('should return fields from comma-separated string', () => {
    const filter = { fieldsToHide: ['field1,field2,field3'] };
    const result = getAllFieldsToHide(filter);

    expect(result).toEqual(['field1', 'field2', 'field3']);
  });

  it('should trim whitespace from fields', () => {
    const filter = { fieldsToHide: ['field1 , field2 , field3'] };
    const result = getAllFieldsToHide(filter);

    expect(result).toEqual(['field1', 'field2', 'field3']);
  });

  it('should handle multiple strings in array', () => {
    const filter = { fieldsToHide: ['field1,field2', 'field3,field4'] };
    const result = getAllFieldsToHide(filter);

    expect(result).toEqual(['field1', 'field2', 'field3', 'field4']);
  });

  it('should remove duplicates', () => {
    const filter = { fieldsToHide: ['field1,field2', 'field2,field3'] };
    const result = getAllFieldsToHide(filter);

    expect(result).toEqual(['field1', 'field2', 'field3']);
  });
});
