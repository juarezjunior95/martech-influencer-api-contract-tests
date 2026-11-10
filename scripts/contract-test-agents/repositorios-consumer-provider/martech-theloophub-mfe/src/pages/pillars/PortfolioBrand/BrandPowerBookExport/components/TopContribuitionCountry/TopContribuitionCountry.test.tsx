import '@testing-library/jest-dom';
import type { ComponentProps } from 'react';

import { render, screen } from '@testing-library/react';

import { TopCountryContribution } from './TopContribuitionCountry';

const mockAISummaryAlert = jest.fn();
const mockWaterfall = jest.fn();
const mockBrandAvatarList = jest.fn();
const mockComparisonLine = jest.fn();
const mockSectionHeader = jest.fn();
const mockProcessVariationCaptions = jest.fn();

jest.mock('components', () => ({
  BrandAvatarList: (props: any) => {
    mockBrandAvatarList(props);
    return <div data-testid="brand-avatar-list" data-length={props.length} />;
  },
  ComparisonLine: (props: any) => {
    mockComparisonLine(props);
    return <div data-testid="comparison-line" />;
  },
  DataStateHandler: ({ children, loading, error, empty }: any) => {
    if (loading) return <div data-testid="loading" />;
    if (error) return <div data-testid="error">{error.message}</div>;
    if (empty) return <div data-testid="empty" />;
    return <div data-testid="content">{children}</div>;
  },
}));

jest.mock('components/Chart/Bar/Waterfall', () => ({
  Waterfall: (props: any) => {
    mockWaterfall(props);
    return (
      <div
        data-testid="waterfall"
        data-values-count={props.values?.length ?? 0}
        data-labels-count={props.labels?.length ?? 0}
      />
    );
  },
}));

jest.mock('pages/components/AISummary', () => ({
  AISummaryAlert: (props: any) => {
    mockAISummaryAlert(props);
    return <div data-testid="ai-summary-alert" />;
  },
}));

jest.mock('pages/components/SectionHeader', () => ({
  SectionHeader: (props: any) => {
    mockSectionHeader(props);
    return (
      <div
        data-testid="section-header"
        data-legends={JSON.stringify(props.legends ?? null)}
      />
    );
  },
}));

jest.mock('utils/variationCaptions', () => ({
  processVariationCaptions: (data: any) => mockProcessVariationCaptions(data),
}));

jest.mock('../../BrandPowerBookExport', () => ({
  BRAND_POWER_BOOK_EXPORT_PAGE_NAME:
    'portfolio-brand_brand-power-results-export',
}));

const baseProps = {
  countryContribuitionKpiData: {
    countriesContribution: {
      data: [10, 20, -5],
      labels: [
        { value: 'USA', image: 'usa.png' },
        { value: 'BRA', image: 'bra.png' },
        { value: 'MEX', image: 'mex.png' },
      ],
      legend: [{ id: 'a', label: 'A' }],
      variationCaptions: [{ caption: 'cap-1' }],
    },
    empty: false,
  },
  loading: false,
  error: null as Error | null,
  title: 'Top Country Contribution',
  dataTestId: 'top-country-contribution-abi',
};

const renderComponent = (
  props: Partial<ComponentProps<typeof TopCountryContribution>> = {},
) => render(<TopCountryContribution {...baseProps} {...props} />);

beforeEach(() => {
  jest.clearAllMocks();
  mockProcessVariationCaptions.mockReturnValue([{ id: 'comparison' }]);
});

describe('TopCountryContribution', () => {
  it('renders the title and the dataTestId on the container', () => {
    renderComponent();

    expect(screen.getByText('Top Country Contribution')).toBeInTheDocument();
    expect(
      screen.getByTestId('top-country-contribution-abi'),
    ).toBeInTheDocument();
  });

  it('extracts waterfall values and labels from countriesContribution', () => {
    renderComponent();

    const props = mockWaterfall.mock.calls[0][0];
    expect(props.values).toEqual([10, 20, -5]);
    expect(props.labels).toEqual(['USA', 'BRA', 'MEX']);
  });

  it('builds brand avatar entries from chart labels', () => {
    renderComponent();

    const props = mockBrandAvatarList.mock.calls[0][0];
    expect(props.data).toEqual([
      { title: 'USA', mainBrand: { src: 'usa.png', alt: 'USA' } },
      { title: 'BRA', mainBrand: { src: 'bra.png', alt: 'BRA' } },
      { title: 'MEX', mainBrand: { src: 'mex.png', alt: 'MEX' } },
    ]);
    expect(props.length).toBe(3);
  });

  it('forwards processed variationCaptions to ComparisonLine', () => {
    renderComponent();

    expect(mockProcessVariationCaptions).toHaveBeenCalledWith(
      baseProps.countryContribuitionKpiData.countriesContribution,
    );
    expect(mockComparisonLine.mock.calls[0][0].data).toEqual([
      { id: 'comparison' },
    ]);
  });

  it('passes the legend array to SectionHeader', () => {
    renderComponent();

    expect(mockSectionHeader.mock.calls[0][0].legends).toEqual([
      { id: 'a', label: 'A' },
    ]);
  });

  it('passes undefined legends when chart legend is not an array', () => {
    renderComponent({
      countryContribuitionKpiData: {
        countriesContribution: { data: [], labels: [], legend: 'oops' },
      },
    });

    expect(mockSectionHeader.mock.calls[0][0].legends).toBeUndefined();
  });

  it('handles missing labels by passing empty arrays to Waterfall and BrandAvatarList', () => {
    renderComponent({
      countryContribuitionKpiData: { countriesContribution: {} },
    });

    expect(mockWaterfall.mock.calls[0][0].values).toEqual([]);
    expect(mockWaterfall.mock.calls[0][0].labels).toEqual([]);
    expect(mockBrandAvatarList.mock.calls[0][0].data).toEqual([]);
  });

  it.each([
    ['loading', { loading: true }, 'loading'],
    ['error', { error: new Error('boom') }, 'error'],
  ])(
    'shows %s state inside the DataStateHandler',
    (_label, override, testId) => {
      renderComponent(override as any);

      expect(screen.getByTestId(testId)).toBeInTheDocument();
      expect(screen.queryByTestId('waterfall')).not.toBeInTheDocument();
    },
  );

  it('shows the empty state when countryContribuitionKpiData.empty is true', () => {
    renderComponent({
      countryContribuitionKpiData: {
        ...baseProps.countryContribuitionKpiData,
        empty: true,
      },
    });

    expect(screen.getByTestId('empty')).toBeInTheDocument();
    expect(screen.queryByTestId('waterfall')).not.toBeInTheDocument();
  });

  describe('AI summary slot', () => {
    it('renders the AISummaryAlert when aiSummary has an id', () => {
      renderComponent({
        aiSummary: {
          id: 'summary-1',
          subFilters: { scope: 'All' },
        },
      } as any);

      expect(screen.getByTestId('ai-summary-alert')).toBeInTheDocument();
      expect(mockAISummaryAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          summaryPageIdentifier: 'summary-1',
          subFilters: { scope: 'All' },
          dataTestId: 'ai-summary-top-country-contribution-abi',
          kpiGroup: 'power',
          hasExpandedAction: false,
        }),
      );
    });

    it.each([
      ['undefined', undefined],
      ['no id', { subFilters: {} }],
    ])(
      'does not render the AISummaryAlert when aiSummary is %s',
      (_label, aiSummary) => {
        renderComponent({ aiSummary } as any);

        expect(
          screen.queryByTestId('ai-summary-alert'),
        ).not.toBeInTheDocument();
      },
    );
  });
});
