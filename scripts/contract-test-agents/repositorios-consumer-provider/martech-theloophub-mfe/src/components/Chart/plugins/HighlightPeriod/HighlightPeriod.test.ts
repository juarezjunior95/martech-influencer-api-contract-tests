import { createHighlightAnnotations } from './HighlightPeriod';

describe('HighlightPeriod', () => {
  describe('createHighlightAnnotations', () => {
    it('should create annotations for highlighted indexes', () => {
      const highlightedIndexes = [1, 3];
      const result = createHighlightAnnotations(highlightedIndexes);

      expect(Object.keys(result)).toHaveLength(2);
      expect(result['highlight-0']).toEqual({
        type: 'box',
        xMin: 0.5,
        xMax: 1.5,
        yMax: Number.MAX_SAFE_INTEGER,
        backgroundColor: 'rgba(255, 247, 205, 0.4)',
        borderWidth: 0,
        drawTime: 'beforeDatasetsDraw',
      });
      expect(result['highlight-1']).toEqual({
        type: 'box',
        xMin: 2.5,
        xMax: 3.5,
        yMax: Number.MAX_SAFE_INTEGER,
        backgroundColor: 'rgba(255, 247, 205, 0.4)',
        borderWidth: 0,
        drawTime: 'beforeDatasetsDraw',
      });
    });

    it('should create annotation for single index', () => {
      const highlightedIndexes = [2];
      const result = createHighlightAnnotations(highlightedIndexes);

      expect(Object.keys(result)).toHaveLength(1);
      expect(result['highlight-0']).toEqual({
        type: 'box',
        xMin: 1.5,
        xMax: 2.5,
        yMax: Number.MAX_SAFE_INTEGER,
        backgroundColor: 'rgba(255, 247, 205, 0.4)',
        borderWidth: 0,
        drawTime: 'beforeDatasetsDraw',
      });
    });

    it('should use custom color when provided', () => {
      const highlightedIndexes = [0];
      const customColor = 'rgba(0, 255, 0, 0.5)';
      const result = createHighlightAnnotations(
        highlightedIndexes,
        customColor,
      );

      const annotation = result['highlight-0'];
      expect(annotation).toBeDefined();
      if (annotation && 'backgroundColor' in annotation) {
        expect(annotation.backgroundColor).toBe(customColor);
      }
    });

    it('should return empty object for empty highlighted indexes', () => {
      const result = createHighlightAnnotations([]);
      expect(result).toEqual({});
    });

    it('should handle last index correctly', () => {
      const highlightedIndexes = [4];
      const result = createHighlightAnnotations(highlightedIndexes);

      expect(result['highlight-0']).toEqual({
        type: 'box',
        xMin: 3.5,
        xMax: 4.5,
        yMax: Number.MAX_SAFE_INTEGER,
        backgroundColor: 'rgba(255, 247, 205, 0.4)',
        borderWidth: 0,
        drawTime: 'beforeDatasetsDraw',
      });
    });

    it('should handle first index correctly', () => {
      const highlightedIndexes = [0];
      const result = createHighlightAnnotations(highlightedIndexes);

      expect(result['highlight-0']).toEqual({
        type: 'box',
        xMin: -0.5,
        xMax: 0.5,
        yMax: Number.MAX_SAFE_INTEGER,
        backgroundColor: 'rgba(255, 247, 205, 0.4)',
        borderWidth: 0,
        drawTime: 'beforeDatasetsDraw',
      });
    });

    it('should handle consecutive indexes', () => {
      const highlightedIndexes = [2, 3, 4];
      const result = createHighlightAnnotations(highlightedIndexes);

      expect(Object.keys(result)).toHaveLength(3);
      expect(result['highlight-0']?.xMin).toBe(1.5);
      expect(result['highlight-0']?.xMax).toBe(2.5);
      expect(result['highlight-1']?.xMin).toBe(2.5);
      expect(result['highlight-1']?.xMax).toBe(3.5);
      expect(result['highlight-2']?.xMin).toBe(3.5);
      expect(result['highlight-2']?.xMax).toBe(4.5);
    });
  });
});
