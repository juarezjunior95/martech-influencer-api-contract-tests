import {
  getInsightsArrayByPath,
  getInsightsByPath,
  normalizeInsightsToArray,
} from '.';

describe('Insights Helpers', () => {
  describe('getInsightsByPath', () => {
    it('should navigate nested object by path', () => {
      const obj = {
        level1: {
          level2: {
            level3: 'value',
          },
        },
      };

      const result = getInsightsByPath(obj, 'level1.level2.level3');
      expect(result).toBe('value');
    });

    it('should return undefined for invalid path', () => {
      const obj = { foo: 'bar' };
      const result = getInsightsByPath(obj, 'foo.baz.qux');
      expect(result).toBeUndefined();
    });

    it('should handle null/undefined object', () => {
      expect(getInsightsByPath(null, 'path')).toBeUndefined();
      expect(getInsightsByPath(undefined, 'path')).toBeUndefined();
    });

    it('should handle empty path', () => {
      const obj = { foo: 'bar' };
      expect(getInsightsByPath(obj, '')).toBeUndefined();
    });

    it('should handle array indices in path', () => {
      const obj = {
        items: [{ name: 'item1' }, { name: 'item2' }],
      };
      const result = getInsightsByPath(obj, 'items.1.name');
      expect(result).toBe('item2');
    });
  });

  describe('normalizeInsightsToArray', () => {
    it('should return array as is', () => {
      const input = ['insight1', 'insight2'];
      expect(normalizeInsightsToArray(input)).toEqual(input);
    });

    it('should wrap string in array', () => {
      const input = 'single insight';
      expect(normalizeInsightsToArray(input)).toEqual([input]);
    });

    it('should return empty array for undefined', () => {
      expect(normalizeInsightsToArray(undefined)).toEqual([]);
    });

    it('should return empty array for null', () => {
      expect(normalizeInsightsToArray(null as any)).toEqual([]);
    });
  });

  describe('getInsightsArrayByPath', () => {
    it('should combine path navigation and normalization', () => {
      const obj = {
        insights: {
          abi: {
            data: 'single insight',
          },
        },
      };

      const result = getInsightsArrayByPath(obj, 'insights.abi.data');
      expect(result).toEqual(['single insight']);
    });

    it('should handle array in nested path', () => {
      const obj = {
        insights: {
          items: ['insight1', 'insight2'],
        },
      };

      const result = getInsightsArrayByPath(obj, 'insights.items');
      expect(result).toEqual(['insight1', 'insight2']);
    });

    it('should return empty array for invalid path', () => {
      const obj = { foo: 'bar' };
      const result = getInsightsArrayByPath(obj, 'invalid.path');
      expect(result).toEqual([]);
    });
  });
});
