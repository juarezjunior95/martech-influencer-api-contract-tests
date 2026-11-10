import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getAssetHostForServices } from 'config/api';
import { useLastDataRefresh } from 'contexts';
import { useDataRefreshForTab } from 'contexts/DataRefreshModal/useDataRefreshForTab';
import { useFeatureToggle, usePageFilterApplied, useSubFilters } from 'hooks';

import { GrowTheCategory } from './GrowTheCategory';

const mockFormatMessage = jest.fn(({ id }: { id: string }) => id);
const mockLastDataRefreshKpisFormated = {
  pos: {
    'Last 4 Weeks': '2025-01-15',
    'Last 13 Weeks': '2025-01-10',
  },
};
const mockApplied = {
  pos_periods: 'Last 4 Weeks',
};

const mockGetCountry = jest.fn();

jest.mock('services', () => ({
  ImagesService: {
    getInstance: jest.fn(() => ({
      getCountry: (...args: unknown[]) => mockGetCountry(...args),
    })),
  },
}));

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: mockFormatMessage,
  }),
}));

jest.mock('contexts', () => ({
  useLastDataRefresh: jest.fn(() => ({
    lastDataRefreshKpisFormated: mockLastDataRefreshKpisFormated,
  })),
}));

jest.mock('contexts/DataRefreshModal/useDataRefreshForTab', () => ({
  useDataRefreshForTab: jest.fn(),
}));

jest.mock('hooks', () => ({
  usePageFilterApplied: jest.fn(() => ({
    applied: mockApplied,
  })),
  useFeatureToggle: jest.fn(() => [false, false]),
  useSubFilters: jest.fn(() => ({
    activeSubFilters: {},
  })),
}));

jest.mock('@hexa-ui/components', () => ({
  SegmentedControl: ({
    options,
    onValueChange,
    value,
  }: {
    options: Array<{ label: string; value: string }>;
    onValueChange: (value: string) => void;
    value: string;
  }) => (
    <div data-testid="segmented-control" data-value={value}>
      {options.map((option) => (
        <button
          key={option.value}
          data-testid={`option-${option.value}`}
          onClick={() => onValueChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  ),
}));

jest.mock('@hexa-ui/icons2', () => ({
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
  }: {
    children: React.ReactNode;
    size: string;
  }) => (
    <div data-testid="styled-tooltip" data-size={size}>
      {children}
    </div>
  ),
  StyledFlag: ({ src, alt }: { src: string; alt: string }) => (
    <img data-testid="styled-flag" src={src} alt={alt} />
  ),
}));

jest.mock('./components', () => ({
  ParticipationTable: ({
    selectedView,
    hasPosKpi,
    dataTestId,
  }: {
    selectedView: string;
    hasPosKpi: boolean;
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId || 'participation-table'}
      data-selected-view={selectedView}
      data-has-pos-kpi={String(hasPosKpi)}
    />
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
}));

jest.mock('config/featureToggle', () => ({
  featureToggles: {
    pillar: {
      category: {
        submenus: {
          posBook: {
            usaAlert: 'USA_ALERT_TOGGLE',
            tab: {
              growCategory: {
                aiSummary: 'AI_SUMMARY_GROW_CATEGORY_TOGGLE',
              },
            },
          },
        },
      },
    },
  },
}));

jest.mock('pages/components/AISummary', () => ({
  AISummary: ({
    pageName,
    dataTestId,
    kpiGroup,
    summaryPageIdentifier,
    subFilters,
  }: any) => (
    <div
      data-testid="ai-summary"
      data-page-name={pageName}
      data-kpi-group={kpiGroup}
      data-data-test-id={dataTestId}
      data-summary-page-identifier={summaryPageIdentifier}
      data-sub-filters={JSON.stringify(subFilters)}
    />
  ),
}));

jest.mock('pages/constants', () => ({
  AI_SUMMARY_PAGE_IDENTIFIERS: {
    GROW_THE_CATEGORY: '1. Category; POS Book; Grow the category',
  },
}));

jest.mock('./constants', () => ({
  POS_KPI_KEY: 'pos_kpi',
  COHORTS_KEY: 'cohorts-grow',
}));

describe('GrowTheCategory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCountry.mockImplementation(({ name }: { name: string }) =>
      Promise.resolve({
        data: {
          url: `${getAssetHostForServices()}/countries/rounded_flags/${name}.png`,
        },
      }),
    );
    (useLastDataRefresh as jest.Mock).mockReturnValue({
      lastDataRefreshKpisFormated: mockLastDataRefreshKpisFormated,
    });
    (usePageFilterApplied as jest.Mock).mockReturnValue({
      applied: mockApplied,
    });
    (useFeatureToggle as jest.Mock).mockReturnValue([false, false]);
    (useSubFilters as jest.Mock).mockReturnValue({
      activeSubFilters: {},
    });
  });

  describe('component structure', () => {
    it('renders BasicContainer', () => {
      render(<GrowTheCategory />);

      expect(screen.getByTestId('basic-container')).toBeInTheDocument();
    });

    it('renders ParticipationTable with default country view', () => {
      render(<GrowTheCategory />);

      const table = screen.getByTestId('participation-table');
      expect(table).toBeInTheDocument();
      expect(table).toHaveAttribute('data-selected-view', 'country');
      expect(table).toHaveAttribute('data-has-pos-kpi', 'true');
    });

    it('renders SegmentedControl with correct options', () => {
      render(<GrowTheCategory />);

      expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
      expect(screen.getByTestId('option-country')).toHaveTextContent('Country');
      expect(screen.getByTestId('option-maturity-zone')).toHaveTextContent(
        'Zone/Maturity',
      );
      expect(screen.getByTestId('option-cohort')).toHaveTextContent('Cohort');
    });
  });

  describe('data refresh integration', () => {
    it('calls useDataRefreshForTab with correct tab name', () => {
      render(<GrowTheCategory />);

      expect(useDataRefreshForTab).toHaveBeenCalledWith(
        'POS Book - Grow the Category',
      );
    });

    it('renders Tag with lastDataRefresh when available', () => {
      render(<GrowTheCategory />);

      const tag = screen.getByTestId('tag');
      expect(tag).toBeInTheDocument();
      expect(tag).toHaveAttribute('data-text', ': 2025-01-15');
      expect(screen.getByTestId('calendar-clock-icon')).toBeInTheDocument();
    });

    it('does not render Tag when lastDataRefresh is not available', () => {
      (useLastDataRefresh as jest.Mock).mockReturnValue({
        lastDataRefreshKpisFormated: { pos: null },
      });

      render(<GrowTheCategory />);

      expect(screen.queryByTestId('tag')).not.toBeInTheDocument();
    });

    it('does not render Tag when pos_periods is not available', () => {
      (usePageFilterApplied as jest.Mock).mockReturnValue({
        applied: { pos_periods: null },
      });

      render(<GrowTheCategory />);

      expect(screen.queryByTestId('tag')).not.toBeInTheDocument();
    });
  });

  describe('header configuration', () => {
    it('renders header with correct title id', () => {
      render(<GrowTheCategory />);

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'Category.POSBook.GrowTheCategory.title',
      });
    });

    it('renders header with correct title size', () => {
      render(<GrowTheCategory />);

      const titleSize = screen.getByTestId('header-title-size');
      expect(titleSize).toHaveTextContent('H2');
    });

    it('renders tooltip with correct id', () => {
      render(<GrowTheCategory />);

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'Category.POSBook.GrowTheCategory.tooltip',
      });
    });

    it('renders tooltip component with correct size', () => {
      render(<GrowTheCategory />);

      const tooltip = screen.getByTestId('styled-tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveAttribute('data-size', 'small');
    });
  });

  describe('view selection state management', () => {
    it('initializes with country view', () => {
      render(<GrowTheCategory />);

      const segmentedControl = screen.getByTestId('segmented-control');
      expect(segmentedControl).toHaveAttribute('data-value', 'country');
    });

    it('updates view when user selects maturity-zone', async () => {
      const user = userEvent.setup();
      render(<GrowTheCategory />);

      const maturityZoneOption = screen.getByTestId('option-maturity-zone');
      await user.click(maturityZoneOption);

      const table = screen.getByTestId('participation-table');
      expect(table).toHaveAttribute('data-selected-view', 'maturity-zone');
    });

    it('updates view when user selects cohort', async () => {
      const user = userEvent.setup();
      render(<GrowTheCategory />);

      const cohortOption = screen.getByTestId('option-cohort');
      await user.click(cohortOption);

      const table = screen.getByTestId('participation-table');
      expect(table).toHaveAttribute('data-selected-view', 'cohort');
    });

    it('updates view back to country', async () => {
      const user = userEvent.setup();
      render(<GrowTheCategory />);

      const cohortOption = screen.getByTestId('option-cohort');
      await user.click(cohortOption);

      const countryOption = screen.getByTestId('option-country');
      await user.click(countryOption);

      const table = screen.getByTestId('participation-table');
      expect(table).toHaveAttribute('data-selected-view', 'country');
    });
  });

  describe('flag display', () => {
    it('renders StyledFlag with ABI flag when view is country', async () => {
      render(<GrowTheCategory />);

      const flag = screen.getByTestId('styled-flag');
      await waitFor(() => {
        expect(flag).toHaveAttribute(
          'src',
          `${getAssetHostForServices()}/countries/rounded_flags/ABI.png`,
        );
      });
      expect(flag).toHaveAttribute('alt', 'ABI');
      expect(screen.queryByTestId('country-flag')).not.toBeInTheDocument();
    });

    it('renders StyledFlag with ABI flag when view is maturity-zone', async () => {
      const user = userEvent.setup();
      render(<GrowTheCategory />);

      const maturityZoneOption = screen.getByTestId('option-maturity-zone');
      await user.click(maturityZoneOption);

      const flag = screen.getByTestId('styled-flag');
      await waitFor(() => {
        expect(flag).toHaveAttribute(
          'src',
          `${getAssetHostForServices()}/countries/rounded_flags/ABI.png`,
        );
      });
      expect(screen.queryByTestId('country-flag')).not.toBeInTheDocument();
    });

    it('renders CountryFlag when view is cohort', async () => {
      const user = userEvent.setup();
      render(<GrowTheCategory />);

      const cohortOption = screen.getByTestId('option-cohort');
      await user.click(cohortOption);

      expect(screen.getByTestId('country-flag')).toBeInTheDocument();
      expect(screen.queryByTestId('styled-flag')).not.toBeInTheDocument();
    });
  });

  describe('USA Alert feature toggle', () => {
    it('does not render Alert when feature toggle is disabled', () => {
      (useFeatureToggle as jest.Mock).mockReturnValue([false, false]);

      render(<GrowTheCategory />);

      expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
    });

    it('does not render Alert when feature toggle is loading', () => {
      (useFeatureToggle as jest.Mock).mockReturnValue([true, true]);

      render(<GrowTheCategory />);

      expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
    });

    it('renders Alert when feature toggle is enabled and not loading', () => {
      (useFeatureToggle as jest.Mock).mockReturnValue([true, false]);

      render(<GrowTheCategory />);

      const alert = screen.getByTestId('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute('data-type', 'warning');
    });

    it('renders Alert with correct title when enabled', () => {
      (useFeatureToggle as jest.Mock).mockReturnValue([true, false]);

      render(<GrowTheCategory />);

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'Category.POSBook.USA.alert.title',
      });
      expect(screen.getByTestId('alert-title')).toHaveTextContent(
        'Category.POSBook.USA.alert.title',
      );
    });

    it('renders Alert with correct message when enabled', () => {
      (useFeatureToggle as jest.Mock).mockReturnValue([true, false]);

      render(<GrowTheCategory />);

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'Category.POSBook.USA.alert.message',
      });
      expect(screen.getByTestId('alert-message')).toHaveTextContent(
        'Category.POSBook.USA.alert.message',
      );
    });
  });

  describe('hooks integration', () => {
    it('calls usePageFilterApplied with correct page name', () => {
      render(<GrowTheCategory />);

      expect(usePageFilterApplied).toHaveBeenCalledWith('POS_BOOK');
    });

    it('calls useFeatureToggle with correct toggle key', () => {
      render(<GrowTheCategory />);

      expect(useFeatureToggle).toHaveBeenCalledWith('USA_ALERT_TOGGLE');
    });
  });

  describe('right content rendering', () => {
    it('renders right content with SegmentedControl and flag', async () => {
      render(<GrowTheCategory />);

      const rightContent = screen.getByTestId('header-right-content');
      expect(rightContent).toBeInTheDocument();
      expect(
        rightContent.querySelector('[data-testid="segmented-control"]'),
      ).toBeInTheDocument();
      await waitFor(() => {
        expect(
          rightContent.querySelector('[data-testid="styled-flag"]'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('data-testid Implementation', () => {
    describe('Without dataTestId prop', () => {
      it('does not render custom data-testid on BasicContainer when dataTestId is not provided', () => {
        render(<GrowTheCategory />);

        expect(screen.getByTestId('basic-container')).toBeInTheDocument();
      });

      it('does not render custom data-testid on ParticipationTable when dataTestId is not provided', () => {
        render(<GrowTheCategory />);

        expect(screen.getByTestId('participation-table')).toBeInTheDocument();
      });

      it('does not render custom data-testid on Tag when dataTestId is not provided', () => {
        render(<GrowTheCategory />);

        expect(screen.getByTestId('tag')).toBeInTheDocument();
      });

      it('does not render custom data-testid on Alert when feature is disabled', () => {
        (useFeatureToggle as jest.Mock).mockReturnValue([false, false]);

        render(<GrowTheCategory />);

        expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
      });
    });

    describe('With dataTestId prop', () => {
      it('renders data-testid on BasicContainer', () => {
        render(<GrowTheCategory dataTestId="grow" />);

        const elements = screen.getAllByTestId('grow');
        expect(elements.length).toBeGreaterThanOrEqual(1);
      });

      it('renders data-testid on StyledHeaderRightContent with correct prefix', () => {
        render(<GrowTheCategory dataTestId="grow" />);

        expect(
          screen.getByTestId('header-right-content-grow'),
        ).toBeInTheDocument();
      });

      it('renders data-testid on Tag with correct suffix', () => {
        render(<GrowTheCategory dataTestId="grow" />);

        expect(screen.getByTestId('grow-last-refresh')).toBeInTheDocument();
      });

      it('renders data-testid on ParticipationTable', () => {
        render(<GrowTheCategory dataTestId="grow" />);

        const elements = screen.getAllByTestId('grow');
        const table = elements.find(
          (el) => el.dataset.selectedView === 'country',
        );
        expect(table).toBeDefined();
      });

      it('renders data-testid on Alert container when feature is enabled', () => {
        (useFeatureToggle as jest.Mock).mockReturnValue([true, false]);

        render(<GrowTheCategory dataTestId="grow" />);

        expect(screen.getByTestId('alert-container-grow')).toBeInTheDocument();
      });

      it('renders data-testid on Alert with correct suffix when feature is enabled', () => {
        (useFeatureToggle as jest.Mock).mockReturnValue([true, false]);

        render(<GrowTheCategory dataTestId="grow" />);

        expect(screen.getByTestId('grow-usa-alert')).toBeInTheDocument();
      });

      it('does not render alert container data-testid when feature is disabled', () => {
        (useFeatureToggle as jest.Mock).mockReturnValue([false, false]);

        render(<GrowTheCategory dataTestId="grow" />);

        expect(
          screen.queryByTestId('alert-container-grow'),
        ).not.toBeInTheDocument();
        expect(screen.queryByTestId('grow-usa-alert')).not.toBeInTheDocument();
      });
    });

    describe('dataTestId with empty string', () => {
      it('does not render custom data-testid when dataTestId is empty string', () => {
        render(<GrowTheCategory dataTestId="" />);

        expect(screen.getByTestId('basic-container')).toBeInTheDocument();
        expect(screen.getByTestId('participation-table')).toBeInTheDocument();
      });
    });

    describe('dataTestId propagation', () => {
      it('propagates dataTestId to BasicContainer', () => {
        render(<GrowTheCategory dataTestId="propagation-test" />);

        const elements = screen.getAllByTestId('propagation-test');
        expect(elements.length).toBeGreaterThanOrEqual(1);
      });

      it('propagates dataTestId to ParticipationTable', () => {
        render(<GrowTheCategory dataTestId="propagation-test" />);

        const elements = screen.getAllByTestId('propagation-test');
        const table = elements.find(
          (el) => el.dataset.selectedView === 'country',
        );
        expect(table).toHaveAttribute('data-selected-view', 'country');
        expect(table).toHaveAttribute('data-has-pos-kpi', 'true');
      });

      it('propagates dataTestId to Tag', () => {
        render(<GrowTheCategory dataTestId="propagation-test" />);

        const tag = screen.getByTestId('propagation-test-last-refresh');
        expect(tag).toHaveAttribute('data-text', ': 2025-01-15');
      });

      it('does not create duplicate BasicContainer when dataTestId is provided', () => {
        render(<GrowTheCategory dataTestId="unique" />);

        expect(screen.queryByTestId('basic-container')).not.toBeInTheDocument();
        const elements = screen.getAllByTestId('unique');
        expect(elements.length).toBeGreaterThanOrEqual(1);
      });
    });

    describe('dataTestId with different views', () => {
      it('maintains data-testid when switching to maturity-zone view', async () => {
        const user = userEvent.setup();
        render(<GrowTheCategory dataTestId="grow" />);

        const maturityZoneOption = screen.getByTestId('option-maturity-zone');
        await user.click(maturityZoneOption);

        const elements = screen.getAllByTestId('grow');
        const table = elements.find(
          (el) => el.dataset.selectedView === 'maturity-zone',
        );
        expect(table).toHaveAttribute('data-selected-view', 'maturity-zone');
      });

      it('maintains data-testid when switching to cohort view', async () => {
        const user = userEvent.setup();
        render(<GrowTheCategory dataTestId="grow" />);

        const cohortOption = screen.getByTestId('option-cohort');
        await user.click(cohortOption);

        const elements = screen.getAllByTestId('grow');
        const table = elements.find(
          (el) => el.dataset.selectedView === 'cohort',
        );
        expect(table).toHaveAttribute('data-selected-view', 'cohort');
      });
    });

    describe('dataTestId with feature toggle states', () => {
      it('renders alert with dataTestId when feature is enabled', () => {
        (useFeatureToggle as jest.Mock).mockReturnValue([true, false]);

        render(<GrowTheCategory dataTestId="toggle-test" />);

        expect(
          screen.getByTestId('alert-container-toggle-test'),
        ).toBeInTheDocument();
        expect(screen.getByTestId('toggle-test-usa-alert')).toBeInTheDocument();
      });

      it('does not render alert with dataTestId when feature is loading', () => {
        (useFeatureToggle as jest.Mock).mockReturnValue([true, true]);

        render(<GrowTheCategory dataTestId="toggle-test" />);

        expect(
          screen.queryByTestId('alert-container-toggle-test'),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('toggle-test-usa-alert'),
        ).not.toBeInTheDocument();
      });
    });

    describe('dataTestId without lastDataRefresh', () => {
      it('does not render Tag data-testid when lastDataRefresh is not available', () => {
        (useLastDataRefresh as jest.Mock).mockReturnValue({
          lastDataRefreshKpisFormated: { pos: null },
        });

        render(<GrowTheCategory dataTestId="grow" />);

        expect(
          screen.queryByTestId('grow-last-refresh'),
        ).not.toBeInTheDocument();
      });
    });

    describe('dataTestId preservation on interactions', () => {
      it('preserves dataTestId after view changes', async () => {
        const user = userEvent.setup();
        render(<GrowTheCategory dataTestId="persistent" />);

        const cohortOption = screen.getByTestId('option-cohort');
        await user.click(cohortOption);

        const elementsAfterCohort = screen.getAllByTestId('persistent');
        expect(elementsAfterCohort.length).toBeGreaterThanOrEqual(1);
        expect(
          screen.getByTestId('persistent-last-refresh'),
        ).toBeInTheDocument();

        const countryOption = screen.getByTestId('option-country');
        await user.click(countryOption);

        const elementsAfterCountry = screen.getAllByTestId('persistent');
        expect(elementsAfterCountry.length).toBeGreaterThanOrEqual(1);
        expect(
          screen.getByTestId('persistent-last-refresh'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('AISummary feature toggle', () => {
    const enableAiSummaryOnly = () => {
      (useFeatureToggle as jest.Mock).mockImplementation((toggle: string) => {
        if (toggle === 'AI_SUMMARY_GROW_CATEGORY_TOGGLE') return [true, false];
        return [false, false];
      });
    };

    it('should call useFeatureToggle with the correct toggle name', () => {
      render(<GrowTheCategory />);

      expect(useFeatureToggle).toHaveBeenCalledWith(
        'AI_SUMMARY_GROW_CATEGORY_TOGGLE',
      );
    });

    it('should render AISummary when feature toggle is enabled and not loading', () => {
      enableAiSummaryOnly();

      render(<GrowTheCategory />);

      expect(screen.getByTestId('ai-summary')).toBeInTheDocument();
    });

    it('should not render AISummary when feature toggle is disabled', () => {
      (useFeatureToggle as jest.Mock).mockImplementation((toggle: string) => {
        if (toggle === 'AI_SUMMARY_GROW_CATEGORY_TOGGLE') return [false, false];
        return [false, false];
      });

      render(<GrowTheCategory />);

      expect(screen.queryByTestId('ai-summary')).not.toBeInTheDocument();
    });

    it('should not render AISummary when feature toggle is still loading', () => {
      (useFeatureToggle as jest.Mock).mockImplementation((toggle: string) => {
        if (toggle === 'AI_SUMMARY_GROW_CATEGORY_TOGGLE') return [true, true];
        return [false, false];
      });

      render(<GrowTheCategory />);

      expect(screen.queryByTestId('ai-summary')).not.toBeInTheDocument();
    });

    it('should not render AISummary when feature toggle is undefined (loading)', () => {
      (useFeatureToggle as jest.Mock).mockImplementation((toggle: string) => {
        if (toggle === 'AI_SUMMARY_GROW_CATEGORY_TOGGLE')
          return [undefined, true];
        return [false, false];
      });

      render(<GrowTheCategory />);

      expect(screen.queryByTestId('ai-summary')).not.toBeInTheDocument();
    });

    it('should not render AISummary when feature toggle is disabled and still loading', () => {
      (useFeatureToggle as jest.Mock).mockImplementation((toggle: string) => {
        if (toggle === 'AI_SUMMARY_GROW_CATEGORY_TOGGLE') return [false, true];
        return [false, false];
      });

      render(<GrowTheCategory />);

      expect(screen.queryByTestId('ai-summary')).not.toBeInTheDocument();
    });

    it('should not render AISummary when toggle is undefined and not loading', () => {
      (useFeatureToggle as jest.Mock).mockImplementation((toggle: string) => {
        if (toggle === 'AI_SUMMARY_GROW_CATEGORY_TOGGLE')
          return [undefined, false];
        return [false, false];
      });

      render(<GrowTheCategory />);

      expect(screen.queryByTestId('ai-summary')).not.toBeInTheDocument();
    });

    it('should pass POS_BOOK_PAGE_NAME as pageName to AISummary', () => {
      enableAiSummaryOnly();

      render(<GrowTheCategory />);

      const aiSummary = screen.getByTestId('ai-summary');
      expect(aiSummary).toHaveAttribute('data-page-name', 'POS_BOOK');
    });

    it('should pass kpiGroup="pos" to AISummary', () => {
      enableAiSummaryOnly();

      render(<GrowTheCategory />);

      const aiSummary = screen.getByTestId('ai-summary');
      expect(aiSummary).toHaveAttribute('data-kpi-group', 'pos');
    });

    it('should pass summaryPageIdentifier to AISummary', () => {
      enableAiSummaryOnly();

      render(<GrowTheCategory />);

      const aiSummary = screen.getByTestId('ai-summary');
      expect(aiSummary).toHaveAttribute(
        'data-summary-page-identifier',
        '1. Category; POS Book; Grow the category',
      );
    });

    it('should pass dataTestId to AISummary when provided', () => {
      enableAiSummaryOnly();

      render(<GrowTheCategory dataTestId="grow" />);

      const aiSummary = screen.getByTestId('ai-summary');
      expect(aiSummary).toHaveAttribute('data-data-test-id', 'ai-summary-grow');
    });

    it('should render ai-summary-container with dataTestId when provided', () => {
      enableAiSummaryOnly();

      render(<GrowTheCategory dataTestId="grow" />);

      expect(
        screen.getByTestId('ai-summary-container-grow'),
      ).toBeInTheDocument();
    });

    it('should pass an empty subFilters object when required subfilters are missing', () => {
      enableAiSummaryOnly();

      render(<GrowTheCategory />);

      expect(screen.getByTestId('ai-summary')).toHaveAttribute(
        'data-sub-filters',
        '{}',
      );
    });

    it('should pass pos_kpi and cohort subFilters when both are selected', () => {
      enableAiSummaryOnly();
      (useSubFilters as jest.Mock).mockReturnValue({
        activeSubFilters: {
          pos_kpi: 'weighted_distribution',
          'cohorts-grow': 'Premium',
        },
      });

      render(<GrowTheCategory />);

      expect(screen.getByTestId('ai-summary')).toHaveAttribute(
        'data-sub-filters',
        JSON.stringify({
          pos_kpi: 'weighted_distribution',
          cohort: 'Premium',
        }),
      );
    });
  });
});
