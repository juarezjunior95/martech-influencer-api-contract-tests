import { FC, memo } from 'react';

import { Cores, MarketShare, NetRevenue, Power, Volume } from '../Kpis';
import { KpiSwitchProps } from './types';

const KpiSwitchComponent: FC<KpiSwitchProps> = ({
  kpi = 'volume',
  onFilterChange,
}: KpiSwitchProps) => {
  switch (kpi) {
    case 'power':
      return <Power onFilterChange={onFilterChange} />;
    case 'volume':
      return <Volume onFilterChange={onFilterChange} />;
    case 'nr':
      return <NetRevenue onFilterChange={onFilterChange} />;
    case 'market_share':
      return <MarketShare onFilterChange={onFilterChange} />;
    case 'cores':
      return <Cores onFilterChange={onFilterChange} />;
    default:
      return null;
  }
};

export const KpiSwitch = memo(KpiSwitchComponent);
