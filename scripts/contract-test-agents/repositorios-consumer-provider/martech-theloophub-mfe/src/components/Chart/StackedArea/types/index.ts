import { ChartDataset } from 'chart.js';
import { ComparisonLineData } from 'components/ComparisonLine';

export type StackedAreaSize = 'small' | 'medium' | 'large' | 'responsive';

export type AtLeastOne<T> = [T, ...T[]];

export interface StackedAreaSegment {
  value: number | string;
  label?: string;
  height?: number;
  showNumber?: boolean;
}

export interface StackedAreaColumn {
  label: string;
  segments: AtLeastOne<StackedAreaSegment>;
}

export interface StackedAreaResponse {
  title: string;
  subtitle?: string;
  chartData: StackedAreaData;
}

export interface StackedAreaData {
  columns: StackedAreaColumn[];
  colors: AtLeastOne<string>;
  connectorColors: AtLeastOne<string>;
  legends?: string[];
  comparisonLine?: ComparisonLineData[];
}

export interface ResponsiveConfig {
  columnWidth: number;
  columnSpacing: number;
  fontSize: {
    label: number;
    value: number;
    variation: number;
  };
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  borderRadius: number;
  minCellHeight: number;
}

export interface ContainerHeaderProps {
  title: string;
  subtitle?: string;
  tooltip?: React.ReactNode;
  titleSize?: 'H1' | 'H2' | 'H3' | 'H4' | 'H5';
  measure?: string;
  refreshDateLabel?: string;
}

export interface ContainerLayoutProps {
  border?: 'none' | 'small' | 'gray';
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  headerPadding?: 'none' | 'small' | 'medium' | 'large';
  bodyPadding?: boolean;
}

export interface StackedAreaProps {
  data: StackedAreaData;
  size?: StackedAreaSize;
  height?: string | number;
  width?: string | number;
  dataTestId?: string;
  containerHeader?: ContainerHeaderProps;
  containerLayout?: ContainerLayoutProps;
}

export interface StackedAreaBarDataset extends ChartDataset<'bar'> {
  originalValues: (number | string)[];
  showNumbers: boolean[];
}
