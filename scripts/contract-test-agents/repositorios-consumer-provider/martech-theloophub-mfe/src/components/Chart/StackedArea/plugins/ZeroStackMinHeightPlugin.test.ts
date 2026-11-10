import { Chart } from 'chart.js';

import {
  GAP_COLOR,
  ZERO_BAR_COLOR,
  ZERO_BAR_GAP_PX,
  ZERO_BAR_MIN_HEIGHT_PX,
  ZERO_BAR_TOTAL_HEIGHT,
} from '../constants';
import { ZeroStackMinHeightPlugin } from './ZeroStackMinHeightPlugin';

const createMockCtx = () => ({
  save: jest.fn(),
  restore: jest.fn(),
  fillRect: jest.fn(),
  fillStyle: '' as string,
});

const createMockBar = (x: number, base: number, width: number) => ({
  x,
  base,
  width,
  y: base - 50,
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

describe('ZeroStackMinHeightPlugin', () => {
  let mockCtx: ReturnType<typeof createMockCtx>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCtx = createMockCtx();
  });

  it('has id "zeroStackMinHeight"', () => {
    expect(ZeroStackMinHeightPlugin.id).toBe('zeroStackMinHeight');
  });

  it('draws zero bar for visual zero bars', () => {
    const datasets = [{ data: [10, 0], originalValues: [10, 0] }];
    const metaMap = {
      0: { data: [createMockBar(100, 400, 60), createMockBar(200, 400, 60)] },
    };
    const chart = createMockChart(mockCtx, datasets, metaMap);

    ZeroStackMinHeightPlugin.afterDatasetsDraw(
      chart,
      {} as any,
      {} as any,
      false,
    );

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
    expect(mockCtx.fillRect).toHaveBeenCalledTimes(2);
  });

  it('draws gap rectangle with GAP_COLOR', () => {
    const datasets = [{ data: [10, 0], originalValues: [10, 0] }];
    const bar = createMockBar(200, 400, 60);
    const metaMap = {
      0: { data: [createMockBar(100, 400, 60), bar] },
    };
    const chart = createMockChart(mockCtx, datasets, metaMap);

    ZeroStackMinHeightPlugin.afterDatasetsDraw(chart, {}, {}, false);

    const fillStyleCalls: string[] = [];
    Object.defineProperty(mockCtx, 'fillStyle', {
      set(val: string) {
        fillStyleCalls.push(val);
      },
      get() {
        return fillStyleCalls[fillStyleCalls.length - 1] ?? '';
      },
    });

    ZeroStackMinHeightPlugin.afterDatasetsDraw(
      chart,
      {} as any,
      {} as any,
      false,
    );

    expect(fillStyleCalls[0]).toBe(GAP_COLOR);
  });

  it('draws bar rectangle with ZERO_BAR_COLOR', () => {
    const fillStyles: string[] = [];
    const ctx = {
      save: jest.fn(),
      restore: jest.fn(),
      fillRect: jest.fn(),
      set fillStyle(val: string) {
        fillStyles.push(val);
      },
      get fillStyle() {
        return fillStyles[fillStyles.length - 1] ?? '';
      },
    };

    const datasets = [{ data: [10, 0], originalValues: [10, 0] }];
    const metaMap = {
      0: { data: [createMockBar(100, 400, 60), createMockBar(200, 400, 60)] },
    };
    const chart = createMockChart(ctx as any, datasets, metaMap);

    ZeroStackMinHeightPlugin.afterDatasetsDraw(
      chart,
      {} as any,
      {} as any,
      false,
    );

    expect(fillStyles).toContain(ZERO_BAR_COLOR);
  });

  it('does not draw for non-zero bars', () => {
    const datasets = [{ data: [10, 20], originalValues: [10, 20] }];
    const metaMap = {
      0: { data: [createMockBar(100, 400, 60), createMockBar(200, 400, 60)] },
    };
    const chart = createMockChart(mockCtx, datasets, metaMap);

    ZeroStackMinHeightPlugin.afterDatasetsDraw(
      chart,
      {} as any,
      {} as any,
      false,
    );

    expect(mockCtx.fillRect).not.toHaveBeenCalled();
  });

  it('does not draw for pre-start zeros (zero before any positive)', () => {
    const datasets = [{ data: [0, 0, 10], originalValues: [0, 0, 10] }];
    const metaMap = {
      0: {
        data: [
          createMockBar(100, 400, 60),
          createMockBar(200, 400, 60),
          createMockBar(300, 400, 60),
        ],
      },
    };
    const chart = createMockChart(mockCtx, datasets, metaMap);

    ZeroStackMinHeightPlugin.afterDatasetsDraw(
      chart,
      {} as any,
      {} as any,
      false,
    );

    expect(mockCtx.fillRect).not.toHaveBeenCalled();
  });

  it('calculates offset correctly with zero bars below', () => {
    const datasets = [
      { data: [10, 0], originalValues: [10, 0] },
      { data: [10, 0], originalValues: [10, 0] },
    ];
    const bar0 = createMockBar(200, 400, 60);
    const bar1 = createMockBar(200, 400, 60);
    const metaMap = {
      0: { data: [createMockBar(100, 400, 60), bar0] },
      1: { data: [createMockBar(100, 400, 60), bar1] },
    };
    const chart = createMockChart(mockCtx, datasets, metaMap);

    ZeroStackMinHeightPlugin.afterDatasetsDraw(
      chart,
      {} as any,
      {} as any,
      false,
    );

    expect(mockCtx.fillRect).toHaveBeenCalledTimes(4);

    const firstGapCall = mockCtx.fillRect.mock.calls[0];
    const x = bar0.x - bar0.width / 2;
    expect(firstGapCall[0]).toBe(x);
    expect(firstGapCall[1]).toBe(bar0.base - 0 - ZERO_BAR_TOTAL_HEIGHT);
    expect(firstGapCall[2]).toBe(bar0.width);
    expect(firstGapCall[3]).toBe(ZERO_BAR_TOTAL_HEIGHT);
  });

  it('draws at correct position for zero bar', () => {
    const datasets = [{ data: [10, 0], originalValues: [10, 0] }];
    const bar = createMockBar(200, 400, 60);
    const metaMap = {
      0: { data: [createMockBar(100, 400, 60), bar] },
    };
    const chart = createMockChart(mockCtx, datasets, metaMap);

    ZeroStackMinHeightPlugin.afterDatasetsDraw(
      chart,
      {} as any,
      {} as any,
      false,
    );

    const barCall = mockCtx.fillRect.mock.calls[1];
    const x = bar.x - bar.width / 2;
    expect(barCall[0]).toBe(x);
    expect(barCall[1]).toBe(
      bar.base - 0 - ZERO_BAR_GAP_PX - ZERO_BAR_MIN_HEIGHT_PX,
    );
    expect(barCall[2]).toBe(bar.width);
    expect(barCall[3]).toBe(ZERO_BAR_MIN_HEIGHT_PX);
  });

  it('calls save and restore for each visual zero bar', () => {
    const datasets = [{ data: [10, 0, 0], originalValues: [10, 0, 0] }];
    const metaMap = {
      0: {
        data: [
          createMockBar(100, 400, 60),
          createMockBar(200, 400, 60),
          createMockBar(300, 400, 60),
        ],
      },
    };
    const chart = createMockChart(mockCtx, datasets, metaMap);

    ZeroStackMinHeightPlugin.afterDatasetsDraw(
      chart,
      {} as any,
      {} as any,
      false,
    );

    expect(mockCtx.save).toHaveBeenCalledTimes(2);
    expect(mockCtx.restore).toHaveBeenCalledTimes(2);
  });
});
