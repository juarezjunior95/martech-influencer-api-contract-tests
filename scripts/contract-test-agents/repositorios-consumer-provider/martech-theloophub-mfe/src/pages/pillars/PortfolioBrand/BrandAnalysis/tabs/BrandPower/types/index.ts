import { YearQuarter } from 'pages/pillars/PortfolioBrand/BrandAnalysis/types';

export interface SectionProps {
  quarterYearSelected: YearQuarter;
  kpisConfig?: unknown;
  setQuarterYearSelected: (quarterYearSelected: YearQuarter) => void;
}

export interface KpiRequestResponse<T = unknown> {
  kpiData: T;
  loading: boolean;
}
