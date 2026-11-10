import type { ChartDataset } from 'chart.js';
import type { BigNumberData } from 'components/BigNumber/types';
import type { RoudedArrowProps } from 'components/Chart/plugins/RoundedArrow/types';
import type { IChartHeaderProps } from 'components/ChartHeader/types/interface';
import type { ComparisonLineData } from 'components/ComparisonLine/ComparisonLine';

export interface KpiOverviewCardComparisonLine {
  data: ComparisonLineData[];
}

export interface KpiOverviewBarChartLayoutPadding {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

export interface KpiOverviewCardData {
  chartHeader: Pick<IChartHeaderProps, 'title' | 'measure' | 'period'>;
  bigNumberData: BigNumberData[];
  barChart?: {
    labels: string[];
    datasets: ChartDataset<'bar'>[];
    formattedData: string[][];
    stripedIndexes?: number[];
    highlightLabels?: string[];
    roundedArrow?: RoudedArrowProps;
    layoutPadding?: KpiOverviewBarChartLayoutPadding;
  };
  comparisonLine?: KpiOverviewCardComparisonLine;
  noticeMessage?: string;
}

export interface KpiOverviewCardProps {
  data?: KpiOverviewCardData;
  dataTestId?: string;
  tooltip?: string;
  onClick?: () => void;
  variation?: 'export' | 'innovation';
  chartColors?: { striped: string; current: string; default: string };
}

export interface KpiOverviewCardSkeletonProps {
  height: string;
  width: string;
  length: number;
  hasContainer: boolean;
}

export interface KpiOverviewCardSkeletonViewportMap {
  forExport: KpiOverviewCardSkeletonProps;
  forXLarge: KpiOverviewCardSkeletonProps;
  forLarge: KpiOverviewCardSkeletonProps;
  forDefault: KpiOverviewCardSkeletonProps;
}

export type KpiOverviewCardSkeletonVariation =
  'default' | 'export' | 'innovation';
