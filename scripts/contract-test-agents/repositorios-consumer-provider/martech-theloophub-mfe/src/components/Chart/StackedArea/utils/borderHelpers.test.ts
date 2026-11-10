import { getVerticalBorderWidths } from './borderHelpers';

describe('getVerticalBorderWidths', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns same top and bottom when borderWidth is a number', () => {
    const dataset = { borderWidth: 3 };
    expect(getVerticalBorderWidths(dataset)).toEqual({ top: 3, bottom: 3 });
  });

  it('returns top and bottom from object', () => {
    const dataset = { borderWidth: { top: 5, bottom: 2 } };
    expect(getVerticalBorderWidths(dataset)).toEqual({ top: 5, bottom: 2 });
  });

  it('returns partial object with only top', () => {
    const dataset = { borderWidth: { top: 4 } };
    expect(getVerticalBorderWidths(dataset)).toEqual({ top: 4, bottom: 0 });
  });

  it('returns partial object with only bottom', () => {
    const dataset = { borderWidth: { bottom: 7 } };
    expect(getVerticalBorderWidths(dataset)).toEqual({ top: 0, bottom: 7 });
  });

  it('returns {0, 0} when borderWidth is undefined', () => {
    const dataset = {};
    expect(getVerticalBorderWidths(dataset)).toEqual({ top: 0, bottom: 0 });
  });

  it('returns {0, 0} when borderWidth is null', () => {
    const dataset = { borderWidth: null };
    expect(getVerticalBorderWidths(dataset)).toEqual({ top: 0, bottom: 0 });
  });

  it('returns {0, 0} when dataset is undefined', () => {
    expect(getVerticalBorderWidths(undefined)).toEqual({ top: 0, bottom: 0 });
  });

  it('returns {0, 0} when dataset is null', () => {
    expect(getVerticalBorderWidths(null)).toEqual({ top: 0, bottom: 0 });
  });

  it('handles zero as a number', () => {
    const dataset = { borderWidth: 0 };
    expect(getVerticalBorderWidths(dataset)).toEqual({ top: 0, bottom: 0 });
  });

  it('handles object with non-number values', () => {
    const dataset = { borderWidth: { top: 'invalid', bottom: 3 } };
    expect(getVerticalBorderWidths(dataset)).toEqual({ top: 0, bottom: 3 });
  });
});
