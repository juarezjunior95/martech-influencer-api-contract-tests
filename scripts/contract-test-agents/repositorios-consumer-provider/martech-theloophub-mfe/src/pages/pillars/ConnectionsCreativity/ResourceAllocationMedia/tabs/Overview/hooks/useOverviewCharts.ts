import { useMemo } from 'react';

import { useBffData } from 'hooks';

import { BFF_VIEW_IDS } from '../constants';
import { ResourceAllocationOverview } from '../types';

export function useOverviewCharts() {
  const mediaSpendBff = useBffData({
    id: BFF_VIEW_IDS.mediaSpend,
    kpiGroup: 'media',
  });

  const mediaSpendData = useMemo(() => {
    const normalized = mediaSpendBff.data;
    return normalized?.media_spend_index as ResourceAllocationOverview;
  }, [mediaSpendBff.data]);

  const mediaSpend = {
    data: mediaSpendData,
    loading: mediaSpendBff.loading,
    error: mediaSpendBff.error,
  };

  const megaBrandsBff = useBffData({
    id: BFF_VIEW_IDS.megaBrands,
    kpiGroup: 'media',
  });

  const megaBrandsData = useMemo(() => {
    const normalized = megaBrandsBff.data;
    return normalized?.megabrands_qwoa as ResourceAllocationOverview;
  }, [megaBrandsBff.data]);

  const megaBrands = {
    data: megaBrandsData,
    loading: megaBrandsBff.loading,
    error: megaBrandsBff.error,
  };

  const campaignsBff = useBffData({
    id: BFF_VIEW_IDS.campaigns,
    kpiGroup: 'media',
  });

  const campaignsData = useMemo(() => {
    const normalized = campaignsBff.data;
    return normalized?.campaigns_qwoa as ResourceAllocationOverview;
  }, [campaignsBff.data]);

  const campaigns = {
    data: campaignsData,
    loading: campaignsBff.loading,
    error: campaignsBff.error,
  };

  const resourceAllocationBff = useBffData({
    id: BFF_VIEW_IDS.resourceAllocation,
    kpiGroup: 'media',
  });

  const resourceAllocationData = useMemo(() => {
    const normalized = resourceAllocationBff.data;
    return normalized?.non_working_money as ResourceAllocationOverview;
  }, [resourceAllocationBff.data]);

  const resourceAllocation = {
    data: resourceAllocationData,
    loading: resourceAllocationBff.loading,
    error: resourceAllocationBff.error,
  };

  return {
    mediaSpend,
    megaBrands,
    campaigns,
    resourceAllocation,
  };
}
