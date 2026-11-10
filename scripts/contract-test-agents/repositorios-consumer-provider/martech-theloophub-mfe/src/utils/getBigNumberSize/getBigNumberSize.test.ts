import { getBigNumberSize } from './getBigNumberSize';

describe('getBigNumberSize', () => {
  it('should return small when export page regardless of breakpoints', () => {
    expect(getBigNumberSize(true, true, true)).toBe('small');
    expect(getBigNumberSize(false, true, true)).toBe('small');
    expect(getBigNumberSize(false, false, true)).toBe('small');
  });

  it('should return small when desktop xlarge and not export', () => {
    expect(getBigNumberSize(true, false, false)).toBe('small');
    expect(getBigNumberSize(true, true, false)).toBe('small');
  });

  it('should return xsmall when desktop large only', () => {
    expect(getBigNumberSize(false, true, false)).toBe('xsmall');
  });

  it('should return xxsmall when below desktop large', () => {
    expect(getBigNumberSize(false, false, false)).toBe('xxsmall');
  });
});
