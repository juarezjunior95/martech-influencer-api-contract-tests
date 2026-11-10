import { removeCitations } from './removeCitations';

describe('removeCitations', () => {
  it('removes single citation', () => {
    expect(removeCitations('Hello [a1] world')).toBe('Hello world');
  });

  it('removes multiple citations', () => {
    expect(removeCitations('Text [a1] more [a2] end')).toBe('Text more end');
  });

  it('removes citation with multi-digit number', () => {
    expect(removeCitations('Text [a12] end')).toBe('Text end');
  });

  it('does not remove non-citation brackets', () => {
    expect(removeCitations('array[0] value')).toBe('array[0] value');
  });

  it('does not remove brackets with other letters', () => {
    expect(removeCitations('ref [b1] here')).toBe('ref [b1] here');
  });

  it('trims result', () => {
    expect(removeCitations(' [a1] text [a2] ')).toBe('text');
  });

  it('returns empty string for citations only', () => {
    expect(removeCitations('[a1]')).toBe('');
  });
});
