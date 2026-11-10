import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { FilterDataAccessor } from 'domain/Filter';

import { OVERVIEW_BASE_URL } from '../../../constants';
import { buildFilterSearchParams } from '../utils/buildFilterSearchParams';

interface UseDrillDownBreadcrumbsParams {
  applied: Record<string, string | undefined> | undefined;
  dataFilters: Record<string, unknown>;
}

interface BreadcrumbItem {
  pageName: string;
  href: string;
}

export function useDrillDownBreadcrumbs({
  applied,
  dataFilters,
}: UseDrillDownBreadcrumbsParams): BreadcrumbItem[] {
  const { formatMessage } = useIntl();

  return useMemo(() => {
    const zones = FilterDataAccessor.getInstance().getOptions(
      'zone',
      dataFilters,
      applied || {},
    );
    const hasGlobalZoneAccess = zones?.some((zone) => zone.value === 'ABI');

    const overviewHref = hasGlobalZoneAccess
      ? `${OVERVIEW_BASE_URL}?${buildFilterSearchParams(
          { years: applied?.years, segments: applied?.segments },
          { filter_zone: 'ABI', filter_country: 'ABI' },
        ).toString()}`
      : '';

    const pageList: BreadcrumbItem[] = [
      {
        pageName: 'Category',
        href: '/category',
      },
      {
        pageName: formatMessage({ id: 'Category.CategoryHealth.title' }),
        href: overviewHref,
      },
    ];

    if (hasGlobalZoneAccess) {
      pageList.push({
        pageName: 'Drill Down',
        href: '',
      });
    }

    return pageList;
  }, [dataFilters, applied, formatMessage]);
}
