import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { TabInfo, TabsWithFilters } from 'components';
import { brandPowerBookVisibleFilters } from 'pages/constants';
import { createTab } from 'utils/tab';

import { PowerBook } from './tabs';

export const BRAND_POWER_BOOK_PAGE_NAME = 'portfolio-brand_brand-power-results';

export const BrandPowerBook: React.FC = () => {
  const { formatMessage } = useIntl();
  const tabs = useMemo<TabInfo[]>(
    () => [
      createTab(
        'power-book',
        'Overview',
        <PowerBook dataTestId="tabpanel-power-book" />,
        false,
      ),
    ],
    [],
  );

  return (
    <TabsWithFilters
      dataTestId="brand-power-book"
      filter={{
        pageName: BRAND_POWER_BOOK_PAGE_NAME,
        visibleFields: brandPowerBookVisibleFilters,
      }}
      tabConfig={{
        tabs,
        baseRoute: '/portfolio-brand/brand-power-book',
      }}
      breadcrumbsList={[
        {
          href: '/portfolio-brand',
          pageName: formatMessage({ id: 'Pillars.pageName.portfolioBrand' }),
        },
        {
          href: '/portfolio-brand/brand-power-book',
          pageName: formatMessage({ id: 'Sidebar.brandPowerBook' }),
        },
      ]}
    />
  );
};
