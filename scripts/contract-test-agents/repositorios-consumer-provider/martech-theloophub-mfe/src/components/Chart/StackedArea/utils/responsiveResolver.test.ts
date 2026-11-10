import { resolveFixedSize } from './responsiveResolver';

describe('resolveFixedSize', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns "small" for width < 200', () => {
    expect(resolveFixedSize(100)).toBe('small');
    expect(resolveFixedSize(199)).toBe('small');
    expect(resolveFixedSize(0)).toBe('small');
  });

  it('returns "medium" for 200 <= width < 400', () => {
    expect(resolveFixedSize(200)).toBe('medium');
    expect(resolveFixedSize(300)).toBe('medium');
    expect(resolveFixedSize(399)).toBe('medium');
  });

  it('returns "large" for 400 <= width < 700', () => {
    expect(resolveFixedSize(400)).toBe('large');
    expect(resolveFixedSize(550)).toBe('large');
    expect(resolveFixedSize(699)).toBe('large');
  });

  it('returns "responsive" for width >= 700', () => {
    expect(resolveFixedSize(700)).toBe('responsive');
    expect(resolveFixedSize(1000)).toBe('responsive');
    expect(resolveFixedSize(1920)).toBe('responsive');
  });

  it('handles exact breakpoint boundaries', () => {
    expect(resolveFixedSize(200)).toBe('medium');
    expect(resolveFixedSize(400)).toBe('large');
    expect(resolveFixedSize(700)).toBe('responsive');
  });
});
