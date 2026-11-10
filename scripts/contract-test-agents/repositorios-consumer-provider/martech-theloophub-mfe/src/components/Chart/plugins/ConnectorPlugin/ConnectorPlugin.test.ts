import { Chart } from 'chart.js';

import { ConnectorPlugin } from './ConnectorPlugin';
import * as drawArrowModule from './utils/drawArrow';
import * as drawRoundedRectModule from './utils/drawRoundedRect';

jest.mock('./utils/drawArrow');
jest.mock('./utils/drawRoundedRect');
jest.mock('utils/format', () => ({
  formatNumber: jest.fn((value) => value.toString()),
}));

const createMockCtx = (): CanvasRenderingContext2D =>
  ({
    save: jest.fn(),
    restore: jest.fn(),
  }) as unknown as CanvasRenderingContext2D;

const createMockChart = (
  ctx: CanvasRenderingContext2D,
  connectorOptions?: any,
): Chart =>
  ({
    ctx,
    chartArea: {
      top: 50,
      bottom: 450,
      left: 50,
      right: 650,
    },
    config: {
      options: {
        plugins: {
          connector: connectorOptions,
        },
      },
    },
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [
        {
          data: [10, 20, 30, 40, 50],
        },
      ],
    },
    getDatasetMeta: jest.fn(() => ({
      data: [
        { x: 100, y: 200, base: 300 },
        { x: 200, y: 180, base: 300 },
        { x: 300, y: 160, base: 300 },
        { x: 400, y: 140, base: 300 },
        { x: 500, y: 120, base: 300 },
      ],
    })),
    scales: {
      y: {
        getPixelForValue: jest.fn(() => 300),
        min: 0,
      },
    },
  }) as unknown as Chart;

describe('ConnectorPlugin', () => {
  let mockCtx: CanvasRenderingContext2D;
  let mockChart: Chart;
  let drawArrowSpy: jest.SpyInstance;
  let drawRoundedRectSpy: jest.SpyInstance;

  beforeEach(() => {
    mockCtx = createMockCtx();
    jest.clearAllMocks();

    drawArrowSpy = jest
      .spyOn(drawArrowModule, 'drawArrow')
      .mockImplementation(() => {
        return;
      });
    drawRoundedRectSpy = jest
      .spyOn(drawRoundedRectModule, 'drawRoundedRect')
      .mockImplementation(() => {
        return;
      });
  });

  afterEach(() => {
    drawArrowSpy.mockRestore();
    drawRoundedRectSpy.mockRestore();
  });

  it('has correct plugin id', () => {
    expect(ConnectorPlugin.id).toBe('connectorPlugin');
  });

  it('draws connector with valid options', () => {
    mockChart = createMockChart(mockCtx, {
      value: 25,
      from: 'Jan',
      to: 'Mar',
      backgroundColor: '#FF0000',
      textColor: '#FFFFFF',
      measure: '%',
    });

    ConnectorPlugin.afterDatasetsDraw(mockChart);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(drawArrowSpy).toHaveBeenCalled();
    expect(drawRoundedRectSpy).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('does not draw when connector plugin data is missing', () => {
    mockChart = createMockChart(mockCtx);

    ConnectorPlugin.afterDatasetsDraw(mockChart);

    expect(drawArrowSpy).not.toHaveBeenCalled();
    expect(drawRoundedRectSpy).not.toHaveBeenCalled();
  });

  it('does not draw when value is undefined', () => {
    mockChart = createMockChart(mockCtx, {
      from: 'Jan',
      to: 'Mar',
      backgroundColor: '#FF0000',
      textColor: '#FFFFFF',
    });

    ConnectorPlugin.afterDatasetsDraw(mockChart);

    expect(drawArrowSpy).not.toHaveBeenCalled();
    expect(drawRoundedRectSpy).not.toHaveBeenCalled();
  });

  it('does not draw when from is undefined', () => {
    mockChart = createMockChart(mockCtx, {
      value: 25,
      to: 'Mar',
      backgroundColor: '#FF0000',
      textColor: '#FFFFFF',
    });

    ConnectorPlugin.afterDatasetsDraw(mockChart);

    expect(drawArrowSpy).not.toHaveBeenCalled();
    expect(drawRoundedRectSpy).not.toHaveBeenCalled();
  });

  it('does not draw when to is undefined', () => {
    mockChart = createMockChart(mockCtx, {
      value: 25,
      from: 'Jan',
      backgroundColor: '#FF0000',
      textColor: '#FFFFFF',
    });

    ConnectorPlugin.afterDatasetsDraw(mockChart);

    expect(drawArrowSpy).not.toHaveBeenCalled();
    expect(drawRoundedRectSpy).not.toHaveBeenCalled();
  });

  it('does not draw when data is empty', () => {
    mockChart = createMockChart(mockCtx, {
      value: 25,
      from: 'Jan',
      to: 'Mar',
      backgroundColor: '#FF0000',
      textColor: '#FFFFFF',
    });
    mockChart.getDatasetMeta = jest.fn(() => ({
      data: [],
    })) as any;

    ConnectorPlugin.afterDatasetsDraw(mockChart);

    expect(drawArrowSpy).not.toHaveBeenCalled();
    expect(drawRoundedRectSpy).not.toHaveBeenCalled();
  });

  it('finds bar indices by label names', () => {
    mockChart = createMockChart(mockCtx, {
      value: 30,
      from: 'Jan',
      to: 'Mar',
      backgroundColor: '#00FF00',
      textColor: '#000000',
      measure: ' pts',
    });

    ConnectorPlugin.afterDatasetsDraw(mockChart);

    expect(drawArrowSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        firstBar: expect.objectContaining({ x: 100 }),
        lastBar: expect.objectContaining({ x: 300 }),
      }),
    );
  });

  it('calls drawArrow with correct parameters using label names', () => {
    mockChart = createMockChart(mockCtx, {
      value: 20,
      from: 'Jan',
      to: 'Mar',
      backgroundColor: '#FF0000',
      textColor: '#FFFFFF',
      measure: '%',
    });

    ConnectorPlugin.afterDatasetsDraw(mockChart);

    expect(drawArrowSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        ctx: mockCtx,
        firstBar: expect.any(Object),
        lastBar: expect.any(Object),
        axisLineY: 300,
        midY: 50,
        arcRadius: 10,
        offset: 30,
      }),
    );
  });

  it('calls drawRoundedRect with correct parameters', () => {
    mockChart = createMockChart(mockCtx, {
      value: 35.5,
      from: 'Feb',
      to: 'Apr',
      backgroundColor: '#00FF00',
      textColor: '#000000',
      measure: ' units',
    });

    ConnectorPlugin.afterDatasetsDraw(mockChart);

    const midX =
      (mockChart.getDatasetMeta(0).data[1].x +
        mockChart.getDatasetMeta(0).data[3].x) /
      2;

    expect(drawRoundedRectSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        ctx: mockCtx,
        x: midX - 54 / 2,
        y: 50 - 65,
        width: 54,
        height: 24,
        radius: 4,
        label: '35.5 units',
        textColor: '#000000',
        backgroundColor: '#00FF00',
      }),
    );
  });

  it('formats label with measure', () => {
    mockChart = createMockChart(mockCtx, {
      value: 42,
      from: 'Jan',
      to: 'Feb',
      backgroundColor: '#FF0000',
      textColor: '#FFFFFF',
      measure: 'pts',
    });

    ConnectorPlugin.afterDatasetsDraw(mockChart);

    expect(drawRoundedRectSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        label: '42pts',
      }),
    );
  });

  it('handles errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      return;
    });

    mockChart = createMockChart(mockCtx, {
      value: 10,
      from: 'Jan',
      to: 'Dec',
      backgroundColor: '#FF0000',
      textColor: '#FFFFFF',
    });

    mockChart.getDatasetMeta = jest.fn(() => {
      throw new Error('Test error');
    });

    expect(() => {
      ConnectorPlugin.afterDatasetsDraw(mockChart);
    }).not.toThrow();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error in connectorPlugin:',
      expect.any(Error),
      expect.any(Object),
    );

    consoleSpy.mockRestore();
  });

  it('calculates midX correctly between bars', () => {
    mockChart = createMockChart(mockCtx, {
      value: 50,
      from: 'Feb',
      to: 'May',
      backgroundColor: '#0000FF',
      textColor: '#FFFFFF',
      measure: '',
    });

    ConnectorPlugin.afterDatasetsDraw(mockChart);

    const firstBar = mockChart.getDatasetMeta(0).data[1];
    const lastBar = mockChart.getDatasetMeta(0).data[4];
    const expectedMidX = (lastBar.x + firstBar.x) / 2;

    expect(drawRoundedRectSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        x: expectedMidX - 54 / 2,
      }),
    );
  });

  it('handles negative bar values', () => {
    mockChart = createMockChart(mockCtx, {
      value: -10,
      from: 'Jan',
      to: 'Feb',
      backgroundColor: '#FF0000',
      textColor: '#FFFFFF',
      measure: '%',
    });
    mockChart.data.datasets[0].data = [-20, -10, 5, 15];

    ConnectorPlugin.afterDatasetsDraw(mockChart);

    expect(drawArrowSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        firstBar: expect.objectContaining({ x: 100 }),
        lastBar: expect.objectContaining({ x: 200 }),
      }),
    );
  });
});
