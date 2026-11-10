import { useMemo } from 'react';

import { useBffData } from 'hooks';
import { SharedKpis } from 'pages/enums';

import { useStableBffResponse } from '../../utils';

export const usePowerBookCountryData = () => {
  const ttABI = useStableBffResponse(
    useBffData({
      id: SharedKpis.BFF.OVERVIEW,
      kpiGroup: 'power',
      subFilters: { page_filter: 'All' },
    }),
  );

  const ttABIMegabrands = useStableBffResponse(
    useBffData({
      id: SharedKpis.BFF.OVERVIEW,
      kpiGroup: 'power',
      subFilters: { page_filter: 'Megabrands' },
    }),
  );

  const ABIBrandBreakdown = useStableBffResponse(
    useBffData({
      id: SharedKpis.COUNTRY.BRAND_BREAKDOWN,
      kpiGroup: 'power',
      subFilters: { page_filter: 'All', breakdown_filter: 'TT ABI Portfolio' },
    }),
  );

  const power = useStableBffResponse(
    useBffData({
      id: SharedKpis.BFF.SUMMARY_FOR_POWER,
      kpiGroup: 'power',
      subFilters: { page_filter: 'All' },
    }),
  );

  const CompetitorBrandBreakdown = useStableBffResponse(
    useBffData({
      id: SharedKpis.COUNTRY.BRAND_BREAKDOWN,
      kpiGroup: 'power',
      subFilters: { page_filter: 'All', breakdown_filter: 'TT ABI Segment' },
    }),
  );

  const data = useMemo(
    () => ({
      ttABI,
      ttABIMegabrands,
      power,
      ABIBrandBreakdown,
      CompetitorBrandBreakdown,
    }),
    [
      ttABI,
      ttABIMegabrands,
      power,
      ABIBrandBreakdown,
      CompetitorBrandBreakdown,
    ],
  );

  const isLoadingCountryData =
    ttABI.loading ||
    ttABIMegabrands.loading ||
    power.loading ||
    ABIBrandBreakdown.loading ||
    CompetitorBrandBreakdown.loading;

  return { data, isLoadingCountryData };
};
