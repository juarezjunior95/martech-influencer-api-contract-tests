import { render } from '@testing-library/react';
import { BaseChart } from 'components/Chart/BaseChart';

import { getStackedAreaOptions } from './configs';
import {
  useCellVisibility,
  useContainerSize,
  useResponsiveConfig,
} from './hooks';
import { getStackedAreaPlugins } from './plugins';
import { StackedArea } from './StackedArea';
import type { StackedAreaData } from './types';
import { transformToChartData } from './utils';

jest.mock('components/Chart/BaseChart', () => ({
  BaseChart: jest.fn((props: any) => (
    <div data-testid="base-chart" data-type={props.type} />
  )),
}));

jest.mock('./hooks', () => ({
  useContainerSize: jest.fn(() => ({
    ref: jest.fn(),
    width: 800,
    height: 500,
  })),
  useResponsiveConfig: jest.fn(() => ({
    columnWidth: 72,
    columnSpacing: 16,
    fontSize: { label: 12, value: 12, variation: 12 },
    padding: { top: 50, right: 24, bottom: 40, left: 24 },
    borderRadius: 8,
    minCellHeight: 8,
  })),
  useCellVisibility: jest.fn((columns: any) => columns),
}));

jest.mock('./utils', () => ({
  transformToChartData: jest.fn(() => [{ data: [50, 50] }]),
}));

jest.mock('./plugins', () => ({
  getStackedAreaPlugins: jest.fn(() => []),
}));

jest.mock('./configs', () => ({
  getStackedAreaOptions: jest.fn(() => ({})),
}));

const mockData: StackedAreaData = {
  columns: [
    { label: '2024', segments: [{ value: 50 }, { value: 50 }] },
    { label: '2025', segments: [{ value: 30 }, { value: 70 }] },
  ],
  colors: ['#EFD328', '#D9AA4A'],
  connectorColors: ['#F0DF78', '#EEC879'],
  legends: ['Beer', 'Wine'],
};

describe('StackedArea', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a wrapper div with ref', () => {
    const { container } = render(<StackedArea data={mockData} />);
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper.tagName).toBe('DIV');
    expect(useContainerSize).toHaveBeenCalled();
  });

  it('sets default height of 500px', () => {
    const { container } = render(<StackedArea data={mockData} />);
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper.style.height).toBe('500px');
  });

  it('applies custom height', () => {
    const { container } = render(<StackedArea data={mockData} height={500} />);
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper.style.height).toBe('500px');
  });

  it('sets width to 100%', () => {
    const { container } = render(<StackedArea data={mockData} />);
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper.style.width).toBe('100%');
  });

  it('calls useResponsiveConfig with correct params', () => {
    render(<StackedArea data={mockData} size="large" />);

    expect(useResponsiveConfig).toHaveBeenCalledWith(
      'large',
      800,
      mockData.columns.length,
      mockData.legends?.length ?? 0,
    );
  });

  it('defaults size to "medium"', () => {
    render(<StackedArea data={mockData} />);

    expect(useResponsiveConfig).toHaveBeenCalledWith(
      'medium',
      expect.any(Number),
      expect.any(Number),
      mockData.legends?.length ?? 0,
    );
  });

  it('calls useCellVisibility with columns and chartHeight', () => {
    render(<StackedArea data={mockData} height={400} />);

    expect(useCellVisibility).toHaveBeenCalledWith(mockData.columns, 400);
  });

  it('calls transformToChartData with correct params', () => {
    render(<StackedArea data={mockData} />);

    expect(transformToChartData).toHaveBeenCalledWith(
      expect.any(Array),
      mockData.colors,
      mockData.legends,
      expect.any(Object),
    );
  });

  it('calls getStackedAreaOptions with config', () => {
    render(<StackedArea data={mockData} />);

    expect(getStackedAreaOptions).toHaveBeenCalledWith(expect.any(Object));
  });

  it('calls getStackedAreaPlugins with data and config', () => {
    render(<StackedArea data={mockData} />);

    expect(getStackedAreaPlugins).toHaveBeenCalledWith(
      mockData,
      expect.any(Object),
    );
  });

  it('renders BaseChart with type "bar"', () => {
    render(<StackedArea data={mockData} />);

    expect(BaseChart).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'bar' }),
      expect.anything(),
    );
  });

  it('passes datasets, labels, options and plugins to BaseChart', () => {
    render(<StackedArea data={mockData} />);

    expect(BaseChart).toHaveBeenCalledWith(
      expect.objectContaining({
        datasets: expect.any(Array),
        labels: ['2024', '2025'],
        options: expect.any(Object),
        plugins: expect.any(Array),
      }),
      expect.anything(),
    );
  });

  it('treats string height as default 500', () => {
    const { container } = render(<StackedArea data={mockData} height="auto" />);
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper.style.height).toBe('500px');
  });
});
