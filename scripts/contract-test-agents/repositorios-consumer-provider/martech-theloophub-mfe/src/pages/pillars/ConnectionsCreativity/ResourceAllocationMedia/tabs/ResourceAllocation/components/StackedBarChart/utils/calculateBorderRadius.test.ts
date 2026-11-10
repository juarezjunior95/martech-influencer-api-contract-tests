import { BorderRadius } from 'chart.js';

import { calculateBorderRadius } from './calculateBorderRadius';

jest.mock('../constants', () => ({
  DEFAULT_BORDER_RADIUS: {
    topLeft: 0,
    topRight: 0,
    bottomRight: 0,
    bottomLeft: 0,
  },
}));

describe('calculateBorderRadius', () => {
  it('returns border radius at specific index from array', () => {
    const borderRadiusArray: BorderRadius[][] = [
      [{ topLeft: 5, topRight: 5, bottomRight: 0, bottomLeft: 0 }],
      [{ topLeft: 10, topRight: 10, bottomRight: 0, bottomLeft: 0 }],
    ];

    const result = calculateBorderRadius(borderRadiusArray, 1);

    expect(result).toEqual([
      { topLeft: 10, topRight: 10, bottomRight: 0, bottomLeft: 0 },
    ]);
  });

  it('returns default border radius when index is out of bounds', () => {
    const borderRadiusArray: BorderRadius[][] = [
      [{ topLeft: 5, topRight: 5, bottomRight: 0, bottomLeft: 0 }],
    ];

    const result = calculateBorderRadius(borderRadiusArray, 5);

    expect(result).toEqual({
      topLeft: 0,
      topRight: 0,
      bottomRight: 0,
      bottomLeft: 0,
    });
  });

  it('returns the same border radius when not an array', () => {
    const singleBorderRadius: BorderRadius = {
      topLeft: 8,
      topRight: 8,
      bottomRight: 8,
      bottomLeft: 8,
    };

    const result = calculateBorderRadius(singleBorderRadius, 0);

    expect(result).toEqual(singleBorderRadius);
  });
});
