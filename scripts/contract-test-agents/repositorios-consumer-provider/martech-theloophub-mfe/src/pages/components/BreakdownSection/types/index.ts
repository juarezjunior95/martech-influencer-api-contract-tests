import { SimpleBarChartData } from 'components/Chart/Bar/SimpleBarChart';

export type BreakdownVariant = 'participation' | 'occasions' | 'brandPower';

export type TierLevel = 'beer' | 'core_co' | 'brand' | 'competitor';

export type YoYDirection = 'up' | 'down' | 'neutral';

export interface AudienceMetrics {
  value: number | null;
  yoy_change: number | null;
  yoy_direction: YoYDirection | null;
  performance_index: number | null;
  comparison_index: number | null;
}

export interface TierAudiences {
  core: AudienceMetrics | null;
  halo: AudienceMetrics | null;
  total: AudienceMetrics | null;
}

export interface BreakdownTier {
  tier_level: TierLevel;
  tier_name: string;
  audiences: TierAudiences | null;
}

export interface BreakdownVariantConfig {
  titleKey: string;
  metricLabel: string;
}

export interface BreakdownSectionProps {
  variant: BreakdownVariant;
  tiers: BreakdownTier[];
  loading: boolean;
  error: Error | null;
  headerRight?: React.ReactNode;
  dataTestId?: string;
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
}

export interface TooltipContent {
  title: string;
  subtitle: string;
  text: string;
}
