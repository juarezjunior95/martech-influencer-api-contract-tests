import { Chart } from 'chart.js';

import { CONNECTOR_EDGE_OVERLAP_PX, ZERO_CONNECTOR_COLOR } from '../constants';
import { createAreaConnectorPlugin } from './AreaConnectorPlugin';

const createMockCtx = () => ({
  save: jest.fn(),
  restore: jest.fn(),
  fill: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  fillStyle: '' as string,
});

const createMockBar = (x: number, y: number, base: number, width: number) => ({
  x,
  y,
  base,
  width,
});

const createMockChart = (
  ctx: ReturnType<typeof createMockCtx>,
  datasets: any[],
  metaMap: Record<number, any>,
): Chart<'bar'> =>
  ({
    ctx,
    data: { datasets },
    getDatasetMeta: jest.fn((index: number) => metaMap[index]),
  }) as unknown as Chart<'bar'>;

describe('AreaConnectorPlugin', () => {
  let mockCtx: ReturnType<typeof createMockCtx>;
  const connectorColors = ['#F0DF78', '#EEC879', '#A1CFF4'];

  beforeEach(() => {
    mockCtx = createMockCtx();
    jest.clearAllMocks();
  });

  it('returns plugin with id "areaConnector"', () => {
    const plugin = createAreaConnectorPlugin(connectorColors);
    expect(plugin.id).toBe('areaConnector');
  });

  it('draws connectors between adjacent bars', () => {
    const datasets = [
      {
        data: [50, 60],
        originalValues: [50, 60],
        borderWidth: { top: 2 },
      },
    ];
    const metaMap = {
      0: {
        data: [
          createMockBar(100, 200, 400, 60),
          createMockBar(250, 180, 400, 60),
        ],
      },
    };
    const chart = createMockChart(mockCtx, datasets, metaMap);
    const plugin = createAreaConnectorPlugin(connectorColors);

    plugin.beforeDatasetsDraw(chart);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.moveTo).toHaveBeenCalled();
    expect(mockCtx.lineTo).toHaveBeenCalledTimes(3);
    expect(mockCtx.closePath).toHaveBeenCalled();
    expect(mockCtx.fill).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('uses ZERO_CONNECTOR_COLOR when both bars are visual zeros', () => {
    const fillStyles: string[] = [];
    const ctx = {
      ...createMockCtx(),
      set fillStyle(val: string) {
        fillStyles.push(val);
      },
      get fillStyle() {
        return fillStyles[fillStyles.length - 1] ?? '';
      },
    };

    const datasets = [
      {
        data: [10, 0, 0],
        originalValues: [10, 0, 0],
        borderWidth: { top: 2 },
      },
    ];
    const metaMap = {
      0: {
        data: [
          createMockBar(100, 200, 400, 60),
          createMockBar(200, 400, 400, 60),
          createMockBar(300, 400, 400, 60),
        ],
      },
    };
    const chart = createMockChart(ctx as any, datasets, metaMap);
    const plugin = createAreaConnectorPlugin(connectorColors);

    plugin.beforeDatasetsDraw(chart);

    expect(fillStyles).toContain(ZERO_CONNECTOR_COLOR);
  });

  it('uses connectorColors for normal bars', () => {
    const fillStyles: string[] = [];
    const ctx = {
      ...createMockCtx(),
      set fillStyle(val: string) {
        fillStyles.push(val);
      },
      get fillStyle() {
        return fillStyles[fillStyles.length - 1] ?? '';
      },
    };

    const datasets = [
      {
        data: [50, 60],
        originalValues: [50, 60],
        borderWidth: { top: 2 },
      },
    ];
    const metaMap = {
      0: {
        data: [
          createMockBar(100, 200, 400, 60),
          createMockBar(250, 180, 400, 60),
        ],
      },
    };
    const chart = createMockChart(ctx as any, datasets, metaMap);
    const plugin = createAreaConnectorPlugin(['#AAA', '#BBB', '#CCC']);

    plugin.beforeDatasetsDraw(chart);

    expect(fillStyles).toContain('#AAA');
  });

  it('skips when currentData is disabled', () => {
    const datasets = [
      {
        data: [{ disabled: true }, 60],
        originalValues: [50, 60],
        borderWidth: { top: 2 },
      },
    ];
    const metaMap = {
      0: {
        data: [
          createMockBar(100, 200, 400, 60),
          createMockBar(250, 180, 400, 60),
        ],
      },
    };
    const chart = createMockChart(mockCtx, datasets, metaMap);
    const plugin = createAreaConnectorPlugin(connectorColors);

    plugin.beforeDatasetsDraw(chart);

    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  it('skips when nextData is disabled', () => {
    const datasets = [
      {
        data: [50, { disabled: true }],
        originalValues: [50, 60],
        borderWidth: { top: 2 },
      },
    ];
    const metaMap = {
      0: {
        data: [
          createMockBar(100, 200, 400, 60),
          createMockBar(250, 180, 400, 60),
        ],
      },
    };
    const chart = createMockChart(mockCtx, datasets, metaMap);
    const plugin = createAreaConnectorPlugin(connectorColors);

    plugin.beforeDatasetsDraw(chart);

    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  it('skips when both bars are preStartZero', () => {
    const datasets = [
      {
        data: [0, 0, 10],
        originalValues: [0, 0, 10],
        borderWidth: { top: 2 },
      },
    ];
    const metaMap = {
      0: {
        data: [
          createMockBar(100, 400, 400, 60),
          createMockBar(200, 400, 400, 60),
          createMockBar(300, 200, 400, 60),
        ],
      },
    };
    const chart = createMockChart(mockCtx, datasets, metaMap);
    const plugin = createAreaConnectorPlugin(connectorColors);

    plugin.beforeDatasetsDraw(chart);

    expect(mockCtx.fill).toHaveBeenCalledTimes(1);
  });

  it('skips when both bars have height < 1 and are not visual zeros', () => {
    const datasets = [
      {
        data: [0.1, 0.1],
        originalValues: [0.1, 0.1],
        borderWidth: { top: 2 },
      },
    ];
    const metaMap = {
      0: {
        data: [
          createMockBar(100, 400, 400.5, 60),
          createMockBar(200, 400, 400.5, 60),
        ],
      },
    };
    const chart = createMockChart(mockCtx, datasets, metaMap);
    const plugin = createAreaConnectorPlugin(connectorColors);

    plugin.beforeDatasetsDraw(chart);

    expect(mockCtx.beginPath).not.toHaveBeenCalled();
  });

  it('returns early when meta.data has less than 2 bars', () => {
    const datasets = [
      {
        data: [50],
        originalValues: [50],
        borderWidth: { top: 2 },
      },
    ];
    const metaMap = {
      0: {
        data: [createMockBar(100, 200, 400, 60)],
      },
    };
    const chart = createMockChart(mockCtx, datasets, metaMap);
    const plugin = createAreaConnectorPlugin(connectorColors);

    plugin.beforeDatasetsDraw(chart);

    expect(mockCtx.save).not.toHaveBeenCalled();
  });

  it('calculates x positions with CONNECTOR_EDGE_OVERLAP_PX', () => {
    const datasets = [
      {
        data: [50, 60],
        originalValues: [50, 60],
        borderWidth: { top: 2 },
      },
    ];
    const bar1 = createMockBar(100, 200, 400, 60);
    const bar2 = createMockBar(250, 180, 400, 60);
    const metaMap = {
      0: { data: [bar1, bar2] },
    };
    const chart = createMockChart(mockCtx, datasets, metaMap);
    const plugin = createAreaConnectorPlugin(connectorColors);

    plugin.beforeDatasetsDraw(chart);

    const expectedX1 = bar1.x + bar1.width / 2 - CONNECTOR_EDGE_OVERLAP_PX;
    const expectedX2 = bar2.x - bar2.width / 2 + CONNECTOR_EDGE_OVERLAP_PX;

    expect(mockCtx.moveTo).toHaveBeenCalledWith(expectedX1, expect.any(Number));
    expect(mockCtx.lineTo).toHaveBeenCalledWith(expectedX2, expect.any(Number));
  });

  it('handles multiple datasets correctly', () => {
    const datasets = [
      {
        data: [50, 60],
        originalValues: [50, 60],
        borderWidth: { bottom: 2 },
      },
      {
        data: [30, 40],
        originalValues: [30, 40],
        borderWidth: { top: 2 },
      },
    ];
    const metaMap = {
      0: {
        data: [
          createMockBar(100, 300, 400, 60),
          createMockBar(250, 280, 400, 60),
        ],
      },
      1: {
        data: [
          createMockBar(100, 200, 300, 60),
          createMockBar(250, 180, 280, 60),
        ],
      },
    };
    const chart = createMockChart(mockCtx, datasets, metaMap);
    const plugin = createAreaConnectorPlugin(connectorColors);

    plugin.beforeDatasetsDraw(chart);

    expect(mockCtx.fill).toHaveBeenCalledTimes(2);
  });
});
