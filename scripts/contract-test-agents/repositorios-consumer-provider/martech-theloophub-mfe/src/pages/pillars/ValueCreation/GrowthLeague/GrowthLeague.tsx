import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { TabInfo, TabsWithFilters } from 'components';
import { featureToggles } from 'config/featureToggle';
import { useMultiplesFeatureToggles } from 'hooks';
import { createTab } from 'utils/tab';

import { Overview, Rankings } from './tabs';

export const GROWTH_LEAGUE_PAGE_NAME = 'value-creation_growth-league';

export const GrowthLeague: React.FC = () => {
  const { featuresListByToggleName, togglesReady } = useMultiplesFeatureToggles(
    [
      featureToggles.pillar.valueCreation.submenus.growthLeague.tab.overview.id,
      featureToggles.pillar.valueCreation.submenus.growthLeague.tab.rank.id,
    ],
  );
  const { formatMessage } = useIntl();
  const tabs = useMemo<TabInfo[]>(
    () => [
      createTab(
        'overview',
        formatMessage({
          id: 'ValueCreation.GrowthLeague.Overview.title',
          defaultMessage: '',
        }),
        <Overview dataTestId="tabpanel-overview" />,
        !featuresListByToggleName[
          featureToggles.pillar.valueCreation.submenus.growthLeague.tab.overview
            .id
        ],
      ),
      createTab(
        'rankings',
        formatMessage({
          id: 'ValueCreation.GrowthLeague.Rankings.title',
          defaultMessage: '',
        }),
        <Rankings dataTestId="tabpanel-rankings" />,
        !featuresListByToggleName[
          featureToggles.pillar.valueCreation.submenus.growthLeague.tab.rank.id
        ],
      ),
    ],
    [featuresListByToggleName, formatMessage],
  );

  if (!togglesReady) {
    return <div></div>;
  }

  return (
    <TabsWithFilters
      dataTestId="growth-league"
      filter={{
        pageName: GROWTH_LEAGUE_PAGE_NAME,
        hidden: true,
      }}
      tabConfig={{
        tabs: tabs,
        baseRoute: '/value-creation/growth-league',
      }}
      breadcrumbsList={[
        {
          href: '/value-creation',
          pageName: formatMessage({ id: 'Pillars.pageName.valueCreation' }),
        },
        {
          href: '/value-creation/growth-league',
          pageName: formatMessage({ id: 'Sidebar.growthLeague' }),
        },
      ]}
    />
  );
};

export default GrowthLeague;
