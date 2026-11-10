import { generateChartData } from './generateChartData';

jest.mock('../constants', () => ({
  CHART_CONFIG: {
    acBorderWidth: 2,
    acBorderColor: '#FEFBF1',
    acHoverBorderColor: '#FFFFFF',
    buBorderWidth: 2,
    buBorderColor: '#EBEBEB',
    buHoverBorderColor: '#FFFFFF',
    datalabelBorderWidth: 1,
    datalabelBorderRadius: 4,
    horizontalTotalLabelReservedWidth: 48,
  },
}));

jest.mock('../utils', () => ({
  calculateBorderRadius: jest.fn((borderRadius, index) => borderRadius[index]),
  formatDatalabelValue: jest.fn(),
  getDatalabelBackground: jest.fn(),
  getDatalabelBorderColor: jest.fn(),
  getDatalabelColor: jest.fn(),
  getDatalabelFont: jest.fn(),
}));

describe('generateChartData', () => {
  const mockChart = {
    labels: ['Label 1', 'Label 2'],
    datasets: [
      { data: [100, 200], label: 'Dataset 1' },
      { data: [150, 250], label: 'Dataset 2' },
    ],
    total_allocation: { value: ['100', '200'] },
  };

  const mockBackgroundColor = ['#E8D19D', '#BADBF5'];
  const mockBorderRadius = [
    { topLeft: 5, topRight: 0, bottomLeft: 0, bottomRight: 0 },
    { topLeft: 0, topRight: 5, bottomLeft: 0, bottomRight: 0 },
  ];

  it('returns data with correct labels, dataset count and original properties preserved', () => {
    const result = generateChartData(
      mockChart,
      mockBackgroundColor,
      mockBorderRadius,
    );

    expect(result.labels).toEqual(['Label 1', 'Label 2']);
    expect(result.datasets).toHaveLength(2);
    expect(result.datasets[0].data).toEqual([100, 200]);
    expect(result.datasets[0].label).toBe('Dataset 1');
    expect(result.datasets[1].data).toEqual([150, 250]);
    expect(result.datasets[1].label).toBe('Dataset 2');
  });

  it('applies backgroundColor and border properties as per-row context functions', () => {
    const result = generateChartData(
      mockChart,
      mockBackgroundColor,
      mockBorderRadius,
    );

    expect(result.datasets[0].backgroundColor).toBe('#E8D19D');
    expect(result.datasets[1].backgroundColor).toBe('#BADBF5');

    result.datasets.forEach((dataset: any) => {
      expect(typeof dataset.borderWidth).toBe('function');
      expect(typeof dataset.borderColor).toBe('function');
      expect(typeof dataset.hoverBorderColor).toBe('function');
      expect(dataset.borderSkipped).toBe(false);

      expect(dataset.borderWidth({ dataIndex: 0 })).toBe(2);
      expect(dataset.borderColor({ dataIndex: 0 })).toBe('#EBEBEB');
      expect(dataset.hoverBorderColor({ dataIndex: 0 })).toBe('#FFFFFF');

      expect(dataset.borderWidth({ dataIndex: 1 })).toBe(2);
      expect(dataset.borderColor({ dataIndex: 1 })).toBe('#FEFBF1');
      expect(dataset.hoverBorderColor({ dataIndex: 1 })).toBe('#FFFFFF');
    });
  });

  it('applies datalabels configuration with fixed values and function-typed callbacks', () => {
    const result = generateChartData(
      mockChart,
      mockBackgroundColor,
      mockBorderRadius,
    );

    result.datasets.forEach((dataset: any) => {
      expect(dataset.datalabels).toBeDefined();
      expect(dataset.datalabels.borderWidth).toBe(1);
      expect(dataset.datalabels.borderRadius).toBe(4);
      expect(typeof dataset.datalabels.color).toBe('function');
      expect(typeof dataset.datalabels.font).toBe('function');
      expect(typeof dataset.datalabels.backgroundColor).toBe('function');
      expect(typeof dataset.datalabels.borderColor).toBe('function');
      expect(typeof dataset.datalabels.formatter).toBe('function');
    });
  });

  it('handles empty datasets', () => {
    const emptyChart = {
      labels: [],
      datasets: [],
      total_allocation: { value: [] },
    };

    const result = generateChartData(emptyChart, [], []);

    expect(result.labels).toEqual([]);
    expect(result.datasets).toEqual([]);
  });

  it('resolves per-row colors when backgroundColor is a 2D array (AC/BU rows)', () => {
    const perRowColors = [
      ['#C9AF82', '#70C6FF'],
      ['#E2D4BB', '#99D6FF'],
    ];

    const result = generateChartData(mockChart, perRowColors, mockBorderRadius);

    result.datasets.forEach((dataset: any) => {
      expect(typeof dataset.backgroundColor).toBe('function');
      const buColor = dataset.backgroundColor({ dataIndex: 0 });
      expect(typeof buColor).toBe('string');
      const acColor = dataset.backgroundColor({ dataIndex: 1 });
      expect(typeof acColor).toBe('string');
    });
  });

  it('datalabel callbacks delegate to util functions', () => {
    const {
      getDatalabelColor: mockColor,
      getDatalabelFont: mockFont,
      getDatalabelBackground: mockBg,
      getDatalabelBorderColor: mockBorderColor,
      formatDatalabelValue: mockFormatter,
    } = jest.requireMock('../utils') as any;

    const result = generateChartData(
      mockChart,
      mockBackgroundColor,
      mockBorderRadius,
    );

    const context = { dataIndex: 0, datasetIndex: 0 };
    result.datasets.forEach((dataset: any) => {
      dataset.datalabels.color(context);
      dataset.datalabels.font(context);
      dataset.datalabels.backgroundColor(context);
      dataset.datalabels.borderColor(context);
      dataset.datalabels.formatter(10, context);
    });

    expect(mockColor).toHaveBeenCalled();
    expect(mockFont).toHaveBeenCalled();
    expect(mockBg).toHaveBeenCalled();
    expect(mockBorderColor).toHaveBeenCalled();
    expect(mockFormatter).toHaveBeenCalled();
  });
});
