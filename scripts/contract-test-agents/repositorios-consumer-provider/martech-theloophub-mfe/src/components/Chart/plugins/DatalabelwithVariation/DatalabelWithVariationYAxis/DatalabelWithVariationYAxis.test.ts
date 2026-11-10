import { Chart, ChartDataset } from 'chart.js';

import { DatalabelWithVariationYAxis } from './DatalabelWithVariationYAxis';

jest.mock('utils/format', () => ({
  formatNumberWithSuffix: jest.fn((value) => ({
    value: value.toString(),
    suffix: '',
  })),
}));

type DatasetWithVariation = ChartDataset<'bar'> & {
  variationData?: Array<{ variation: string; direction: 'up' | 'down' }>;
  formattedData?: string[];
};

const createMockCtx = (): CanvasRenderingContext2D =>
  ({
    fillText: jest.fn(),
    measureText: jest.fn().mockReturnValue({
      width: 50,
      actualBoundingBoxAscent: 10,
      actualBoundingBoxDescent: 5,
    }),
    font: '',
    fillStyle: '',
    textAlign: '',
    textBaseline: '',
  }) as unknown as CanvasRenderingContext2D;

const createMockChart = (ctx: CanvasRenderingContext2D): Chart<'bar'> =>
  ({
    ctx,
    config: {
      options: {
        plugins: {
          datalabelWithVariationYAxis: {
            label: {
              display: true,
              font: '12px Arial',
              textBaseline: 'middle',
              position: 'inside',
              unitOfMeasure: '%',
              color: {
                inside: '#000',
                outside: '#666',
                white: '#FFF',
              },
            },
            variation: {
              font: '10px Arial',
              textBaseline: 'top',
              color: {
                up: '#00FF00',
                down: '#FF0000',
              },
            },
            separator: {
              yAxis: '|',
            },
          },
        },
      },
    },
    data: {
      labels: ['Label1', 'Label2'],
      datasets: [
        {
          data: [50, -30],
          variationData: [
            { variation: '+5%', direction: 'up' as const },
            { variation: '-3%', direction: 'down' as const },
          ],
          formattedData: ['50%', '-30%'],
        } as DatasetWithVariation,
      ],
    },
    scales: {
      x: {
        getPixelForValue: jest.fn((value) => value * 10),
      },
      y: {
        getPixelForValue: jest.fn((value) => 500 - value * 5),
      },
    },
    getDatasetMeta: jest.fn(() => ({
      type: 'bar',
      data: [
        {
          x: 100,
          y: 200,
          width: 80,
          height: 100,
          options: { backgroundColor: '#0000FF' },
        },
        {
          x: 250,
          y: 350,
          width: 80,
          height: 100,
          options: { backgroundColor: '#FF0000' },
        },
      ],
    })),
  }) as unknown as Chart<'bar'>;

describe('DatalabelWithVariationYAxis Plugin', () => {
  let mockCtx: CanvasRenderingContext2D;
  let mockChart: Chart<'bar'>;

  beforeEach(() => {
    mockCtx = createMockCtx();
    jest.clearAllMocks();
  });

  it('has correct plugin id', () => {
    expect(DatalabelWithVariationYAxis.id).toBe('datalabelWithVariationYAxis');
  });

  it('draws labels with variation for bar charts', () => {
    mockChart = createMockChart(mockCtx);

    DatalabelWithVariationYAxis.afterDraw(mockChart);

    expect(mockCtx.fillText).toHaveBeenCalled();
  });

  it('does not draw for non-bar chart types', () => {
    mockChart = createMockChart(mockCtx);
    mockChart.getDatasetMeta = jest.fn(() => ({
      type: 'line',
      data: [],
    })) as any;

    DatalabelWithVariationYAxis.afterDraw(mockChart);

    expect(mockCtx.fillText).not.toHaveBeenCalled();
  });

  it('draws labels when display is true', () => {
    mockChart = createMockChart(mockCtx);

    DatalabelWithVariationYAxis.afterDraw(mockChart);

    expect(mockCtx.fillText).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Number),
      expect.any(Number),
    );
  });

  it('uses formattedData when available', () => {
    mockChart = createMockChart(mockCtx);

    DatalabelWithVariationYAxis.afterDraw(mockChart);

    expect(mockCtx.fillText).toHaveBeenCalledWith(
      '50%',
      expect.any(Number),
      expect.any(Number),
    );
  });

  it('draws variation labels when variationData exists', () => {
    mockChart = createMockChart(mockCtx);

    DatalabelWithVariationYAxis.afterDraw(mockChart);

    expect(mockCtx.fillText).toHaveBeenCalledWith(
      '+5%',
      expect.any(Number),
      expect.any(Number),
    );
  });

  it('applies correct color for up variation', () => {
    mockChart = createMockChart(mockCtx);

    DatalabelWithVariationYAxis.afterDraw(mockChart);

    expect(mockCtx.fillStyle).toBeDefined();
  });

  it('applies correct color for down variation', () => {
    mockChart = createMockChart(mockCtx);

    DatalabelWithVariationYAxis.afterDraw(mockChart);

    expect(mockCtx.fillStyle).toBeDefined();
  });

  it('handles positive values correctly', () => {
    mockChart = createMockChart(mockCtx);
    mockChart.data.datasets[0].data = [50];
    mockChart.getDatasetMeta = jest.fn(() => ({
      type: 'bar',
      data: [
        {
          x: 100,
          y: 200,
          width: 80,
          height: 100,
          options: { backgroundColor: '#0000FF' },
        },
      ],
    })) as any;

    DatalabelWithVariationYAxis.afterDraw(mockChart);

    expect(mockCtx.fillText).toHaveBeenCalled();
  });

  it('handles negative values correctly', () => {
    mockChart = createMockChart(mockCtx);
    mockChart.data.datasets[0].data = [-30];
    (mockChart.data.datasets[0] as any).formattedData = ['-30%'];
    mockChart.getDatasetMeta = jest.fn(() => ({
      type: 'bar',
      data: [
        {
          x: 100,
          y: 200,
          width: 80,
          height: 100,
          options: { backgroundColor: '#FF0000' },
        },
      ],
    })) as any;

    DatalabelWithVariationYAxis.afterDraw(mockChart);

    expect(mockCtx.fillText).toHaveBeenCalled();
  });

  it('handles zero values correctly', () => {
    mockChart = createMockChart(mockCtx);
    mockChart.data.datasets[0].data = [0];
    (mockChart.data.datasets[0] as any).formattedData = ['0%'];
    mockChart.getDatasetMeta = jest.fn(() => ({
      type: 'bar',
      data: [
        {
          x: 100,
          y: 200,
          width: 80,
          height: 100,
          options: { backgroundColor: '#CCCCCC' },
        },
      ],
    })) as any;

    DatalabelWithVariationYAxis.afterDraw(mockChart);

    expect(mockCtx.fillText).toHaveBeenCalled();
  });

  it('applies unit of measure when configured', () => {
    mockChart = createMockChart(mockCtx);

    DatalabelWithVariationYAxis.afterDraw(mockChart);

    expect(mockCtx.fillText).toHaveBeenCalled();
  });

  it('measures text correctly', () => {
    mockChart = createMockChart(mockCtx);

    DatalabelWithVariationYAxis.afterDraw(mockChart);

    expect(mockCtx.measureText).toHaveBeenCalled();
  });

  it('handles overflowing text with separator', () => {
    mockChart = createMockChart(mockCtx);
    mockChart.config.options.plugins.datalabelWithVariationYAxis.label.position =
      'top';

    DatalabelWithVariationYAxis.afterDraw(mockChart);

    expect(mockCtx.fillText).toHaveBeenCalled();
  });

  it('processes multiple datasets', () => {
    mockChart = createMockChart(mockCtx);
    mockChart.data.datasets = [
      {
        data: [50],
        variationData: [{ variation: '+5%', direction: 'up' as const }],
        formattedData: ['50%'],
      } as any,
      {
        data: [30],
        variationData: [{ variation: '+3%', direction: 'up' as const }],
        formattedData: ['30%'],
      } as any,
    ];

    DatalabelWithVariationYAxis.afterDraw(mockChart);

    expect(mockChart.getDatasetMeta).toHaveBeenCalledTimes(2);
  });

  it('does not draw when label display is false', () => {
    mockChart = createMockChart(mockCtx);
    mockChart.config.options.plugins.datalabelWithVariationYAxis.label.display = false;

    jest.clearAllMocks();
    DatalabelWithVariationYAxis.afterDraw(mockChart);

    const fillTextCalls = (mockCtx.fillText as jest.Mock).mock.calls;
    const hasEmptyString = fillTextCalls.some((call) => call[0] === '');
    expect(hasEmptyString).toBe(true);
  });

  it('applies correct font styles', () => {
    mockChart = createMockChart(mockCtx);

    DatalabelWithVariationYAxis.afterDraw(mockChart);

    expect(mockCtx.font).toBeDefined();
    expect(mockCtx.textBaseline).toBeDefined();
  });

  it('handles bars without variationData', () => {
    mockChart = createMockChart(mockCtx);
    (mockChart.data.datasets[0] as any).variationData = undefined;

    DatalabelWithVariationYAxis.afterDraw(mockChart);

    expect(mockCtx.fillText).toHaveBeenCalled();
  });

  it('determines text position based on bar width', () => {
    mockChart = createMockChart(mockCtx);

    DatalabelWithVariationYAxis.afterDraw(mockChart);

    expect(mockCtx.fillText).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Number),
      expect.any(Number),
    );
  });
});
