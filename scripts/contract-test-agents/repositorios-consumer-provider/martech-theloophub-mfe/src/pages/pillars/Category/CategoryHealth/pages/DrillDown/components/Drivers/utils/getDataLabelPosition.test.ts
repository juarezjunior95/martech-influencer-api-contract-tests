import { getDataLabelPosition } from './getDataLabelPosition';

describe('getDataLabelPosition', () => {
  const populationValues = [100, 200, 150];
  const iclValues = [80, 120, 90];

  const createContext = ({
    dataIndex = 0,
    yPixel,
    y1Pixel,
    includeYScale = true,
    includeY1Scale = true,
  }: {
    dataIndex?: number;
    yPixel?: number | null;
    y1Pixel?: number | null;
    includeYScale?: boolean;
    includeY1Scale?: boolean;
  } = {}) => {
    const yGetPixelForValue = jest.fn().mockReturnValue(yPixel);
    const y1GetPixelForValue = jest.fn().mockReturnValue(y1Pixel);

    return {
      context: {
        chart: {
          scales: {
            ...(includeYScale
              ? { y: { getPixelForValue: yGetPixelForValue } }
              : {}),
            ...(includeY1Scale
              ? { y1: { getPixelForValue: y1GetPixelForValue } }
              : {}),
          },
        },
        dataIndex,
      },
      yGetPixelForValue,
      y1GetPixelForValue,
    };
  };

  describe('Population series', () => {
    test('should position population on top when it is higher than ICL', () => {
      const { context } = createContext({ yPixel: 50, y1Pixel: 100 });

      const result = getDataLabelPosition({
        context,
        populationValues,
        iclValues,
        series: 'population',
      });

      expect(result).toEqual({ anchor: 'end', align: 'top' });
    });

    test('should position population on bottom when it is lower than ICL', () => {
      const { context } = createContext({ yPixel: 100, y1Pixel: 50 });

      const result = getDataLabelPosition({
        context,
        populationValues,
        iclValues,
        series: 'population',
      });

      expect(result).toEqual({ anchor: 'start', align: 'bottom' });
    });

    test('should return default position when scales are null', () => {
      const { context } = createContext({ yPixel: null, y1Pixel: 100 });

      const result = getDataLabelPosition({
        context,
        populationValues,
        iclValues,
        series: 'population',
      });

      expect(result).toEqual({ anchor: 'end', align: 'top' });
    });

    test('should return default position when population scale is missing', () => {
      const { context } = createContext({
        y1Pixel: 100,
        includeYScale: false,
      });

      const result = getDataLabelPosition({
        context,
        populationValues,
        iclValues,
        series: 'population',
      });

      expect(result).toEqual({ anchor: 'end', align: 'top' });
    });
  });

  describe('ICL series', () => {
    test('should position ICL on top when it is higher than population', () => {
      const { context } = createContext({ yPixel: 100, y1Pixel: 50 });

      const result = getDataLabelPosition({
        context,
        populationValues,
        iclValues,
        series: 'icl',
      });

      expect(result).toEqual({ anchor: 'end', align: 'top' });
    });

    test('should position ICL on bottom when it is lower than population', () => {
      const { context } = createContext({ yPixel: 50, y1Pixel: 100 });

      const result = getDataLabelPosition({
        context,
        populationValues,
        iclValues,
        series: 'icl',
      });

      expect(result).toEqual({ anchor: 'start', align: 'bottom' });
    });

    test('should return default position when scales are null', () => {
      const { context } = createContext({ yPixel: 50, y1Pixel: null });

      const result = getDataLabelPosition({
        context,
        populationValues,
        iclValues,
        series: 'icl',
      });

      expect(result).toEqual({ anchor: 'start', align: 'bottom' });
    });

    test('should return default position when ICL scale is missing', () => {
      const { context } = createContext({
        yPixel: 50,
        includeY1Scale: false,
      });

      const result = getDataLabelPosition({
        context,
        populationValues,
        iclValues,
        series: 'icl',
      });

      expect(result).toEqual({ anchor: 'start', align: 'bottom' });
    });
  });

  test('should position labels deterministically when both series share the same pixel', () => {
    const { context } = createContext({ yPixel: 75, y1Pixel: 75 });

    expect(
      getDataLabelPosition({
        context,
        populationValues,
        iclValues,
        series: 'population',
      }),
    ).toEqual({ anchor: 'end', align: 'top' });
    expect(
      getDataLabelPosition({
        context,
        populationValues,
        iclValues,
        series: 'icl',
      }),
    ).toEqual({ anchor: 'start', align: 'bottom' });
  });

  test('should read chart scale pixels from the current data index', () => {
    const { context, yGetPixelForValue, y1GetPixelForValue } = createContext({
      dataIndex: 1,
      yPixel: 50,
      y1Pixel: 100,
    });

    getDataLabelPosition({
      context,
      populationValues,
      iclValues,
      series: 'population',
    });

    expect(yGetPixelForValue).toHaveBeenCalledWith(200);
    expect(y1GetPixelForValue).toHaveBeenCalledWith(120);
  });
});
