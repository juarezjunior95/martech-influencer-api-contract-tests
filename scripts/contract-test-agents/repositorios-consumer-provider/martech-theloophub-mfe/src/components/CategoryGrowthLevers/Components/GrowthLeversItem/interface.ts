type DisplayType = 'single' | 'multi';
type AlignmentType = 'default' | 'center';

interface MetricData {
  value: string;
  measure: string;
}

export interface GrowthLeversItemProps {
  cardTitle?: string;
  type?: DisplayType;
  showTitle?: boolean;
  alignItems?: AlignmentType;
  growthLeversNumber?: MetricData;
  variation?: MetricData & { color?: string };
  comparison?: MetricData;
  dataTestId?: string;
}
