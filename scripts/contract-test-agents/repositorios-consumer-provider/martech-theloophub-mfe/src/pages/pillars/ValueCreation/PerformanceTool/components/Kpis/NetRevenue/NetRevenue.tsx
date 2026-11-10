import { useMemo } from 'react';

import { netRevenueWaterfallConfig } from '../../../config';
import { KpiDrillDown } from '../KpiDrillDown';
import { KpiDrillDownConfig } from '../KpiDrillDown/types';

interface NetRevenueProps {
  onFilterChange: (key: string, value: string) => void;
}

const PERIOD_VALUES = ['YTD', 'L3M', 'MTD'] as const;

export const NetRevenue: React.FC<NetRevenueProps> = ({ onFilterChange }) => {
  const config: KpiDrillDownConfig = useMemo(
    () => ({
      kpiSlug: 'net-revenue',
      kpiGroup: 'finance',
      waterfallConfig: netRevenueWaterfallConfig,
      measure: '[ $Mio ]',
      driversTitle: 'Net Revenue Drivers',
      periodValues: PERIOD_VALUES,
    }),
    [],
  );

  return <KpiDrillDown config={config} onFilterChange={onFilterChange} />;
};
