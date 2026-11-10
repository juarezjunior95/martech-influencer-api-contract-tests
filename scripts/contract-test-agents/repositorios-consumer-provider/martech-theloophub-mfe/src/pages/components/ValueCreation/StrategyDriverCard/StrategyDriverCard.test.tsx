import React from 'react';

import { render, screen } from '@testing-library/react';

import { StrategyDriverCard } from './StrategyDriverCard';
import type { StrategyDriverCardData } from './types';

jest.mock('components', () => ({
  BigNumber: ({ data }: { data: unknown[] }) => (
    <div data-testid="big-number">
      <span data-testid="big-number-count">{data.length}</span>
    </div>
  ),
  ChartHeader: ({
    title,
    period,
    info,
  }: {
    title: string;
    period?: string;
    info?: string;
  }) => (
    <div data-testid="chart-header">
      <span>{title}</span>
      {period && <span data-testid="period">{period}</span>}
      {info && <span data-testid="tooltip">{info}</span>}
    </div>
  ),
}));

jest.mock('./StrategyDriverCard.styles', () => ({
  StyledChartHeaderWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="chart-header-wrapper">{children}</div>
  ),
  StyledNoDataYetIcon: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img data-testid="no-data-yet-icon" alt="" {...props} />
  ),
  StyledNoticeMessageContainer: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="notice-message-container">{children}</div>,
  StyledStrategyDriverCard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="strategy-driver-card">{children}</div>
  ),
}));

const mockData: StrategyDriverCardData = {
  chartHeader: {
    title: 'ABI Lovers',
    period: "Q1-Q4'25",
  },
  bigNumberData: [
    {
      bigNumber: { value: '1.1', measure: 'pp', color: '#007800' },
      comparison: { label: 'vs', value: 'LY' },
    },
  ],
};

describe('StrategyDriverCard', () => {
  describe('Basic Rendering', () => {
    it('should render title and period from data', () => {
      render(<StrategyDriverCard data={mockData} />);

      expect(screen.getByTestId('strategy-driver-card')).toBeInTheDocument();
      expect(screen.getByTestId('chart-header')).toHaveTextContent(
        'ABI Lovers',
      );
      expect(screen.getByTestId('period')).toHaveTextContent("Q1-Q4'25");
      expect(screen.getByTestId('big-number')).toBeInTheDocument();
    });

    it('should render tooltip when provided', () => {
      render(
        <StrategyDriverCard data={mockData} tooltip="Tooltip for ABI Lovers" />,
      );

      expect(screen.getByTestId('tooltip')).toHaveTextContent(
        'Tooltip for ABI Lovers',
      );
    });
  });
});
