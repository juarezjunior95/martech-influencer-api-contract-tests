import { fireEvent, render, screen } from '@testing-library/react';

import { KpiCard } from './KpiCard';

const mockOnSelect = jest.fn();
const mockUseMediaQuery = jest.fn();
const mockFormatMessage = jest.fn();

jest.mock('hooks', () => ({
  useMediaQuery: (query: string) => mockUseMediaQuery(query),
}));

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: mockFormatMessage,
  }),
}));

jest.mock('components', () => ({
  BigNumber: ({
    children,
    header,
    footer,
    data,
    size,
    fullWidth,
    onClick,
    isSelected,
    asCard,
  }: {
    children?: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    data?: unknown;
    size?: string;
    fullWidth?: boolean;
    onClick?: () => void;
    isSelected?: boolean;
    asCard?: boolean;
  }) => (
    <button
      type="button"
      data-testid="big-number"
      data-size={size}
      data-fullwidth={fullWidth?.toString()}
      data-selected={isSelected?.toString()}
      data-as-card={asCard?.toString()}
      onClick={onClick}
    >
      <div data-testid="big-number-header">{header}</div>
      <div data-testid="big-number-data">{JSON.stringify(data)}</div>
      <div data-testid="big-number-footer">{footer}</div>
      {children}
    </button>
  ),
  ChartHeader: ({
    title,
    measure,
    period,
    config,
    tooltipSize,
    info,
  }: {
    title: string;
    measure?: string;
    period?: string;
    config?: object;
    tooltipSize?: string;
    info?: React.ReactNode;
  }) => (
    <div
      data-testid="chart-header"
      data-config={JSON.stringify(config)}
      data-tooltip-size={tooltipSize}
    >
      <span data-testid="chart-header-title">{title}</span>
      <span data-testid="chart-header-measure">{measure}</span>
      <span data-testid="chart-header-period">{period}</span>
      <div data-testid="chart-header-info">{info}</div>
    </div>
  ),
  CustomTooltip: ({
    children,
    title,
    text,
  }: {
    children: React.ReactNode;
    title?: string;
    text?: string;
  }) => (
    <div
      data-testid="custom-tooltip"
      data-tooltip-title={title}
      data-tooltip-text={text}
    >
      {children}
    </div>
  ),
}));

jest.mock('../../../../../../components/TooltipContent/TooltipContent', () => ({
  TooltipContent: ({
    title,
    subtitle,
    text,
  }: {
    title: string;
    subtitle: string;
    text: string;
  }) => (
    <div data-testid="tooltip-content">
      <span data-testid="tooltip-title">{title}</span>
      <span data-testid="tooltip-subtitle">{subtitle}</span>
      <span data-testid="tooltip-text">{text}</span>
    </div>
  ),
}));

jest.mock('../../utils', () => ({
  getKpiConfig: (kpiId: string) => ({
    name: `${kpiId} Name`,
    measure: `${kpiId} Measure`,
    tooltip: {
      subtitle: `${kpiId} tooltip subtitle`,
      description: `${kpiId} tooltip description`,
    },
  }),
  transformBigNumberData: (data: unknown[]) =>
    data.map((item: unknown, index: number) => ({
      bigNumber: { value: `value-${index}` },
    })),
}));

jest.mock('./KpiCard.styles', () => ({
  StyledIndexPillarContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="index-pillar-container">{children}</div>
  ),
  StyledIndexPillarText: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="index-pillar-text">{children}</span>
  ),
  StyledIndexPillar: ({
    children,
    variation,
  }: {
    children: React.ReactNode;
    variation: string;
  }) => (
    <span data-testid="index-pillar" data-variation={variation}>
      {children}
    </span>
  ),
}));

describe('KpiCard', () => {
  const defaultProps = {
    data: {
      id: 'participation',
      performanceIndex: {
        value: '1.5',
        variation: 'up' as const,
      },
      bigNumberData: [
        { id: 'core', value: '10%', measure: '%', variation: 'up' as const },
        { id: 'brand', value: '8%', measure: '%', variation: 'down' as const },
      ],
    },
    isSelected: false,
    onSelect: mockOnSelect,
    period: 'P4W',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMediaQuery.mockReturnValue(true);
    mockFormatMessage.mockImplementation(({ id }: { id: string }) => {
      const messages: Record<string, string> = {
        'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.kpisSummaryCards.participation.title':
          'Participation',
        'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.kpisSummaryCards.participation.tooltip.subtitle':
          'Participation tooltip subtitle',
        'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.kpisSummaryCards.participation.tooltip.description':
          'Participation tooltip description',
        'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.kpisSummaryCards.occasions.title':
          'Occasions',
        'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.kpisSummaryCards.occasions.tooltip.subtitle':
          'Occasions tooltip subtitle',
        'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.kpisSummaryCards.occasions.tooltip.description':
          'Occasions tooltip description',
        'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.kpisSummaryCards.brandPower.title':
          'Brand Power',
        'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.kpisSummaryCards.brandPower.tooltip.subtitle':
          'Brand Power tooltip subtitle',
        'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.kpisSummaryCards.brandPower.tooltip.description':
          'Brand Power tooltip description',
        'Consumer.AudienceTargeting.BreakdownIndexes.comparisonIndex.title':
          'Comparison Index',
        'Consumer.AudienceTargeting.BreakdownIndexes.comparisonIndex.tooltip.text':
          'Comparison Index tooltip text',
      };
      return messages[id] || id;
    });
  });

  describe('Basic Rendering', () => {
    it('should render the BigNumber component', () => {
      render(<KpiCard {...defaultProps} />);

      expect(screen.getByTestId('big-number')).toBeInTheDocument();
    });

    it('should render the ChartHeader component', () => {
      render(<KpiCard {...defaultProps} />);

      expect(screen.getByTestId('chart-header')).toBeInTheDocument();
    });

    it('should render the footer with performance index', () => {
      render(<KpiCard {...defaultProps} />);

      expect(screen.getByTestId('index-pillar-container')).toBeInTheDocument();
      expect(screen.getByTestId('index-pillar-text')).toBeInTheDocument();
      expect(screen.getByTestId('index-pillar')).toBeInTheDocument();
    });
  });

  describe('BigNumber Props', () => {
    it('should pass fullWidth as true', () => {
      render(<KpiCard {...defaultProps} />);

      expect(screen.getByTestId('big-number')).toHaveAttribute(
        'data-fullwidth',
        'true',
      );
    });

    it('should pass asCard as true', () => {
      render(<KpiCard {...defaultProps} />);

      expect(screen.getByTestId('big-number')).toHaveAttribute(
        'data-as-card',
        'true',
      );
    });

    it('should pass isSelected prop', () => {
      render(<KpiCard {...defaultProps} isSelected={true} />);

      expect(screen.getByTestId('big-number')).toHaveAttribute(
        'data-selected',
        'true',
      );
    });

    it('should pass size as medium on large screens', () => {
      mockUseMediaQuery.mockReturnValue(true);

      render(<KpiCard {...defaultProps} />);

      expect(screen.getByTestId('big-number')).toHaveAttribute(
        'data-size',
        'medium',
      );
    });

    it('should pass size as small on smaller screens', () => {
      mockUseMediaQuery.mockReturnValue(false);

      render(<KpiCard {...defaultProps} />);

      expect(screen.getByTestId('big-number')).toHaveAttribute(
        'data-size',
        'small',
      );
    });
  });

  describe('ChartHeader Props', () => {
    it('should display the KPI name as title', () => {
      render(<KpiCard {...defaultProps} />);

      expect(screen.getByTestId('chart-header-title')).toHaveTextContent(
        'Participation',
      );
    });

    it('should display the measure in brackets', () => {
      render(<KpiCard {...defaultProps} />);

      expect(screen.getByTestId('chart-header-measure')).toHaveTextContent(
        '[participation Measure]',
      );
    });

    it('should display the period', () => {
      render(<KpiCard {...defaultProps} />);

      expect(screen.getByTestId('chart-header-period')).toHaveTextContent(
        'P4W',
      );
    });

    it('should pass correct config', () => {
      render(<KpiCard {...defaultProps} />);

      const chartHeader = screen.getByTestId('chart-header');
      expect(chartHeader).toHaveAttribute(
        'data-config',
        JSON.stringify({ inline: 'horizontal', type: 'small' }),
      );
    });

    it('should pass tooltipSize as medium', () => {
      render(<KpiCard {...defaultProps} />);

      expect(screen.getByTestId('chart-header')).toHaveAttribute(
        'data-tooltip-size',
        'medium',
      );
    });
  });

  describe('TooltipContent', () => {
    it('should render TooltipContent in header info', () => {
      render(<KpiCard {...defaultProps} />);

      expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
    });

    it('should pass KPI name as tooltip title', () => {
      render(<KpiCard {...defaultProps} />);

      expect(screen.getByTestId('tooltip-title')).toHaveTextContent(
        'Participation',
      );
    });

    it('should pass tooltip subtitle', () => {
      render(<KpiCard {...defaultProps} />);

      expect(screen.getByTestId('tooltip-subtitle')).toHaveTextContent(
        'Participation tooltip subtitle',
      );
    });

    it('should pass tooltip description as text', () => {
      render(<KpiCard {...defaultProps} />);

      expect(screen.getByTestId('tooltip-text')).toHaveTextContent(
        'Participation tooltip description',
      );
    });
  });

  describe('Performance Index Footer', () => {
    it('should display the KPI name with Index label', () => {
      render(<KpiCard {...defaultProps} />);

      expect(screen.getByTestId('index-pillar-text')).toHaveTextContent(
        'Participation Index:',
      );
    });

    it('should display the performance index value', () => {
      render(<KpiCard {...defaultProps} />);

      expect(screen.getByTestId('index-pillar')).toHaveTextContent('1.5');
    });

    it('should pass the variation to StyledIndexPillar', () => {
      render(<KpiCard {...defaultProps} />);

      expect(screen.getByTestId('index-pillar')).toHaveAttribute(
        'data-variation',
        'up',
      );
    });

    it('should display down variation correctly', () => {
      const propsWithDownVariation = {
        ...defaultProps,
        data: {
          ...defaultProps.data,
          performanceIndex: {
            value: '-0.5',
            variation: 'down' as const,
          },
        },
      };

      render(<KpiCard {...propsWithDownVariation} />);

      expect(screen.getByTestId('index-pillar')).toHaveAttribute(
        'data-variation',
        'down',
      );
      expect(screen.getByTestId('index-pillar')).toHaveTextContent('-0.5');
    });

    it('should display neutral variation correctly', () => {
      const propsWithNeutralVariation = {
        ...defaultProps,
        data: {
          ...defaultProps.data,
          performanceIndex: {
            value: '0',
            variation: 'neutral' as const,
          },
        },
      };

      render(<KpiCard {...propsWithNeutralVariation} />);

      expect(screen.getByTestId('index-pillar')).toHaveAttribute(
        'data-variation',
        'neutral',
      );
    });

    it('should not render footer content when performance index value is empty', () => {
      const propsWithoutPerformanceIndexValue = {
        ...defaultProps,
        data: {
          ...defaultProps.data,
          performanceIndex: {
            value: '   ',
            variation: 'neutral' as const,
          },
        },
      };

      render(<KpiCard {...propsWithoutPerformanceIndexValue} />);

      expect(screen.queryByTestId('index-pillar-text')).not.toBeInTheDocument();
      expect(screen.queryByTestId('index-pillar')).not.toBeInTheDocument();
      expect(screen.queryByTestId('custom-tooltip')).not.toBeInTheDocument();
    });
  });

  describe('Click Handler', () => {
    it('should call onSelect with data.id when clicked', () => {
      render(<KpiCard {...defaultProps} />);

      fireEvent.click(screen.getByTestId('big-number'));

      expect(mockOnSelect).toHaveBeenCalledTimes(1);
      expect(mockOnSelect).toHaveBeenCalledWith('participation');
    });

    it('should call onSelect with different id', () => {
      const propsWithDifferentId = {
        ...defaultProps,
        data: {
          ...defaultProps.data,
          id: 'occasions',
        },
      };

      render(<KpiCard {...propsWithDifferentId} />);

      fireEvent.click(screen.getByTestId('big-number'));

      expect(mockOnSelect).toHaveBeenCalledWith('occasions');
    });
  });

  describe('Responsive Behavior', () => {
    it('should call useMediaQuery with correct breakpoint', () => {
      render(<KpiCard {...defaultProps} />);

      expect(mockUseMediaQuery).toHaveBeenCalledWith('(min-width: 1440px)');
    });

    it('should use medium size on desktop large', () => {
      mockUseMediaQuery.mockReturnValue(true);

      render(<KpiCard {...defaultProps} />);

      expect(screen.getByTestId('big-number')).toHaveAttribute(
        'data-size',
        'medium',
      );
    });

    it('should use small size on smaller screens', () => {
      mockUseMediaQuery.mockReturnValue(false);

      render(<KpiCard {...defaultProps} />);

      expect(screen.getByTestId('big-number')).toHaveAttribute(
        'data-size',
        'small',
      );
    });
  });

  describe('Different KPI Types', () => {
    it('should render occasions KPI correctly', () => {
      const occasionsProps = {
        ...defaultProps,
        data: {
          ...defaultProps.data,
          id: 'occasions',
        },
      };

      render(<KpiCard {...occasionsProps} />);

      expect(screen.getByTestId('chart-header-title')).toHaveTextContent(
        'Occasions',
      );
      expect(screen.getByTestId('index-pillar-text')).toHaveTextContent(
        'Occasions Index:',
      );
    });

    it('should render brandPower KPI correctly', () => {
      const brandPowerProps = {
        ...defaultProps,
        data: {
          ...defaultProps.data,
          id: 'brandPower',
        },
      };

      render(<KpiCard {...brandPowerProps} />);

      expect(screen.getByTestId('chart-header-title')).toHaveTextContent(
        'Brand Power',
      );
    });
  });

  describe('Period Prop', () => {
    it('should render with period', () => {
      render(<KpiCard {...defaultProps} period="P4W" />);

      expect(screen.getByTestId('chart-header-period')).toHaveTextContent(
        'P4W',
      );
    });

    it('should render without period', () => {
      const propsWithoutPeriod = {
        ...defaultProps,
        period: undefined,
      };

      render(<KpiCard {...propsWithoutPeriod} />);

      expect(screen.getByTestId('chart-header-period')).toBeEmptyDOMElement();
    });

    it('should render with different period', () => {
      render(<KpiCard {...defaultProps} period="P7W" />);

      expect(screen.getByTestId('chart-header-period')).toHaveTextContent(
        'P7W',
      );
    });
  });

  describe('Internationalization (formatMessage)', () => {
    it('should call formatMessage with correct title id for participation', () => {
      render(<KpiCard {...defaultProps} />);

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.kpisSummaryCards.participation.title',
      });
    });

    it('should call formatMessage with correct tooltip subtitle id', () => {
      render(<KpiCard {...defaultProps} />);

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.kpisSummaryCards.participation.tooltip.subtitle',
      });
    });

    it('should call formatMessage with correct tooltip description id', () => {
      render(<KpiCard {...defaultProps} />);

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.kpisSummaryCards.participation.tooltip.description',
      });
    });

    it('should call formatMessage with comparison index tooltip title id', () => {
      render(<KpiCard {...defaultProps} />);

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'Consumer.AudienceTargeting.BreakdownIndexes.comparisonIndex.title',
      });
    });

    it('should call formatMessage with comparison index tooltip text id', () => {
      render(<KpiCard {...defaultProps} />);

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'Consumer.AudienceTargeting.BreakdownIndexes.comparisonIndex.tooltip.text',
      });
    });

    it('should call formatMessage 5 times for each KPI', () => {
      render(<KpiCard {...defaultProps} />);

      expect(mockFormatMessage).toHaveBeenCalledTimes(5);
    });

    it('should call formatMessage with correct ids for occasions', () => {
      const occasionsProps = {
        ...defaultProps,
        data: {
          ...defaultProps.data,
          id: 'occasions',
        },
      };

      render(<KpiCard {...occasionsProps} />);

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.kpisSummaryCards.occasions.title',
      });
      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.kpisSummaryCards.occasions.tooltip.subtitle',
      });
      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.kpisSummaryCards.occasions.tooltip.description',
      });
    });

    it('should call formatMessage with correct ids for brandPower', () => {
      const brandPowerProps = {
        ...defaultProps,
        data: {
          ...defaultProps.data,
          id: 'brandPower',
        },
      };

      render(<KpiCard {...brandPowerProps} />);

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.kpisSummaryCards.brandPower.title',
      });
      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.kpisSummaryCards.brandPower.tooltip.subtitle',
      });
      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.kpisSummaryCards.brandPower.tooltip.description',
      });
    });

    it('should use translated title in header', () => {
      render(<KpiCard {...defaultProps} />);

      expect(screen.getByTestId('chart-header-title')).toHaveTextContent(
        'Participation',
      );
    });

    it('should use translated title in footer index label', () => {
      render(<KpiCard {...defaultProps} />);

      expect(screen.getByTestId('index-pillar-text')).toHaveTextContent(
        'Participation Index:',
      );
    });

    it('should use translated subtitle in tooltip', () => {
      render(<KpiCard {...defaultProps} />);

      expect(screen.getByTestId('tooltip-subtitle')).toHaveTextContent(
        'Participation tooltip subtitle',
      );
    });

    it('should use translated description in tooltip', () => {
      render(<KpiCard {...defaultProps} />);

      expect(screen.getByTestId('tooltip-text')).toHaveTextContent(
        'Participation tooltip description',
      );
    });
  });
});
