import { theme } from 'theme';

import { drawArrow } from './drawArrow';

jest.mock('theme', () => ({
  theme: {
    colors: {
      charts: {
        border: {
          neutrals: {
            30: '#AAB4BE',
          },
        },
      },
    },
  },
}));

const createMockCtx = (): CanvasRenderingContext2D =>
  ({
    setLineDash: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    arc: jest.fn(),
    stroke: jest.fn(),
    closePath: jest.fn(),
    fill: jest.fn(),
    lineWidth: 0,
    strokeStyle: '',
    fillStyle: '',
  }) as unknown as CanvasRenderingContext2D;

describe('drawArrow', () => {
  let mockCtx: CanvasRenderingContext2D;

  beforeEach(() => {
    mockCtx = createMockCtx();
    jest.clearAllMocks();
  });

  it('sets correct line dash and style', () => {
    const firstBar = { x: 100, y: 200, base: 300 };
    const lastBar = { x: 400, y: 180, base: 300 };

    drawArrow({
      ctx: mockCtx,
      firstBar,
      lastBar,
      axisLineY: 300,
      midY: 50,
      arcRadius: 10,
      offset: 30,
    });

    expect(mockCtx.setLineDash).toHaveBeenCalledWith([6, 2]);
    expect(mockCtx.lineWidth).toBe(2);
    expect(mockCtx.strokeStyle).toBe(theme.colors.charts.border.neutrals[30]);
  });

  it('draws arrow from first bar to last bar with positive values', () => {
    const firstBar = { x: 100, y: 200, base: 300 };
    const lastBar = { x: 400, y: 180, base: 300 };

    drawArrow({
      ctx: mockCtx,
      firstBar,
      lastBar,
      axisLineY: 300,
      midY: 50,
      arcRadius: 10,
      offset: 30,
    });

    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.moveTo).toHaveBeenCalledWith(100, 175);
    expect(mockCtx.stroke).toHaveBeenCalled();
  });

  it('draws arrow with negative first bar value', () => {
    const firstBar = { x: 100, y: 350, base: 300 };
    const lastBar = { x: 400, y: 180, base: 300 };

    drawArrow({
      ctx: mockCtx,
      firstBar,
      lastBar,
      axisLineY: 300,
      midY: 50,
      arcRadius: 10,
      offset: 30,
    });

    expect(mockCtx.moveTo).toHaveBeenCalledWith(100, 275);
  });

  it('draws arcs correctly', () => {
    const firstBar = { x: 100, y: 200, base: 300 };
    const lastBar = { x: 400, y: 180, base: 300 };

    drawArrow({
      ctx: mockCtx,
      firstBar,
      lastBar,
      axisLineY: 300,
      midY: 50,
      arcRadius: 10,
      offset: 30,
    });

    expect(mockCtx.arc).toHaveBeenCalledWith(
      110,
      8,
      10,
      Math.PI,
      1.5 * Math.PI,
    );

    expect(mockCtx.arc).toHaveBeenCalledWith(390, 8, 10, 1.5 * Math.PI, 0);
  });

  it('draws line to firstBar when distance is greater than 50', () => {
    const firstBar = { x: 100, y: 200, base: 300 };
    const lastBar = { x: 400, y: 180, base: 300 };

    drawArrow({
      ctx: mockCtx,
      firstBar,
      lastBar,
      axisLineY: 300,
      midY: 50,
      arcRadius: 10,
      offset: 30,
    });

    expect(mockCtx.lineTo).toHaveBeenCalledWith(100, 50);
  });

  it('does not draw line to firstBar when distance is less than 50', () => {
    const firstBar = { x: 100, y: 90, base: 300 };
    const lastBar = { x: 400, y: 180, base: 300 };

    drawArrow({
      ctx: mockCtx,
      firstBar,
      lastBar,
      axisLineY: 300,
      midY: 50,
      arcRadius: 10,
      offset: 30,
    });

    const lineToCall = (mockCtx.lineTo as jest.Mock).mock.calls.find(
      (call) => call[0] === 100 && call[1] === 50,
    );
    expect(lineToCall).toBeUndefined();
  });

  it('draws arrow head triangle', () => {
    const firstBar = { x: 100, y: 200, base: 300 };
    const lastBar = { x: 400, y: 180, base: 300 };

    drawArrow({
      ctx: mockCtx,
      firstBar,
      lastBar,
      axisLineY: 300,
      midY: 50,
      arcRadius: 10,
      offset: 30,
    });

    expect(mockCtx.closePath).toHaveBeenCalled();
    expect(mockCtx.fill).toHaveBeenCalled();
    expect(mockCtx.fillStyle).toBe(theme.colors.charts.border.neutrals[30]);
  });

  it('handles negative last bar value', () => {
    const firstBar = { x: 100, y: 200, base: 300 };
    const lastBar = { x: 400, y: 350, base: 300 };

    drawArrow({
      ctx: mockCtx,
      firstBar,
      lastBar,
      axisLineY: 300,
      midY: 50,
      arcRadius: 10,
      offset: 30,
    });

    const expectedLineToY = 265;
    const lineToCall = (mockCtx.lineTo as jest.Mock).mock.calls.find(
      (call) => call[0] === 400 && call[1] === expectedLineToY,
    );
    expect(lineToCall).toBeDefined();
  });

  it('draws arrow head at correct position for negative values', () => {
    const firstBar = { x: 100, y: 200, base: 300 };
    const lastBar = { x: 400, y: 350, base: 300 };

    drawArrow({
      ctx: mockCtx,
      firstBar,
      lastBar,
      axisLineY: 300,
      midY: 50,
      arcRadius: 10,
      offset: 30,
    });

    expect(mockCtx.moveTo).toHaveBeenCalled();
    const moveToCall = (mockCtx.moveTo as jest.Mock).mock.calls[1];
    expect(moveToCall[0]).toBe(400);
  });

  it('uses correct offset in calculations', () => {
    const firstBar = { x: 100, y: 200, base: 300 };
    const lastBar = { x: 400, y: 180, base: 300 };
    const customOffset = 50;

    drawArrow({
      ctx: mockCtx,
      firstBar,
      lastBar,
      axisLineY: 300,
      midY: 50,
      arcRadius: 10,
      offset: customOffset,
    });

    expect(mockCtx.arc).toHaveBeenCalledWith(
      expect.any(Number),
      -12,
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
    );
  });

  it('uses correct arc radius in calculations', () => {
    const firstBar = { x: 100, y: 200, base: 300 };
    const lastBar = { x: 400, y: 180, base: 300 };
    const customRadius = 15;

    drawArrow({
      ctx: mockCtx,
      firstBar,
      lastBar,
      axisLineY: 300,
      midY: 50,
      arcRadius: customRadius,
      offset: 30,
    });

    expect(mockCtx.arc).toHaveBeenCalledWith(
      115,
      8,
      customRadius,
      expect.any(Number),
      expect.any(Number),
    );
  });

  it('calls stroke to render the arrow path', () => {
    const firstBar = { x: 100, y: 200, base: 300 };
    const lastBar = { x: 400, y: 180, base: 300 };

    drawArrow({
      ctx: mockCtx,
      firstBar,
      lastBar,
      axisLineY: 300,
      midY: 50,
      arcRadius: 10,
      offset: 30,
    });

    expect(mockCtx.stroke).toHaveBeenCalled();
  });
});
