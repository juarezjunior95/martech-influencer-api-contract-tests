import { render, screen } from '@testing-library/react';

import { BreakdownTier } from '../../types';
import { TierCard } from './TierCard';

jest.mock('@hexa-ui/components', () => ({
  Paragraph: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  Heading: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
}));

jest.mock('@hexa-ui/components2', () => ({
  Icon: ({ icon, ...props }: any) => (
    <span data-testid="info-icon" {...props} />
  ),
}));

jest.mock('@hexa-ui/icons2', () => ({
  Info: () => null,
}));

jest.mock('components/ComparisonLine/ComparisonLine', () => ({
  ComparisonLine: ({ dataTestId, gridColumnsLength }: any) => (
    <div
      data-testid={dataTestId || 'comparison-line'}
      data-columns={gridColumnsLength}
    />
  ),
}));

jest.mock('components/Chart/Bar/SimpleBarChart/SimpleBarChart', () => ({
  SimpleBarChart: ({ dataTestId, barTickness }: any) => (
    <div
      data-testid={dataTestId || 'simple-bar-chart'}
      data-bar-thickness={barTickness}
    />
  ),
}));

jest.mock('components/CustomTooltip', () => ({
  CustomTooltip: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('components/NoDataYet', () => ({
  NoDataYet: ({ description }: any) => (
    <div data-testid="no-data-yet">{description}</div>
  ),
}));

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: ({ id }: { id: string }) => id }),
}));

jest.mock('../../constants', () => ({
  TIER_BAR_COLORS: {
    beer: { primary: '#e5b611', halo: '#f5db7f' },
    brand: { primary: '#42b88c', halo: '#99e0c6' },
  },
  CHART_CONFIG: {
    barThicknessHaloOn: 32,
    barThicknessHaloOff: 48,
    suggestedMaxPadding: 10,
    yStepSize: 10,
    padding: { top: 25, left: 0, bottom: 0 },
  },
  CHART_CONFIG_PLUGINS: {
    extendYAxis: { display: true },
    extendXAxis: { display: true },
  },
  COMPARISON_BORDER_CONFIG: { marginLeft: 0, marginRight: 0 },
  COMPARISON_ROW_CONFIG: { height: 50, alignItems: 'center' },
  COMPARISON_INNER_BORDER_CONFIG: { marginLeft: 7, marginRight: -8 },
  DATA_NOT_AVAILABLE: 'DATA NOT AVAILABLE',
  NOT_APPLICABLE: 'N/A',
}));

const buildTier = (overrides: Partial<BreakdownTier> = {}): BreakdownTier => ({
  tier_level: 'beer',
  tier_name: 'Beer',
  audiences: {
    core: {
      value: 31.2,
      yoy_change: 0.2,
      yoy_direction: 'up',
      comparison_index: 111,
      performance_index: 111,
    },
    halo: {
      value: 29.5,
      yoy_change: 0.4,
      yoy_direction: 'up',
      comparison_index: 105,
      performance_index: 105,
    },
    total: {
      value: 28.0,
      yoy_change: 0.5,
      yoy_direction: 'up',
      comparison_index: null,
      performance_index: null,
    },
  },
  ...overrides,
});

describe('TierCard', () => {
  const dataTestId = 'tier-card';

  it('should render tier name', () => {
    render(
      <TierCard tier={buildTier()} showHalo={false} dataTestId={dataTestId} />,
    );

    expect(screen.getByText('Beer')).toBeInTheDocument();
  });

  it('should render chart when audiences exist', () => {
    render(
      <TierCard tier={buildTier()} showHalo={false} dataTestId={dataTestId} />,
    );

    expect(screen.getByTestId(`${dataTestId}-chart`)).toBeInTheDocument();
    expect(
      screen.queryByTestId(`${dataTestId}-no-data`),
    ).not.toBeInTheDocument();
  });

  it('should show DATA NOT AVAILABLE when audiences is null', () => {
    render(
      <TierCard
        tier={buildTier({ audiences: null })}
        showHalo={false}
        dataTestId={dataTestId}
      />,
    );

    expect(screen.getByTestId('no-data-yet')).toBeInTheDocument();
    expect(screen.getByText('DATA NOT AVAILABLE')).toBeInTheDocument();
    expect(screen.queryByTestId(`${dataTestId}-chart`)).not.toBeInTheDocument();
  });

  it('should render no-data container with data-testid when audiences is null', () => {
    render(
      <TierCard
        tier={buildTier({ audiences: null })}
        showHalo={false}
        dataTestId={dataTestId}
      />,
    );

    expect(screen.getByTestId(`${dataTestId}-no-data`)).toBeInTheDocument();
  });

  it('should render chart with correct labels when showHalo is false', () => {
    render(
      <TierCard tier={buildTier()} showHalo={false} dataTestId={dataTestId} />,
    );

    expect(screen.getByTestId(`${dataTestId}-chart`)).toBeInTheDocument();
  });

  it('should use barThicknessHaloOff when showHalo is false', () => {
    render(
      <TierCard tier={buildTier()} showHalo={false} dataTestId={dataTestId} />,
    );

    const chart = screen.getByTestId(`${dataTestId}-bar-chart`);
    expect(chart).toHaveAttribute('data-bar-thickness', '48');
  });

  it('should use barThicknessHaloOn when showHalo is true', () => {
    render(
      <TierCard tier={buildTier()} showHalo={true} dataTestId={dataTestId} />,
    );

    const chart = screen.getByTestId(`${dataTestId}-bar-chart`);
    expect(chart).toHaveAttribute('data-bar-thickness', '32');
  });

  it('should render YoY comparison line', () => {
    render(
      <TierCard tier={buildTier()} showHalo={false} dataTestId={dataTestId} />,
    );

    expect(screen.getByTestId(`${dataTestId}-yoy`)).toBeInTheDocument();
  });

  it('should render indexes comparison line', () => {
    render(
      <TierCard tier={buildTier()} showHalo={false} dataTestId={dataTestId} />,
    );

    expect(screen.getByTestId(`${dataTestId}-indexes`)).toBeInTheDocument();
  });

  it('should use 2 grid columns when showHalo is false', () => {
    render(
      <TierCard tier={buildTier()} showHalo={false} dataTestId={dataTestId} />,
    );

    const yoyLine = screen.getByTestId(`${dataTestId}-yoy`);
    expect(yoyLine).toHaveAttribute('data-columns', '2');
  });

  it('should use 3 grid columns when showHalo is true', () => {
    render(
      <TierCard tier={buildTier()} showHalo={true} dataTestId={dataTestId} />,
    );

    const yoyLine = screen.getByTestId(`${dataTestId}-yoy`);
    expect(yoyLine).toHaveAttribute('data-columns', '3');
  });

  describe('dataTestId', () => {
    it('should apply data-testid to root element', () => {
      render(
        <TierCard
          tier={buildTier()}
          showHalo={false}
          dataTestId={dataTestId}
        />,
      );

      expect(screen.getByTestId(dataTestId)).toBeInTheDocument();
    });

    it('should not render data-testid attributes when not provided', () => {
      render(<TierCard tier={buildTier()} showHalo={false} />);

      expect(
        screen.queryByTestId(`${dataTestId}-chart`),
      ).not.toBeInTheDocument();
    });
  });
});
