import { cn } from './cn';

describe('cn', () => {
  it('should join multiple class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should filter out falsy values', () => {
    expect(cn('foo', undefined, 'bar', null, false, '')).toBe('foo bar');
  });

  it('should return empty string when no valid classes', () => {
    expect(cn(undefined, null, false)).toBe('');
  });

  it('should return single class when only one is provided', () => {
    expect(cn('foo')).toBe('foo');
  });

  it('should return empty string when called with no arguments', () => {
    expect(cn()).toBe('');
  });
});
