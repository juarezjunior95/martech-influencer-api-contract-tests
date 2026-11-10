import { handleExpandSection } from './handleExpand';

describe('handleExpandSection', () => {
  let mockSetSearchParams: jest.Mock;
  let mockSearchParams: URLSearchParams;

  beforeEach(() => {
    mockSetSearchParams = jest.fn();
    mockSearchParams = new URLSearchParams();
  });

  it.each([
    ['typical name', 'test-section'],
    ['empty string', ''],
    ['special characters', 'section-with-dash'],
  ])('sets section=%s when expanding (%s)', (_label, name) => {
    handleExpandSection(true, name, mockSetSearchParams, mockSearchParams);

    const params = mockSetSearchParams.mock.calls[0][0];
    expect(params.get('section')).toBe(name);
    expect(params).toBeInstanceOf(URLSearchParams);
    expect(params).not.toBe(mockSearchParams);
  });

  it('removes the section param when collapsing', () => {
    mockSearchParams.set('section', 'test-section');

    handleExpandSection(
      false,
      'test-section',
      mockSetSearchParams,
      mockSearchParams,
    );

    const params = mockSetSearchParams.mock.calls[0][0];
    expect(params.has('section')).toBe(false);
  });

  it('overrides an existing section param when expanding', () => {
    mockSearchParams.set('section', 'old-section');

    handleExpandSection(
      true,
      'new-section',
      mockSetSearchParams,
      mockSearchParams,
    );

    expect(mockSetSearchParams.mock.calls[0][0].get('section')).toBe(
      'new-section',
    );
  });

  it.each([
    ['expanding', true],
    ['collapsing', false],
  ])('preserves other query params when %s', (_label, value) => {
    mockSearchParams.set('filter', 'value');
    mockSearchParams.set('sort', 'asc');
    if (!value) mockSearchParams.set('section', 'previous');

    handleExpandSection(
      value,
      'test-section',
      mockSetSearchParams,
      mockSearchParams,
    );

    const params = mockSetSearchParams.mock.calls[0][0];
    expect(params.get('filter')).toBe('value');
    expect(params.get('sort')).toBe('asc');
  });
});
