import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { TabInfo, TabsWithFilters } from 'components';
import { createTab } from 'utils/tab';

import {
  INNOVATION_HUB_BASE_ROUTE,
  INNOVATION_HUB_PAGE_NAME,
  INNOVATION_HUB_TAB_DISABLED,
  INNOVATION_HUB_TAB_ID_OVERVIEW,
  INNOVATION_HUB_TAB_ID_PERFORMANCE_AND_BREAKDOWN,
  INNOVATION_HUB_VISIBLE_FILTER_FIELDS,
} from './constants';
import { Overview } from './tabs';

export const InnovationHub: React.FC = () => {
  const { formatMessage } = useIntl();

  const tabs = useMemo<TabInfo[]>(
    () => [
      createTab(
        INNOVATION_HUB_TAB_ID_OVERVIEW,
        'Overview',
        <Overview dataTestId="tabpanel-innovation-hub-overview" />,
        INNOVATION_HUB_TAB_DISABLED,
      ),
      createTab(
        INNOVATION_HUB_TAB_ID_PERFORMANCE_AND_BREAKDOWN,
        'Performance & Breakdown',
        <></>,
        INNOVATION_HUB_TAB_DISABLED,
      ),
    ],
    [],
  );

  return (
    <TabsWithFilters
      filter={{
        pageName: INNOVATION_HUB_PAGE_NAME,
        visibleFields: [...INNOVATION_HUB_VISIBLE_FILTER_FIELDS],
      }}
      tabConfig={{
        tabs,
        baseRoute: INNOVATION_HUB_BASE_ROUTE,
      }}
      dataTestId="innovation-hub"
      breadcrumbsList={[
        {
          href: '/innovation',
          pageName: formatMessage({ id: 'Pillars.pageName.innovation' }),
        },
        {
          href: INNOVATION_HUB_BASE_ROUTE,
          pageName: formatMessage({ id: 'Sidebar.innovation' }),
        },
      ]}
      isResponsivePage
    />
  );
};
