import { fireEvent, render, screen } from '@testing-library/react';
import { useLastDataRefresh, useScopedModal } from 'contexts';
import { usePageFilterApplied } from 'hooks';
import { FilterValue } from 'models/Filters';
import { INDIA_COUNTRY_CODE } from 'pages/constants';

import { useBrandPowerRequests } from '../../hooks/brand-power/useBrandPowerRequests';
import { BrandPower } from './BrandPower';
import { ALL_BRANDS_VALUE } from './constants';

const mockFormatMessage = jest.fn((msg) => msg.id || msg.defaultMessage);
const mockOpenModal = jest.fn();

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: mockFormatMessage }),
}));

jest.mock('react-router-dom');

jest.mock('hooks', () => ({
  usePageFilterApplied: jest.fn(),
}));

jest.mock('contexts', () => ({
  useLastDataRefresh: jest.fn(),
  useScopedModal: jest.fn(),
}));

jest.mock('contexts/DataRefreshModal/useDataRefreshForTab', () => ({
  useDataRefreshForTab: jest.fn(),
}));

jest.mock('components/Filter', () => ({
  FILTER_MODAL_NAME: 'filter-modal',
}));

jest.mock('../../BrandAnalysis', () => ({
  BRAND_POWER_PAGE_NAME: 'brand-power-page',
}));

jest.mock('@hexa-ui/components', () => ({
  Divider: () => <div data-testid="divider" />,
}));

jest.mock('@hexa-ui/icons', () => ({
  CalendarClock: { name: 'CalendarClock' },
}));

jest.mock('components', () => ({
  BasicContainer: ({
    header,
    children,
  }: {
    header: any;
    children: React.ReactNode;
  }) => (
    <div data-testid="basic-container">
      {header.tags && (
        <div data-testid="header-tags">
          {header.tags.map((tag: any, index: number) => (
            <div key={`${tag.text}-${index}`} data-testid={`tag-${index}`}>
              {tag.text}
            </div>
          ))}
        </div>
      )}
      <div data-testid="header-right-content">{header.rightContent}</div>
      {children}
    </div>
  ),
  CountryFlag: () => <div data-testid="country-flag" />,
  NoDataYet: () => <div data-testid="no-data-yet" />,
  NoResultsState: ({ type, openModal }: any) => (
    <button
      data-testid="no-results-state"
      data-type={type}
      type="button"
      onClick={openModal}
    />
  ),
  SubFilterBrandCompetitor: () => (
    <div data-testid="sub-filter-brand-competitor" />
  ),
}));

jest.mock('shared/Styles', () => ({
  StyledTooltip: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock('./components', () => ({
  BrandPowerSection: () => <div data-testid="brand-power-section" />,
  ImageriesSection: () => <div data-testid="imageries-section" />,
  SalienceSection: ({ onPowerAwarenessChange }: any) => (
    <div
      data-testid="salience-section"
      role="button"
      tabIndex={0}
      onClick={() => onPowerAwarenessChange?.('brand-clarity')}
      onKeyDown={(event) => {
        if (event.key === 'Enter') onPowerAwarenessChange?.('brand-clarity');
      }}
    />
  ),
  Section: ({ name }: any) => <div data-testid="section" data-name={name} />,
}));

jest.mock('./BrandPower.styles', () => ({
  StyledSubFilterContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  StyledDividerContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  StyledBrandPowerContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  StyledIndiaEmptyState: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="styled-india-empty-state">{children}</div>
  ),
}));

jest.mock('utils/format', () => ({
  formatDateToQuarterYear: jest.fn(() => 'Q4 2024'),
}));

jest.mock('../../hooks/brand-power/useBrandPowerRequests', () => ({
  useBrandPowerRequests: jest.fn(() => ({
    responses: {
      power: { kpiData: { power: {} }, loading: false },
      meaning: { kpiData: { meaning: {} }, loading: false },
      affinity: { kpiData: { affinity: {} }, loading: false },
      meetNeeds: { kpiData: { meetNeeds: {} }, loading: false },
      difference: { kpiData: { difference: {} }, loading: false },
      dynamic: { kpiData: { dynamic: {} }, loading: false },
      unique: { kpiData: { unique: {} }, loading: false },
      salience: { kpiData: { salience: {} }, loading: false },
      unaided_awareness: { kpiData: { unaided_awareness: {} }, loading: false },
      occasion: { kpiData: { occasion: {} }, loading: false },
      imageries: { kpiData: { imageries: {} }, loading: false },
      bip: { kpiData: { bip: {} }, loading: false },
      brand_clarity: { kpiData: { brand_clarity: {} }, loading: false },
    },
    loading: false,
  })),
}));

const mockApplied = {
  country: 'BR' as FilterValue,
  brands_abi: 'brand1' as FilterValue,
  brands_comp: null as FilterValue,
  time_frame: '2024' as FilterValue,
};

const mockLastDataRefreshKpisDate = { power: '2024-12-10T10:00:00.000Z' };

const mockedUsePageFilterApplied = usePageFilterApplied as jest.MockedFunction<
  typeof usePageFilterApplied
>;
const mockedUseLastDataRefresh = useLastDataRefresh as jest.MockedFunction<
  typeof useLastDataRefresh
>;
const mockedUseScopedModal = useScopedModal as jest.MockedFunction<
  typeof useScopedModal
>;
const mockedUseBrandPowerRequests =
  useBrandPowerRequests as jest.MockedFunction<typeof useBrandPowerRequests>;

const setFilterApplied = (
  overrides: Partial<typeof mockApplied> = {},
  isGlobalZone = false,
) => {
  mockedUsePageFilterApplied.mockReturnValue({
    applied: { ...mockApplied, ...overrides },
    isGlobalZone,
  } as any);
};

describe('BrandPower', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setFilterApplied();
    mockedUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisDate: mockLastDataRefreshKpisDate,
    } as any);
    mockedUseScopedModal.mockReturnValue({ open: mockOpenModal } as any);
  });

  describe('useBrandPowerRequests integration', () => {
    it.each([
      ['default', mockApplied, false, { power: true, details: true }],
      ['global zone', mockApplied, true, { power: true, details: false }],
      [
        'India',
        { ...mockApplied, country: INDIA_COUNTRY_CODE },
        false,
        { power: false, details: false },
      ],
    ])(
      'calls hook with the right enabled flags (%s)',
      (_label, applied, isGlobalZone, enabled) => {
        mockedUsePageFilterApplied.mockReturnValue({
          applied,
          isGlobalZone,
        } as any);

        render(<BrandPower />);

        expect(mockedUseBrandPowerRequests).toHaveBeenCalledWith(
          expect.objectContaining({
            quarterYearSelected: 'quarter',
            powerAwarenessSelected: 'unaided-awareness',
            enabled,
          }),
        );
      },
    );

    it('propagates powerAwarenessSelected updates from SalienceSection', () => {
      render(<BrandPower />);

      fireEvent.click(screen.getByTestId('salience-section'));

      expect(mockedUseBrandPowerRequests).toHaveBeenLastCalledWith(
        expect.objectContaining({
          powerAwarenessSelected: 'brand-clarity',
        }),
      );
    });
  });

  describe('header refresh tag', () => {
    it.each([
      [
        'shows tag when refresh date is present',
        mockLastDataRefreshKpisDate,
        true,
      ],
      ['hides tag when refresh map is null', null, false],
      ['hides tag when power date is missing', {}, false],
    ])('%s', (_label, refreshDate, shouldRender) => {
      mockedUseLastDataRefresh.mockReturnValue({
        lastDataRefreshKpisDate: refreshDate,
      } as any);

      render(<BrandPower />);

      const tags = screen.queryByTestId('header-tags');
      if (shouldRender) {
        expect(tags).toBeInTheDocument();
        expect(screen.getByTestId('tag-0')).toHaveTextContent(': Q4 2024');
      } else {
        expect(tags).not.toBeInTheDocument();
      }
    });
  });

  describe('India market', () => {
    beforeEach(() => {
      setFilterApplied({ country: INDIA_COUNTRY_CODE });
    });

    it('renders the India empty state and hides all sections', () => {
      render(<BrandPower />);

      expect(
        screen.getByTestId('styled-india-empty-state'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('no-data-yet')).toBeInTheDocument();
      expect(
        screen.queryByTestId('brand-power-section'),
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('section')).not.toBeInTheDocument();
    });
  });

  describe('ALL_BRANDS_VALUE (no brand selected)', () => {
    beforeEach(() => {
      setFilterApplied({ brands_abi: ALL_BRANDS_VALUE });
    });

    it('renders NoResultsState and hides detail sections', () => {
      render(<BrandPower />);

      const noResults = screen.getByTestId('no-results-state');
      expect(noResults).toHaveAttribute('data-type', 'brandPower');
      expect(screen.queryByTestId('section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('salience-section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('imageries-section')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('sub-filter-brand-competitor'),
      ).not.toBeInTheDocument();
    });

    it('opens the filter modal when the empty state is clicked', () => {
      render(<BrandPower />);

      fireEvent.click(screen.getByTestId('no-results-state'));

      expect(mockOpenModal).toHaveBeenCalled();
    });
  });

  describe('global zone', () => {
    it('renders only BrandPowerSection and hides detail/salience/imageries sections', () => {
      setFilterApplied({}, true);

      render(<BrandPower />);

      expect(screen.getByTestId('brand-power-section')).toBeInTheDocument();
      expect(screen.queryByTestId('section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('salience-section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('imageries-section')).not.toBeInTheDocument();
    });
  });

  describe('default brand-selected flow', () => {
    it('renders BrandPowerSection, meaning/difference sections, salience and imageries', () => {
      render(<BrandPower />);

      expect(screen.getByTestId('brand-power-section')).toBeInTheDocument();
      expect(screen.getByTestId('salience-section')).toBeInTheDocument();
      expect(screen.getByTestId('imageries-section')).toBeInTheDocument();

      const names = screen
        .getAllByTestId('section')
        .map((node) => node.dataset.name);
      expect(names).toEqual(['meaning', 'difference']);
    });

    it('renders SubFilterBrandCompetitor when brands_abi is a specific brand', () => {
      render(<BrandPower />);

      expect(
        screen.getByTestId('sub-filter-brand-competitor'),
      ).toBeInTheDocument();
    });
  });
});
