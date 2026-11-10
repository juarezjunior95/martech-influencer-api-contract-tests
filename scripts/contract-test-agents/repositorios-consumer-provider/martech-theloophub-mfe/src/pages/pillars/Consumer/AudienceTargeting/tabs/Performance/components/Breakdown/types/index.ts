import { SimpleBarChartData } from 'components/Chart/Bar/SimpleBarChart';

export type BreakdownVariant = 'p4w' | 'occasions' | 'power';

export type TierLevel = 'beer' | 'core_co' | 'brand' | 'competitor';

export type YoYDirection = 'up' | 'down' | 'neutral';

export interface AudienceMetrics {
  value: string | null;
  yoy_change: string | null;
  yoy_direction: YoYDirection | null;
  performance_index: string | null;
  comparison_index: string | null;
}

export interface TierAudiences {
  core: AudienceMetrics | null;
  halo: AudienceMetrics | null;
  total: AudienceMetrics | null;
}

export interface BreakdownTier {
  tier_level?: TierLevel;
  tier_name?: string;
  audiences?: TierAudiences | null;
  empty?: boolean;
}

export interface BreakdownVariantConfig {
  titleKey: string;
  metricLabel: string;
  i18nKey: string;
}

export interface BreakdownSectionProps {
  variant: BreakdownVariant;
  data?: BreakdownTier[];
  isLoading: boolean;
  error: Error | null;
  headerRight?: React.ReactNode;
  dataTestId?: string;
  competitorWithoutData?: boolean;
}

export interface TierCardProps {
  tier: BreakdownTier;
  showHalo: boolean;
  dataTestId?: string;
  tooltipInfo?: TooltipContent;
}

export interface TierChartResult {
  chartData: SimpleBarChartData;
  naIndexes: number[];
  missingDataBarColor: string;
}

export interface TooltipContent {
  title: string;
  subtitle: string;
  text: string;
}
