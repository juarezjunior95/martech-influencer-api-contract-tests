import type { VolumePagesKpiGroup } from 'pages/pillars/ValueCreation/VolumePages/config/kpiConfigs';

import { WaterfallConfig } from '../../../config';

export interface KpiDrillDownConfig {
  kpiSlug: string;
  kpiGroup: VolumePagesKpiGroup;
  waterfallConfig: WaterfallConfig;
  measure: string;
  driversTitle: string;
  periodValues: readonly string[];
  bigNumbersTitle?: string;
  bigNumbersTooltip?: string;
  showCompositionSection?: boolean;
  showLineDataLabels?: boolean;
}

export interface KpiDrillDownProps {
  config: KpiDrillDownConfig;
  onFilterChange: (key: string, value: string) => void;
}
