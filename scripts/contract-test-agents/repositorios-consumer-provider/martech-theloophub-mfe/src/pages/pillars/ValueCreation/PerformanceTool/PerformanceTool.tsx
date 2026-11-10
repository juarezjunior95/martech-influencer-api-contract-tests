import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { PageHeader, StickyScrollWithFilters } from 'components';
import {
  useCurrentPage,
  usePageFilterApplied,
  usePageFilterData,
  usePageFilterManagement,
  usePageFilterStatus,
} from 'hooks';
import { StyledGridContainer, StyledHomeContainer } from 'shared/Styles';

import { KpiSwitch } from './components/KpiSwitch/KpiSwitch';
import { PERFORMANCE_TOOL_PAGE_NAME } from './constants';
import { WATERFALL_RESET_EVENT } from './hooks/useWaterfallViewBySync';
import { getPageSubtitleByKpi, getPageTitleByKpi } from './utils';

const FILTER_VISIBLE_FIELDS: string[] = [
  'zone',
  'country',
  'brand_filter_groupings',
  'portfolios',
  'beer_price_segment',
  'growth_levers',
  'global_brands',
  'brands',
  'sub_brands',
  'periods',
  'kpis',
];

export const PerformanceTool: React.FC = () => {
  const { currentPage } = useCurrentPage();
  const { formatMessage } = useIntl();

  const { applied } = usePageFilterApplied(currentPage);
  const { dataFilters } = usePageFilterData(currentPage);
  const { isLoading: isFilterLoading } = usePageFilterStatus(currentPage);

  const { updateForm, apply } = usePageFilterManagement(
    PERFORMANCE_TOOL_PAGE_NAME,
  );

  const pageTitle = useMemo(
    () => getPageTitleByKpi(dataFilters, applied),
    [dataFilters, applied],
  );

  const pageSubtitle = useMemo(
    () => formatMessage({ id: getPageSubtitleByKpi(applied.kpis as string) }),
    [applied.kpis, formatMessage],
  );

  const handleFilterChange = (key: string, value: string) => {
    updateForm(key, value);
    apply();
  };

  const handleFilterReset = useCallback(() => {
    globalThis.dispatchEvent(new Event(WATERFALL_RESET_EVENT));
  }, []);

  return (
    <>
      <StickyScrollWithFilters
        filter={{
          pageName: PERFORMANCE_TOOL_PAGE_NAME,
          visibleFields: FILTER_VISIBLE_FIELDS,
          onReset: handleFilterReset,
        }}
        breadcrumbs={{
          pageList: [
            { href: '/value-creation', pageName: 'Value Creation' },
            {
              href: '/value-creation/performance-tool',
              pageName: 'Performance Tool',
            },
          ],
          showIcon: true,
        }}
        isResponsivePage
        dataTestId="performance-tool-navigation"
      />

      <StyledGridContainer isResponsivePage>
        <StyledHomeContainer>
          <PageHeader
            title={pageTitle}
            subtitle={pageSubtitle}
            loading={isFilterLoading}
          />
          <KpiSwitch
            kpi={applied.kpis as string}
            onFilterChange={handleFilterChange}
          />
        </StyledHomeContainer>
      </StyledGridContainer>
    </>
  );
};
