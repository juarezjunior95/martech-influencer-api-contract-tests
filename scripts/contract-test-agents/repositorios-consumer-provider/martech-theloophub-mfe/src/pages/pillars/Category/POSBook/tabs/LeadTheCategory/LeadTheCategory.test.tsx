import { render, screen } from '@testing-library/react';
import { useLastDataRefresh } from 'contexts';
import { useDataRefreshForTab } from 'contexts/DataRefreshModal/useDataRefreshForTab';
import {
  useMultiplesFeatureToggles,
  usePageFilterApplied,
  useSubFilters,
} from 'hooks';

import { LeadTheCategory } from './LeadTheCategory';

const mockFormatMessage = jest.fn(({ id }: { id: string }) => id);
const mockFeaturesListByToggleName: Record<string, boolean> = {};
let mockTogglesReady = true;
const mockLastDataRefreshKpisDate = {
  pos: {
    'Last 4 Weeks': '2025-01-15',
    'Last 13 Weeks': '2025-01-10',
  },
};
const mockApplied = {
  pos_periods: 'Last 4 Weeks',
};

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: mockFormatMessage,
  }),
}));

jest.mock('contexts', () => ({
  useLastDataRefresh: jest.fn(() => ({
    lastDataRefreshKpisDate: mockLastDataRefreshKpisDate,
  })),
}));

jest.mock('contexts/DataRefreshModal/useDataRefreshForTab', () => ({
  useDataRefreshForTab: jest.fn(),
}));

jest.mock('hooks', () => ({
  usePageFilterApplied: jest.fn(() => ({
    applied: mockApplied,
  })),
  useMultiplesFeatureToggles: jest.fn(() => ({
    featuresListByToggleName: mockFeaturesListByToggleName,
    togglesReady: mockTogglesReady,
  })),
  useSubFilters: jest.fn(() => ({ activeSubFilters: {} })),
}));

jest.mock('config/featureToggle', () => ({
  featureToggles: {
    pillar: {
      category: {
        submenus: {
          posBook: {
            usaAlert: 'USA_ALERT_TOGGLE',
            tab: {
              leadCategory: {
                aiSummary: 'AI_SUMMARY_LEAD_TOGGLE',
                sections: {
                  manufactureLead: 'MANUFACTURE_LEAD_TOGGLE',
                  brandParticipation: 'BRAND_PARTICIPATION_TOGGLE',
                },
              },
            },
          },
        },
      },
    },
  },
}));

jest.mock('@hexa-ui/icons', () => ({
  CalendarClock: () => <span data-testid="calendar-clock-icon" />,
}));

jest.mock('components', () => ({
  BasicContainer: ({
    header,
    children,
    dataTestId,
  }: {
    header: {
      title: string;
      titleSize: string;
      tooltip: React.ReactNode;
      rightContent: React.ReactNode;
      bottomTag: React.ReactNode;
    };
    children: React.ReactNode;
    dataTestId?: string;
  }) => (
    <div data-testid={dataTestId || 'basic-container'}>
      <div data-testid="header-title">{header.title}</div>
      <div data-testid="header-title-size">{header.titleSize}</div>
      <div data-testid="header-tooltip">{header.tooltip}</div>
      <div data-testid="header-right-content">{header.rightContent}</div>
      <div data-testid="header-bottom-tag">{header.bottomTag}</div>
      {children}
    </div>
  ),
  CountryFlag: () => <div data-testid="country-flag" />,
  Tag: ({
    Icon,
    text,
    dataTestId,
  }: {
    Icon: React.ComponentType;
    text: string;
    dataTestId?: string;
  }) => (
    <div data-testid={dataTestId || 'tag'} data-text={text}>
      <Icon />
    </div>
  ),
  Alert: ({
    type,
    title,
    message,
    dataTestId,
  }: {
    type: string;
    title: string;
    message: string;
    dataTestId?: string;
  }) => (
    <div data-testid={dataTestId || 'alert'} data-type={type}>
      <div data-testid="alert-title">{title}</div>
      <div data-testid="alert-message">{message}</div>
    </div>
  ),
}));

jest.mock('shared/Styles', () => ({
  StyledTooltip: ({
    children,
    size,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    size: string;
    'data-testid'?: string;
  }) => (
    <div data-testid={dataTestId || 'styled-tooltip'} data-size={size}>
      {children}
    </div>
  ),
}));

jest.mock('./components', () => ({
  Manufacture: ({
    lastDataRefresh,
    dataTestId,
  }: {
    formatMessage: any;
    lastDataRefresh: string | null;
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId || 'manufacture'}
      data-last-data-refresh={lastDataRefresh || ''}
    >
      Manufacture Component
    </div>
  ),
  BrandParticipation: ({
    lastDataRefresh,
    dataTestId,
  }: {
    formatMessage: any;
    lastDataRefresh: string | null;
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId || 'brand-participation'}
      data-last-data-refresh={lastDataRefresh || ''}
    >
      BrandParticipation Component
    </div>
  ),
}));

jest.mock('./LeadTheCategory.styles', () => ({
  LeadTheCategoryContainer: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => (
    <div data-testid={dataTestId || 'lead-the-category-container'}>
      {children}
    </div>
  ),
}));

jest.mock('pages/components/AISummary', () => ({
  AISummary: ({
    pageName,
    kpiGroup,
    dataTestId,
    subFilters,
    summaryPageIdentifier,
  }: {
    pageName: string;
    kpiGroup?: string;
    dataTestId?: string;
    subFilters?: Record<string, unknown>;
    summaryPageIdentifier?: string;
  }) => (
    <div
      data-testid={dataTestId || 'ai-summary'}
      data-page-name={pageName}
      data-kpi-group={kpiGroup}
      data-sub-filters={JSON.stringify(subFilters)}
      data-summary-page-identifier={summaryPageIdentifier}
    >
      AI Summary Component
    </div>
  ),
}));

jest.mock('../../POSBook', () => ({
  POS_BOOK_PAGE_NAME: 'POS_BOOK',
}));

jest.mock('utils/timePeriod', () => ({
  lastDataRefreshByTimePeriod: jest.fn((data, period) => {
    if (!data || !period) return null;
    return data[period] || null;
  }),
  vsLastYearByTimePeriod: jest.fn((data, period) => {
    if (!data || !period) return null;
    return `vs LY: ${data[period]}` || null;
  }),
}));

describe('LeadTheCategory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLastDataRefresh as jest.Mock).mockReturnValue({
      lastDataRefreshKpisDate: mockLastDataRefreshKpisDate,
    });
    (usePageFilterApplied as jest.Mock).mockReturnValue({
      applied: mockApplied,
    });
    (useSubFilters as jest.Mock).mockReturnValue({ activeSubFilters: {} });
    mockFeaturesListByToggleName['MANUFACTURE_LEAD_TOGGLE'] = true;
    mockFeaturesListByToggleName['BRAND_PARTICIPATION_TOGGLE'] = true;
    mockFeaturesListByToggleName['USA_ALERT_TOGGLE'] = false;
    mockFeaturesListByToggleName['AI_SUMMARY_LEAD_TOGGLE'] = false;
    mockTogglesReady = true;
  });

  describe('Component Structure', () => {
    it('renders BasicContainer', () => {
      render(<LeadTheCategory />);

      expect(screen.getByTestId('basic-container')).toBeInTheDocument();
    });

    it('renders LeadTheCategoryContainer', () => {
      render(<LeadTheCategory />);

      expect(
        screen.getByTestId('lead-the-category-container'),
      ).toBeInTheDocument();
    });

    it('renders CountryFlag in rightContent', () => {
      render(<LeadTheCategory />);

      expect(screen.getByTestId('country-flag')).toBeInTheDocument();
    });
  });

  describe('Data Refresh Integration', () => {
    it('calls useDataRefreshForTab with correct tab name', () => {
      render(<LeadTheCategory />);

      expect(useDataRefreshForTab).toHaveBeenCalledWith(
        'POS Book - Lead the Category',
      );
    });

    it('renders Tag with lastDataRefresh when available', () => {
      render(<LeadTheCategory />);

      const tag = screen.getByTestId('tag');
      expect(tag).toBeInTheDocument();
      expect(tag).toHaveAttribute('data-text', ': 2025-01-15');
      expect(screen.getByTestId('calendar-clock-icon')).toBeInTheDocument();
    });

    it('does not render Tag when lastDataRefresh is not available', () => {
      (useLastDataRefresh as jest.Mock).mockReturnValue({
        lastDataRefreshKpisDate: { pos: null },
      });

      render(<LeadTheCategory />);

      expect(screen.queryByTestId('tag')).not.toBeInTheDocument();
    });

    it('does not render Tag when pos_periods is not available', () => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        applied: { pos_periods: null },
      });

      render(<LeadTheCategory />);

      expect(screen.queryByTestId('tag')).not.toBeInTheDocument();
    });
  });

  describe('Header Configuration', () => {
    it('renders header with correct title id', () => {
      render(<LeadTheCategory />);

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'Category.POSBook.LeadTheCategory.title',
      });
    });

    it('renders header with correct title size', () => {
      render(<LeadTheCategory />);

      const titleSize = screen.getByTestId('header-title-size');
      expect(titleSize).toHaveTextContent('H2');
    });

    it('renders tooltip with correct id', () => {
      render(<LeadTheCategory />);

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'Category.POSBook.LeadTheCategory.tooltip',
      });
    });

    it('renders tooltip component with correct size', () => {
      render(<LeadTheCategory />);

      const tooltip = screen.getByTestId('styled-tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveAttribute('data-size', 'small');
    });
  });

  describe('Feature Toggles - Sections', () => {
    it('requests all Lead The Category feature toggles', () => {
      render(<LeadTheCategory />);

      expect(useMultiplesFeatureToggles).toHaveBeenCalledWith([
        'MANUFACTURE_LEAD_TOGGLE',
        'BRAND_PARTICIPATION_TOGGLE',
        'AI_SUMMARY_LEAD_TOGGLE',
        'USA_ALERT_TOGGLE',
      ]);
    });

    it('renders Manufacture when toggle is enabled', () => {
      mockFeaturesListByToggleName['MANUFACTURE_LEAD_TOGGLE'] = true;

      render(<LeadTheCategory />);

      expect(screen.getByTestId('manufacture')).toBeInTheDocument();
    });

    it('does not render Manufacture when toggle is disabled', () => {
      mockFeaturesListByToggleName['MANUFACTURE_LEAD_TOGGLE'] = false;

      render(<LeadTheCategory />);

      expect(screen.queryByTestId('manufacture')).not.toBeInTheDocument();
    });

    it('renders BrandParticipation when toggle is enabled', () => {
      mockFeaturesListByToggleName['BRAND_PARTICIPATION_TOGGLE'] = true;

      render(<LeadTheCategory />);

      expect(screen.getByTestId('brand-participation')).toBeInTheDocument();
    });

    it('does not render BrandParticipation when toggle is disabled', () => {
      mockFeaturesListByToggleName['BRAND_PARTICIPATION_TOGGLE'] = false;

      render(<LeadTheCategory />);

      expect(
        screen.queryByTestId('brand-participation'),
      ).not.toBeInTheDocument();
    });

    it('renders both sections when both toggles are enabled', () => {
      mockFeaturesListByToggleName['MANUFACTURE_LEAD_TOGGLE'] = true;
      mockFeaturesListByToggleName['BRAND_PARTICIPATION_TOGGLE'] = true;

      render(<LeadTheCategory />);

      expect(screen.getByTestId('manufacture')).toBeInTheDocument();
      expect(screen.getByTestId('brand-participation')).toBeInTheDocument();
    });

    it('renders neither section when both toggles are disabled', () => {
      mockFeaturesListByToggleName['MANUFACTURE_LEAD_TOGGLE'] = false;
      mockFeaturesListByToggleName['BRAND_PARTICIPATION_TOGGLE'] = false;

      render(<LeadTheCategory />);

      expect(screen.queryByTestId('manufacture')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('brand-participation'),
      ).not.toBeInTheDocument();
    });

    it('handles mixed toggle states', () => {
      mockFeaturesListByToggleName['MANUFACTURE_LEAD_TOGGLE'] = true;
      mockFeaturesListByToggleName['BRAND_PARTICIPATION_TOGGLE'] = false;

      render(<LeadTheCategory />);

      expect(screen.getByTestId('manufacture')).toBeInTheDocument();
      expect(
        screen.queryByTestId('brand-participation'),
      ).not.toBeInTheDocument();
    });
  });

  describe('USA Alert Feature Toggle', () => {
    it('does not render Alert when feature toggle is disabled', () => {
      mockFeaturesListByToggleName['USA_ALERT_TOGGLE'] = false;

      render(<LeadTheCategory />);

      expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
    });

    it('does not render Alert when toggles are not ready', () => {
      mockFeaturesListByToggleName['USA_ALERT_TOGGLE'] = true;
      mockTogglesReady = false;

      render(<LeadTheCategory />);

      expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
    });

    it('renders Alert when feature toggle is enabled and toggles are ready', () => {
      mockFeaturesListByToggleName['USA_ALERT_TOGGLE'] = true;
      mockTogglesReady = true;

      render(<LeadTheCategory />);

      const alert = screen.getByTestId('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute('data-type', 'warning');
    });

    it('renders Alert with correct title when enabled', () => {
      mockFeaturesListByToggleName['USA_ALERT_TOGGLE'] = true;
      mockTogglesReady = true;

      render(<LeadTheCategory />);

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'Category.POSBook.USA.alert.title',
      });
      expect(screen.getByTestId('alert-title')).toHaveTextContent(
        'Category.POSBook.USA.alert.title',
      );
    });

    it('renders Alert with correct message when enabled', () => {
      mockFeaturesListByToggleName['USA_ALERT_TOGGLE'] = true;
      mockTogglesReady = true;

      render(<LeadTheCategory />);

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'Category.POSBook.USA.alert.message',
      });
      expect(screen.getByTestId('alert-message')).toHaveTextContent(
        'Category.POSBook.USA.alert.message',
      );
    });
  });

  describe('AI Summary Feature Toggle', () => {
    it('does not render AISummary when feature toggle is disabled', () => {
      mockFeaturesListByToggleName['AI_SUMMARY_LEAD_TOGGLE'] = false;
      mockTogglesReady = true;

      render(<LeadTheCategory dataTestId="lead" />);

      expect(screen.queryByTestId('ai-summary-lead')).not.toBeInTheDocument();
    });

    it('does not render AISummary when toggles are not ready', () => {
      mockFeaturesListByToggleName['AI_SUMMARY_LEAD_TOGGLE'] = true;
      mockTogglesReady = false;

      render(<LeadTheCategory dataTestId="lead" />);

      expect(screen.queryByTestId('ai-summary-lead')).not.toBeInTheDocument();
    });

    it('does not render AISummary when toggle is disabled and toggles are not ready', () => {
      mockFeaturesListByToggleName['AI_SUMMARY_LEAD_TOGGLE'] = false;
      mockTogglesReady = false;

      render(<LeadTheCategory dataTestId="lead" />);

      expect(screen.queryByTestId('ai-summary-lead')).not.toBeInTheDocument();
    });

    it('renders AISummary when feature toggle is enabled and toggles are ready', () => {
      mockFeaturesListByToggleName['AI_SUMMARY_LEAD_TOGGLE'] = true;
      mockTogglesReady = true;

      render(<LeadTheCategory dataTestId="lead" />);

      const aiSummary = screen.getByTestId('ai-summary-lead');
      expect(aiSummary).toBeInTheDocument();
    });

    it('renders AISummary with correct pageName prop', () => {
      mockFeaturesListByToggleName['AI_SUMMARY_LEAD_TOGGLE'] = true;
      mockTogglesReady = true;

      render(<LeadTheCategory dataTestId="lead" />);

      const aiSummary = screen.getByTestId('ai-summary-lead');
      expect(aiSummary).toHaveAttribute('data-page-name', 'POS_BOOK');
    });

    it('renders AISummary with correct kpiGroup prop', () => {
      mockFeaturesListByToggleName['AI_SUMMARY_LEAD_TOGGLE'] = true;
      mockTogglesReady = true;

      render(<LeadTheCategory dataTestId="lead" />);

      const aiSummary = screen.getByTestId('ai-summary-lead');
      expect(aiSummary).toHaveAttribute('data-kpi-group', 'pos');
    });

    it('renders AISummary with correct summaryPageIdentifier prop', () => {
      mockFeaturesListByToggleName['AI_SUMMARY_LEAD_TOGGLE'] = true;
      mockTogglesReady = true;

      render(<LeadTheCategory dataTestId="lead" />);

      expect(screen.getByTestId('ai-summary-lead')).toHaveAttribute(
        'data-summary-page-identifier',
        '1. Category; POS Book; Lead the Category',
      );
    });

    it('passes cohort and manufacture price segment to AISummary subFilters', () => {
      (useSubFilters as jest.Mock).mockReturnValue({
        activeSubFilters: {
          'price-segments-manufacture': 'Premium',
          cohorts: 'Gold',
        },
      });
      mockFeaturesListByToggleName['AI_SUMMARY_LEAD_TOGGLE'] = true;
      mockTogglesReady = true;

      render(<LeadTheCategory dataTestId="lead" />);

      expect(screen.getByTestId('ai-summary-lead')).toHaveAttribute(
        'data-sub-filters',
        JSON.stringify({ price_segment: 'Premium', cohort: 'Gold' }),
      );
    });

    it('passes empty subFilters to AISummary when required subfilters are incomplete', () => {
      (useSubFilters as jest.Mock).mockReturnValue({
        activeSubFilters: {
          'price-segments-manufacture': 'Premium',
        },
      });
      mockFeaturesListByToggleName['AI_SUMMARY_LEAD_TOGGLE'] = true;
      mockTogglesReady = true;

      render(<LeadTheCategory dataTestId="lead" />);

      expect(screen.getByTestId('ai-summary-lead')).toHaveAttribute(
        'data-sub-filters',
        JSON.stringify({}),
      );
    });

    it('renders AISummary with correct data-testid when dataTestId is provided', () => {
      mockFeaturesListByToggleName['AI_SUMMARY_LEAD_TOGGLE'] = true;
      mockTogglesReady = true;

      render(<LeadTheCategory dataTestId="lead" />);

      expect(screen.getByTestId('ai-summary-lead')).toBeInTheDocument();
    });

    it('renders AISummary container with correct data-testid', () => {
      mockFeaturesListByToggleName['AI_SUMMARY_LEAD_TOGGLE'] = true;
      mockTogglesReady = true;

      render(<LeadTheCategory dataTestId="lead" />);

      expect(
        screen.getByTestId('ai-summary-container-lead'),
      ).toBeInTheDocument();
    });

    it('does not render AISummary container data-testid when feature is disabled', () => {
      mockFeaturesListByToggleName['AI_SUMMARY_LEAD_TOGGLE'] = false;
      mockTogglesReady = true;

      render(<LeadTheCategory dataTestId="lead" />);

      expect(
        screen.queryByTestId('ai-summary-container-lead'),
      ).not.toBeInTheDocument();
    });

    it('renders both AISummary and USA Alert when both toggles are enabled', () => {
      mockFeaturesListByToggleName['AI_SUMMARY_LEAD_TOGGLE'] = true;
      mockFeaturesListByToggleName['USA_ALERT_TOGGLE'] = true;
      mockTogglesReady = true;

      render(<LeadTheCategory dataTestId="lead" />);

      expect(screen.getByTestId('ai-summary-lead')).toBeInTheDocument();
      expect(screen.getByTestId('lead-usa-alert')).toBeInTheDocument();
    });

    it('renders only AISummary when USA Alert toggle is disabled', () => {
      mockFeaturesListByToggleName['AI_SUMMARY_LEAD_TOGGLE'] = true;
      mockFeaturesListByToggleName['USA_ALERT_TOGGLE'] = false;
      mockTogglesReady = true;

      render(<LeadTheCategory dataTestId="lead" />);

      expect(screen.getByTestId('ai-summary-lead')).toBeInTheDocument();
      expect(screen.queryByTestId('lead-usa-alert')).not.toBeInTheDocument();
    });

    it('renders only USA Alert when AI Summary toggle is disabled', () => {
      mockFeaturesListByToggleName['AI_SUMMARY_LEAD_TOGGLE'] = false;
      mockFeaturesListByToggleName['USA_ALERT_TOGGLE'] = true;
      mockTogglesReady = true;

      render(<LeadTheCategory dataTestId="lead" />);

      expect(screen.queryByTestId('ai-summary-lead')).not.toBeInTheDocument();
      expect(screen.getByTestId('lead-usa-alert')).toBeInTheDocument();
    });

    it('renders neither AISummary nor USA Alert when both toggles are disabled', () => {
      mockFeaturesListByToggleName['AI_SUMMARY_LEAD_TOGGLE'] = false;
      mockFeaturesListByToggleName['USA_ALERT_TOGGLE'] = false;
      mockTogglesReady = true;

      render(<LeadTheCategory dataTestId="lead" />);

      expect(screen.queryByTestId('ai-summary-lead')).not.toBeInTheDocument();
      expect(screen.queryByTestId('lead-usa-alert')).not.toBeInTheDocument();
    });

    it('renders neither AISummary nor USA Alert when both toggles are enabled but not ready', () => {
      mockFeaturesListByToggleName['AI_SUMMARY_LEAD_TOGGLE'] = true;
      mockFeaturesListByToggleName['USA_ALERT_TOGGLE'] = true;
      mockTogglesReady = false;

      render(<LeadTheCategory dataTestId="lead" />);

      expect(screen.queryByTestId('ai-summary-lead')).not.toBeInTheDocument();
      expect(screen.queryByTestId('lead-usa-alert')).not.toBeInTheDocument();
    });

    it('AISummary is inside BasicContainer', () => {
      mockFeaturesListByToggleName['AI_SUMMARY_LEAD_TOGGLE'] = true;
      mockTogglesReady = true;

      render(<LeadTheCategory dataTestId="lead" />);

      const basicContainer = screen.getByTestId('lead');
      const aiSummaryContainer = screen.getByTestId(
        'ai-summary-container-lead',
      );

      expect(basicContainer).toContainElement(aiSummaryContainer);
    });
  });

  describe('Component Props', () => {
    it('passes formatMessage to Manufacture', () => {
      mockFeaturesListByToggleName['MANUFACTURE_LEAD_TOGGLE'] = true;

      render(<LeadTheCategory />);

      expect(screen.getByTestId('manufacture')).toBeInTheDocument();
    });

    it('passes vsLastYearDataRefresh to Manufacture', () => {
      mockFeaturesListByToggleName['MANUFACTURE_LEAD_TOGGLE'] = true;

      render(<LeadTheCategory />);

      const manufacture = screen.getByTestId('manufacture');
      expect(manufacture).toHaveAttribute(
        'data-last-data-refresh',
        'vs LY: 2025-01-15',
      );
    });

    it('passes formatMessage to BrandParticipation', () => {
      mockFeaturesListByToggleName['BRAND_PARTICIPATION_TOGGLE'] = true;

      render(<LeadTheCategory />);

      expect(screen.getByTestId('brand-participation')).toBeInTheDocument();
    });

    it('passes vsLastYearDataRefresh to BrandParticipation', () => {
      mockFeaturesListByToggleName['BRAND_PARTICIPATION_TOGGLE'] = true;

      render(<LeadTheCategory />);

      const brandParticipation = screen.getByTestId('brand-participation');
      expect(brandParticipation).toHaveAttribute(
        'data-last-data-refresh',
        'vs LY: 2025-01-15',
      );
    });
  });

  describe('Component Hierarchy', () => {
    it('Manufacture is inside LeadTheCategoryContainer', () => {
      mockFeaturesListByToggleName['MANUFACTURE_LEAD_TOGGLE'] = true;

      render(<LeadTheCategory />);

      const container = screen.getByTestId('lead-the-category-container');
      const manufacture = screen.getByTestId('manufacture');

      expect(container).toContainElement(manufacture);
    });

    it('BrandParticipation is inside LeadTheCategoryContainer', () => {
      mockFeaturesListByToggleName['BRAND_PARTICIPATION_TOGGLE'] = true;

      render(<LeadTheCategory />);

      const container = screen.getByTestId('lead-the-category-container');
      const brandParticipation = screen.getByTestId('brand-participation');

      expect(container).toContainElement(brandParticipation);
    });

    it('LeadTheCategoryContainer is inside BasicContainer', () => {
      render(<LeadTheCategory />);

      const basicContainer = screen.getByTestId('basic-container');
      const leadContainer = screen.getByTestId('lead-the-category-container');

      expect(basicContainer).toContainElement(leadContainer);
    });
  });

  describe('Component Stability', () => {
    it('renders consistently across multiple renders', () => {
      const { rerender } = render(<LeadTheCategory />);

      expect(screen.getByTestId('basic-container')).toBeInTheDocument();
      expect(
        screen.getByTestId('lead-the-category-container'),
      ).toBeInTheDocument();

      rerender(<LeadTheCategory />);

      expect(screen.getByTestId('basic-container')).toBeInTheDocument();
      expect(
        screen.getByTestId('lead-the-category-container'),
      ).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles null vsLastYearDataRefresh gracefully', () => {
      (useLastDataRefresh as jest.Mock).mockReturnValue({
        lastDataRefreshKpisDate: { pos: null },
      });
      mockFeaturesListByToggleName['MANUFACTURE_LEAD_TOGGLE'] = true;
      mockFeaturesListByToggleName['BRAND_PARTICIPATION_TOGGLE'] = true;

      render(<LeadTheCategory />);

      expect(screen.getByTestId('manufacture')).toHaveAttribute(
        'data-last-data-refresh',
        '',
      );
      expect(screen.getByTestId('brand-participation')).toHaveAttribute(
        'data-last-data-refresh',
        '',
      );
    });

    it('handles undefined toggle values', () => {
      mockFeaturesListByToggleName['MANUFACTURE_LEAD_TOGGLE'] =
        undefined as any;
      mockFeaturesListByToggleName['BRAND_PARTICIPATION_TOGGLE'] =
        undefined as any;

      render(<LeadTheCategory />);

      expect(screen.queryByTestId('manufacture')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('brand-participation'),
      ).not.toBeInTheDocument();
    });

    it('LeadTheCategoryContainer renders even when empty', () => {
      mockFeaturesListByToggleName['MANUFACTURE_LEAD_TOGGLE'] = false;
      mockFeaturesListByToggleName['BRAND_PARTICIPATION_TOGGLE'] = false;

      render(<LeadTheCategory />);

      const container = screen.getByTestId('lead-the-category-container');
      expect(container).toBeInTheDocument();
      expect(container.textContent).toBe('');
    });
  });

  describe('data-testid Implementation', () => {
    beforeEach(() => {
      mockFeaturesListByToggleName['MANUFACTURE_LEAD_TOGGLE'] = true;
      mockFeaturesListByToggleName['BRAND_PARTICIPATION_TOGGLE'] = true;
    });

    describe('dataTestId prop', () => {
      it('accepts dataTestId as optional prop', () => {
        render(<LeadTheCategory dataTestId="lead-category-test" />);

        expect(screen.getByTestId('lead-category-test')).toBeInTheDocument();
      });

      it('renders without dataTestId prop', () => {
        render(<LeadTheCategory />);

        expect(screen.getByTestId('basic-container')).toBeInTheDocument();
        expect(screen.queryByTestId('lead-category-')).not.toBeInTheDocument();
      });

      it('does not render data-testid when dataTestId is undefined', () => {
        render(<LeadTheCategory dataTestId={undefined} />);

        expect(screen.getByTestId('basic-container')).toBeInTheDocument();
        expect(screen.queryByTestId('lead-category-')).not.toBeInTheDocument();
      });

      it('does not render data-testid when dataTestId is empty string', () => {
        render(<LeadTheCategory dataTestId="" />);

        expect(screen.getByTestId('basic-container')).toBeInTheDocument();
        expect(screen.queryByTestId('lead-category-')).not.toBeInTheDocument();
      });
    });

    describe('BasicContainer data-testid', () => {
      it('propagates dataTestId directly to BasicContainer', () => {
        render(<LeadTheCategory dataTestId="container-test" />);

        expect(screen.getByTestId('container-test')).toBeInTheDocument();
      });

      it('does not propagate dataTestId when not provided', () => {
        render(<LeadTheCategory />);

        expect(screen.getByTestId('basic-container')).toBeInTheDocument();
      });
    });

    describe('StyledTooltip data-testid', () => {
      it('applies correct data-testid to StyledTooltip', () => {
        render(<LeadTheCategory dataTestId="tooltip-test" />);

        expect(screen.getByTestId('tooltip-tooltip-test')).toBeInTheDocument();
      });

      it('uses tooltip- prefix', () => {
        render(<LeadTheCategory dataTestId="my-tooltip" />);

        const tooltip = screen.getByTestId('tooltip-my-tooltip');
        expect(tooltip).toBeInTheDocument();
      });

      it('does not apply data-testid when dataTestId is not provided', () => {
        render(<LeadTheCategory />);

        expect(screen.getByTestId('styled-tooltip')).toBeInTheDocument();
      });
    });

    describe('Tag data-testid', () => {
      it('applies correct data-testid to Tag when lastDataRefresh exists', () => {
        render(<LeadTheCategory dataTestId="tag-test" />);

        expect(screen.getByTestId('tag-test-last-refresh')).toBeInTheDocument();
      });

      it('does not render Tag when lastDataRefresh is null', () => {
        (useLastDataRefresh as jest.Mock).mockReturnValue({
          lastDataRefreshKpisDate: { pos: null },
        });

        render(<LeadTheCategory dataTestId="no-tag" />);

        expect(
          screen.queryByTestId('no-tag-last-refresh'),
        ).not.toBeInTheDocument();
      });

      it('does not apply data-testid to Tag when dataTestId is not provided', () => {
        render(<LeadTheCategory />);

        expect(screen.getByTestId('tag')).toBeInTheDocument();
      });
    });

    describe('Alert data-testid', () => {
      beforeEach(() => {
        mockFeaturesListByToggleName['USA_ALERT_TOGGLE'] = true;
        mockTogglesReady = true;
      });

      it('applies correct data-testid to Alert when USA alert is enabled', () => {
        render(<LeadTheCategory dataTestId="alert-test" />);

        expect(screen.getByTestId('alert-test-usa-alert')).toBeInTheDocument();
      });

      it('applies correct data-testid to alert container', () => {
        render(<LeadTheCategory dataTestId="container-alert-test" />);

        expect(
          screen.getByTestId('alert-container-container-alert-test'),
        ).toBeInTheDocument();
      });

      it('does not render Alert when feature toggle is disabled', () => {
        mockFeaturesListByToggleName['USA_ALERT_TOGGLE'] = false;

        render(<LeadTheCategory dataTestId="no-alert" />);

        expect(
          screen.queryByTestId('no-alert-usa-alert'),
        ).not.toBeInTheDocument();
      });

      it('does not apply data-testid when dataTestId is not provided', () => {
        render(<LeadTheCategory />);

        expect(screen.getByTestId('alert')).toBeInTheDocument();
      });
    });

    describe('LeadTheCategoryContainer data-testid', () => {
      it('applies correct data-testid to LeadTheCategoryContainer', () => {
        render(<LeadTheCategory dataTestId="container-test" />);

        expect(
          screen.getByTestId('container-container-test'),
        ).toBeInTheDocument();
      });

      it('uses container- prefix', () => {
        render(<LeadTheCategory dataTestId="my-container" />);

        const container = screen.getByTestId('container-my-container');
        expect(container).toBeInTheDocument();
      });

      it('does not apply data-testid when dataTestId is not provided', () => {
        render(<LeadTheCategory />);

        expect(
          screen.getByTestId('lead-the-category-container'),
        ).toBeInTheDocument();
      });
    });

    describe('Child components data-testid propagation', () => {
      it('propagates dataTestId to Manufacture with suffix', () => {
        render(<LeadTheCategory dataTestId="child-test" />);

        expect(
          screen.getByTestId('child-test-manufacture'),
        ).toBeInTheDocument();
      });

      it('propagates dataTestId to BrandParticipation with suffix', () => {
        render(<LeadTheCategory dataTestId="child-test" />);

        expect(
          screen.getByTestId('child-test-brand-participation'),
        ).toBeInTheDocument();
      });

      it('does not propagate dataTestId to children when not provided', () => {
        render(<LeadTheCategory />);

        expect(screen.getByTestId('manufacture')).toBeInTheDocument();
        expect(screen.getByTestId('brand-participation')).toBeInTheDocument();
      });
    });

    describe('dataTestId hierarchy validation', () => {
      it('renders all data-testids in correct hierarchy', () => {
        render(<LeadTheCategory dataTestId="hierarchy-test" />);

        const basicContainer = screen.getByTestId('hierarchy-test');
        const leadContainer = screen.getByTestId('container-hierarchy-test');
        const manufacture = screen.getByTestId('hierarchy-test-manufacture');
        const brandParticipation = screen.getByTestId(
          'hierarchy-test-brand-participation',
        );

        expect(basicContainer).toContainElement(leadContainer);
        expect(leadContainer).toContainElement(manufacture);
        expect(leadContainer).toContainElement(brandParticipation);
      });

      it('maintains hierarchy with USA alert', () => {
        mockFeaturesListByToggleName['USA_ALERT_TOGGLE'] = true;
        mockTogglesReady = true;

        render(<LeadTheCategory dataTestId="alert-hierarchy" />);

        const basicContainer = screen.getByTestId('alert-hierarchy');
        const alertContainer = screen.getByTestId(
          'alert-container-alert-hierarchy',
        );
        const alert = screen.getByTestId('alert-hierarchy-usa-alert');

        expect(basicContainer).toContainElement(alertContainer);
        expect(alertContainer).toContainElement(alert);
      });
    });

    describe('dataTestId with feature toggles', () => {
      it('maintains dataTestId when Manufacture is disabled', () => {
        mockFeaturesListByToggleName['MANUFACTURE_LEAD_TOGGLE'] = false;

        render(<LeadTheCategory dataTestId="no-manufacture" />);

        expect(screen.getByTestId('no-manufacture')).toBeInTheDocument();
        expect(
          screen.queryByTestId('no-manufacture-manufacture'),
        ).not.toBeInTheDocument();
      });

      it('maintains dataTestId when BrandParticipation is disabled', () => {
        mockFeaturesListByToggleName['BRAND_PARTICIPATION_TOGGLE'] = false;

        render(<LeadTheCategory dataTestId="no-brand" />);

        expect(screen.getByTestId('no-brand')).toBeInTheDocument();
        expect(
          screen.queryByTestId('no-brand-brand-participation'),
        ).not.toBeInTheDocument();
      });

      it('maintains dataTestId when both sections are disabled', () => {
        mockFeaturesListByToggleName['MANUFACTURE_LEAD_TOGGLE'] = false;
        mockFeaturesListByToggleName['BRAND_PARTICIPATION_TOGGLE'] = false;

        render(<LeadTheCategory dataTestId="empty-container" />);

        expect(screen.getByTestId('empty-container')).toBeInTheDocument();
        const container = screen.getByTestId('container-empty-container');
        expect(container.textContent).toBe('');
      });
    });
  });
});
