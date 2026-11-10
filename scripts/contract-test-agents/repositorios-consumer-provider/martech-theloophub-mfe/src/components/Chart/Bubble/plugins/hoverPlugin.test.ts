import { Chart, ChartEvent } from 'chart.js';

import * as constants from '../constants';
import { createColumnHoverPlugin } from './hoverPlugin';

jest.mock('../constants', () => ({
  COLUMN_WIDTH: 2,
  getHoveredColumn: jest.fn(),
  setHoveredColumn: jest.fn(),
  isInCooldown: jest.fn().mockReturnValue(false),
}));

const createMockChart = (): Chart<'bubble'> =>
  ({
    scales: {
      x: {
        getValueForPixel: jest.fn((pixel) => pixel / 10),
      },
    },
    update: jest.fn(),
  }) as unknown as Chart<'bubble'>;

describe('createColumnHoverPlugin (hoverPlugin)', () => {
  let mockChart: Chart<'bubble'>;
  let plugin: any;

  beforeEach(() => {
    mockChart = createMockChart();
    jest.clearAllMocks();
    (constants.getHoveredColumn as jest.Mock).mockReturnValue(null);
  });

  it('creates plugin with correct id', () => {
    plugin = createColumnHoverPlugin(5);

    expect(plugin.id).toBe('hoverPlugin');
  });

  it('handles mousemove event and updates hovered column', () => {
    plugin = createColumnHoverPlugin(5);

    const event: ChartEvent = {
      type: 'mousemove',
      x: 25,
      y: 100,
    } as ChartEvent;

    plugin.beforeEvent(mockChart, { event } as any, {} as any);

    expect(mockChart.scales.x.getValueForPixel).toHaveBeenCalledWith(25);
    expect(constants.setHoveredColumn).toHaveBeenCalledWith(1);
    expect(mockChart.update).toHaveBeenCalled();
  });

  it('does not update if hovered column is the same', () => {
    (constants.getHoveredColumn as jest.Mock).mockReturnValue(2);
    plugin = createColumnHoverPlugin(5);

    const event: ChartEvent = {
      type: 'mousemove',
      x: 40,
      y: 100,
    } as ChartEvent;

    plugin.beforeEvent(mockChart, { event } as any, {} as any);

    expect(constants.setHoveredColumn).not.toHaveBeenCalled();
    expect(mockChart.update).not.toHaveBeenCalled();
  });

  it('calls onHoverChange callback when column changes', () => {
    const onHoverChange = jest.fn();
    plugin = createColumnHoverPlugin(5, onHoverChange);

    const event: ChartEvent = {
      type: 'mousemove',
      x: 60,
      y: 100,
    } as ChartEvent;

    plugin.beforeEvent(mockChart, { event } as any, {} as any);

    expect(onHoverChange).toHaveBeenCalledWith(3);
  });

  it('does not call onHoverChange when column has not changed', () => {
    (constants.getHoveredColumn as jest.Mock).mockReturnValue(1);
    const onHoverChange = jest.fn();
    plugin = createColumnHoverPlugin(5, onHoverChange);

    const event: ChartEvent = {
      type: 'mousemove',
      x: 20,
      y: 100,
    } as ChartEvent;

    plugin.beforeEvent(mockChart, { event } as any, {} as any);

    expect(onHoverChange).not.toHaveBeenCalled();
  });

  it('ignores negative column indices', () => {
    plugin = createColumnHoverPlugin(5);

    const event: ChartEvent = {
      type: 'mousemove',
      x: -50,
      y: 100,
    } as ChartEvent;

    plugin.beforeEvent(mockChart, { event } as any, {} as any);

    expect(constants.setHoveredColumn).not.toHaveBeenCalled();
    expect(mockChart.update).not.toHaveBeenCalled();
  });

  it('ignores column indices >= columnsCount', () => {
    plugin = createColumnHoverPlugin(5);

    const event: ChartEvent = {
      type: 'mousemove',
      x: 150,
      y: 100,
    } as ChartEvent;

    plugin.beforeEvent(mockChart, { event } as any, {} as any);

    expect(constants.setHoveredColumn).not.toHaveBeenCalled();
    expect(mockChart.update).not.toHaveBeenCalled();
  });

  it('does not process event when x-scale is missing', () => {
    plugin = createColumnHoverPlugin(5);
    mockChart.scales.x = undefined;

    const event: ChartEvent = {
      type: 'mousemove',
      x: 50,
      y: 100,
    } as ChartEvent;

    plugin.beforeEvent(mockChart, { event } as any, {} as any);

    expect(constants.setHoveredColumn).not.toHaveBeenCalled();
  });

  it('calculates column index correctly using COLUMN_WIDTH', () => {
    plugin = createColumnHoverPlugin(10);

    const event: ChartEvent = {
      type: 'mousemove',
      x: 80,
      y: 100,
    } as ChartEvent;

    plugin.beforeEvent(mockChart, { event } as any, {} as any);

    expect(constants.setHoveredColumn).toHaveBeenCalledWith(4);
  });

  it('works without onHoverChange callback', () => {
    plugin = createColumnHoverPlugin(5);

    const event: ChartEvent = {
      type: 'mousemove',
      x: 40,
      y: 100,
    } as ChartEvent;

    expect(() => {
      plugin.beforeEvent(mockChart, { event } as any, {} as any);
    }).not.toThrow();
  });

  it('handles boundary column index (0)', () => {
    plugin = createColumnHoverPlugin(5);

    const event: ChartEvent = {
      type: 'mousemove',
      x: 5,
      y: 100,
    } as ChartEvent;

    plugin.beforeEvent(mockChart, { event } as any, {} as any);

    expect(constants.setHoveredColumn).toHaveBeenCalledWith(0);
  });

  it('handles boundary column index (columnsCount - 1)', () => {
    plugin = createColumnHoverPlugin(5);

    const event: ChartEvent = {
      type: 'mousemove',
      x: 95,
      y: 100,
    } as ChartEvent;

    plugin.beforeEvent(mockChart, { event } as any, {} as any);

    expect(constants.setHoveredColumn).toHaveBeenCalledWith(4);
  });

  it('ignores events other than mousemove', () => {
    plugin = createColumnHoverPlugin(5);

    const event: ChartEvent = {
      type: 'click',
      x: 50,
      y: 100,
    } as ChartEvent;

    plugin.beforeEvent(mockChart, { event } as any, {} as any);

    expect(constants.setHoveredColumn).not.toHaveBeenCalled();
    expect(mockChart.update).not.toHaveBeenCalled();
  });

  it('updates chart when column changes', () => {
    plugin = createColumnHoverPlugin(5);

    const event: ChartEvent = {
      type: 'mousemove',
      x: 30,
      y: 100,
    } as ChartEvent;

    plugin.beforeEvent(mockChart, { event } as any, {} as any);

    expect(mockChart.update).toHaveBeenCalled();
  });

  it('handles rapid column changes', () => {
    plugin = createColumnHoverPlugin(5);

    [10, 30, 50, 70].forEach((x) => {
      jest.clearAllMocks();
      (constants.getHoveredColumn as jest.Mock).mockReturnValue(null);

      const event: ChartEvent = {
        type: 'mousemove',
        x,
        y: 100,
      } as ChartEvent;

      plugin.beforeEvent(mockChart, { event } as any, {} as any);

      expect(constants.setHoveredColumn).toHaveBeenCalled();
      expect(mockChart.update).toHaveBeenCalled();
    });
  });

  it('handles float x values correctly with floor', () => {
    plugin = createColumnHoverPlugin(5);

    const event: ChartEvent = {
      type: 'mousemove',
      x: 37.8,
      y: 100,
    } as ChartEvent;

    plugin.beforeEvent(mockChart, { event } as any, {} as any);

    expect(constants.setHoveredColumn).toHaveBeenCalledWith(1);
  });

  it('handles single column chart', () => {
    plugin = createColumnHoverPlugin(1);

    const event: ChartEvent = {
      type: 'mousemove',
      x: 5,
      y: 100,
    } as ChartEvent;

    plugin.beforeEvent(mockChart, { event } as any, {} as any);

    expect(constants.setHoveredColumn).toHaveBeenCalledWith(0);
  });
});
