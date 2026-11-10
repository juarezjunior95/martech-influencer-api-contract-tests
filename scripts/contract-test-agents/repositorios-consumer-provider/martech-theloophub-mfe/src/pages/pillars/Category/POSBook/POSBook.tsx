import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { TabInfo, TabsWithFilters } from 'components';
import { featureToggles } from 'config/featureToggle';
import { useMultiplesFeatureToggles } from 'hooks';
import { createTab } from 'utils/tab';

import { GrowTheCategory, LeadTheCategory } from './tabs';

export const POS_BOOK_PAGE_NAME = 'category_pos-results';

export const POSBook: React.FC = () => {
  const { formatMessage } = useIntl();
  const { featuresListByToggleName: tabToggles, togglesReady } =
    useMultiplesFeatureToggles([
      featureToggles.pillar.category.submenus.posBook.tab.growCategory.id,
      featureToggles.pillar.category.submenus.posBook.tab.leadCategory.id,
    ]);

  const tabs = useMemo<TabInfo[]>(
    () => [
      createTab(
        'grow',
        'Grow the Category',
        <GrowTheCategory dataTestId="tabpanel-grow-the-category" />,
        !tabToggles[
          featureToggles.pillar.category.submenus.posBook.tab.growCategory.id
        ],
      ),
      createTab(
        'lead',
        'Lead the Category',
        <LeadTheCategory dataTestId="tabpanel-lead-the-category" />,
        !tabToggles[
          featureToggles.pillar.category.submenus.posBook.tab.leadCategory.id
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
      dataTestId="pos-book"
      filter={{
        pageName: POS_BOOK_PAGE_NAME,
        visibleFields: ['zone', 'country', 'pos_periods', 'time_frame'],
      }}
      tabConfig={{
        tabs: tabs,
        baseRoute: '/category/pos',
      }}
      breadcrumbsList={[
        {
          pageName: formatMessage({ id: 'Pillars.pageName.category' }),
          href: '/category',
        },
        {
          pageName: formatMessage({ id: 'Sidebar.posBook' }),
          href: '/category/pos-book',
        },
      ]}
    />
  );
};
