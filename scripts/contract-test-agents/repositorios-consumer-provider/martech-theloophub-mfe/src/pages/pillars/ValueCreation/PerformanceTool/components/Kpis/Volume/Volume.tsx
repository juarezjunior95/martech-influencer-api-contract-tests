import { useMemo } from 'react';

import { volumeWaterfallConfig } from '../../../config';
import { KpiDrillDown } from '../KpiDrillDown';
import { KpiDrillDownConfig } from '../KpiDrillDown/types';

interface VolumeProps {
  onFilterChange: (key: string, value: string) => void;
}

const PERIOD_VALUES = ['YTD', 'L3M', 'MTD'] as const;

export const Volume: React.FC<VolumeProps> = ({ onFilterChange }) => {
  const config: KpiDrillDownConfig = useMemo(
    () => ({
      kpiSlug: 'volume',
      kpiGroup: 'volume',
      waterfallConfig: volumeWaterfallConfig,
      measure: '[ k hl ]',
      driversTitle: 'Volume Drivers',
      periodValues: PERIOD_VALUES,
    }),
    [],
  );

  return <KpiDrillDown config={config} onFilterChange={onFilterChange} />;
};
