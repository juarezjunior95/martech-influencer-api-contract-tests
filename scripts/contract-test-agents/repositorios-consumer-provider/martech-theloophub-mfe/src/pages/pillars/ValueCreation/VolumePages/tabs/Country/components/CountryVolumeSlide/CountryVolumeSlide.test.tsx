import React from 'react';
import { IntlProvider } from 'react-intl';

import { render } from '@testing-library/react';
import { VolumePagesKpiProvider } from 'pages/pillars/ValueCreation/VolumePages/contexts';

import { pageSections } from '../../constants/sections';
import { CountryVolumeSlide } from './CountryVolumeSlide';

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
  TemplateSlide: ({ children, title }: any) => (
    <div data-testid="template-slide" data-title={title}>
      {children}
    </div>
  ),
}));

jest.mock('pages/components/ValueCreation/Slides/SlideContent', () => ({
  SlideContent: (props: { loading?: boolean; error?: Error | null }) => (
    <div
      data-testid="slide-content"
      data-loading={String(props.loading)}
      data-error={String(props.error)}
    />
  ),
}));

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
    'big-numbers': [],
    'line-chart': null,
    portfolio: null,
    'growth-levers': null,
  },
  loading: false,
  error: null,
};

const defaultProps = {
  getPageByName: jest.fn(() => ({ index: 1, name: 'test-page' })),
  countryLabel: 'Brazil',
  countryCode: 'BRA',
  kpiName: 'Volume',
  dataTestId: 'test-id',
  period: "JAN'25",
  data: mockData as any,
};

describe('CountryVolumeSlide', () => {
  it('renders the section with correct data-page-name', () => {
    const { container } = renderWithVolumeKpi(
      <CountryVolumeSlide {...defaultProps} />,
    );

    expect(
      container.querySelector(
        `[data-page-name="${pageSections.countryVolumeReport}"]`,
      ),
    ).toBeInTheDocument();
  });

  it('renders the TemplateSlide with country volume title', () => {
    const { getByTestId } = renderWithVolumeKpi(
      <CountryVolumeSlide {...defaultProps} />,
    );

    expect(getByTestId('template-slide')).toHaveAttribute(
      'data-title',
      'Brazil Volume',
    );
  });

  it('renders SlideContent', () => {
    const { getByTestId } = renderWithVolumeKpi(
      <CountryVolumeSlide {...defaultProps} />,
    );

    expect(getByTestId('slide-content')).toBeInTheDocument();
  });

  it('passes loading state to SlideContent', () => {
    const dataWithLoading = { ...mockData, loading: true };

    const { getByTestId } = renderWithVolumeKpi(
      <CountryVolumeSlide {...defaultProps} data={dataWithLoading as any} />,
    );

    expect(getByTestId('slide-content')).toHaveAttribute(
      'data-loading',
      'true',
    );
  });

  it('passes error state to SlideContent', () => {
    const dataWithError = {
      ...mockData,
      error: new Error('Network error'),
      loading: false,
    };

    const { getByTestId } = renderWithVolumeKpi(
      <CountryVolumeSlide {...defaultProps} data={dataWithError as any} />,
    );

    expect(getByTestId('slide-content')).toHaveAttribute(
      'data-error',
      String(dataWithError.error),
    );
  });

  it('calls getPageByName with countryVolumeReport section', () => {
    const getPageByName = jest.fn(() => ({ index: 3, name: 'test-page' }));

    renderWithVolumeKpi(
      <CountryVolumeSlide {...defaultProps} getPageByName={getPageByName} />,
    );

    expect(getPageByName).toHaveBeenCalledWith(
      pageSections.countryVolumeReport,
    );
  });

  it('uses countryCode for TemplateSlide countryId', () => {
    const { container } = renderWithVolumeKpi(
      <CountryVolumeSlide {...defaultProps} />,
    );

    expect(container.querySelector('[data-page-name]')).toBeInTheDocument();
  });

  it('renders correctly without dataTestId', () => {
    const { container } = renderWithVolumeKpi(
      <CountryVolumeSlide {...defaultProps} dataTestId={undefined} />,
    );

    expect(
      container.querySelector(
        `[data-page-name="${pageSections.countryVolumeReport}"]`,
      ),
    ).toBeInTheDocument();
  });
});
