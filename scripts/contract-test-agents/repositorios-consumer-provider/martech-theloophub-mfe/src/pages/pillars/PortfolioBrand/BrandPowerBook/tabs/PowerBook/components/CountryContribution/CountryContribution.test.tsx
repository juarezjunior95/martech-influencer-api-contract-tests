import React from 'react';
import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';
import { useBffData, usePageFilterApplied } from 'hooks';

import { countryContributionMock } from '../../../../__mocks';
import { CountryContribution } from './CountryContribution';

const renderWithIntl = (ui: React.ReactElement) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      {ui}
    </IntlProvider>,
  );

jest.mock('hooks', () => ({
  usePageFilterApplied: jest.fn(),
  useBffData: jest.fn(),
}));

jest.mock('components', () => ({
  DataStateHandler: ({ loading, error, empty, children }: any) => (
    <div data-testid="data-state-handler">
      {loading && <div data-testid="loading">Loading...</div>}
      {error && <div data-testid="error">Error</div>}
      {empty && <div data-testid="empty">Empty</div>}
      {!loading && !error && !empty && children}
    </div>
  ),
}));

jest.mock('components/CaptionWithFlag/CaptionWithFlag', () => ({
  CaptionWithFlag: ({ label, flag }: any) => (
    <div data-testid="caption-with-flag" data-flag={flag}>
      {label}
    </div>
  ),
}));

jest.mock('components/VariationCaption/VariationCaption', () => ({
  VariationCaption: ({ gridColumnsCount }: any) => (
    <div data-testid="variation-caption" data-grid-columns={gridColumnsCount} />
  ),
}));

jest.mock('components/Chart/Bar/Waterfall', () => ({
  Waterfall: ({ values, labels }: any) => (
    <div
      data-testid="waterfall"
      data-values={JSON.stringify(values)}
      data-labels={JSON.stringify(labels)}
    />
  ),
}));

jest.mock('pages/components', () => ({
  ContentHeader: ({ title, subtitle }: any) => (
    <div data-testid="content-header">
      <div data-testid="header-title">{title}</div>
      {subtitle && <div data-testid="header-subtitle">{subtitle}</div>}
    </div>
  ),
}));

const mockUsePageFilterApplied = usePageFilterApplied as jest.Mock;
const mockUseBffData = useBffData as jest.Mock;

const setData = (data: any) =>
  mockUseBffData.mockReturnValue({ loading: false, error: null, data });

const setBffState = (state: {
  loading?: boolean;
  error?: Error | null;
  data?: any;
}) =>
  mockUseBffData.mockReturnValue({
    loading: false,
    error: null,
    data: null,
    ...state,
  });

const happyPathData = { countriesContribution: countryContributionMock };

describe('CountryContribution', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePageFilterApplied.mockReturnValue({
      applied: { sub_scopes: 'All Global Brands' },
    });
  });

  it('renders translated title and subtitle of the section', () => {
    setData(happyPathData);

    renderWithIntl(<CountryContribution />);

    expect(screen.getByTestId('header-title')).toHaveTextContent(
      'PortfolioBrand.BrandPowerBook.PowerBook.CountryContribution.title',
    );
    expect(screen.getByTestId('header-subtitle')).toHaveTextContent(
      'PortfolioBrand.BrandPowerBook.PowerBook.CountryContribution.subtitle',
    );
  });

  it.each([
    {
      label: 'loading',
      bff: { loading: true },
      visible: 'loading',
    },
    {
      label: 'error',
      bff: { error: new Error('Test error') },
      visible: 'error',
    },
    {
      label: 'empty',
      bff: {
        data: {
          countriesContribution: { ...countryContributionMock, empty: true },
        },
      },
      visible: 'empty',
    },
  ])(
    'forwards $label state to DataStateHandler and hides the chart',
    ({ bff, visible }) => {
      setBffState(bff);

      renderWithIntl(<CountryContribution />);

      expect(screen.getByTestId(visible)).toBeInTheDocument();
      expect(screen.queryByTestId('waterfall')).not.toBeInTheDocument();
    },
  );

  it('renders the Waterfall, captions per label and the variation caption when data is available', () => {
    setData(happyPathData);

    renderWithIntl(<CountryContribution />);

    expect(screen.getByTestId('waterfall')).toBeInTheDocument();
    expect(screen.getAllByTestId('caption-with-flag')).toHaveLength(
      countryContributionMock.labels.length,
    );
    expect(screen.getByTestId('variation-caption')).toHaveAttribute(
      'data-grid-columns',
      String(countryContributionMock.labels.length),
    );
  });

  it.each([
    {
      label: 'value when present',
      labels: [{ value: 'Test Value', image: 'test.png' }],
      expected: 'Test Value',
    },
    {
      label: 'country when value is missing',
      labels: [{ country: 'Test Country', image: 'test.png' }],
      expected: 'Test Country',
    },
    {
      label: 'country when value is empty string',
      labels: [{ value: '', country: 'Test Country', image: 'test.png' }],
      expected: 'Test Country',
    },
  ])('uses label.$label as the waterfall label', ({ labels, expected }) => {
    setData({
      countriesContribution: { ...countryContributionMock, labels },
    });

    renderWithIntl(<CountryContribution />);

    const waterfall = screen.getByTestId('waterfall');
    const renderedLabels = JSON.parse(
      waterfall.getAttribute('data-labels') || '[]',
    );
    expect(renderedLabels).toContain(expected);
  });

  it('renders no waterfall labels when the labels array is missing', () => {
    setData({
      countriesContribution: { ...countryContributionMock, labels: undefined },
    });

    renderWithIntl(<CountryContribution />);

    const renderedLabels = JSON.parse(
      screen.getByTestId('waterfall').getAttribute('data-labels') || '[]',
    );
    expect(renderedLabels).toEqual([]);
  });

  it.each([
    { sub_scopes: 'Heineken', expectedFilter: 'Heineken' },
    { sub_scopes: null, expectedFilter: 'All' },
    { sub_scopes: undefined, expectedFilter: 'All' },
  ])(
    'sends sub_scopes=$sub_scopes as page_filter (resolves to $expectedFilter)',
    ({ sub_scopes, expectedFilter }) => {
      mockUsePageFilterApplied.mockReturnValue({ applied: { sub_scopes } });
      setData(happyPathData);

      renderWithIntl(<CountryContribution />);

      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          subFilters: { page_filter: expectedFilter },
        }),
      );
    },
  );
});
