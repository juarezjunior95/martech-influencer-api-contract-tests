import { ChartDataset } from 'chart.js';

import {
  buildDashedLineIndicatorBackground,
  isLineDatasetDashed,
  resolveLineDatasetColor,
} from './linePointTooltip.utils';

describe('linePointTooltip.utils', () => {
  describe('resolveLineDatasetColor', () => {
    it('returns string borderColor', () => {
      const ds = {
        borderColor: '#DEB333',
        data: [0],
      } as ChartDataset<'line'>;
      expect(resolveLineDatasetColor(ds)).toBe('#DEB333');
    });

    it('returns first color from array borderColor', () => {
      const ds = {
        borderColor: ['#a', '#b'],
        data: [0],
      } as ChartDataset<'line'>;
      expect(resolveLineDatasetColor(ds)).toBe('#a');
    });

    it('falls back when borderColor is missing', () => {
      const ds = { data: [0] } as ChartDataset<'line'>;
      expect(resolveLineDatasetColor(ds)).toBe('#FFFFFF');
    });
  });

  describe('isLineDatasetDashed', () => {
    it('returns true when borderDash has positive segment', () => {
      const ds = {
        borderDash: [4, 4],
        data: [0],
      } as ChartDataset<'line'>;
      expect(isLineDatasetDashed(ds)).toBe(true);
    });

    it('returns false when borderDash is empty', () => {
      const ds = {
        borderDash: [],
        data: [0],
      } as ChartDataset<'line'>;
      expect(isLineDatasetDashed(ds)).toBe(false);
    });

    it('returns false when borderDash is only zeros', () => {
      const ds = {
        borderDash: [0, 0],
        data: [0],
      } as ChartDataset<'line'>;
      expect(isLineDatasetDashed(ds)).toBe(false);
    });
  });

  describe('buildDashedLineIndicatorBackground', () => {
    it('includes the line color in the gradient', () => {
      const bg = buildDashedLineIndicatorBackground('#EDCD20');
      expect(bg).toContain('#EDCD20');
      expect(bg).toContain('repeating-linear-gradient');
    });
  });
});
