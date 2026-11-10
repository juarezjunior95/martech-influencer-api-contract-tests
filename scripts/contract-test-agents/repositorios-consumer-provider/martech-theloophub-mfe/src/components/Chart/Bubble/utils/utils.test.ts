import { COLUMN_WIDTH, setHoveredColumn } from '../constants';
import { BubbleChartData } from '../types';
import { generateDatasets } from './utils';

describe('Bubble Chart Utils - generateDatasets', () => {
  const createMockData = (
    overrides?: Partial<BubbleChartData>,
  ): BubbleChartData => ({
    yAxis: { min: 0, max: 100 },
    info: { label: 'Test Label' },
    backgroundChart: { backgrounds: [] },
    caption: { title: '', subtitle: '', data: [] },
    datasets: [
      {
        bubbles: [{ y: 10, r: 5, tooltip: 'Test', backgroundColor: '#FF0000' }],
      },
    ],
    ...overrides,
  });

  beforeEach(() => {
    setHoveredColumn(null);
  });

  describe('Dataset Structure', () => {
    it('should generate datasets with correct structure and properties', () => {
      const mockData = createMockData();
      const result = generateDatasets(mockData);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('label', 'Test Label');
      expect(result[0]).toHaveProperty('data');
      expect(result[0]).toHaveProperty('backgroundColor');
      expect(result[0]).toHaveProperty('hoverBorderColor', '#ffffff');
      expect(result[0]).toHaveProperty('hoverBorderWidth', 2);
    });

    it('should handle empty bubbles array', () => {
      const mockData = createMockData({
        datasets: [{ bubbles: [] }],
      });
      const result = generateDatasets(mockData);

      expect(result[0].data).toHaveLength(0);
      expect(result[0].backgroundColor).toHaveLength(0);
    });
  });

  describe('Position and Distribution', () => {
    it('should distribute bubbles horizontally with correct spacing', () => {
      const mockData = createMockData({
        datasets: [
          {
            bubbles: [
              { y: 10, r: 5, tooltip: 'B1', backgroundColor: '#FF0000' },
              { y: 10, r: 5, tooltip: 'B2', backgroundColor: '#00FF00' },
            ],
          },
        ],
      });
      const result = generateDatasets(mockData);
      const bubbles = result[0].data;

      expect(bubbles[0].x).not.toBe(bubbles[1].x);

      const centerX = 0 * COLUMN_WIDTH + COLUMN_WIDTH / 2;
      expect(bubbles[0].x).toBeLessThan(centerX);
      expect(bubbles[1].x).toBeGreaterThan(centerX);
    });

    it('should handle multiple columns', () => {
      const mockData = createMockData({
        datasets: [
          {
            bubbles: [
              { y: 10, r: 5, tooltip: 'C1', backgroundColor: '#FF0000' },
            ],
          },
          {
            bubbles: [
              { y: 10, r: 5, tooltip: 'C2', backgroundColor: '#00FF00' },
            ],
          },
        ],
      });
      const result = generateDatasets(mockData);

      expect(result).toHaveLength(2);
      expect(result[0].data[0].x).toBeLessThan(result[1].data[0].x);
    });
  });

  it('should preserve bubble properties', () => {
    const mockData = createMockData({
      datasets: [
        {
          bubbles: [
            {
              y: 10,
              r: 8,
              tooltip: 'Custom',
              pointStyle: 'rectRot',
              backgroundColor: '#FF0000',
            },
          ],
        },
      ],
    });
    const result = generateDatasets(mockData);

    expect(result[0].data[0].r).toBe(8);
    expect(result[0].data[0].pointStyle).toBe('rectRot');
    expect(result[0].backgroundColor).toEqual(['#FF0000']);
  });

  it('should handle pointStyle function with custom and default', () => {
    const mockData = createMockData({
      datasets: [
        {
          bubbles: [
            {
              y: 10,
              r: 5,
              tooltip: 'With style',
              pointStyle: 'triangle',
              backgroundColor: '#FF0000',
            },
            { y: 20, r: 5, tooltip: 'No style', backgroundColor: '#00FF00' },
          ],
        },
      ],
    });
    const result = generateDatasets(mockData);
    const pointStyleFn = result[0].pointStyle as (ctx: {
      dataIndex: number;
      dataset: any;
    }) => string;

    expect(pointStyleFn({ dataIndex: 0, dataset: result[0] })).toBe('triangle');
    expect(pointStyleFn({ dataIndex: 1, dataset: result[0] })).toBe('circle');
  });

  it('should apply border styles based on hover state', () => {
    const mockData = createMockData({
      backgroundChart: {
        backgrounds: [],
        borderColorBubbleHover: '#00FF00',
      },
    });

    let result = generateDatasets(mockData);
    expect(result[0].borderColor[0]).toBe('transparent');
    expect(result[0].borderWidth[0]).toBe(0);

    setHoveredColumn(0);
    result = generateDatasets(mockData);
    expect(result[0].borderColor[0]).toBe('#00FF00');
    expect(result[0].borderWidth[0]).toBe(2);
  });

  it('should handle multiple y groups in same column', () => {
    const mockData = createMockData({
      datasets: [
        {
          bubbles: [
            { y: 10, r: 5, tooltip: 'A1', backgroundColor: '#FF0000' },
            { y: 10, r: 5, tooltip: 'A2', backgroundColor: '#00FF00' },
            { y: 20, r: 5, tooltip: 'B1', backgroundColor: '#0000FF' },
          ],
        },
      ],
    });
    const result = generateDatasets(mockData);

    expect(result[0].data).toHaveLength(3);

    const y10XPositions = result[0].data.slice(0, 2).map((b) => b.x);
    const uniqueY10X = new Set(y10XPositions);
    expect(uniqueY10X.size).toBe(2);
  });
});
