import { CAMPAIGN_TRACKER_ROW_HEIGHT } from '../constants';

export const getRowHeightCallback = (row: any) => {
  const campaignLength = row?.data?.campaign?.length;
  return campaignLength * CAMPAIGN_TRACKER_ROW_HEIGHT;
};
