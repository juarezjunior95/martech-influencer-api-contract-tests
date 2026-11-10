import { getVariationColor } from './getColor';

jest.mock('theme', () => ({
  theme: {
    colors: {
      green: { high: '#00FF00' },
      red: { high: '#FF0000' },
      txt: { secondary: '#1414148F' },
    },
  },
}));

describe('getColor', () => {
  describe('getVariationColor', () => {
    it('should return green color for "up" direction', () => {
      const result = getVariationColor('up');
      expect(result).toBe('#00FF00');
    });

    it('should return red color for "down" direction', () => {
      const result = getVariationColor('down');
      expect(result).toBe('#FF0000');
    });

    it('should return txt.secondary for "neutral"', () => {
      expect(getVariationColor('neutral')).toBe('#1414148F');
    });

    it('should return the input value for other unknown directions', () => {
      expect(getVariationColor('stable')).toBe('stable');
      expect(getVariationColor('')).toBe('');
    });

    it('should return custom color code when passed', () => {
      expect(getVariationColor('#123456')).toBe('#123456');
      expect(getVariationColor('rgb(255,0,0)')).toBe('rgb(255,0,0)');
    });
  });
});
