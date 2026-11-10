import React from 'react';
import { IntlProvider } from 'react-intl';

import { render } from '@testing-library/react';
import { VolumePagesKpiProvider } from 'pages/pillars/ValueCreation/VolumePages/contexts';

import { pageSections } from '../../constants/sections';
import { CountryBrandsBreakdownSlide } from './CountryBrandsBreakdownSlide';

const intlMessages = {
  'ValueCreation.PRPages.volume': 'Volume',
};

const renderWithVolumeKpi = (ui: React.ReactElement) =>
  render(
    <IntlProvider locale="en" messages={intlMessages}>
      <VolumePagesKpiProvider kpi="volume">{ui}</VolumePagesKpiProvider>
    </IntlProvider>,
  );

jest.mock('components', () => ({
  TemplateSlide: ({ children, title, footnotes }: any) => (
    <div
      data-testid="template-slide"
      data-title={title}
      data-footnotes={footnotes}
    >
      {children}
    </div>
  ),
}));

jest.mock(
  'pages/components/ValueCreation/Slides/TopBottomWaterfallSlideContent',
  () => ({
    TopBottomWaterfallSlideContent: (props: any) => (
      <div
        data-testid="top-bottom-waterfall-slide-content"
        data-loading={String(props.loading)}
        data-error={String(props.error)}
      />
    ),
  }),
);

jest.mock('shared/Styles/exportPages.styles', () => ({
  StyledExportPageSection: ({ children, ...props }: any) => (
    <section
      data-page-name={props['data-page-name']}
      data-testid={props['data-testid']}
    >
      {children}
    </section>
  ),
}));

const mockData = {
  data: {
    'brands-volume-YTD': { header: [], rows: [] },
    'brands-volume-MTD': { header: [], rows: [] },
  },
  loading: false,
  error: null,
};

const defaultProps = {
  getPageByName: jest.fn(() => ({ index: 1, name: 'test-page' })),
  countryLabel: 'Brazil',
  countryCode: 'BRA',
  dataTestId: 'test-id',
  period: "JAN'25",
  data: mockData as any,
  kpiName: 'Volume',
};

describe('CountryBrandsBreakdownSlide', () => {
  it('renders the section with correct data-page-name', () => {
    const { container } = renderWithVolumeKpi(
      <CountryBrandsBreakdownSlide {...defaultProps} />,
    );

    expect(
      container.querySelector(
        `[data-page-name="${pageSections.countryBarChartReport}"]`,
      ),
    ).toBeInTheDocument();
  });

  it('renders the TemplateSlide with brands breakdown title', () => {
    const { getByTestId } = renderWithVolumeKpi(
      <CountryBrandsBreakdownSlide {...defaultProps} />,
    );

    expect(getByTestId('template-slide')).toHaveAttribute(
      'data-title',
      'Brazil Volume Brands Breakdown',
    );
  });

  it('renders TopBottomWaterfallSlideContent', () => {
    const { getByTestId } = renderWithVolumeKpi(
      <CountryBrandsBreakdownSlide {...defaultProps} />,
    );

    expect(
      getByTestId('top-bottom-waterfall-slide-content'),
    ).toBeInTheDocument();
  });

  it('passes loading state to TopBottomWaterfallSlideContent', () => {
    const dataWithLoading = { ...mockData, loading: true };

    const { getByTestId } = renderWithVolumeKpi(
      <CountryBrandsBreakdownSlide
        {...defaultProps}
        data={dataWithLoading as any}
      />,
    );

    expect(getByTestId('top-bottom-waterfall-slide-content')).toHaveAttribute(
      'data-loading',
      'true',
    );
  });

  it('hides the whole section when the BFF call resolves with an error', () => {
    const dataWithError = {
      ...mockData,
      error: new Error('Network error'),
      loading: false,
    };

    const { queryByTestId } = renderWithVolumeKpi(
      <CountryBrandsBreakdownSlide
        {...defaultProps}
        data={dataWithError as any}
      />,
    );

    expect(queryByTestId('template-slide')).not.toBeInTheDocument();
    expect(
      queryByTestId('top-bottom-waterfall-slide-content'),
    ).not.toBeInTheDocument();
  });

  it('hides the whole section when the BFF call resolves without payload', () => {
    const dataWithoutPayload = {
      data: null,
      loading: false,
      error: null,
    };

    const { queryByTestId } = renderWithVolumeKpi(
      <CountryBrandsBreakdownSlide
        {...defaultProps}
        data={dataWithoutPayload as any}
      />,
    );

    expect(queryByTestId('template-slide')).not.toBeInTheDocument();
    expect(
      queryByTestId('top-bottom-waterfall-slide-content'),
    ).not.toBeInTheDocument();
  });

  it('calls getPageByName with countryBarChartReport section', () => {
    const getPageByName = jest.fn(() => ({ index: 2, name: 'test-page' }));

    renderWithVolumeKpi(
      <CountryBrandsBreakdownSlide
        {...defaultProps}
        getPageByName={getPageByName}
      />,
    );

    expect(getPageByName).toHaveBeenCalledWith(
      pageSections.countryBarChartReport,
    );
  });

  it('renders correctly without dataTestId', () => {
    const { container } = renderWithVolumeKpi(
      <CountryBrandsBreakdownSlide {...defaultProps} dataTestId={undefined} />,
    );

    expect(
      container.querySelector(
        `[data-page-name="${pageSections.countryBarChartReport}"]`,
      ),
    ).toBeInTheDocument();
  });

  it('includes footnotes text about brands ordering', () => {
    const { getByTestId } = renderWithVolumeKpi(
      <CountryBrandsBreakdownSlide {...defaultProps} />,
    );

    expect(getByTestId('template-slide')).toHaveAttribute(
      'data-footnotes',
      'Brands are ordered by Portfolio Classification, then ranked by vol. size. Product Type filtered by Beer + ADJ.',
    );
  });
});
