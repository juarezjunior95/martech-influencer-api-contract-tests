import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { TabInfo, TabsWithFilters } from 'components';
import { featureToggles } from 'config/featureToggle';
import { useMultiplesFeatureToggles } from 'hooks';
import { createTab } from 'utils/tab';

import { InvestmentBreakdown, Overview, ResourceAllocation } from './tabs';
import { CampaignDeepDive } from './tabs/CampaignDeepDive/CampaignDeepDive';
import { MediaDrilldoown } from './tabs/MediaDrilldoown/MediaDrilldoown';

export const RESOURCE_ALLOCATION_MEDIA_PAGE_NAME =
  'connections-creativity_media-campaign-results';

export const ResourceAllocationMedia: React.FC = () => {
  const { formatMessage } = useIntl();
  const { featuresListByToggleName: tabToggles, togglesReady } =
    useMultiplesFeatureToggles([
      featureToggles.pillar.connectionsAndCreativity.submenus
        .resourceAllocationMedia.tab.overview.id,
      featureToggles.pillar.connectionsAndCreativity.submenus
        .resourceAllocationMedia.tab.resourceAllocation.id,
      featureToggles.pillar.connectionsAndCreativity.submenus
        .resourceAllocationMedia.tab.investmentBreakdown.id,
      featureToggles.pillar.connectionsAndCreativity.submenus
        .resourceAllocationMedia.tab.mediaDrilldoown.id,
      featureToggles.pillar.connectionsAndCreativity.submenus
        .resourceAllocationMedia.tab.campaignDeepDive.id,
    ]);

  const tabs = useMemo<TabInfo[]>(
    () => [
      createTab(
        'overview',
        'Overview',
        <Overview dataTestId="tabpanel-overview" />,
        !tabToggles[
          featureToggles.pillar.connectionsAndCreativity.submenus
            .resourceAllocationMedia.tab.overview.id
        ],
      ),
      createTab(
        'media-drilldown',
        'Media Drilldown',
        <MediaDrilldoown dataTestId="tabpanel-media-drilldown" />,
        !tabToggles[
          featureToggles.pillar.connectionsAndCreativity.submenus
            .resourceAllocationMedia.tab.mediaDrilldoown.id
        ],
      ),
      createTab(
        'campaign-deep-dive',
        'Campaign Deep Dive',
        <CampaignDeepDive dataTestId="tabpanel-campaign-deep-dive" />,
        !tabToggles[
          featureToggles.pillar.connectionsAndCreativity.submenus
            .resourceAllocationMedia.tab.campaignDeepDive.id
        ],
      ),
      createTab(
        'resource-allocation',
        'Resource Allocation',
        <ResourceAllocation dataTestId="tabpanel-resource-allocation" />,
        !tabToggles[
          featureToggles.pillar.connectionsAndCreativity.submenus
            .resourceAllocationMedia.tab.resourceAllocation.id
        ],
      ),
      createTab(
        'investment-breakdown',
        'Investment Breakdown',
        <InvestmentBreakdown dataTestId="tabpanel-investment-breakdown" />,
        !tabToggles[
          featureToggles.pillar.connectionsAndCreativity.submenus
            .resourceAllocationMedia.tab.investmentBreakdown.id
        ],
      ),
    ],
    [tabToggles],
  );

  if (!togglesReady) {
    return <></>;
  }

  return (
    <TabsWithFilters
      filter={{
        pageName: RESOURCE_ALLOCATION_MEDIA_PAGE_NAME,
        visibleFields: ['zone', 'country', 'time_frame'],
      }}
      tabConfig={{
        tabs: tabs,
        baseRoute: '/connections-creativity/resource-allocation-media',
      }}
      dataTestId="resource-allocation-media"
      breadcrumbsList={[
        {
          href: '/connections-creativity',
          pageName: formatMessage({
            id: 'Pillars.pageName.connectionsCreativity',
          }),
        },
        {
          href: '/connections-creativity/resource-allocation-media',
          pageName: formatMessage({ id: 'Sidebar.resourceAllocationMedia' }),
        },
      ]}
    />
  );
};
