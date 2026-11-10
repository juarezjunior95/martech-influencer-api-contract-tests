import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { EvolutionSlide } from './EvolutionSlide';

jest.mock(
  'pages/pillars/PortfolioBrand/BrandPowerBookExport/components/HeaderContainer/HeaderContainer',
  () => ({
    HeaderContainer: ({ title, children }: any) => (
      <section data-testid="header" data-title={title}>
        {children}
      </section>
    ),
  }),
);

jest.mock('components', () => ({
  Alert: ({ message }: any) => <div data-testid="alert">{message}</div>,
  DataStateHandler: ({ children, loading, error, empty }: any) => {
    if (loading) return <div data-testid="state-loading" />;
    if (error) return <div data-testid="state-error">{error.message}</div>;
    if (empty) return <div data-testid="state-empty" />;
    return <div data-testid="state-content">{children}</div>;
  },
  ComparisonLine: ({ data }: any) => (
    <div data-testid="comparison-line" data-length={data?.length ?? 0} />
  ),
}));

jest.mock('components/Chart/Bar/SimpleBarChart/SimpleBarChart', () => ({
  SimpleBarChart: ({ data, suggestedMin, suggestedMax }: any) => (
    <div
      data-testid="simple-bar-chart"
      data-values-length={data?.values?.length ?? 0}
      data-suggested-min={suggestedMin}
      data-suggested-max={suggestedMax}
    />
  ),
}));

jest.mock('pages/components/SectionHeader', () => ({
  SectionHeader: ({ period }: any) => (
    <div data-testid="section-header" data-period={period} />
  ),
}));

jest.mock('utils/chart', () => ({
  getChartAxisLimits: jest.fn(() => ({
    yMin: 0,
    yMax: 39,
  })),
}));

jest.mock('utils/variationCaptions', () => ({
  processVariationCaptions: jest.fn(() => [
    { title: 't', subtitle: 's', data: [] },
  ]),
}));

const baseChartData = {
  values: [10, 20, 30],
  labels: ['Q1', 'Q2', 'Q3'],
  backgroundColor: ['#000'],
  legendPeriod: '2024',
  legend: [{ label: 'Series', color: '#000', shape: 'square' }],
};

const baseSlideInfo = {
  firstChartData: baseChartData,
  secondChartData: baseChartData,
  firstChartTitle: 'Chart A',
  secondChartTitle: 'Chart B',
  chartHeight: '400px',
  evolutionSlideLoading: false,
  evolutionSlideError: null,
  evolutionSlideEmpty: false,
};

const renderSlide = (props: any) => render(<EvolutionSlide {...props} />);

describe('EvolutionSlide', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders both chart headers', () => {
    renderSlide({
      evolutionSlideInfos: [baseSlideInfo],
      alerts: [],
    });

    const headers = screen.getAllByTestId('header');

    expect(
      headers.some((h) => h.getAttribute('data-title') === 'Chart A'),
    ).toBe(true);

    expect(
      headers.some((h) => h.getAttribute('data-title') === 'Chart B'),
    ).toBe(true);
  });

  it('renders two charts per slide', () => {
    renderSlide({
      evolutionSlideInfos: [baseSlideInfo],
      alerts: [],
    });

    expect(screen.getAllByTestId('simple-bar-chart')).toHaveLength(2);
  });

  it('renders multiple slides correctly', () => {
    renderSlide({
      evolutionSlideInfos: [
        baseSlideInfo,
        {
          ...baseSlideInfo,
          firstChartTitle: 'Chart C',
          secondChartTitle: 'Chart D',
        },
      ],
      alerts: [],
    });

    expect(screen.getAllByTestId('simple-bar-chart')).toHaveLength(4);
  });

  it('renders alerts when provided', () => {
    renderSlide({
      evolutionSlideInfos: [baseSlideInfo],
      alerts: ['Alert 1', 'Alert 2'],
    });

    expect(screen.getByTestId('alert')).toBeInTheDocument();
    expect(screen.getByText('Alert 1')).toBeInTheDocument();
    expect(screen.getByText('Alert 2')).toBeInTheDocument();
  });

  it('shows loading state and hides charts', () => {
    renderSlide({
      evolutionSlideInfos: [{ ...baseSlideInfo, evolutionSlideLoading: true }],
      alerts: [],
    });

    expect(screen.getByTestId('state-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('simple-bar-chart')).not.toBeInTheDocument();
  });

  it('shows error state', () => {
    renderSlide({
      evolutionSlideInfos: [
        {
          ...baseSlideInfo,
          evolutionSlideError: new Error('err'),
        },
      ],
      alerts: [],
    });

    expect(screen.getByTestId('state-error')).toHaveTextContent('err');
  });

  it('shows empty state', () => {
    renderSlide({
      evolutionSlideInfos: [{ ...baseSlideInfo, evolutionSlideEmpty: true }],
      alerts: [],
    });

    expect(screen.getByTestId('state-empty')).toBeInTheDocument();
  });

  it('passes suggestedMin and suggestedMax to charts', () => {
    renderSlide({
      evolutionSlideInfos: [baseSlideInfo],
      alerts: [],
    });

    const chart = screen.getAllByTestId('simple-bar-chart')[0];

    expect(chart).toHaveAttribute('data-suggested-min', '0');
    expect(chart).toHaveAttribute('data-suggested-max', '39');
  });

  it('passes Map values without conversion', () => {
    const mapValues = new Map([
      [0, 10],
      [1, 20],
    ]);

    renderSlide({
      evolutionSlideInfos: [
        {
          ...baseSlideInfo,
          firstChartData: {
            ...baseChartData,
            values: mapValues,
          },
        },
      ],
      alerts: [],
    });

    const chart = screen.getAllByTestId('simple-bar-chart')[0];

    // Map does not have length → component does not convert it
    expect(chart).toHaveAttribute('data-values-length', '0');
  });

  it('renders ComparisonLine when portfolioType and variationCaptions exist', () => {
    renderSlide({
      evolutionSlideInfos: [
        {
          ...baseSlideInfo,
          portfolioType: 'MEGABRANDS',
          firstChartData: {
            ...baseChartData,
            variationCaptions: [{ title: 't' }],
          },
        },
      ],
      alerts: [],
    });

    expect(screen.getByTestId('comparison-line')).toBeInTheDocument();
  });

  it('does not render ComparisonLine without portfolioType', () => {
    renderSlide({
      evolutionSlideInfos: [
        {
          ...baseSlideInfo,
          firstChartData: {
            ...baseChartData,
            variationCaptions: [{ title: 't' }],
          },
        },
      ],
      alerts: [],
    });

    expect(screen.queryByTestId('comparison-line')).not.toBeInTheDocument();
  });

  it('uses default period when legendPeriod is missing', () => {
    renderSlide({
      evolutionSlideInfos: [
        {
          ...baseSlideInfo,
          firstChartData: {
            ...baseChartData,
            legendPeriod: undefined,
          },
        },
      ],
      alerts: [],
    });

    const headers = screen.getAllByTestId('section-header');
    expect(headers[0]).toHaveAttribute('data-period', '-');
  });
});
