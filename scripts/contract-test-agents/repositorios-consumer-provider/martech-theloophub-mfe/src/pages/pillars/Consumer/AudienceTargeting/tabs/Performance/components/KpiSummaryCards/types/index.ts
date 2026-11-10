import { BigNumber } from 'components/BigNumber/types';

export type Variation = 'up' | 'down' | 'neutral';

export interface PerformanceIndex {
  value: string;
  variation: Variation;
}

export type BigNumberItem = BigNumber & { id: string; variation: Variation };

export interface KpiSummaryCardData {
  id: string;
  /** When true, BFF has no data for this KPI for the current filters (hide / skip as default). */
  empty?: boolean;
  performanceIndex: PerformanceIndex;
  bigNumberData: BigNumberItem[];
}

export interface KpiConfig {
  name: string;
  tooltip: string;
  measure: string;
}

export interface KpiSummaryCardsProps {
  data: KpiSummaryCardData[];
  defaultSelected?: string;
  onSelectionChange?: (id: string) => void;
  loading?: boolean;
  dataTestId?: string;
}

export interface KpiCardProps {
  data: KpiSummaryCardData;
  isSelected: boolean;
  onSelect: (id: string) => void;
  period?: string;
}

export interface PerformanceIndexProps {
  value: string;
  variation: Variation;
}
