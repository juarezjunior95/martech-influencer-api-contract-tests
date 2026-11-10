import { renderHook } from '@testing-library/react-hooks';

import {
  PROXIMITY_THRESHOLD_PIXELS,
  TOOLTIP_CONFIG,
} from '../drivers.constants';
import { useDriversTooltip } from './useDriversTooltip';

describe('useDriversTooltip', () => {
  const mockParams = {
    populationLabel: 'Population',
    iclLabel: 'BICL',
    populationFormattedValues: ['100M', '200M', '150M'],
    iclFormattedValues: ['50', '80', '60'],
    populationValues: [100000000, 200000000, 150000000],
    iclValues: [50, 80, 60],
  };

  const getTooltipElement = (parentElement: HTMLElement) =>
    parentElement.querySelector('[data-drivers-tooltip]') as HTMLDivElement;

  const createMockChart = (popYPixel: number, iclYPixel: number) => {
    const parentElement = document.createElement('div');

    return {
      parentElement,
      chart: {
        canvas: {
          parentNode: parentElement,
          getBoundingClientRect: jest.fn(() => ({
            left: 100,
            top: 100,
          })),
        },
        scales: {
          y: { getPixelForValue: jest.fn(() => popYPixel) },
          y1: { getPixelForValue: jest.fn(() => iclYPixel) },
        },
        data: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
      },
    };
  };

  test('should return a function', () => {
    const { result } = renderHook(() => useDriversTooltip(mockParams));
    expect(typeof result.current).toBe('function');
  });

  test('should not display tooltip when opacity is 0', () => {
    const { result } = renderHook(() => useDriversTooltip(mockParams));
    const tooltipFn = result.current;

    const { chart, parentElement } = createMockChart(100, 105);
    const mockContext = {
      chart,
      tooltip: {
        opacity: 0,
        dataPoints: [{ dataIndex: 0 }],
        caretX: 200,
      },
    };

    tooltipFn(mockContext as any);

    const tooltipEl = getTooltipElement(parentElement);

    expect(tooltipEl.style.display).toBe('none');
    expect(tooltipEl.innerHTML).toBe('');
  });

  test('should not display tooltip when values are far apart', () => {
    const { result } = renderHook(() => useDriversTooltip(mockParams));
    const tooltipFn = result.current;

    const pixelDistance = PROXIMITY_THRESHOLD_PIXELS + 10;
    const { chart, parentElement } = createMockChart(50, 50 + pixelDistance);

    const mockContext = {
      chart,
      tooltip: {
        opacity: 1,
        dataPoints: [{ dataIndex: 0 }],
        caretX: 200,
      },
    };

    tooltipFn(mockContext as any);

    const tooltipEl = getTooltipElement(parentElement);

    expect(tooltipEl.style.display).toBe('none');
    expect(tooltipEl.innerHTML).toBe('');
  });

  test('should display formatted series values when values are close', () => {
    const { result } = renderHook(() => useDriversTooltip(mockParams));
    const tooltipFn = result.current;

    const { chart, parentElement } = createMockChart(100, 105);
    const mockContext = {
      chart,
      tooltip: {
        opacity: 1,
        dataPoints: [{ dataIndex: 0 }],
        caretX: 200,
      },
    };

    tooltipFn(mockContext as any);

    const tooltipEl = getTooltipElement(parentElement);

    expect(tooltipEl.style.display).toBe('block');
    expect(tooltipEl).toHaveTextContent('Population: 100M');
    expect(tooltipEl).toHaveTextContent('BICL: 50');
  });

  test('should use PROXIMITY_THRESHOLD_PIXELS for distance check', () => {
    const { result } = renderHook(() => useDriversTooltip(mockParams));
    const tooltipFn = result.current;

    const exactThreshold = PROXIMITY_THRESHOLD_PIXELS;
    const { chart, parentElement } = createMockChart(100, 100 + exactThreshold);
    const mockContextInside = {
      chart,
      tooltip: {
        opacity: 1,
        dataPoints: [{ dataIndex: 0 }],
        caretX: 200,
      },
    };

    tooltipFn(mockContextInside as any);

    expect(getTooltipElement(parentElement).style.display).toBe('block');
  });

  test('should position tooltip on left for last columns', () => {
    const { result } = renderHook(() => useDriversTooltip(mockParams));
    const tooltipFn = result.current;

    const { chart, parentElement } = createMockChart(100, 105);
    const mockContext = {
      chart,
      tooltip: {
        opacity: 1,
        dataPoints: [{ dataIndex: 5 }],
        caretX: 200,
      },
    };

    tooltipFn(mockContext as any);

    const tooltipContent = getTooltipElement(parentElement)
      .firstElementChild as HTMLDivElement;

    expect(tooltipContent.style.left).toBe(
      `${100 + 200 - TOOLTIP_CONFIG.offsetX}px`,
    );
    expect(tooltipContent.style.top).toBe('202.5px');
    expect(tooltipContent.style.transform).toBe(TOOLTIP_CONFIG.transformLeft);
  });

  test('should position tooltip on right for regular columns', () => {
    const { result } = renderHook(() => useDriversTooltip(mockParams));
    const tooltipFn = result.current;

    const { chart, parentElement } = createMockChart(100, 105);
    const mockContext = {
      chart,
      tooltip: {
        opacity: 1,
        dataPoints: [{ dataIndex: 0 }],
        caretX: 200,
      },
    };

    tooltipFn(mockContext as any);

    const tooltipContent = getTooltipElement(parentElement)
      .firstElementChild as HTMLDivElement;

    expect(tooltipContent.style.left).toBe(
      `${100 + 200 + TOOLTIP_CONFIG.offsetX}px`,
    );
    expect(tooltipContent.style.top).toBe('202.5px');
    expect(tooltipContent.style.transform).toBe(TOOLTIP_CONFIG.transformRight);
  });

  test('should reuse and reset the existing tooltip element between calls', () => {
    const { result } = renderHook(() => useDriversTooltip(mockParams));
    const tooltipFn = result.current;

    const { chart, parentElement } = createMockChart(100, 105);

    tooltipFn({
      chart,
      tooltip: {
        opacity: 1,
        dataPoints: [{ dataIndex: 0 }],
        caretX: 200,
      },
    } as any);

    const tooltipEl = getTooltipElement(parentElement);
    const firstTooltipContent = tooltipEl.firstElementChild;

    tooltipFn({
      chart,
      tooltip: {
        opacity: 1,
        dataPoints: [{ dataIndex: 1 }],
        caretX: 200,
      },
    } as any);

    expect(
      parentElement.querySelectorAll('[data-drivers-tooltip]'),
    ).toHaveLength(1);
    expect(tooltipEl.children).toHaveLength(1);
    expect(tooltipEl.firstElementChild).not.toBe(firstTooltipContent);
    expect(tooltipEl).toHaveTextContent('Population: 200M');
    expect(tooltipEl).toHaveTextContent('BICL: 80');
  });

  test('should handle empty data gracefully', () => {
    const emptyParams = {
      populationLabel: '',
      iclLabel: '',
      populationFormattedValues: [],
      iclFormattedValues: [],
      populationValues: [],
      iclValues: [],
    };

    const { result } = renderHook(() => useDriversTooltip(emptyParams));
    const tooltipFn = result.current;

    const { chart } = createMockChart(100, 105);
    const mockContext = {
      chart,
      tooltip: {
        opacity: 1,
        dataPoints: [{ dataIndex: 0 }],
        caretX: 200,
      },
    };

    expect(() => {
      tooltipFn(mockContext as any);
    }).not.toThrow();
  });

  test('should not display tooltip when dataIndex is null', () => {
    const { result } = renderHook(() => useDriversTooltip(mockParams));
    const tooltipFn = result.current;

    const { chart, parentElement } = createMockChart(100, 105);

    const mockContext = {
      chart,
      tooltip: {
        opacity: 1,
        dataPoints: [],
        caretX: 200,
      },
    };

    tooltipFn(mockContext as any);

    const tooltipEl = getTooltipElement(parentElement);

    expect(tooltipEl.style.display).toBe('none');
    expect(tooltipEl.innerHTML).toBe('');
  });

  test('should not display tooltip when chart scales are unavailable', () => {
    const { result } = renderHook(() => useDriversTooltip(mockParams));
    const tooltipFn = result.current;

    const { chart, parentElement } = createMockChart(100, 105);
    chart.scales = {} as any;

    tooltipFn({
      chart,
      tooltip: {
        opacity: 1,
        dataPoints: [{ dataIndex: 0 }],
        caretX: 200,
      },
    } as any);

    const tooltipEl = getTooltipElement(parentElement);

    expect(tooltipEl.style.display).toBe('none');
    expect(tooltipEl.innerHTML).toBe('');
  });
});
