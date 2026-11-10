import { createColorsWithDefaults } from './createColorsWithDefaults';

describe('createColorsWithDefaults', () => {
  it('should return default colors when no argument is passed', () => {
    const result = createColorsWithDefaults();

    expect(result).toEqual({
      first: '#C9D1D6',
      last: '#4C5965',
      retained: '#D1A33C',
      negative: '#A20A0A',
      positive: '#49764B',
    });
  });

  it('should merge partial colors over defaults', () => {
    const result = createColorsWithDefaults({
      first: '#111111',
      positive: '#222222',
    });

    expect(result.first).toBe('#111111');
    expect(result.positive).toBe('#222222');
    expect(result.last).toBe('#4C5965');
    expect(result.negative).toBe('#A20A0A');
  });
});
