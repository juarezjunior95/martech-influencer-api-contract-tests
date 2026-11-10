import React from 'react';
import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';
import {
  LoadingRegistryProvider,
  VolumePagesKpiProvider,
} from 'pages/pillars/ValueCreation/VolumePages/contexts';

import { pageSections } from './constants/sections';
import { Country } from './Country';

const mockGetPageByName = jest.fn(() => ({ index: 1 }));
const mockOnExport = jest.fn().mockResolvedValue(undefined);
const mockGetCountry = jest.fn();

jest.mock('hooks', () => ({
  useBffData: jest.fn(),
  useExportPdf: jest.fn(),
  useFeatureToggle: jest.fn(() => [false, false]),
  usePageFilterApplied: jest.fn(),
  usePageFilterData: jest.fn(),
  usePageIndexes: jest.fn(),
}));

jest.mock('contexts', () => ({
  useLastDataRefresh: jest.fn(),
}));

jest.mock('domain/Filter', () => ({
  FilterDataAccessor: {
    getInstance: () => ({ getCountry: mockGetCountry }),
  },
  FilterRegistry: {
    buildFilterQueryString: jest.fn((filters: Record<string, string>) =>
      Object.entries(filters)
        .map(([k, v]) => `${k}=${v}`)
        .join('&'),
    ),
  },
}));

jest.mock('components', () => ({
  Cover: () => <div data-testid="cover" />,
  TemplateSlide: ({ children }: any) => (
    <div data-testid="template-slide">{children}</div>
  ),
}));

jest.mock('pages/components/ValueCreation/Slides/SlideContent', () => ({
  SlideContent: () => <div data-testid="slide-content" />,
}));

jest.mock(
  'pages/components/ValueCreation/Slides/TopBottomWaterfallSlideContent',
  () => ({
    TopBottomWaterfallSlideContent: () => (
      <div data-testid="top-bottom-waterfall-slide-content" />
    ),
  }),
);

jest.mock('shared/Styles/exportPages.styles', () => ({
  StyledExportButton: ({ onClick, children }: any) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
  StyledExportIcon: () => null,
  StyledExportPageContent: ({ children }: any) => <div>{children}</div>,
  StyledExportPageHeader: ({ children }: any) => <div>{children}</div>,
  StyledExportHoverContainer: ({ children }: any) => <div>{children}</div>,
  StyledExportCenterCopyButton: ({ children, ...props }: any) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
  StyledExportPageSection: ({ children, ...props }: any) => (
    <section data-page-name={props['data-page-name']}>{children}</section>
  ),
}));

const mockUseBffData = jest.requireMock('hooks').useBffData;
const mockUseExportPdf = jest.requireMock('hooks').useExportPdf;
const mockUsePageFilterApplied = jest.requireMock('hooks').usePageFilterApplied;
const mockUsePageFilterData = jest.requireMock('hooks').usePageFilterData;
const mockUsePageIndexes = jest.requireMock('hooks').usePageIndexes;
const mockUseLastDataRefresh = jest.requireMock('contexts').useLastDataRefresh;

const intlMessages = {
  'ValueCreation.PRPages.volume': 'Volume',
};

describe('Country', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCountry.mockReturnValue({ value: 'USA', label: 'United States' });
    mockUsePageFilterApplied.mockReturnValue({ applied: {} });
    mockUsePageFilterData.mockReturnValue({ dataFilters: {} });
    mockUsePageIndexes.mockReturnValue({ getPageByName: mockGetPageByName });
    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisDate: { volume: new Date('2025-01-15') },
    });
    mockUseBffData.mockReturnValue({
      data: {},
      loading: false,
      error: null,
    });
    mockUseExportPdf.mockReturnValue({ onExport: mockOnExport });
  });

  it('should render country pages with export button', () => {
    render(
      <IntlProvider locale="en" messages={intlMessages}>
        <LoadingRegistryProvider>
          <VolumePagesKpiProvider kpi="volume">
            <Country />
          </VolumePagesKpiProvider>
        </LoadingRegistryProvider>
      </IntlProvider>,
    );

    expect(
      screen.getByRole('button', { name: /export file/i }),
    ).toBeInTheDocument();
    expect(
      document.querySelector(
        `[data-page-name="${pageSections.countryMainCover}"]`,
      ),
    ).toBeInTheDocument();
  });
});
