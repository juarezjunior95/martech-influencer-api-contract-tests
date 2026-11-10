import { useMemo } from 'react';

import { coresWaterfallConfig } from '../../../config';
import { KpiDrillDown } from '../KpiDrillDown';
import { KpiDrillDownConfig } from '../KpiDrillDown/types';

interface CoresProps {
  onFilterChange: (key: string, value: string) => void;
}

const PERIOD_VALUES = ['YTD', 'L3M', 'MTD'] as const;

export const Cores: React.FC<CoresProps> = ({ onFilterChange }) => {
  const config: KpiDrillDownConfig = useMemo(
    () => ({
      kpiSlug: 'cores',
      kpiGroup: 'finance',
      waterfallConfig: coresWaterfallConfig,
      measure: '[ $Mio ]',
      driversTitle: 'CORES Drivers',
      periodValues: PERIOD_VALUES,
      showCompositionSection: true,
      showLineDataLabels: false,
    }),
    [],
  );

  return <KpiDrillDown config={config} onFilterChange={onFilterChange} />;
};
