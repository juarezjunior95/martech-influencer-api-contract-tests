import React from 'react';

import { render, screen } from '@testing-library/react';
import { VolumePagesKpiProvider } from 'pages/pillars/ValueCreation/VolumePages/contexts';

import { pageSections } from './constants';
import { Global } from './Global';

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

const mockGetPageByName = jest.fn(() => ({ index: 1 }));
const mockOnExport = jest.fn().mockResolvedValue(undefined);

jest.mock('contexts/DataRefreshModal/useDataRefreshForTab', () => ({
  useDataRefreshForTab: jest.fn(),
}));

jest.mock('contexts', () => ({
  useLastDataRefresh: jest.fn(),
}));

jest.mock('hooks', () => ({
  useBffData: jest.fn(),
  useExportPdf: jest.fn(),
  usePageIndexes: jest.fn(),
  useFeatureToggle: jest.fn(() => [false, false]),
  usePageFilterApplied: jest.fn(() => ({ applied: {} })),
}));

jest.mock('components', () => ({
  Cover: () => <div data-testid="cover" />,
  TemplateSlide: ({ children }: any) => (
    <div data-testid="template-slide">{children}</div>
  ),
}));

jest.mock('../../components', () => ({
  BarChartSlideContent: () => <div data-testid="bar-chart-slide-content" />,
  BrandsSlide: () => <div data-testid="brands-slide" />,
  GlobalMovesSlideContent: () => (
    <div data-testid="global-moves-slide-content" />
  ),
}));

jest.mock(
  'pages/pillars/ValueCreation/VolumePages/tabs/Global/components/CountrySlideWrapper',
  () => ({
    CountrySlideWrapper: () => <div data-testid="country-slide-wrapper" />,
  }),
);

jest.mock('pages/pillars/ValueCreation/VolumePages/components', () => ({
  BrandsSlide: () => <div data-testid="brands-slide" />,
  CountrySlideWrapper: () => <div data-testid="country-slide-wrapper" />,
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
  StyledExportPageSection: ({ children, ...props }: any) => (
    <section data-page-name={props['data-page-name']}>{children}</section>
  ),
}));

jest.mock(
  'pages/components/AISummary/components/AISummaryVolumePages/AISummaryVolumePages',
  () => ({
    AISummaryVolumePages: ({ dataTestId }: any) => (
      <div data-testid={dataTestId ?? 'ai-summary-volume-pages'}>
        AISummaryVolumePages
      </div>
    ),
  }),
);

const mockUseDataRefreshForTab = jest.requireMock(
  'contexts/DataRefreshModal/useDataRefreshForTab',
).useDataRefreshForTab;
const mockUseLastDataRefresh = jest.requireMock('contexts').useLastDataRefresh;
const mockUseBffData = jest.requireMock('hooks').useBffData;
const mockUseExportPdf = jest.requireMock('hooks').useExportPdf;
const mockUsePageIndexes = jest.requireMock('hooks').usePageIndexes;

describe('Global', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDataRefreshForTab.mockImplementation(() => undefined);
    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisDate: { volume: new Date('2025-01-15') },
      lastDataRefreshKpisDateMonthYear: { volume: '2025-01' },
    });
    mockUseBffData.mockReturnValue({
      data: {},
      loading: false,
      error: null,
    });
    mockUsePageIndexes.mockReturnValue({ getPageByName: mockGetPageByName });
    mockUseExportPdf.mockReturnValue({ onExport: mockOnExport });
  });

  it('should render consolidated global tab without export button', () => {
    render(
      <VolumePagesKpiProvider kpi="volume">
        <Global />
      </VolumePagesKpiProvider>,
    );

    expect(
      screen.queryByRole('button', { name: /export file/i }),
    ).not.toBeInTheDocument();
    const mainCover = `[data-page-name="${pageSections.mainCover}"]`;
    expect(document.querySelector(mainCover)).toBeInTheDocument();
    const keyMarketsCover = `[data-page-name="${pageSections.mustWinMarketsCover}"]`;
    expect(document.querySelector(keyMarketsCover)).toBeInTheDocument();
  });
});
