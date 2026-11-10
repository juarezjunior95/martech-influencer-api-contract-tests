import { useMemo } from 'react';

import { TableDataType } from 'components/Table/types';
import { useBffData } from 'hooks';
import { SharedKpis } from 'pages/enums';
import { Legend as LegendType } from 'pages/pillars/PortfolioBrand/BrandPowerBook/types';

interface TableData {
  table?: TableDataType;
  legend?: LegendType[];
}

interface DataResponse<T> {
  loading: boolean;
  error: Error | null;
  data: T;
}

interface ZoneMaturityDataReturn {
  zone: DataResponse<TableData>;
  maturity: DataResponse<TableData>;
}

interface UseZoneMaturityDataProps {
  subScopeFilter: string;
}

export const useZoneMaturityData = ({
  subScopeFilter,
}: UseZoneMaturityDataProps): ZoneMaturityDataReturn => {
  const zoneMaturityData = useBffData({
    id: SharedKpis.BFF.ZONE_MATURITY,
    kpiGroup: 'power',
    subFilters: {
      page_filter: subScopeFilter,
    },
  });

  const zoneTable = zoneMaturityData.data?.zonePowerPerformance?.table as
    TableDataType | undefined;
  const zoneLegend = zoneMaturityData.data?.zonePowerPerformance?.legend as
    LegendType[] | undefined;
  const maturityTable = zoneMaturityData.data?.maturityPowerPerformance
    ?.table as TableDataType | undefined;
  const maturityLegend = zoneMaturityData.data?.maturityPowerPerformance
    ?.legend as LegendType[] | undefined;

  const zoneTableData = useMemo<TableData>(
    () => ({ table: zoneTable, legend: zoneLegend }),
    [zoneTable, zoneLegend],
  );

  const maturityTableData = useMemo<TableData>(
    () => ({ table: maturityTable, legend: maturityLegend }),
    [maturityTable, maturityLegend],
  );

  return useMemo<ZoneMaturityDataReturn>(
    () => ({
      zone: {
        loading: zoneMaturityData.loading,
        error: zoneMaturityData.error,
        data: zoneTableData,
      },
      maturity: {
        loading: zoneMaturityData.loading,
        error: zoneMaturityData.error,
        data: maturityTableData,
      },
    }),
    [
      zoneMaturityData.loading,
      zoneMaturityData.error,
      zoneTableData,
      maturityTableData,
    ],
  );
};
