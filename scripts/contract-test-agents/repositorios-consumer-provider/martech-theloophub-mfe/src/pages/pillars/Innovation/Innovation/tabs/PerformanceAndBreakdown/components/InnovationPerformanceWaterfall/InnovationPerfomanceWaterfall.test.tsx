import React from 'react';

import { render, screen } from '@testing-library/react';

import { InnovationPerformanceData } from '../../types';
import { InnovationPerfomanceWaterfall } from './InnovationPerfomanceWaterfall';

const mockWaterfall = jest.fn((props: any) => (
  <div data-testid={props['data-testid'] ?? 'waterfall-mock'} />
));

const mockComparisonLine = jest.fn((props: any) => (
  <div data-testid={props['data-testid'] ?? 'comparison-line-mock'} />
));

const mockBrandAvatarItem = jest.fn((props: any) => (
  <div data-testid={props['data-testid'] ?? 'brand-avatar-item-mock'} />
));

const mockNoDataYet = jest.fn(() => <div data-testid="no-data-yet" />);

jest.mock('components', () => ({
  BrandAvatarItem: (props: any) => mockBrandAvatarItem(props),
  ComparisonLine: (props: any) => mockComparisonLine(props),
  NoDataYet: (props: any) => mockNoDataYet(),
  Waterfall: (props: any) => mockWaterfall(props),
}));

jest.mock('@hexa-ui/components', () => ({
  Paragraph: ({ children, ...rest }: any) => <p {...rest}>{children}</p>,
}));

const mockStyledWaterfallContainer = jest.fn(({ children, ...rest }: any) => (
  <div {...rest}>{children}</div>
));

const mockStyledBrandsGrid = jest.fn(({ children, ...rest }: any) => (
  <div {...rest}>{children}</div>
));

const mockStyledComparisonLineContainer = jest.fn(
  ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
);

jest.mock('./InnovationPerfomanceWaterfall.styles', () => ({
  StyledWaterfallContainer: (props: any) => mockStyledWaterfallContainer(props),
  StyledBrandsGrid: (props: any) => mockStyledBrandsGrid(props),
  StyledComparisonLineContainer: (props: any) =>
    mockStyledComparisonLineContainer(props),
}));

const baseOptions = { maintainAspectRatio: false } as any;
const basePlugins: any[] = [{ name: 'plugin' }];

const createData = (
  overrides: Partial<InnovationPerformanceData> = {},
): InnovationPerformanceData => ({
  data: [10, -5, 15],
  labels: ['Start', 'Middle', 'End'],
  connector: {
    value: '100',
    from: 'Start',
    to: 'End',
    backgroundColor: '#000',
    textColor: '#fff',
    measure: '%',
  },
  comparisonLineData: [
    {
      title: 'Line',
      data: [
        { value: '1', measure: '%', color: '#000' },
        { value: '2', measure: '%', color: '#111' },
        { value: '3', measure: '%', color: '#222' },
      ],
    },
  ],
  ...overrides,
});

describe('InnovationPerfomanceWaterfall', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders NoDataYet when the provided data is marked as empty', () => {
    const emptyData = createData({ empty: true });

    render(
      <InnovationPerfomanceWaterfall
        options={baseOptions}
        data={emptyData as any}
        plugins={basePlugins}
      />,
    );

    expect(screen.getByTestId('no-data-yet')).toBeInTheDocument();
    expect(mockWaterfall).not.toHaveBeenCalled();
    expect(mockComparisonLine).not.toHaveBeenCalled();
    expect(
      screen.queryByTestId('innovation-performance-comparison-line-container'),
    ).not.toBeInTheDocument();
  });

  it('renders the waterfall and comparison line with the received data', () => {
    const data = createData();

    render(
      <InnovationPerfomanceWaterfall
        options={baseOptions}
        data={data as any}
        plugins={basePlugins}
      />,
    );

    expect(mockWaterfall).toHaveBeenCalledTimes(1);
    const waterfallProps = mockWaterfall.mock.calls[0][0];
    expect(waterfallProps.values).toBe(data.data);
    expect(waterfallProps.labels).toBe(data.labels);

    expect(mockComparisonLine).toHaveBeenCalledTimes(1);
    const comparisonLineProps = mockComparisonLine.mock.calls[0][0];
    expect(comparisonLineProps.data).toBe(data.comparisonLineData);
    expect(comparisonLineProps.gridColumnsLength).toBe(data.labels.length);
  });

  it('renders the brands grid with the corresponding labels and items', () => {
    const brands = [
      {
        mainBrand: { src: 'one.png', alt: 'Brand One' },
        title: 'Brand One',
      },
      {
        mainBrand: { src: 'two.png', alt: 'Brand Two' },
        title: 'Brand Two',
      },
    ];

    const data = createData({ brandsImg: brands });

    render(
      <InnovationPerfomanceWaterfall
        options={baseOptions}
        data={data as any}
        plugins={basePlugins}
      />,
    );

    expect(screen.getByText(data.labels[0])).toBeInTheDocument();
    expect(
      screen.getByText(data.labels[data.labels.length - 1]),
    ).toBeInTheDocument();

    expect(mockBrandAvatarItem).toHaveBeenCalledTimes(brands.length);

    brands.forEach((brand, index) => {
      expect(mockBrandAvatarItem.mock.calls[index][0]).toMatchObject({
        mainBrand: brand.mainBrand,
        title: brand.title,
      });
    });
  });

  it('passes interactiveConfig to Waterfall when provided', () => {
    const data = createData();
    const mockInteractiveConfig = {
      onBarSelect: jest.fn(),
      fillHeight: true,
      clickability: { clickableIndexes: [1, 2] },
    };

    render(
      <InnovationPerfomanceWaterfall
        options={baseOptions}
        data={data as any}
        interactiveConfig={mockInteractiveConfig}
      />,
    );

    expect(mockWaterfall).toHaveBeenCalledTimes(1);
    const waterfallProps = mockWaterfall.mock.calls[0][0];
    expect(waterfallProps.interactiveConfig).toBe(mockInteractiveConfig);
  });

  it('renders without interactiveConfig when not provided', () => {
    const data = createData();

    render(
      <InnovationPerfomanceWaterfall
        options={baseOptions}
        data={data as any}
      />,
    );

    expect(mockWaterfall).toHaveBeenCalledTimes(1);
    const waterfallProps = mockWaterfall.mock.calls[0][0];
    expect(waterfallProps.interactiveConfig).toBeUndefined();
  });

  it('uses empty array as default for plugins when not provided', () => {
    const data = createData();

    render(
      <InnovationPerfomanceWaterfall
        options={baseOptions}
        data={data as any}
      />,
    );

    expect(mockWaterfall).toHaveBeenCalledTimes(1);
    const waterfallProps = mockWaterfall.mock.calls[0][0];
    expect(waterfallProps.plugins).toEqual([]);
  });
});
