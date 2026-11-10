import { emptyBarOverlay } from './EmptyBarOverlay';

const makeCtx = () => ({
  save: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  arcTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  fillText: jest.fn(),
  setLineDash: jest.fn(),
  strokeStyle: '',
  fillStyle: '',
  lineWidth: 0,
  textAlign: '' as CanvasTextAlign,
  textBaseline: '' as CanvasTextBaseline,
  font: '',
});

const makeChart = (
  emptyIndices: Set<number>,
  labels: (string | null)[],
  yScaleTicks: { value: number }[] = [{ value: 0 }, { value: 1 }],
) => ({
  options: {
    plugins: {
      emptyBarOverlay: { emptyIndices },
    },
  },
  data: { labels },
  ctx: makeCtx(),
  chartArea: { left: 0, right: 500, top: 0, bottom: 100 },
  scales: {
    y: {
      height: 100,
      ticks: yScaleTicks,
      getPixelForValue: jest.fn((index: number) => index * 50 + 25),
    },
  },
});

describe('emptyBarOverlay', () => {
  it('has the correct plugin id', () => {
    expect(emptyBarOverlay.id).toBe('emptyBarOverlay');
  });

  it('does nothing when emptyIndices is empty', () => {
    const chart = makeChart(new Set(), ['AC', 'BU']) as any;
    emptyBarOverlay.afterDatasetsDraw(chart, null, null, null);
    expect(chart.ctx.stroke).not.toHaveBeenCalled();
  });

  it('does nothing when emptyBarOverlay options are missing', () => {
    const chart = makeChart(new Set([0]), ['BU', 'AC']) as any;
    delete chart.options.plugins.emptyBarOverlay;
    emptyBarOverlay.afterDatasetsDraw(chart, null, null, null);
    expect(chart.ctx.stroke).not.toHaveBeenCalled();
  });

  it('draws border and N/A label for each empty index', () => {
    const chart = makeChart(new Set([0, 1]), ['BU', 'AC']) as any;
    emptyBarOverlay.afterDatasetsDraw(chart, null, null, null);

    expect(chart.ctx.stroke).toHaveBeenCalledTimes(2);
    expect(chart.ctx.fillText).toHaveBeenCalledTimes(2);
  });

  it('draws N/A overlay even when the label for that slot is null', () => {
    const chart = makeChart(new Set([0, 1]), [null, 'AC']) as any;
    emptyBarOverlay.afterDatasetsDraw(chart, null, null, null);

    expect(chart.ctx.stroke).toHaveBeenCalledTimes(2);
  });

  it('still draws when yScale has fewer ticks than label slots (empty-string BU row)', () => {
    const chart = makeChart(new Set([0]), ['BU', 'AC'], [{ value: 1 }]) as any;
    emptyBarOverlay.afterDatasetsDraw(chart, null, null, null);

    expect(chart.ctx.stroke).toHaveBeenCalledTimes(1);
    expect(chart.ctx.fillText).toHaveBeenCalledWith(
      'N/A',
      expect.any(Number),
      expect.any(Number),
    );
  });

  it('draws N/A text centered in the bar', () => {
    const chart = makeChart(new Set([0]), ['BU']) as any;
    emptyBarOverlay.afterDatasetsDraw(chart, null, null, null);

    const calls = chart.ctx.fillText.mock.calls;
    expect(calls[0][0]).toBe('N/A');
  });

  it('draws only N/A — total label is delegated to TotalAllocation plugin', () => {
    const chart = makeChart(new Set([0]), ['BU']) as any;
    emptyBarOverlay.afterDatasetsDraw(chart, null, null, null);

    expect(chart.ctx.fillText).toHaveBeenCalledTimes(1);
    expect(chart.ctx.fillText.mock.calls[0][0]).toBe('N/A');
  });
});
