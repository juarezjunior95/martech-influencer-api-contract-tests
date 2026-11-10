import type { KpiGroup } from 'domain/Kpi';
import { FilterValue } from 'models/Filters';

export interface SummaryBffResponse {
  resume?: string;
  seeMore?: string;
  trend?: 'positive' | 'negative' | 'neutral';
  empty?: boolean;
}

export interface AISummaryProps {
  pageName: string;
  kpiGroup?: KpiGroup;
  dataTestId?: string;
  subFilters?: Record<string, FilterValue>;
  summaryPageIdentifier: string;
  hasExpandedAction?: boolean;
}

export type AlertType =
  'info' | 'success' | 'warning' | 'error' | 'neutral' | 'AI';

export interface AISummaryFiltersParams {
  pageName: string;
  summaryPageIdentifier: string;
  subFilters?: Record<string, FilterValue>;
}
