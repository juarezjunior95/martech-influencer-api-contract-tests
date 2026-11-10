import { Chart } from 'chart.js';

import { VerticalGuidelines } from './VerticalGuidelines';

type MockChart = Chart & {
  config: {
    options: {
      indexAxis?: 'x' | 'y';
      plugins: {
        verticalGuidelinesPlugin: {
          displayAxisX: boolean;
        };
      };
    };
  };
};

describe('VerticalGuidelines', () => {
  let chartMock: MockChart;
  let ctxMock: CanvasRenderingContext2D;

  beforeEach(() => {
    jest.clearAllMocks();

    ctxMock = {
      save: jest.fn(),
      restore: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
    } as unknown as CanvasRenderingContext2D;

    chartMock = {
      ctx: ctxMock,
      scales: {
        x: { left: 50, right: 150 },
        y: { top: 20, bottom: 200 },
      },
      config: {
        options: {
          plugins: {
            verticalGuidelinesPlugin: {
              displayAxisX: true,
            },
          },
        },
      },
    } as unknown as MockChart;
  });

  it('should draw vertical guidelines', () => {
    VerticalGuidelines.afterDraw(chartMock);

    expect(ctxMock.save).toHaveBeenCalled();
    expect(ctxMock.beginPath).toHaveBeenCalled();
    expect(ctxMock.moveTo).toHaveBeenCalledWith(50, -80);
    expect(ctxMock.lineTo).toHaveBeenCalledWith(50, 200);
    expect(ctxMock.stroke).toHaveBeenCalled();
    expect(ctxMock.restore).toHaveBeenCalled();
  });

  it('should draw right vertical guideline when indexAxis is x', () => {
    chartMock.config.options.indexAxis = 'x';
    VerticalGuidelines.afterDraw(chartMock);

    expect(ctxMock.moveTo).toHaveBeenCalledWith(150, -80);
    expect(ctxMock.lineTo).toHaveBeenCalledWith(150, 200);
  });

  it("should'nt execute the drawing if xAxis or yAxis are undefined", () => {
    chartMock.scales.x = undefined as any;
    VerticalGuidelines.afterDraw(chartMock);

    chartMock.scales.x = { left: 50, right: 450 } as any;
    chartMock.scales.y = undefined as any;
    VerticalGuidelines.afterDraw(chartMock);

    expect(ctxMock.save).not.toHaveBeenCalled();
    expect(ctxMock.beginPath).not.toHaveBeenCalled();
    expect(ctxMock.moveTo).not.toHaveBeenCalled();
    expect(ctxMock.lineTo).not.toHaveBeenCalled();
    expect(ctxMock.stroke).not.toHaveBeenCalled();
    expect(ctxMock.restore).not.toHaveBeenCalled();
  });
});
