import { createDataTestId } from './createDataTestId';

describe('createDataTestId', () => {
  it('returns undefined when dataTestId is empty', () => {
    expect(createDataTestId('')).toBeUndefined();
  });

  it('returns the id only when no prefix and no suffix are provided', () => {
    expect(createDataTestId('my-block')).toBe('my-block');
  });

  it('prepends prefix and hyphen when prefix is provided', () => {
    expect(createDataTestId('block', 'page')).toBe('page-block');
  });

  it('appends hyphen and suffix when suffix is provided', () => {
    expect(createDataTestId('block', undefined, 'row')).toBe('block-row');
  });

  it('combines prefix, id, and suffix in order', () => {
    expect(createDataTestId('block', 'page', 'row')).toBe('page-block-row');
  });
});
