import { createDatasetWithPattern } from './ChartContent.utils';

describe('ChartContent.utils', () => {
  describe('createDatasetWithPattern', () => {
    const mockDataset = {
      data: [100, 200, 300],
      label: 'Test Dataset',
    } as any;

    it('adds the striped pattern to a dataset', () => {
      const result = createDatasetWithPattern(mockDataset);

      expect(result).toEqual({
        ...mockDataset,
        pattern: {
          type: 'striped',
          flags: [0],
          params: {
            color: 'white',
            angle: 45,
            thickness: 3,
            spacing: 12,
          },
        },
      });
    });

    it('returns undefined when dataset is undefined', () => {
      expect(createDatasetWithPattern(undefined)).toBeUndefined();
    });

    it('preserves original dataset properties when adding pattern', () => {
      const datasetWithExtra = {
        ...mockDataset,
        backgroundColor: '#FF0000',
        borderWidth: 2,
      };

      const result = createDatasetWithPattern(datasetWithExtra) as any;

      expect(result.data).toEqual(mockDataset.data);
      expect(result.label).toEqual(mockDataset.label);
      expect(result.backgroundColor).toBe('#FF0000');
      expect(result.borderWidth).toBe(2);
      expect(result.pattern).toBeDefined();
    });
  });
});
