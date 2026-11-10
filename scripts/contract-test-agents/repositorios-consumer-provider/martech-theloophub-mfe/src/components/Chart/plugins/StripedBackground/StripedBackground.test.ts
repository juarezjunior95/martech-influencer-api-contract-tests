import { Chart } from 'chart.js';

import { StripedBackground } from './StripedBackground';
import * as utils from './utils/StripedBackgound.utils';

jest.mock('./utils/StripedBackgound.utils', () => ({
  ...jest.requireActual('./utils/StripedBackgound.utils'),
  createStripedPattern: jest.fn(),
  shouldApplyStripedPattern: jest.fn(),
  drawPaddedRoundedRect: jest.fn(),
}));

const createMockCtx = (): CanvasRenderingContext2D =>
  ({
    save: jest.fn(),
    restore: jest.fn(),
    clip: jest.fn(),
    fill: jest.fn(),
    fillStyle: '',
    canvas: {
      offsetWidth: 600,
      offsetHeight: 400,
    },
  }) as unknown as CanvasRenderingContext2D;

const createMockChart = (
  ctx: CanvasRenderingContext2D,
  datasets: any[],
): Chart =>
  ({
    ctx,
    data: {
      datasets,
    },
    getDatasetMeta: jest.fn(() => ({
      type: 'bar',
      data: [
        {
          x: 100,
          y: 200,
          base: 300,
          width: 50,
          height: 100,
          options: {
            borderWidth: 2,
          },
        },
        {
          x: 200,
          y: 150,
          base: 300,
          width: 50,
          height: 150,
          options: {
            borderWidth: 0,
          },
        },
      ],
    })),
  }) as unknown as Chart;

describe('StripedBackground Plugin', () => {
  let mockCtx: CanvasRenderingContext2D;
  let mockChart: Chart;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCtx = createMockCtx();

    (utils.createStripedPattern as jest.Mock).mockReturnValue('mock-pattern');
    (utils.shouldApplyStripedPattern as jest.Mock).mockReturnValue(true);
  });

  it('has correct plugin id', () => {
    expect(StripedBackground.id).toBe('stripedBackground');
  });

  it('draws striped pattern on bars with pattern config', () => {
    const datasets = [
      {
        data: [10, 20],
        pattern: {
          type: 'striped',
          flags: [0, 1],
          params: { color: '#FF0000', angle: 45, thickness: 2, spacing: 5 },
        },
      },
    ];

    mockChart = createMockChart(mockCtx, datasets);
    StripedBackground.afterDatasetsDraw(mockChart);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(utils.createStripedPattern).toHaveBeenCalled();
    expect(mockCtx.clip).toHaveBeenCalled();
    expect(mockCtx.fill).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('does not draw pattern on non-bar chart types', () => {
    const datasets = [
      { data: [10, 20], pattern: { type: 'striped', flags: [0] } },
    ];

    mockChart = createMockChart(mockCtx, datasets);
    mockChart.getDatasetMeta = jest.fn(() => ({
      type: 'line',
      data: [],
    })) as any;

    StripedBackground.afterDatasetsDraw(mockChart);

    expect(utils.createStripedPattern).not.toHaveBeenCalled();
  });

  it('skips bars that should not apply striped pattern', () => {
    (utils.shouldApplyStripedPattern as jest.Mock).mockReturnValue(false);

    const datasets = [
      { data: [10, 20], pattern: { type: 'striped', flags: [0] } },
    ];
    mockChart = createMockChart(mockCtx, datasets);
    StripedBackground.afterDatasetsDraw(mockChart);

    expect(utils.createStripedPattern).not.toHaveBeenCalled();
  });

  it('does not draw when pattern is null', () => {
    (utils.createStripedPattern as jest.Mock).mockReturnValue(null);

    const datasets = [
      { data: [10, 20], pattern: { type: 'striped', flags: [0] } },
    ];
    mockChart = createMockChart(mockCtx, datasets);
    StripedBackground.afterDatasetsDraw(mockChart);

    expect(mockCtx.fill).not.toHaveBeenCalled();
  });

  it('calls drawPaddedRoundedRect with correct geometry for bars with and without border', () => {
    const datasets = [
      { data: [10, 20], pattern: { type: 'striped', flags: [0, 1] } },
    ];

    mockChart = createMockChart(mockCtx, datasets);
    const [barWithBorder, barWithoutBorder] = mockChart.getDatasetMeta(0)
      .data as any[];

    StripedBackground.afterDatasetsDraw(mockChart);

    expect(utils.drawPaddedRoundedRect).toHaveBeenCalledWith(
      mockCtx,
      barWithBorder.x - barWithBorder.width / 2,
      Math.min(barWithBorder.y, barWithBorder.base),
      barWithBorder.width,
      Math.abs(barWithBorder.base - barWithBorder.y),
      4,
      2,
    );

    expect(utils.drawPaddedRoundedRect).toHaveBeenCalledWith(
      mockCtx,
      barWithoutBorder.x - barWithoutBorder.width / 2,
      Math.min(barWithoutBorder.y, barWithoutBorder.base),
      barWithoutBorder.width,
      Math.abs(barWithoutBorder.base - barWithoutBorder.y),
      4,
      0,
    );
  });

  it('handles negative bar values correctly', () => {
    const datasets = [
      { data: [-10], pattern: { type: 'striped', flags: [0] } },
    ];

    mockChart = createMockChart(mockCtx, datasets);
    const bar = {
      x: 100,
      y: 350,
      base: 300,
      width: 50,
      height: 50,
      options: { borderWidth: 0 },
    };
    mockChart.getDatasetMeta = jest.fn(() => ({
      type: 'bar',
      data: [bar],
    })) as any;

    StripedBackground.afterDatasetsDraw(mockChart);

    expect(utils.drawPaddedRoundedRect).toHaveBeenCalledWith(
      mockCtx,
      bar.x - bar.width / 2,
      Math.min(bar.y, bar.base),
      bar.width,
      Math.abs(bar.base - bar.y),
      4,
      0,
    );
  });

  it('processes multiple datasets', () => {
    const datasets = [
      { data: [10], pattern: { type: 'striped', flags: [0] } },
      { data: [20], pattern: { type: 'striped', flags: [0] } },
    ];

    mockChart = createMockChart(mockCtx, datasets);
    StripedBackground.afterDatasetsDraw(mockChart);

    expect(mockChart.getDatasetMeta).toHaveBeenCalledTimes(2);
  });

  it('handles datasets without pattern property without throwing', () => {
    const datasets = [{ data: [10, 20] }];
    mockChart = createMockChart(mockCtx, datasets);

    expect(() => {
      StripedBackground.afterDatasetsDraw(mockChart);
    }).not.toThrow();
  });

  describe('horizontal orientation (indexAxis === "y")', () => {
    it('uses bar height as thickness and the x/base span as length', () => {
      const datasets = [
        { data: [10], pattern: { type: 'striped', flags: [0] } },
      ];

      const horizontalBar = {
        x: 250,
        y: 80,
        base: 50,
        width: 0,
        height: 36,
        options: { borderWidth: 0 },
      };

      mockChart = {
        ctx: mockCtx,
        options: { indexAxis: 'y' },
        data: { datasets },
        getDatasetMeta: jest.fn(() => ({ type: 'bar', data: [horizontalBar] })),
      } as unknown as Chart;

      StripedBackground.afterDatasetsDraw(mockChart);

      expect(utils.drawPaddedRoundedRect).toHaveBeenCalledWith(
        mockCtx,
        Math.min(horizontalBar.x, horizontalBar.base),
        horizontalBar.y - horizontalBar.height / 2,
        Math.abs(horizontalBar.base - horizontalBar.x),
        horizontalBar.height,
        4,
        0,
      );
    });

    it('handles horizontal bars with negative values (x < base)', () => {
      const datasets = [
        { data: [-10], pattern: { type: 'striped', flags: [0] } },
      ];

      const horizontalBar = {
        x: 20,
        y: 80,
        base: 100,
        width: 0,
        height: 36,
        options: { borderWidth: 2 },
      };

      mockChart = {
        ctx: mockCtx,
        options: { indexAxis: 'y' },
        data: { datasets },
        getDatasetMeta: jest.fn(() => ({ type: 'bar', data: [horizontalBar] })),
      } as unknown as Chart;

      StripedBackground.afterDatasetsDraw(mockChart);

      expect(utils.drawPaddedRoundedRect).toHaveBeenCalledWith(
        mockCtx,
        20,
        horizontalBar.y - horizontalBar.height / 2,
        80,
        36,
        4,
        2,
      );
    });
  });
});
