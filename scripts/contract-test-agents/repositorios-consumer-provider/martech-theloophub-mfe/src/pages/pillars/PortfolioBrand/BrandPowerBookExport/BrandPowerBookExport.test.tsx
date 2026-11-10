import '@testing-library/jest-dom';
import { IntlProvider } from 'react-intl';

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useDataRefreshForTab } from 'contexts/DataRefreshModal/useDataRefreshForTab';

import { BrandPowerBookExport } from './BrandPowerBookExport';

const mockUsePageFilterApplied = jest.fn();
const mockUsePageFilterData = jest.fn();
const mockUsePageFilterStatus = jest.fn();
const mockUseLastDataRefresh = jest.fn();
const mockUseExportPdf = jest.fn();
const mockGetCountry = jest.fn();
const mockGlobalView = jest.fn();
const mockCountryView = jest.fn();

jest.mock('contexts/DataRefreshModal/useDataRefreshForTab', () => ({
  useDataRefreshForTab: jest.fn(),
}));

jest.mock('hooks', () => ({
  usePageFilterApplied: () => mockUsePageFilterApplied(),
  usePageFilterData: () => mockUsePageFilterData(),
  usePageFilterStatus: () => mockUsePageFilterStatus(),
  useExportPdf: () => mockUseExportPdf(),
}));

jest.mock('contexts', () => ({
  useLastDataRefresh: () => mockUseLastDataRefresh(),
}));

jest.mock('domain/Filter', () => ({
  FilterDataAccessor: {
    getInstance: () => ({ getCountry: mockGetCountry }),
  },
}));

jest.mock('./components', () => ({
  GlobalView: ({ loadingCallback }: any) => {
    mockGlobalView({ loadingCallback });
    return <div data-testid="global-view" />;
  },
  CountryView: ({ loadingCallback }: any) => {
    mockCountryView({ loadingCallback });
    return <div data-testid="country-view" />;
  },
}));

jest.mock('components', () => ({
  Cover: ({ name, countries, period, loading, dataTestId, showLogo }: any) => (
    <div
      data-testid={dataTestId ?? 'cover'}
      data-name={name}
      data-show-logo={String(!!showLogo)}
      data-loading={String(!!loading)}
      data-countries={JSON.stringify(countries)}
    >
      <div data-testid={`${dataTestId ?? 'cover'}-period`}>{period}</div>
    </div>
  ),
  StickyScrollWithFilters: ({ filter, breadcrumbs }: any) => (
    <div data-testid="sticky-scroll-with-filters">
      <div
        data-testid={filter.dataTestId}
        data-page-name={filter.pageName}
        data-visible-fields={JSON.stringify(filter.visibleFields)}
      />
      <div
        data-testid="breadcrumbs"
        data-page-list={JSON.stringify(
          breadcrumbs.pageList.map((p: any) => p.pageName),
        )}
      />
    </div>
  ),
}));

jest.mock('shared/Styles', () => ({
  StyledGridContainer: ({ children }: any) => <div>{children}</div>,
  StyledGridItem: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('shared/Styles/exportPages.styles', () => {
  const { forwardRef } = jest.requireActual('react') as typeof import('react');
  const StyledExportPageContent = forwardRef<HTMLDivElement, any>(
    function StyledExportPageContent({ children }, ref) {
      return <div ref={ref}>{children}</div>;
    },
  );
  return {
    StyledExportButton: ({
      children,
      onClick,
      isLoading,
      icon,
      ...rest
    }: any) => (
      <button
        data-testid={rest['data-testid']}
        onClick={onClick}
        disabled={isLoading}
      >
        {typeof icon === 'function' ? icon() : icon}
        {children}
      </button>
    ),
    StyledExportIcon: () => <span data-testid="export-icon" />,
    StyledExportPageContent,
    StyledExportPageHeader: ({ children }: any) => <div>{children}</div>,
    StyledExportPageSection: ({ children, ...rest }: any) => (
      <section {...rest}>{children}</section>
    ),
  };
});

jest.mock('utils/format', () => ({
  formatDateToQuarterYear: jest.fn(
    (date: Date) =>
      `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`,
  ),
}));

jest.mock('./constants', () => ({
  pageSections: {
    cover: 'cover',
    section1: 'section1',
    section2: 'section2',
    backCover: 'back-cover',
  },
}));

const renderWithIntl = (ui: React.ReactElement) =>
  render(
    <IntlProvider locale="en" messages={{}} onError={() => undefined}>
      {ui}
    </IntlProvider>,
  );

const defaultMockApplied = { country: 'USA', zone: 'NAZ' };
const defaultMockDataFilters = {
  countries: {
    default: { value: 'USA', label: 'United States' },
    values: [{ value: 'USA', label: 'United States' }],
  },
};
const defaultMockCountry = { value: 'USA', label: 'United States' };
const defaultOnExport = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  mockUsePageFilterApplied.mockReturnValue({ applied: defaultMockApplied });
  mockUsePageFilterData.mockReturnValue({
    dataFilters: defaultMockDataFilters,
  });
  mockUsePageFilterStatus.mockReturnValue({ isLoading: false });
  mockUseLastDataRefresh.mockReturnValue({
    lastDataRefreshKpisDate: { power: new Date('2024-01-15') },
  });
  mockUseExportPdf.mockReturnValue({
    onExport: defaultOnExport,
    isExporting: false,
  });
  mockGetCountry.mockReturnValue(defaultMockCountry);
  (useDataRefreshForTab as jest.Mock).mockReturnValue(undefined);

  document.querySelector = jest.fn(() => document.createElement('div'));
});

describe('BrandPowerBookExport', () => {
  describe('view selection by country', () => {
    it.each([
      ['ABI', 'global-view', 'country-view'],
      ['USA', 'country-view', 'global-view'],
    ])(
      'renders %s view when country is %s',
      (country, expectedTestId, hiddenTestId) => {
        mockGetCountry.mockReturnValue({ value: country, label: country });

        renderWithIntl(<BrandPowerBookExport />);

        expect(screen.getByTestId(expectedTestId)).toBeInTheDocument();
        expect(screen.queryByTestId(hiddenTestId)).not.toBeInTheDocument();
      },
    );

    it('renders only the back cover when country is empty', () => {
      mockGetCountry.mockReturnValue({ value: '', label: '' });

      renderWithIntl(<BrandPowerBookExport />);

      expect(screen.queryByTestId('country-view')).not.toBeInTheDocument();
      expect(screen.queryByTestId('global-view')).not.toBeInTheDocument();
      expect(
        screen.getByTestId(
          'portfolio-brand_brand-power-results-export-thank-you',
        ),
      ).toBeInTheDocument();
    });
  });

  describe('Cover period', () => {
    it('renders the formatted quarter/year when a power date is available', () => {
      mockUseLastDataRefresh.mockReturnValue({
        lastDataRefreshKpisDate: { power: new Date('2024-03-10') },
      });

      renderWithIntl(<BrandPowerBookExport />);

      const period = screen.getByTestId('cover-period');
      expect(period).toHaveTextContent('Q1');
      expect(period).toHaveTextContent('2024');
    });

    it('renders an empty period when the power date is missing', () => {
      mockUseLastDataRefresh.mockReturnValue({ lastDataRefreshKpisDate: {} });

      renderWithIntl(<BrandPowerBookExport />);

      expect(screen.getByTestId('cover-period')).toBeEmptyDOMElement();
    });
  });

  describe('Export button', () => {
    it('is disabled while isExporting is true', () => {
      mockUseExportPdf.mockReturnValue({
        onExport: defaultOnExport,
        isExporting: true,
      });

      renderWithIntl(<BrandPowerBookExport />);

      expect(screen.getByTestId('refresh-button')).toBeDisabled();
    });

    it('is disabled while the active sub-view is still loading', async () => {
      let loadingCallback:
        ((s: { country: boolean; global: boolean }) => void) | null = null;
      mockCountryView.mockImplementation(({ loadingCallback: cb }) => {
        loadingCallback = cb;
      });

      renderWithIntl(<BrandPowerBookExport />);

      expect(screen.getByTestId('refresh-button')).toBeDisabled();

      act(() => {
        loadingCallback?.({ country: false, global: false });
      });

      await waitFor(() =>
        expect(screen.getByTestId('refresh-button')).not.toBeDisabled(),
      );
    });

    it('clicking the button calls onExport with the section DOM elements in order', async () => {
      const querySelector = jest.fn((selector: string) => {
        const el = document.createElement('div');
        el.dataset.pageName = selector
          .replace('[data-page-name=', '')
          .replace(']', '');
        return el;
      });
      document.querySelector = querySelector;

      let loadingCallback:
        ((s: { country: boolean; global: boolean }) => void) | null = null;
      mockCountryView.mockImplementation(({ loadingCallback: cb }) => {
        loadingCallback = cb;
      });

      renderWithIntl(<BrandPowerBookExport />);

      act(() => {
        loadingCallback?.({ country: false, global: false });
      });

      await waitFor(() =>
        expect(screen.getByTestId('refresh-button')).not.toBeDisabled(),
      );

      fireEvent.click(screen.getByTestId('refresh-button'));

      const calls = querySelector.mock.calls.map(([s]) => s);
      expect(calls).toEqual([
        '[data-page-name=cover]',
        '[data-page-name=section1]',
        '[data-page-name=section2]',
        '[data-page-name=back-cover]',
      ]);
      expect(defaultOnExport).toHaveBeenCalledTimes(1);
    });
  });

  it('passes the export pageName and visible fields to the filter', () => {
    renderWithIntl(<BrandPowerBookExport />);

    const filter = screen.getByTestId('brand-power-book-export-filter');
    expect(filter).toHaveAttribute(
      'data-page-name',
      'portfolio-brand_brand-power-results-export',
    );
    expect(
      JSON.parse(filter.getAttribute('data-visible-fields') ?? '[]'),
    ).toEqual(['zone', 'country', 'time_frame']);
  });

  it('renders the Cover with showLogo and the selected country', () => {
    renderWithIntl(<BrandPowerBookExport />);

    const cover = screen.getByTestId('cover');
    expect(cover).toHaveAttribute('data-show-logo', 'true');
    expect(cover).toHaveAttribute('data-name', 'Brand Power Book');
    expect(JSON.parse(cover.getAttribute('data-countries') ?? '[]')).toEqual([
      { code: 'USA', name: 'United States' },
    ]);
  });

  it('registers the page with useDataRefreshForTab', () => {
    renderWithIntl(<BrandPowerBookExport />);

    expect(useDataRefreshForTab).toHaveBeenCalledWith(
      'Brand Power Book - Power Book',
    );
  });
});
