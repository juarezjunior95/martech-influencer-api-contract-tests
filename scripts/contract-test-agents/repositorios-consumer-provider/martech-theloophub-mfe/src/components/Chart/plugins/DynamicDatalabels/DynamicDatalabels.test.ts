import { dynamicDatalabelsPlugin } from './DynamicDatalabels';

describe('dynamicDatalabelsPlugin', () => {
  let mockChart: any;
  let mockCtx: CanvasRenderingContext2D;

  beforeEach(() => {
    mockCtx = {
      save: jest.fn(),
      restore: jest.fn(),
      font: '',
      textAlign: '',
      fillStyle: '',
      fillText: jest.fn(),
    } as unknown as CanvasRenderingContext2D;

    mockChart = {
      ctx: mockCtx,
      data: {
        datasets: [
          {
            data: [10, 20, 30],
          },
        ],
      },
      getDatasetMeta: jest.fn(() => ({
        data: [
          {
            getProps: jest.fn(() => ({
              x: 50,
              y: 100,
              base: 200,
              height: 100,
              width: 50,
              horizontal: false,
            })),
          },
          {
            getProps: jest.fn(() => ({
              x: 150,
              y: 200,
              base: 300,
              height: 100,
              width: 50,
              horizontal: false,
            })),
          },
          {
            getProps: jest.fn(() => ({
              x: 250,
              y: 300,
              base: 400,
              height: 100,
              width: 50,
              horizontal: false,
            })),
          },
        ],
      })),
    };
  });

  it('should draw labels at the correct positions', () => {
    dynamicDatalabelsPlugin.afterDatasetsDraw(mockChart);

    expect(mockCtx.save).toHaveBeenCalledTimes(3);
    expect(mockCtx.restore).toHaveBeenCalledTimes(3);

    expect(mockCtx.fillText).toHaveBeenCalledWith(10, 50, 150);
    expect(mockCtx.fillText).toHaveBeenCalledWith(20, 150, 250);
    expect(mockCtx.fillText).toHaveBeenCalledWith(30, 250, 350);
  });

  it('should not draw labels if no bars are present', () => {
    mockChart.getDatasetMeta = jest.fn(() => ({
      data: [],
    }));

    dynamicDatalabelsPlugin.afterDatasetsDraw(mockChart);

    expect(mockCtx.fillText).not.toHaveBeenCalled();
  });

  it('should handle horizontal bars correctly', () => {
    mockChart.getDatasetMeta = jest.fn(() => ({
      data: [
        {
          getProps: jest.fn(() => ({
            x: 50,
            y: 100,
            base: 200,
            height: 50,
            width: 100,
            horizontal: true,
          })),
        },
      ],
    }));

    dynamicDatalabelsPlugin.afterDatasetsDraw(mockChart);

    expect(mockCtx.fillText).toHaveBeenCalledWith(10, 125, 105);
  });
});
