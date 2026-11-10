import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';
import { usePageFilterApplied, useSubFilters } from 'hooks';

import {
  RA_BUBBLE_SUBFILTER,
  RA_BUBBLE_SUBFILTER_PRESET,
} from '../../constants';
import { getMediaDrilldownHeaderMessage } from '../../utils/mediaDrilldownHeaderUtils';
import { BubbleHeader } from './BubbleChartHeader';

jest.mock('hooks', () => ({
  usePageFilterApplied: jest.fn(),
  useSubFilters: jest.fn(),
}));

jest.mock('@hexa-ui/components', () => {
  const MockRoot = ({ children }: { children: React.ReactNode }) => (
    <span data-testid="chip-root">{children}</span>
  );
  return {
    Paragraph: ({ children }: { children: React.ReactNode }) => (
      <p>{children}</p>
    ),
    Grid: {
      Container: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
      ),
    },
    EmptyState: {
      PageLevel: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
      ),
    },
    Chip: {
      Root: MockRoot,
    },
  };
});

jest.mock('./BubbleChartHeader.styles', () => ({
  StyledBubbleHeaderContainer: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid={props['data-testid'] ?? 'bubble-header-container'}>
      {children}
    </div>
  ),
  StyledBubbleHeaderFilters: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid={props['data-testid'] ?? 'bubble-header-filters'}>
      {children}
    </div>
  ),
  StyledBubbleHeaderMeasure: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <span data-testid={props['data-testid'] ?? 'bubble-header-measure'}>
      {children}
    </span>
  ),
  StyledBubbleHeaderTextBox: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid={props['data-testid'] ?? 'bubble-header-textbox'}>
      {children}
    </div>
  ),
  StyledBubbleHeaderTitle: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <h3 data-testid={props['data-testid'] ?? 'bubble-header-title'}>
      {children}
    </h3>
  ),
  StyledIconInfo: ({ icon, ...props }: any) => (
    <span data-testid="icon-info" {...props} />
  ),
}));

jest.mock('../../utils/mediaDrilldownHeaderUtils', () => ({
  getMediaDrilldownHeaderMessage: jest.fn(),
}));

jest.mock('components', () => ({
  CustomTooltip: ({
    children,
    content,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    content: React.ReactNode;
    'data-testid'?: string;
  }) => (
    <div data-testid={dataTestId ?? 'custom-tooltip'}>
      {children}
      <div data-testid="tooltip-content">{content}</div>
    </div>
  ),
  SubFilter: {
    Select: ({
      apiKey,
      stateKey,
      dataTestId,
    }: {
      apiKey: string;
      stateKey: string;
      dataTestId?: string;
    }) => (
      <div
        data-testid={dataTestId ?? 'subfilter-select'}
        data-api-key={apiKey}
        data-state-key={stateKey}
      />
    ),
  },
}));

const mockUsePageFilterApplied = usePageFilterApplied as jest.Mock;
const mockUseSubFilters = useSubFilters as jest.Mock;
const mockGetMediaDrilldownHeaderMessage =
  getMediaDrilldownHeaderMessage as jest.Mock;

const MEDIA_QWOA_HEADER = {
  title: 'Media QWOA in the top 12 countries',
  measure: '[# of weeks]',
  tooltip: 'Media QWOA tooltip information',
};

const CAMPAIGN_QWOA_HEADER = {
  title: 'Campaign QWOA in the top 12 countries',
  measure: '[# of weeks]',
  tooltip: 'Campaign QWOA tooltip information',
};

const NON_WORKING_MONEY_HEADER = {
  title: 'Non-Working Money in the top 12 countries',
  measure: '[% of Total Investment]',
  tooltip: 'Non-Working Money tooltip information',
};

const renderComponent = (props?: { dataTestId?: string }) => {
  return render(
    <IntlProvider locale="en" messages={{}}>
      <BubbleHeader {...props} />
    </IntlProvider>,
  );
};

describe('BubbleHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePageFilterApplied.mockReturnValue({ isGlobalZone: false });
    mockUseSubFilters.mockReturnValue({
      activeSubFilters: {},
    });
    mockGetMediaDrilldownHeaderMessage.mockReturnValue({
      title: undefined,
      measure: undefined,
      tooltip: undefined,
    });
  });

  it('renders SubFilter.Select with correct props', () => {
    renderComponent();

    const subFilterSelect = screen.getByTestId('subfilter-select');
    expect(subFilterSelect).toHaveAttribute(
      'data-api-key',
      RA_BUBBLE_SUBFILTER_PRESET,
    );
    expect(subFilterSelect).toHaveAttribute(
      'data-state-key',
      RA_BUBBLE_SUBFILTER,
    );
  });

  describe('Header content rendering', () => {
    it.each([
      [
        'Media QWOA',
        MEDIA_QWOA_HEADER,
        'Media QWOA in the top 12 countries',
        '[# of weeks]',
      ],
      [
        'Campaign QWOA',
        CAMPAIGN_QWOA_HEADER,
        'Campaign QWOA in the top 12 countries',
        '[# of weeks]',
      ],
      [
        'Non-Working Money',
        NON_WORKING_MONEY_HEADER,
        'Non-Working Money in the top 12 countries',
        '[% of Total Investment]',
      ],
    ])(
      'renders %s title, measure, and tooltip',
      (_, header, title, measure) => {
        mockGetMediaDrilldownHeaderMessage.mockReturnValue(header);

        renderComponent();

        screen.getByText(title);
        screen.getByText(measure);
        screen.getByTestId('custom-tooltip');
      },
    );

    it('does not render title when headerMessage.title is undefined', () => {
      mockGetMediaDrilldownHeaderMessage.mockReturnValue({
        title: undefined,
        measure: '[# of weeks]',
        tooltip: undefined,
      });

      renderComponent();

      expect(
        screen.queryByText('Media QWOA in the top 12 countries'),
      ).not.toBeInTheDocument();
    });

    it('does not render measure when headerMessage.measure is undefined', () => {
      mockGetMediaDrilldownHeaderMessage.mockReturnValue({
        title: 'Media QWOA in the top 12 countries',
        measure: undefined,
        tooltip: undefined,
      });

      renderComponent();

      expect(screen.queryByText('[# of weeks]')).not.toBeInTheDocument();
    });

    it('does not render tooltip when headerMessage.tooltip is undefined', () => {
      mockGetMediaDrilldownHeaderMessage.mockReturnValue({
        title: 'Media QWOA in the top 12 countries',
        measure: '[# of weeks]',
        tooltip: undefined,
      });

      renderComponent();

      expect(screen.queryByTestId('custom-tooltip')).not.toBeInTheDocument();
    });
  });

  it('calls getMediaDrilldownHeaderMessage with correct parameters', () => {
    const mockActiveSubFilters = { kpis: 'media_qwoa' };
    mockUseSubFilters.mockReturnValue({
      activeSubFilters: mockActiveSubFilters,
    });
    mockUsePageFilterApplied.mockReturnValue({ isGlobalZone: true });

    renderComponent();

    expect(mockGetMediaDrilldownHeaderMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        activeSubFilters: mockActiveSubFilters,
        isGlobalZone: true,
        formatMessage: expect.any(Function),
      }),
    );
  });

  describe('data-testid Rendering', () => {
    it('should render custom data-testid when dataTestId is provided', () => {
      mockGetMediaDrilldownHeaderMessage.mockReturnValue(MEDIA_QWOA_HEADER);
      renderComponent({ dataTestId: 'bubble-header' });

      expect(
        screen.getByTestId('bubble-chart-header-bubble-header'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('bubble-chart-header-text-box-bubble-header'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('bubble-chart-header-title-bubble-header'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('bubble-chart-header-measure-bubble-header'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('bubble-header-bubble-chart-header-tooltip'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('bubble-chart-header-filters-bubble-header'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(
          `bubble-header-${RA_BUBBLE_SUBFILTER}-bubble-chart-header`,
        ),
      ).toBeInTheDocument();
    });

    it('should not render custom data-testid when dataTestId is not provided', () => {
      renderComponent();

      expect(screen.getByTestId('bubble-header-container')).toBeInTheDocument();
      expect(screen.getByTestId('subfilter-select')).toBeInTheDocument();
      expect(
        screen.queryByTestId('bubble-chart-header-bubble-header'),
      ).not.toBeInTheDocument();
    });
  });
});
