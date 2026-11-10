import { KPI_GROUPS } from 'pages/constants';

import { KPIS_MEASURE_MAP, KPIS_TITLE_MAP } from '../constants';

export const getCommercialResultsConfig = ({
  kpiSlug,
}: {
  kpiSlug: string;
}) => {
  return {
    kpiGroup: KPI_GROUPS[kpiSlug],
    periodValues: ['YTD', 'L3M', 'MTD'],
    measure: KPIS_MEASURE_MAP[kpiSlug],
    driversTitle: `${KPIS_TITLE_MAP[kpiSlug]} Drivers`,
  };
};
