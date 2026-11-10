import { useMemo } from 'react';

import { TableDataType } from 'components/Table/types';
import { useBffData } from 'hooks';
import { SharedKpis } from 'pages/enums';

interface DetailsData {
  performanceDetails?: TableDataType;
}

interface DataResponse<T> {
  loading: boolean;
  error: Error | null;
  data: T;
}

interface UseZoneMaturityDetailsProps {
  subScopeFilter: string;
  selectedRow: string;
}

export const useZoneMaturityDetails = ({
  subScopeFilter,
  selectedRow,
}: UseZoneMaturityDetailsProps): DataResponse<DetailsData> => {
  const zoneMaturityDetailsData = useBffData({
    id: SharedKpis.BFF.ZONE_MATURITY_DETAILS,
    kpiGroup: 'power',
    subFilters: {
      page_filter: subScopeFilter,
      zone_maturity: selectedRow,
    },
    skipRequest: !selectedRow,
  });

  const performanceDetails = zoneMaturityDetailsData.data
    ?.performanceDetails as TableDataType | undefined;

  const detailsTableData = useMemo<DetailsData>(
    () => ({ performanceDetails }),
    [performanceDetails],
  );

  return useMemo<DataResponse<DetailsData>>(
    () => ({
      loading: zoneMaturityDetailsData.loading,
      error: zoneMaturityDetailsData.error,
      data: detailsTableData,
    }),
    [
      zoneMaturityDetailsData.loading,
      zoneMaturityDetailsData.error,
      detailsTableData,
    ],
  );
};
