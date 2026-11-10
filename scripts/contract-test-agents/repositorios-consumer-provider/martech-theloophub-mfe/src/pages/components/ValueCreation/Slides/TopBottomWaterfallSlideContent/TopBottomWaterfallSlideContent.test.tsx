import React from 'react';

import { render, screen } from '@testing-library/react';
import type { WaterfallChartKpiData } from 'pages/pillars/ValueCreation/VolumePages/types';

import { TopBottomWaterfallSlideContent } from './TopBottomWaterfallSlideContent';

jest.mock(
  'pages/pillars/ValueCreation/VolumePages/components/Sections/WaterfallChartSection',
  () => ({
    WaterfallChartSection: ({ dataTestId }: { dataTestId?: string }) => (
      <div data-testid={dataTestId ?? 'waterfall-chart-section'} />
    ),
  }),
);

jest.mock('pages/components/SectionHeader', () => ({
  SectionHeader: () => <div data-testid="section-header" />,
}));

jest.mock('./TopBottomWaterfallSlideContent.styles', () => ({
  StyledWaterfallBaseContainer: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="base-container">{children}</div>,
  StyledGlobalSliderGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="global-slider-grid">{children}</div>
  ),
}));

describe('TopBottomWaterfallSlideContent', () => {
  it('renders two waterfall sections', () => {
    const baseData: WaterfallChartKpiData = {
      period: 'MTD',
      values: [1],
      labels: ['A'],
      brandsAvatar: { data: [] },
      comparisonLine: { data: [] },
      legend: [],
    };

    render(
      <TopBottomWaterfallSlideContent
        data={{
          topKpiData: baseData,
          bottomKpiData: baseData,
        }}
      />,
    );

    expect(screen.getByTestId('global-slider-grid')).toBeInTheDocument();
    expect(screen.getAllByTestId('base-container')).toHaveLength(2);
    expect(screen.getAllByTestId('waterfall-chart-section')).toHaveLength(2);
  });
});
