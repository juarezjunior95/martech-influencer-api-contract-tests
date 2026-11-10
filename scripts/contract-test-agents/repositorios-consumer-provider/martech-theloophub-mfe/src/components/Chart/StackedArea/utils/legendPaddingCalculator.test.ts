import {
  LEGEND_ITEM_AVG_WIDTH,
  LEGEND_LINE_HEIGHT,
  LEGEND_MAX_WIDTH,
} from '../constants';
import {
  calculateLegendPaddingTop,
  estimateLegendLines,
} from './legendPaddingCalculator';

const itemsPerLine = Math.floor(LEGEND_MAX_WIDTH / LEGEND_ITEM_AVG_WIDTH);

describe('estimateLegendLines', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 0 for 0 legends', () => {
    expect(estimateLegendLines(0)).toBe(0);
  });

  it('returns 0 for negative count', () => {
    expect(estimateLegendLines(-1)).toBe(0);
  });

  it('returns 1 for 1 legend', () => {
    expect(estimateLegendLines(1)).toBe(1);
  });

  it('returns 1 when legends fit exactly in one line', () => {
    expect(estimateLegendLines(itemsPerLine)).toBe(1);
  });

  it('returns 2 when legends exceed one line by 1', () => {
    expect(estimateLegendLines(itemsPerLine + 1)).toBe(2);
  });

  it('returns 2 when legends fill exactly two lines', () => {
    expect(estimateLegendLines(itemsPerLine * 2)).toBe(2);
  });

  it('returns 3 when legends exceed two lines', () => {
    expect(estimateLegendLines(itemsPerLine * 2 + 1)).toBe(3);
  });
});

describe('calculateLegendPaddingTop', () => {
  const basePadding = 50;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns basePadding when legendCount is 0', () => {
    expect(calculateLegendPaddingTop(basePadding, 0)).toBe(basePadding);
  });

  it('returns basePadding for a single legend', () => {
    expect(calculateLegendPaddingTop(basePadding, 1)).toBe(basePadding);
  });

  it('returns basePadding when legends fit in one line', () => {
    expect(calculateLegendPaddingTop(basePadding, itemsPerLine)).toBe(
      basePadding,
    );
  });

  it('adds one LEGEND_LINE_HEIGHT for 2 lines', () => {
    expect(calculateLegendPaddingTop(basePadding, itemsPerLine + 1)).toBe(
      basePadding + LEGEND_LINE_HEIGHT,
    );
  });

  it('adds two LEGEND_LINE_HEIGHT for 3 lines', () => {
    expect(calculateLegendPaddingTop(basePadding, itemsPerLine * 2 + 1)).toBe(
      basePadding + 2 * LEGEND_LINE_HEIGHT,
    );
  });

  it('works with different basePadding values', () => {
    expect(calculateLegendPaddingTop(60, itemsPerLine + 1)).toBe(
      60 + LEGEND_LINE_HEIGHT,
    );
  });

  it('returns basePadding for negative legendCount', () => {
    expect(calculateLegendPaddingTop(basePadding, -5)).toBe(basePadding);
  });
});
