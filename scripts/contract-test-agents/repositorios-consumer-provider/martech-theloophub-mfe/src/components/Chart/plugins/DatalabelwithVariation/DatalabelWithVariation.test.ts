import { BarElement } from 'chart.js/dist';

import {
  calculateXAxisPositions,
  calculateYAxisPositions,
  calculateYAxisPositionsForNegativeValues,
  configureLabelStyle,
  getContrastingColor,
  hexToRgb,
  luminance,
  measureText,
  renderNegativeOverflowingLabel,
  renderOverflowingLabel,
  renderStandardLabel,
  setVariationStyle,
} from './DatalabelWithVariation';
import { DatalabelWithVariation as plugin } from './DatalabelWithVariation';
import { AxisData, LabelData } from './types';

const mockCtx = {
  fillText: jest.fn(),
  measureText: jest.fn().mockReturnValue({
    width: 50,
    actualBoundingBoxAscent: 10,
    actualBoundingBoxDescent: 5,
  }),
  font: '',
  textBaseline: '',
  fillStyle: '',
} as unknown as CanvasRenderingContext2D;

const mockBarElement = (x, y, width, height) => ({
  x: x || 50,
  y: y || 100,
  width: width || 40,
  height: height || 80,
  options: {
    backgroundColor: '#FF0000',
    borderColor: '#000000',
    borderWidth: 2,
  },
  getCenterPoint: jest.fn(() => ({ x, y: y || 90 })),
});
const mockChart = {
  ctx: mockCtx,
  config: {
    options: {
      plugins: {
        datalabelWithVariation: {
          label: {
            font: '12px Arial',
            color: {
              inside: '#000',
              outside: '#fff',
              white: '#fff',
            },
            textBaseline: 'middle',
          },
          variation: {
            font: '10px Arial',
            color: {
              up: '#00ff00',
              down: '#ff0000',
            },
            textBaseline: 'top',
          },
          separator: {
            xAxis: '-',
            yAxis: '|',
          },
        },
      },
      indexAxis: 'x',
    },
  },
  data: {
    datasets: [
      {
        data: [80, -40],
        values: [80, -40],
        variationData: [
          { variation: '+5%', direction: 'up' },
          { variation: '-3%', direction: 'down' },
        ],
        backgroundColor: ['#000', '#fff'],
      },
    ],
    labels: ['Jan', 'Feb'],
  },
  scales: {
    x: {
      getPixelForValue: jest.fn((val) => val * 10),
    },
    y: {
      getPixelForValue: jest.fn((val) => val * 20),
    },
  },
  getDatasetMeta: jest.fn(() => ({
    type: 'bar',
    data: [
      {
        x: 10,
        y: 20,
        base: 30,
        width: 50,
        height: 100,
        backgroundColor: '#000',
      },
      {
        x: 15,
        y: 25,
        base: 35,
        width: 60,
        height: 90,
        backgroundColor: '#fff',
      },
    ],
  })),
};

describe('DatalabelWithVariationPlugin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize the plugin correctly', () => {
    expect(plugin).toEqual(
      expect.objectContaining({
        id: 'datalabelWithVariation',
        afterDraw: expect.any(Function),
      }),
    );
  });

  it('should draw labels on X axis for positive values', () => {
    plugin.afterDraw(mockChart);
    expect(mockCtx.fillText).toHaveBeenCalledWith(
      '80.0',
      expect.any(Number),
      expect.any(Number),
    );
    expect(mockCtx.fillText).toHaveBeenCalledWith(
      '+5%',
      expect.any(Number),
      expect.any(Number),
    );
  });

  it('should draw labels on X axis for negative values', () => {
    mockChart.data.datasets[0].data = [-40];
    plugin.afterDraw(mockChart);

    expect(mockCtx.fillText).toHaveBeenCalledWith(
      '-40.0',
      expect.any(Number),
      expect.any(Number),
    );
    expect(mockCtx.fillText).toHaveBeenCalledWith(
      '-3%',
      expect.any(Number),
      expect.any(Number),
    );
  });

  it('should draw labels on Y axis for positive values', () => {
    mockChart.config.options.indexAxis = 'y';

    plugin.afterDraw(mockChart);
    expect(mockCtx.fillText).toHaveBeenCalledWith(
      '-40.0',
      expect.any(Number),
      expect.any(Number),
    );
    expect(mockCtx.fillText).toHaveBeenCalledWith(
      '-3%',
      expect.any(Number),
      expect.any(Number),
    );
  });

  it('should calculate positions correctly for overflowing labels', () => {
    const bar = mockBarElement(10, 20, 50, 10) as unknown as BarElement;
    const ctx = mockCtx;
    const measuredText = measureText(mockCtx, '80');

    const result = calculateXAxisPositions(
      bar,
      ctx,
      { value: '80', variation: '+5%' } as LabelData,
      measuredText,
      '-',
      'inside',
    );

    expect(result.isTextOverflowing).toBe(true);
    expect(result.finalX).toBeLessThan(bar.x + bar.width);
  });

  it('should apply the correct styles', () => {
    const bar = mockBarElement(10, 20, 50, 100) as unknown as BarElement;
    configureLabelStyle(
      mockCtx,
      mockChart.config.options.plugins
        .datalabelWithVariation as AxisData['configOptions'],
      bar,
      true,
    );

    expect(mockCtx.font).toBe('12px Arial');
    expect(mockCtx.fillStyle).toBe('#fff');
  });

  it('should render labels with variations', () => {
    const bar = mockBarElement(10, 20, 50, 100) as unknown as BarElement;
    renderStandardLabel(
      mockCtx,
      { value: 30, variation: 40 },
      { value: '80', variation: '+5%', variationDirection: 'up', label: 'Jan' },
      { finalX: 15, finalXtoVariation: 25 },
      mockChart.config.options.plugins
        .datalabelWithVariation as AxisData['configOptions'],
      bar,
    );

    expect(mockCtx.fillText).toHaveBeenCalledWith('80', 15, 30);
    expect(mockCtx.fillText).toHaveBeenCalledWith('+5%', 25, 40);
  });

  it('shoud return the correct rgb color', () => {
    const hex = '#023c66';
    expect(hexToRgb(hex)).toStrictEqual({ r: 2, g: 60, b: 102 });
  });

  it('should should return the correct luminance for pure black', () => {
    const rgb = { r: 0, g: 0, b: 0 };
    const result = luminance(rgb);
    expect(result).toBeCloseTo(0);
  });

  it('should return the correct luminance for pure white', () => {
    const rgb = { r: 255, g: 255, b: 255 };
    const result = luminance(rgb);
    expect(result).toBeCloseTo(1);
  });

  it('should return the correct luminance for a specific color ', () => {
    const rgb = { r: 255, g: 87, b: 51 };
    const result = luminance(rgb);
    expect(result).toBeCloseTo(0.283);
  });

  it('should return the correct contrast color', () => {
    const color_1 = '#7054a3';
    const color_2 = '#f7f7f7';
    const color_3 = '#000000';
    expect(getContrastingColor(color_1)).toBe('white');
    expect(getContrastingColor(color_2)).toBe('black');
    expect(getContrastingColor(color_3)).toBe('white');
  });

  it('should render label, separator, and variation correctly', () => {
    const bar = mockBarElement(20, null, 50, null) as unknown as BarElement;
    const positions = {
      finalX: 30,
      finalXtoSeparator: 35,
      finalXtoVariation: 40,
      separatorWidth: 50,
      isTextOverflowing: false,
    };
    const yBase = {
      value: 50,
      separator: 55,
      variation: 60,
    };
    const separator = '-';
    const labelData = {
      value: '50',
      variation: '+10%',
      variationDirection: 'up',
      label: 'Test',
    } as LabelData;
    const configOptions = mockChart.config.options.plugins
      .datalabelWithVariation as AxisData['configOptions'];

    renderNegativeOverflowingLabel(
      mockCtx,
      yBase,
      separator,
      labelData,
      positions,
      configOptions,
      bar,
    );

    expect(mockCtx.fillText).toHaveBeenCalledWith(
      '50',
      positions.finalX,
      yBase.value,
    );
    expect(mockCtx.fillText).toHaveBeenCalledWith(
      '-',
      positions.finalXtoSeparator,
      yBase.separator,
    );
    expect(mockCtx.fillText).toHaveBeenCalledWith(
      labelData.variation,
      positions.finalXtoVariation,
      yBase.variation,
    );
  });

  it('should render label and separator correctly when variation is provided', () => {
    const bar = mockBarElement(20, null, 50, null) as unknown as BarElement;
    const positions = {
      finalX: 30,
      finalXtoSeparator: 35,
      finalXtoVariation: 40,
      separatorWidth: 50,
      isTextOverflowing: false,
    };
    const yAxis = { value: 50, separator: 55, variation: 60 };
    const separator = '-';
    const labelData = {
      value: '100',
      variation: '+15%',
      variationDirection: 'down',
      label: 'Test',
    } as LabelData;
    const configOptions = mockChart.config.options.plugins
      .datalabelWithVariation as AxisData['configOptions'];

    renderOverflowingLabel(
      mockCtx,
      yAxis,
      separator,
      labelData,
      positions,
      configOptions,
      bar,
    );

    expect(mockCtx.fillText).toHaveBeenCalledWith(
      '100',
      positions.finalX,
      yAxis.value,
    );
    expect(mockCtx.fillText).toHaveBeenCalledWith(
      '-',
      positions.finalXtoSeparator,
      yAxis.separator,
    );
    expect(mockCtx.fillText).toHaveBeenCalledWith(
      labelData.variation,
      positions.finalXtoVariation,
      yAxis.variation,
    );
  });

  it('should calculate positions correctly for negative values', () => {
    const bar = mockBarElement(100, null, 20, null) as unknown as BarElement;
    const separator = '-';
    const measuredText = { width: 10, height: 15 };

    const positions = calculateYAxisPositionsForNegativeValues(
      bar,
      mockCtx,
      measuredText,
      separator,
      'inside',
    );

    expect(positions.finalX).toBe(80);
    expect(positions.isTextOverflowing).toBe(false);
  });

  it('should calculate positions correctly for positive values', () => {
    const bar = mockBarElement(10, null, 50, null) as unknown as BarElement;
    const value = 20;
    const separator = '-';
    const measuredText = { width: 15, height: 10 };
    const x = {
      getPixelForValue: jest.fn((val) => val * 2),
    } as unknown as AxisData['x'];

    const positions = calculateYAxisPositions(
      bar,
      mockCtx,
      value,
      x,
      measuredText,
      separator,
      'inside',
    );

    expect(positions.finalX).toBe(25);
    expect(positions.isTextOverflowing).toBe(false);
    expect(positions.separatorWidth).toBe(50);
  });

  it('should set fillStyle to black when variation direction is not defined', () => {
    setVariationStyle(
      mockCtx,
      mockChart.config.options.plugins
        .datalabelWithVariation as AxisData['configOptions'],
      { value: '80', variation: '+5%' } as LabelData,
    );
    expect(mockCtx.fillStyle).toBe('#000');
  });
});
