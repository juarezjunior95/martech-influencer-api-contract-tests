import React from 'react';

import { render, screen } from '@testing-library/react';
import type { BarChartKpiData } from 'pages/pillars/ValueCreation/VolumePages/types';

import { TopBottomBarChartSlideContent } from './TopBottomBarChartSlideContent';

jest.mock('pages/pillars/ValueCreation/VolumePages/components', () => ({
  BarChartSection: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId ?? 'bar-chart-section'} />
  ),
}));

jest.mock('pages/components/SectionHeader', () => ({
  SectionHeader: () => <div data-testid="section-header" />,
}));

jest.mock('./TopBottomBarChartSlideContent.styles', () => ({
  StyledBarChartBaseContainer: ({
    children,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => (
    <div data-testid={testId ?? 'bar-chart-base-container'}>{children}</div>
  ),
  StyledBarChartSectionHeaderWrapper: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="bar-chart-section-header-wrapper">{children}</div>,
  StyledBarChartSlideGrid: ({
    children,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={testId ?? 'bar-chart-slide-grid'}>{children}</div>,
}));

const baseData: BarChartKpiData = {
  period: 'YTD',
  datasets: [{ data: [1, -2], backgroundColor: ['#000', '#111'] }],
  formattedData: [['1', '-2']],
  labels: ['A', 'B'],
};

describe('TopBottomBarChartSlideContent', () => {
  it('renders two bar chart sections (top and bottom)', () => {
    render(
      <TopBottomBarChartSlideContent
        data={{
          topKpiData: baseData,
          bottomKpiData: baseData,
        }}
      />,
    );

    expect(screen.getByTestId('bar-chart-slide-grid')).toBeInTheDocument();
    expect(screen.getAllByTestId('section-header')).toHaveLength(2);
    expect(screen.getAllByTestId('bar-chart-section')).toHaveLength(2);
  });

  it('renders with dataTestId prefix', () => {
    render(
      <TopBottomBarChartSlideContent
        dataTestId="prefix"
        data={{
          topKpiData: baseData,
          bottomKpiData: baseData,
        }}
      />,
    );

    expect(
      screen.getByTestId('top-brands-bar-slide-content-prefix'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('prefix-top-brands-bar-slide-content-top-data'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('prefix-top-brands-bar-slide-content-bottom-data'),
    ).toBeInTheDocument();
  });

  it('renders without data gracefully', () => {
    render(<TopBottomBarChartSlideContent data={{}} />);

    expect(screen.getByTestId('bar-chart-slide-grid')).toBeInTheDocument();
    expect(screen.getAllByTestId('bar-chart-section')).toHaveLength(2);
  });
});
