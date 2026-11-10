import { totalAllocationDatalabel } from './TotalAllocation';

describe('totalAllocationDatalabel Plugin', () => {
  let mockChart;

  beforeEach(() => {
    mockChart = {
      ctx: {
        save: jest.fn(),
        restore: jest.fn(),
        textAlign: '',
        textBaseline: '',
        fillStyle: '',
        font: '',
        fillText: jest.fn(),
      },
      data: {
        labels: ['Label 1', 'Label 2', 'Label 3'],
        datasets: [{ data: [10, 20, 30] }, { data: [5, 10, 15] }],
      },
      scales: {
        y: {
          getPixelForValue: jest.fn((value) => value * 10),
        },
      },
      chartArea: { left: 0, right: 800, top: 0, bottom: 200 },
      getDatasetMeta: jest.fn(() => ({
        data: [{ x: 50 }, { x: 150 }, { x: 250 }],
      })),
      config: {
        options: {
          plugins: {
            totalAllocationDatalabel: {
              total_allocation: {
                unit: '$',
                value: ['50', '60', '70'],
              },
            },
          },
        },
      },
    };
  });

  it('should draw allocation labels correctly', () => {
    totalAllocationDatalabel.afterDatasetsDraw(mockChart);

    expect(mockChart.ctx.save).toHaveBeenCalledTimes(1);
    expect(mockChart.ctx.restore).toHaveBeenCalledTimes(1);

    expect(mockChart.ctx.fillText).toHaveBeenCalledWith('$50', 50, 100);
    expect(mockChart.ctx.fillText).toHaveBeenCalledWith('$60', 150, 250);
    expect(mockChart.ctx.fillText).toHaveBeenCalledWith('$70', 250, 400);
  });

  it('should not draw labels if total_allocation is missing', () => {
    mockChart.config.options.plugins.totalAllocationDatalabel.total_allocation =
      null;

    totalAllocationDatalabel.afterDatasetsDraw(mockChart);

    expect(mockChart.ctx.fillText).not.toHaveBeenCalled();
  });

  it('should draw $0 label for empty bars and align with reference bar', () => {
    mockChart.data = {
      labels: ['Label 1', 'Label 2'],
      datasets: [{ data: [10, 0] }, { data: [5, 0] }],
    };
    mockChart.config.options.plugins.totalAllocationDatalabel.total_allocation =
      {
        unit: '$',
        value: ['50', undefined],
      };
    mockChart.getDatasetMeta = jest.fn(() => ({
      data: [{ x: 50 }, { x: 150 }],
    }));

    totalAllocationDatalabel.afterDatasetsDraw(mockChart);
    expect(mockChart.ctx.fillText).toHaveBeenCalledWith('$50', 50, 100);
    expect(mockChart.ctx.fillText).toHaveBeenCalledWith('$0.0', 150, -50);
  });

  describe('horizontal mode (indexAxis === "y")', () => {
    it('renders labels at the right edge of the full STACK (last dataset), vertically centered', () => {
      mockChart.config.options.indexAxis = 'y';
      mockChart.data = {
        labels: ['BU', 'AC'],
        datasets: [{ data: [40, 50] }, { data: [30, 25] }, { data: [30, 25] }],
      };
      mockChart.config.options.plugins.totalAllocationDatalabel.total_allocation =
        {
          unit: '$',
          value: ['12.6', '13.1'],
        };
      mockChart.getDatasetMeta = jest.fn((datasetIndex: number) => {
        const metasByDataset = [
          [
            { x: 200, y: 40 },
            { x: 250, y: 80 },
          ],
          [
            { x: 500, y: 40 },
            { x: 600, y: 80 },
          ],
          [
            { x: 800, y: 40 },
            { x: 820, y: 80 },
          ],
        ];
        return { data: metasByDataset[datasetIndex] };
      });

      totalAllocationDatalabel.afterDatasetsDraw(mockChart);

      expect(mockChart.getDatasetMeta).toHaveBeenCalledWith(2);
      expect(mockChart.ctx.fillText).toHaveBeenCalledWith('$12.6', 808, 40);
      expect(mockChart.ctx.fillText).toHaveBeenCalledWith('$13.1', 828, 80);
    });

    it('anchors label to chartArea.right when index is in emptyIndices', () => {
      mockChart.config.options.indexAxis = 'y';
      mockChart.data = {
        labels: ['BU', 'AC'],
        datasets: [{ data: [0, 50] }, { data: [0, 25] }],
      };
      mockChart.config.options.plugins.totalAllocationDatalabel.total_allocation =
        {
          unit: '$',
          value: ['-', '13.1'],
        };
      mockChart.config.options.plugins.emptyBarOverlay = {
        emptyIndices: new Set([0]),
      };
      mockChart.getDatasetMeta = jest.fn(() => ({
        data: [
          { x: 0, y: 40 },
          { x: 820, y: 80 },
        ],
      }));

      totalAllocationDatalabel.afterDatasetsDraw(mockChart);

      expect(mockChart.ctx.fillText).toHaveBeenCalledWith('$-', 808, 40);
      expect(mockChart.ctx.fillText).toHaveBeenCalledWith('$13.1', 828, 80);
    });

    it('does not crash when a horizontal bar meta is missing', () => {
      mockChart.config.options.indexAxis = 'y';
      mockChart.data = {
        labels: ['BU', 'AC'],
        datasets: [{ data: [10, 20] }],
      };
      mockChart.config.options.plugins.totalAllocationDatalabel.total_allocation =
        {
          unit: '$',
          value: ['1.0', '2.0'],
        };
      mockChart.getDatasetMeta = jest.fn(() => ({
        data: [undefined, { x: 200, y: 80 }],
      }));

      expect(() =>
        totalAllocationDatalabel.afterDatasetsDraw(mockChart),
      ).not.toThrow();
      expect(mockChart.ctx.fillText).toHaveBeenCalledWith('$2.0', 208, 80);
    });
  });

  it('should handle errors gracefully', () => {
    mockChart.getDatasetMeta = jest.fn(() => {
      throw new Error('Test error');
    });
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => ({}));
    expect(() => {
      totalAllocationDatalabel.afterDatasetsDraw(mockChart);
    }).not.toThrow();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error in allocationDataLabel:',
      expect.any(Error),
    );
  });
});
