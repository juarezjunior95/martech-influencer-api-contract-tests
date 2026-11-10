import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { TabInfo, TabsWithFilters } from 'components';
import { createTab } from 'utils/tab';

import { Overview } from './tabs/Overview/Overview';

export const BEES_DISTRIBUTION_PAGE_NAME = 'trade-execution_bees-distribution';

export const BeesDistribution: React.FC = () => {
  const { formatMessage } = useIntl();
  const tabs = useMemo<TabInfo[]>(
    () => [
      createTab(
        'overview',
        'Overview',
        <Overview dataTestId="tabpanel-overview" />,
        false,
      ),
    ],
    [],
  );
  return (
    <TabsWithFilters
      dataTestId="bees-distribution"
      filter={{
        pageName: BEES_DISTRIBUTION_PAGE_NAME,
        visibleFields: ['zone', 'country', 'distribution_scopes', 'time_frame'],
      }}
      tabConfig={{
        tabs,
        baseRoute: '/trade-execution/bees-distribution',
      }}
      breadcrumbsList={[
        {
          href: '/trade-execution',
          pageName: formatMessage({ id: 'Pillars.pageName.tradeExecution' }),
        },
        {
          href: '/trade-execution/bees-distribution',
          pageName: formatMessage({ id: 'Sidebar.beesDistribution' }),
        },
      ]}
    />
  );
};
