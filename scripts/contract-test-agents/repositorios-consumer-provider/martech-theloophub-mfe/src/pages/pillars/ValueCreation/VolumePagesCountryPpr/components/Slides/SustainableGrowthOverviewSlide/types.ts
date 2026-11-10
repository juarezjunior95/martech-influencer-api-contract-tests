import type { KpiOverviewCardData } from 'pages/components/KpiOverviewCard';
import type {
  GrowthLeverCardData,
  StrategyDriverCardData,
} from 'pages/components/ValueCreation';

export interface SustainableGrowthOverviewSlideBffFilters {
  zone: unknown;
  country: unknown;
  growth_lever: unknown;
  period: unknown;
  viewtype: unknown;
}

export interface SustainableGrowthOverviewSlideKpiDtEnd {
  finance?: string;
  pos?: string;
  market_share?: string;
  power?: string;
}

export interface SustainableGrowthOverviewSlideData {
  sustainableGrowthOverview: Record<string, KpiOverviewCardData | undefined>;
  strategyDrivers: StrategyDriverCardData[];
  growthLevers: Record<string, GrowthLeverCardData>;
}

export interface SustainableGrowthOverviewSlideTooltips {
  sustainableGrowthByKpiKey: Record<string, string | undefined>;
  strategyDriverByTitle: Record<string, string | undefined>;
  growthLeverByKey: Record<string, string | undefined>;
}

export interface SustainableGrowthOverviewSlideProps {
  loading?: boolean;
  error?: Error | null;
  data: SustainableGrowthOverviewSlideData;
  dataTestId?: string;
  showGrowthLevers?: boolean;
}
