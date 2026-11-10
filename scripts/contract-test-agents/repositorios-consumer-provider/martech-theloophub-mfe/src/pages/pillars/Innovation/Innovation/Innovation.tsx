import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Navigate } from 'react-router-dom';

import { TabInfo, TabsWithFilters } from 'components';
import { featureToggles } from 'config/featureToggle';
import { useMultiplesFeatureToggles } from 'hooks';
import { createTab } from 'utils/tab';

import { INNOVATION_PAGE_NAME } from '../constants';
import { Overview, PerformanceAndBreakdown } from './tabs';

export const Innovation: React.FC = () => {
  const { formatMessage } = useIntl();
  const { featuresListByToggleName: tabToggles, togglesReady } =
    useMultiplesFeatureToggles([
      featureToggles.pillar.innovation.submenus.innovation.tab.overview.id,
      featureToggles.pillar.innovation.submenus.innovation.tab
        .performanceAndBreakdown.id,
      featureToggles.pillar.innovation.submenus.innovationHub.id,
    ]);
  const tabs = useMemo<TabInfo[]>(
    () => [
      createTab(
        'overview',
        'Overview',
        <Overview dataTestId="tabpanel-overview" />,
        !tabToggles[
          featureToggles.pillar.innovation.submenus.innovation.tab.overview.id
        ],
      ),
      createTab(
        'performance-and-breakdown',
        'Performance & Breakdown',
        <PerformanceAndBreakdown dataTestId="tabpanel-performance-and-breakdown" />,
        !tabToggles[
          featureToggles.pillar.innovation.submenus.innovation.tab
            .performanceAndBreakdown.id
        ],
      ),
    ],
    [tabToggles],
  );

  if (!togglesReady) {
    return <></>;
  }

  if (tabToggles[featureToggles.pillar.innovation.submenus.innovationHub.id]) {
    return (
      <Navigate to="/innovation/innovation-performance/overview" replace />
    );
  }

  return (
    <TabsWithFilters
      filter={{
        pageName: INNOVATION_PAGE_NAME,
        visibleFields: ['zone', 'country', 'time_frame'],
      }}
      tabConfig={{
        tabs,
        baseRoute: '/innovation/innovation',
      }}
      dataTestId="innovation"
      breadcrumbsList={[
        {
          href: '/innovation',
          pageName: formatMessage({ id: 'Pillars.pageName.innovation' }),
        },
        {
          href: '/innovation/innovation',
          pageName: formatMessage({ id: 'Sidebar.innovation' }),
        },
      ]}
    />
  );
};
