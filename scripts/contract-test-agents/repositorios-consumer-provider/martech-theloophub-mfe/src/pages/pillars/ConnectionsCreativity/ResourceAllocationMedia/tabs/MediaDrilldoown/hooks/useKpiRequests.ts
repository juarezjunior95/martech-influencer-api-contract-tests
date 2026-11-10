import { useMemo } from 'react';

import { useBffData } from 'hooks';

import { BFF_VIEW_IDS } from '../constants';

export interface MediaDrilldownData {
  [key: string]: unknown;
}

export function useKpiRequests() {
  const mediaQwoaBff = useBffData({
    id: BFF_VIEW_IDS.media_qwoa,
    kpiGroup: 'media',
  });

  const mediaQwoaData = useMemo(() => {
    const normalized = mediaQwoaBff.data;
    return normalized?.media_qwoa as MediaDrilldownData;
  }, [mediaQwoaBff.data]);

  const mediaQwoa = {
    data: mediaQwoaData,
    loading: mediaQwoaBff.loading,
    error: mediaQwoaBff.error,
  };

  const nonWorkingMoneyBff = useBffData({
    id: BFF_VIEW_IDS.non_working_money,
    kpiGroup: 'media',
  });

  const nonWorkingMoneyData = useMemo(() => {
    const normalized = nonWorkingMoneyBff.data;
    return normalized?.non_working_money as MediaDrilldownData;
  }, [nonWorkingMoneyBff.data]);

  const nonWorkingMoney = {
    data: nonWorkingMoneyData,
    loading: nonWorkingMoneyBff.loading,
    error: nonWorkingMoneyBff.error,
  };

  const campaignQwoaBff = useBffData({
    id: BFF_VIEW_IDS.campaign_qwoa,
    kpiGroup: 'media',
  });

  const campaignQwoaData = useMemo(() => {
    const normalized = campaignQwoaBff.data;
    return normalized?.campaign_qwoa as MediaDrilldownData;
  }, [campaignQwoaBff.data]);

  const campaignQwoa = {
    data: campaignQwoaData,
    loading: campaignQwoaBff.loading,
    error: campaignQwoaBff.error,
  };

  return {
    charts: {
      mediaQwoa,
      nonWorkingMoney,
      campaignQwoa,
    },
  };
}
