import { createContext, FC, ReactNode, useContext, useMemo } from 'react';
import { useIntl } from 'react-intl';

export type Kpi = 'volume' | 'nr' | 'cores' | 'market_share' | 'power';

export const KPI_TO_PAGE_NAME: Record<Kpi, string> = {
  volume: 'value-creation_volume-pages',
  nr: 'value-creation_nr-pages',
  cores: 'value-creation_cores-pages',
  market_share: 'value-creation_market-share-pages',
  power: 'value-creation_power-pages',
};

export interface VolumePagesKpiContextValue {
  kpi: Kpi;
  kpiName: string;
}

const VolumePagesKpiContext = createContext<
  VolumePagesKpiContextValue | undefined
>(undefined);

export interface VolumePagesKpiProviderProps {
  children: ReactNode;
  kpi: Kpi;
}

export const VolumePagesKpiProvider: FC<VolumePagesKpiProviderProps> = ({
  children,
  kpi,
}) => {
  const { formatMessage } = useIntl();
  const value = useMemo(
    () => ({
      kpi,
      kpiName: formatMessage({ id: `ValueCreation.PRPages.${kpi}` }),
    }),
    [kpi, formatMessage],
  );

  return (
    <VolumePagesKpiContext.Provider value={value}>
      {children}
    </VolumePagesKpiContext.Provider>
  );
};

export const useVolumePagesKpi = (): VolumePagesKpiContextValue => {
  const context = useContext(VolumePagesKpiContext);
  if (context === undefined) {
    throw new Error(
      'useVolumePagesKpi must be used within VolumePagesKpiProvider',
    );
  }
  return context;
};
