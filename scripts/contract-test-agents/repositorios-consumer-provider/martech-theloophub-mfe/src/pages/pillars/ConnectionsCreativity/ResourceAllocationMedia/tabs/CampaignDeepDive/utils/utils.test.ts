import { CAMPAIGN_TRACKER_ROW_HEIGHT } from '../constants';
import { getRowHeightCallback } from './utils';

describe('utils', () => {
  describe('getRowHeightCallback', () => {
    it('should return correct height based on campaign length', () => {
      const row = {
        data: {
          campaign: ['Campaign 1', 'Campaign 2', 'Campaign 3'],
        },
      };

      const result = getRowHeightCallback(row);

      expect(result).toBe(3 * CAMPAIGN_TRACKER_ROW_HEIGHT);
    });

    it('should return correct height for single campaign', () => {
      const row = {
        data: {
          campaign: ['Campaign 1'],
        },
      };

      const result = getRowHeightCallback(row);

      expect(result).toBe(1 * CAMPAIGN_TRACKER_ROW_HEIGHT);
    });

    it('should return 0 for empty campaign array', () => {
      const row = {
        data: {
          campaign: [],
        },
      };

      const result = getRowHeightCallback(row);

      expect(result).toBe(0);
    });

    it('should return NaN when campaign is undefined', () => {
      const row = {
        data: {},
      };

      const result = getRowHeightCallback(row);

      expect(result).toBeNaN();
    });

    it('should return NaN when data is undefined', () => {
      const row = {};

      const result = getRowHeightCallback(row);

      expect(result).toBeNaN();
    });

    it('should return NaN when row is undefined', () => {
      const result = getRowHeightCallback(undefined);

      expect(result).toBeNaN();
    });

    it('should return NaN when row is null', () => {
      const result = getRowHeightCallback(null);

      expect(result).toBeNaN();
    });
  });
});
