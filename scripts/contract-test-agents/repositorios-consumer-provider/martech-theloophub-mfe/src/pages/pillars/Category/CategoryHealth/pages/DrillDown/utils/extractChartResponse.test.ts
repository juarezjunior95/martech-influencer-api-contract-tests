import { extractChartResponse } from './extractChartResponse';

const RESPONSE_KEY = 'category-health_drill-down-line-chart-drill';

describe('extractChartResponse', () => {
  it('should return all undefined when data is null', () => {
    const result = extractChartResponse(null);

    expect(result).toEqual({
      lineChartData: undefined,
      driversData: undefined,
      stackedAreaChartData: undefined,
    });
  });

  it('should return all undefined when data is undefined', () => {
    const result = extractChartResponse(undefined);

    expect(result).toEqual({
      lineChartData: undefined,
      driversData: undefined,
      stackedAreaChartData: undefined,
    });
  });

  it('should return all undefined when response key is missing', () => {
    const result = extractChartResponse({ 'other-key': {} });

    expect(result).toEqual({
      lineChartData: undefined,
      driversData: undefined,
      stackedAreaChartData: undefined,
    });
  });

  it('should return all undefined when container is not an object', () => {
    const result = extractChartResponse({ [RESPONSE_KEY]: 'invalid' });

    expect(result).toEqual({
      lineChartData: undefined,
      driversData: undefined,
      stackedAreaChartData: undefined,
    });
  });

  it('should extract chart data from a non-reserved key', () => {
    const chartData = {
      title: 'Beer Volume Performance',
      chartTitle: 'Beer Volume Overtime',
      chartLabel: 'Beer Volume',
      unit: 'k hl',
      comparisonTitle: 'vs LY',
      labels: ['2024', '2025'],
      values: [135.9, 151.4],
      formattedValues: ['135.9', '151.4'],
      comparisonData: [
        { value: '-', measure: '', color: '#5C5C5C' },
        { value: '1.7', measure: '%', color: '#007800' },
      ],
    };

    const result = extractChartResponse({
      [RESPONSE_KEY]: { beerVolume: chartData },
    });

    expect(result.lineChartData).toEqual(chartData);
    expect(result.driversData).toBeUndefined();
    expect(result.stackedAreaChartData).toBeUndefined();
  });

  it('should extract drivers data', () => {
    const driversData = {
      title: 'Drivers',
      chartTitle: 'Population & BICL Overtime',
      populationUnit: '# and L/Year',
      populationLabel: 'Population',
      iclLabel: 'BICL',
      populationComparisonTitle: 'Population vs LY',
      iclComparisonTitle: 'BICL vs LY',
      labels: ['2024', '2025'],
      populationValues: [160.1, 162.8],
      iclValues: [92.4, 93.0],
      populationFormattedValues: ['160.1', '162.8'],
      iclFormattedValues: ['92.4', '93.0'],
      populationComparisonData: [
        { value: '-', measure: '', color: '#5C5C5C' },
        { value: '0.8', measure: '%', color: '#007800' },
      ],
      iclComparisonData: [
        { value: '-', measure: '', color: '#5C5C5C' },
        { value: '0.9', measure: '%', color: '#007800' },
      ],
    };

    const result = extractChartResponse({
      [RESPONSE_KEY]: { drivers: driversData },
    });

    expect(result.driversData).toEqual(driversData);
    expect(result.lineChartData).toBeUndefined();
    expect(result.stackedAreaChartData).toBeUndefined();
  });

  it('should extract shareOfThroat data', () => {
    const sotData = {
      title: 'Share of Throat Performance',
      subtitle: '[%]',
      chartData: {
        columns: [{ label: 'Label 1', segments: [{ value: 12 }] }],
        colors: ['#EFD328'],
        connectorColors: ['#F0DF78'],
        legends: ['Beer'],
        comparisonLine: [],
      },
    };

    const result = extractChartResponse({
      [RESPONSE_KEY]: { shareOfThroat: sotData },
    });

    expect(result.stackedAreaChartData).toEqual(sotData);
    expect(result.lineChartData).toBeUndefined();
    expect(result.driversData).toBeUndefined();
  });

  it('should extract chart and drivers together from volume response', () => {
    const chartData = {
      title: 'Beer Volume Performance',
      chartTitle: 'Beer Volume Overtime',
      chartLabel: 'Beer Volume',
      unit: 'k hl',
      comparisonTitle: 'vs LY',
      labels: ['2025'],
      values: [151.4],
      formattedValues: ['151.4'],
      comparisonData: [{ value: '1.7', measure: '%', color: '#007800' }],
    };

    const driversData = {
      title: 'Drivers',
      chartTitle: 'Population & BICL Overtime',
      populationUnit: '# and L/Year',
      populationLabel: 'Population',
      iclLabel: 'BICL',
      populationComparisonTitle: 'Population vs LY',
      iclComparisonTitle: 'BICL vs LY',
      labels: ['2025'],
      populationValues: [162.8],
      iclValues: [93.0],
      populationFormattedValues: ['162.8'],
      iclFormattedValues: ['93.0'],
      populationComparisonData: [
        { value: '0.8', measure: '%', color: '#007800' },
      ],
      iclComparisonData: [{ value: '0.9', measure: '%', color: '#007800' }],
    };

    const result = extractChartResponse({
      [RESPONSE_KEY]: { beerVolume: chartData, drivers: driversData },
    });

    expect(result.lineChartData).toEqual(chartData);
    expect(result.driversData).toEqual(driversData);
    expect(result.stackedAreaChartData).toBeUndefined();
  });

  it('should handle different chart keys based on product type', () => {
    const chartData = {
      title: 'Beyond Beer Volume Performance',
      chartTitle: 'Beyond Beer Volume Overtime',
      chartLabel: 'BYB Volume',
      unit: 'k hl',
      comparisonTitle: 'vs LY',
      labels: ['2025'],
      values: [1.7],
      formattedValues: ['1.7'],
      comparisonData: [{ value: '3.8', measure: '%', color: '#007800' }],
    };

    const result = extractChartResponse({
      [RESPONSE_KEY]: { beyondBeerVolume: chartData },
    });

    expect(result.lineChartData).toEqual(chartData);
  });

  it('should return all undefined when container is an empty object', () => {
    const result = extractChartResponse({ [RESPONSE_KEY]: {} });

    expect(result).toEqual({
      lineChartData: undefined,
      driversData: undefined,
      stackedAreaChartData: undefined,
    });
  });
});
