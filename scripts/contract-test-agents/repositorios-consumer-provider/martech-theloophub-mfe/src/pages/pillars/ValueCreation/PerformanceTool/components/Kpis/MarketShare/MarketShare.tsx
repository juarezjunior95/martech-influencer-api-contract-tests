import { FC, useMemo } from 'react';

import { marketShareWaterfallConfig } from '../../../config';
import { KpiDrillDown, KpiDrillDownConfig } from '../KpiDrillDown';

interface MarketShareProps {
  onFilterChange: (key: string, value: string) => void;
}

const PERIOD_VALUES = ['YTD', 'L3M', 'MTD'] as const;

export const MarketShare: FC<MarketShareProps> = ({ onFilterChange }) => {
  const config: KpiDrillDownConfig = useMemo(
    () => ({
      kpiSlug: 'non-finance_market-share',
      kpiGroup: 'market_share',
      waterfallConfig: marketShareWaterfallConfig,
      measure: '[ % ]',
      driversTitle: 'Market Share Drivers',
      periodValues: PERIOD_VALUES,
    }),
    [],
  );

  return <KpiDrillDown config={config} onFilterChange={onFilterChange} />;
};
