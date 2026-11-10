import { getTagColors, RoundedArrow } from './RoundedArrow';

describe('RoundedArrow', () => {
  let chartMock;
  let ctxMock;

  beforeEach(() => {
    jest.clearAllMocks();
    ctxMock = {
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      arc: jest.fn(),
      arcTo: jest.fn(),
      closePath: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn(),
      setLineDash: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      fillText: jest.fn(),
      font: '',
      textAlign: '',
      textBaseline: '',
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
    };

    chartMock = {
      ctx: ctxMock,
      chartArea: { left: 0, right: 100, top: 50, bottom: 150 },
      config: {
        options: {
          plugins: {
            roundedArrow: {
              comparison: 5,
              unit_of_measure: '%',
              direction: 'up',
            },
          },
        },
      },
      getDatasetMeta: jest.fn(() => ({
        data: [
          { x: 10, y: 100, base: 150 },
          { x: 90, y: 50, base: 150 },
        ],
      })),
    };
  });

  it('should not draw if dataset is empty', () => {
    chartMock.getDatasetMeta.mockReturnValueOnce({ data: [] });
    RoundedArrow.afterDatasetsDraw(chartMock);
    expect(ctxMock.beginPath).not.toHaveBeenCalled();
  });

  it('should not draw if plugin options are missing', () => {
    chartMock.config.options.plugins.roundedArrow = null;
    RoundedArrow.afterDatasetsDraw(chartMock);
    expect(ctxMock.beginPath).not.toHaveBeenCalled();
  });

  it('should draw an arrowhead', () => {
    RoundedArrow.afterDatasetsDraw(chartMock);
    expect(ctxMock.fill).toHaveBeenCalled();
  });

  it('should draw a label with correct text', () => {
    RoundedArrow.afterDatasetsDraw(chartMock);
    expect(ctxMock.fillText).toHaveBeenCalledWith(
      '5.0%',
      expect.any(Number),
      expect.any(Number),
    );
  });

  it('should return green colors for "up" direction', () => {
    expect(getTagColors('up')).toEqual({
      background: '#E6F9E6',
      color: '#007800',
    });
  });

  it('should return red colors for "down" direction', () => {
    expect(getTagColors('down')).toEqual({
      background: '#FFE6E6',
      color: '#BA0B0B',
    });
  });
});
