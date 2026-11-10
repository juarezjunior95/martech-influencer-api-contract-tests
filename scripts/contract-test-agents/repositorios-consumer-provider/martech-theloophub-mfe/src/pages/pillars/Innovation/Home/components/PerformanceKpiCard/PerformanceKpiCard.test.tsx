import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import type { BigNumberData } from 'components/BigNumber/types';
import type { BigNumberSparkLineCardData } from 'pages/components';

import { INNOVATION_HOME_FOUR_CARD_TREND_MOCK } from '../../__mocks/innovationHomeBffData';
import { PerformanceKpiCard } from './PerformanceKpiCard';

const mockUseMediaQuery = jest.fn(() => false);

jest.mock('hooks', () => ({
  useMediaQuery: () => mockUseMediaQuery(),
}));

jest.mock('components', () => ({
  BigNumber: ({
    header,
    data,
    emptyStateMessage,
    size,
    dataTestId,
  }: {
    header?: React.ReactNode;
    data: BigNumberData[];
    emptyStateMessage?: string;
    size?: string;
    dataTestId?: string;
  }) => (
    <div
      data-testid="big-number"
      data-bn-testid={dataTestId}
      data-empty-message={emptyStateMessage ?? ''}
      data-rows={data.length}
      data-size={size ?? ''}
      data-first-has-secondary={data[0]?.secondaryInfo ? 'true' : 'false'}
    >
      {header}
    </div>
  ),
  ChartHeader: ({ title, measure }: { title: string; measure?: string }) => (
    <div data-testid="chart-header" data-header-measure={measure ?? ''}>
      {title}
    </div>
  ),
  NoDataYet: () => <div data-testid="no-data-yet">NoDataYet</div>,
  Skeleton: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid="skeleton" data-sk-testid={dataTestId ?? ''} />
  ),
  SparkLine: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid="spark-line" data-sl-testid={dataTestId ?? ''} />
  ),
}));

jest.mock('./PerformanceKpiCard.styles', () => ({
  StyledPerformanceKpiCardRoot: ({
    children,
    ...rest
  }: React.PropsWithChildren<Record<string, unknown>>) => {
    const safe = {
      'data-testid': rest['data-testid'],
      'data-title': rest['data-title'],
      'data-variant': rest['data-variant'],
    };
    return (
      <div data-testid="kpi-root" {...safe}>
        {children}
      </div>
    );
  },
  StyledPerformanceKpiCardBody: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="kpi-body">{children}</div>,
  StyledPerformanceKpiBigNumberShell: (
    props: React.PropsWithChildren<
      Pick<
        React.HTMLAttributes<HTMLElement>,
        'onClick' | 'onKeyDown' | 'role' | 'tabIndex'
      >
    >,
  ) => {
    const { children, onClick, onKeyDown, tabIndex } = props;
    return onClick ? (
      <button
        type="button"
        data-testid="kpi-shell"
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        {children}
      </button>
    ) : (
      <div
        data-testid="kpi-shell"
        role="presentation"
        tabIndex={tabIndex}
        onKeyDown={onKeyDown}
      >
        {children}
      </div>
    );
  },
  StyledPerformanceKpiSparklineSlot: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="spark-slot">{children}</div>,
}));

describe('PerformanceKpiCard', () => {
  const sample = INNOVATION_HOME_FOUR_CARD_TREND_MOCK[0];

  beforeEach(() => {
    mockUseMediaQuery.mockReturnValue(false);
  });

  it('shows skeleton while loading', () => {
    render(
      <PerformanceKpiCard containerTitle="Volume" loading data={sample} />,
    );
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('forwards hierarchical dataTestId to Skeleton, BigNumber, and SparkLine when provided', () => {
    const prefix = 'innovation-home-performance-kpi-volume';

    const { rerender } = render(
      <PerformanceKpiCard
        containerTitle="Volume"
        loading
        data={sample}
        dataTestId={prefix}
      />,
    );
    expect(screen.getByTestId('skeleton')).toHaveAttribute(
      'data-sk-testid',
      `${prefix}-skeleton`,
    );

    rerender(
      <PerformanceKpiCard
        containerTitle="Volume"
        data={sample}
        dataTestId={prefix}
      />,
    );
    expect(screen.getByTestId('big-number')).toHaveAttribute(
      'data-bn-testid',
      `${prefix}-bignumber`,
    );
    expect(screen.getByTestId('spark-line')).toHaveAttribute(
      'data-sl-testid',
      `${prefix}-sparkline`,
    );
  });

  it('uses default BigNumber dataTestId when dataTestId prefix is omitted', () => {
    render(<PerformanceKpiCard containerTitle="Volume" data={sample} />);
    expect(screen.getByTestId('big-number')).toHaveAttribute(
      'data-bn-testid',
      'performance-kpi',
    );
    expect(screen.getByTestId('spark-line')).toHaveAttribute(
      'data-sl-testid',
      '',
    );
  });

  it('passes secondaryInfo to BigNumber when absolute secondary value is present', () => {
    render(<PerformanceKpiCard containerTitle="Volume" data={sample} />);

    expect(screen.getByTestId('big-number')).toHaveAttribute(
      'data-rows',
      String(sample.bigNumberData.length),
    );
    expect(screen.getByTestId('big-number')).toHaveAttribute(
      'data-first-has-secondary',
      'true',
    );
  });

  it('omits secondaryInfo on BigNumber when only unit label is sent but keeps measure on header', () => {
    const netRevenue = INNOVATION_HOME_FOUR_CARD_TREND_MOCK[1];

    render(
      <PerformanceKpiCard containerTitle="Net Revenue" data={netRevenue} />,
    );

    expect(screen.getByTestId('big-number')).toHaveAttribute(
      'data-first-has-secondary',
      'false',
    );
    expect(screen.getByTestId('chart-header')).toHaveAttribute(
      'data-header-measure',
      '[ $Mio ]',
    );
  });

  it('shows no-data state when the BFF returns an error', () => {
    render(
      <PerformanceKpiCard
        containerTitle="Volume"
        error={new Error('fail')}
        data={sample}
      />,
    );
    expect(screen.getByTestId('no-data-yet')).toBeInTheDocument();
  });

  it('shows empty KPI layout when data is null', () => {
    render(<PerformanceKpiCard containerTitle="Volume" data={null} />);
    expect(screen.getByTestId('big-number')).toHaveAttribute(
      'data-empty-message',
      'No data available',
    );
  });

  it('invokes onClick when the interactive shell is clicked', () => {
    const onClick = jest.fn();

    render(
      <PerformanceKpiCard
        containerTitle="Volume"
        data={sample}
        onClick={onClick}
      />,
    );

    fireEvent.click(screen.getByTestId('kpi-shell'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('invokes onClick on Enter, Space, and Spacebar keydown', () => {
    const onClick = jest.fn();

    render(
      <PerformanceKpiCard
        containerTitle="Volume"
        data={sample}
        onClick={onClick}
      />,
    );

    const shell = screen.getByTestId('kpi-shell');
    fireEvent.keyDown(shell, { key: 'Enter' });
    fireEvent.keyDown(shell, { key: ' ' });
    fireEvent.keyDown(shell, { key: 'Spacebar' });
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('ignores unrelated keys on keydown', () => {
    const onClick = jest.fn();

    render(
      <PerformanceKpiCard
        containerTitle="Volume"
        data={sample}
        onClick={onClick}
      />,
    );

    fireEvent.keyDown(screen.getByTestId('kpi-shell'), { key: 'Escape' });
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not invoke onClick on keydown when handler is absent', () => {
    render(<PerformanceKpiCard containerTitle="Volume" data={sample} />);

    const shell = screen.getByTestId('kpi-shell');
    fireEvent.keyDown(shell, { key: 'Enter' });
    expect(shell).toBeInTheDocument();
  });

  it('omits sparkline when chartLineData is empty', () => {
    const dataNoSpark: BigNumberSparkLineCardData = {
      ...sample,
      chartLineData: [],
    };

    render(<PerformanceKpiCard containerTitle="Volume" data={dataNoSpark} />);

    expect(screen.queryByTestId('spark-line')).not.toBeInTheDocument();
  });

  it('uses large BigNumber size when desktop breakpoint matches', () => {
    mockUseMediaQuery.mockReturnValue(true);

    render(<PerformanceKpiCard containerTitle="Volume" data={sample} />);

    expect(screen.getByTestId('big-number')).toHaveAttribute(
      'data-size',
      'large',
    );
  });
});
