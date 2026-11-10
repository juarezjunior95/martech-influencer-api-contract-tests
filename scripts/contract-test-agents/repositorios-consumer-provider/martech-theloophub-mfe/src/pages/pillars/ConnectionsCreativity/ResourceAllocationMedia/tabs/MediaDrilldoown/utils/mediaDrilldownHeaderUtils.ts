import { IntlFormatters } from 'react-intl';

import { FilterValue } from 'models/Filters';

import { RA_BUBBLE_SUBFILTER } from '../constants';

interface GetMediaDrilldownHeaderMessageParams {
  activeSubFilters: Record<string, FilterValue>;
  isGlobalZone: boolean;
  formatMessage: IntlFormatters['formatMessage'];
}

export const getMediaDrilldownHeaderMessage = ({
  activeSubFilters,
  isGlobalZone,
  formatMessage,
}: GetMediaDrilldownHeaderMessageParams) => {
  const BubbleKey = activeSubFilters[RA_BUBBLE_SUBFILTER];

  const titles = {
    media_qwoa: isGlobalZone
      ? 'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.globalView.title.media_qwoa'
      : 'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.countryView.title.media_qwoa',
    non_working_money: isGlobalZone
      ? 'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.globalView.title.non_working_money'
      : 'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.countryView.title.non_working_money',
    campaign_qwoa: isGlobalZone
      ? 'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.globalView.title.campaign_qwoa'
      : 'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.countryView.title.campaign_qwoa',
  };

  const measures = {
    media_qwoa: isGlobalZone
      ? 'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.globalView.measure.media_qwoa'
      : 'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.countryView.measure.media_qwoa',
    non_working_money: isGlobalZone
      ? 'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.globalView.measure.non_working_money'
      : 'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.countryView.measure.non_working_money',
    campaign_qwoa: isGlobalZone
      ? 'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.globalView.measure.campaign_qwoa'
      : 'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.countryView.measure.campaign_qwoa',
  };

  const tooltips = {
    media_qwoa: isGlobalZone
      ? 'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.globalView.tooltip.media_qwoa'
      : 'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.countryView.tooltip.media_qwoa',
    non_working_money: isGlobalZone
      ? 'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.globalView.tooltip.non_working_money'
      : 'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.countryView.tooltip.non_working_money',
    campaign_qwoa: isGlobalZone
      ? 'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.globalView.tooltip.campaign_qwoa'
      : 'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.countryView.tooltip.campaign_qwoa',
  };

  const titleKey = titles[BubbleKey];
  const measureKey = measures[BubbleKey];
  const tooltipKey = tooltips[BubbleKey];

  return {
    title: titleKey ? formatMessage({ id: titleKey }) : ' ',
    measure: measureKey ? formatMessage({ id: measureKey }) : ' ',
    tooltip:
      tooltipKey && formatMessage({ id: tooltipKey }) !== tooltipKey
        ? formatMessage({ id: tooltipKey })
        : undefined,
  };
};
