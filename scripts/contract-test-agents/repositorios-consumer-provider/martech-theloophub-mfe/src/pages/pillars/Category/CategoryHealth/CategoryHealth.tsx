import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Grid } from '@hexa-ui/components';
import { CalendarClock } from '@hexa-ui/icons2';
import {
  BasicContainer,
  NoDataYet,
  Skeleton,
  StickyScrollWithFilters,
  Tag,
} from 'components';
import { type CellClickEvent, DataTable } from 'components/TableComponent';
import { useDataRefreshForTab } from 'contexts/DataRefreshModal/useDataRefreshForTab';
import { zonesFilterConfig } from 'domain/Filter/FilterRegistry/configs';
import { useBffData } from 'hooks';
import { PageTitle } from 'pages/components';
import { applyFilters, updateFormValue } from 'redux/slices/filters';
import { StyledGridContainer, StyledTooltip } from 'shared/Styles';

import {
  StyledNoDataContainer,
  StyledOverviewContainer,
} from './CategoryHealth.styles';
import {
  DEFAULT_PRODUCT_TYPE,
  DRILL_DOWN_BASE_URL,
  FILTER_CONFIGS,
  GLOBAL_ZONE,
  KPI_COLUMN_MAPPING,
} from './constants';
import { useCategoryHealthFilters } from './hooks/useCategoryHealthFilters';
import { syncUrlFiltersToRedux } from './utils/syncUrlFiltersToRedux';

export const CategoryHealth: React.FC = () => {
  useEffect(() => {
    globalThis.scrollTo?.(0, 0);
  }, []);
  useDataRefreshForTab('Category Health - Overview');
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const [initialFiltersLoaded, setInitialFiltersLoaded] = useState(false);
  const hasUrlFilterParams = useRef(false);

  const {
    applied,
    dataFilters,
    defaults,
    isLoaded,
    refreshDateLabel,
    dispatch,
  } = useCategoryHealthFilters();

  const shouldSkipRequest =
    !initialFiltersLoaded ||
    !applied?.years ||
    !applied?.zone ||
    !applied?.segments;

  const overview = useBffData({
    id: 'category_category-health_overview',
    kpiGroup: 'category-health',
    subFilters: {
      year: String(applied?.years),
      category: String(applied?.segments),
    },
    skipMainFilters: false,
    skipRequest: shouldSkipRequest,
  });

  const overviewData = useMemo(
    () => overview.data?.['category-health_overview']?.tableData ?? null,
    [overview.data],
  );

  const handleCellClick = useCallback(
    (event: CellClickEvent) => {
      const { columnId, rowData } = event;

      const countriesCell = rowData.countries;
      const countryValue =
        typeof countriesCell?.value === 'string' ? countriesCell.value : '';

      const isGroupRow = /^M\d+$/.test(countryValue);

      if (isGroupRow) {
        return;
      }

      const clickedCell = rowData[columnId];
      const cellValue =
        typeof clickedCell === 'object' ? clickedCell?.value : clickedCell;

      if (!cellValue || cellValue === '-') {
        return;
      }

      const isWmtbbColumn =
        columnId === 'wmtbb_fy' || columnId === 'wmtbb_vsly';
      const productType = String(applied?.segments || DEFAULT_PRODUCT_TYPE);

      if (isWmtbbColumn && productType !== DEFAULT_PRODUCT_TYPE) {
        return;
      }

      const fullYear = String(applied?.years);
      const zone = String(countriesCell?.zone || applied?.zone);

      const params = new URLSearchParams();

      params.set('filter_years', fullYear);
      params.set('filter_zone', zone);
      params.set('filter_segments', productType);
      params.set('filter_country', countryValue);

      const kpi = KPI_COLUMN_MAPPING[columnId];
      if (kpi) {
        params.set('overtime_performance', kpi);
      } else {
        params.set('overtime_performance', 'volume');
      }

      navigate(`${DRILL_DOWN_BASE_URL}?${params.toString()}`);
    },
    [applied, navigate],
  );

  const [initialParams, setInitialParams] = useState<
    Record<string, string | null>
  >({});
  const locationSearch = useMemo(
    () =>
      globalThis.window === undefined ? '' : globalThis.window.location.search,
    [],
  );

  useLayoutEffect(() => {
    const urlParams = new URLSearchParams(locationSearch);
    hasUrlFilterParams.current = Array.from(urlParams.keys()).some((k) =>
      k.startsWith('filter_'),
    );

    setInitialParams({
      filter_zone: urlParams.get('filter_zone') ?? GLOBAL_ZONE,
      filter_country: urlParams.get('filter_country'),
      filter_years: urlParams.get('filter_years'),
      filter_segments: urlParams.get('filter_segments'),
    });
  }, [locationSearch]);

  useEffect(() => {
    if (initialFiltersLoaded || !isLoaded) return;

    if (!hasUrlFilterParams.current) {
      if (!applied?.country) {
        dispatch(updateFormValue({ key: 'zone', value: 'ABI' }));
        dispatch(updateFormValue({ key: 'country', value: 'ABI' }));
        dispatch(applyFilters());
      }
      setInitialFiltersLoaded(true);
      return;
    }

    const synced = syncUrlFiltersToRedux(dispatch, applied, {
      zone: zonesFilterConfig.validator(dataFilters, initialParams.filter_zone)
        ? initialParams.filter_zone
        : ((defaults?.zone as string) ?? GLOBAL_ZONE),
      country: initialParams.filter_country,
      years: initialParams.filter_years ?? (defaults?.years as string),
      segments: initialParams.filter_segments ?? (defaults?.segments as string),
    });

    if (synced) return;
    setInitialFiltersLoaded(true);
  }, [
    isLoaded,
    applied,
    initialFiltersLoaded,
    dispatch,
    dataFilters,
    defaults,
    initialParams,
  ]);

  useEffect(() => {
    if (!initialFiltersLoaded || !isLoaded) {
      return;
    }
    if (applied?.zone !== GLOBAL_ZONE) {
      const searchParams = new URLSearchParams();
      searchParams.set('overtime_performance', 'volume');
      if (applied?.zone) searchParams.set('filter_zone', String(applied.zone));
      if (applied?.country)
        searchParams.set('filter_country', String(applied.country));
      if (applied?.years)
        searchParams.set('filter_years', String(applied.years));
      if (applied?.segments)
        searchParams.set('filter_segments', String(applied.segments));
      navigate(`${DRILL_DOWN_BASE_URL}?${searchParams.toString()}`, {
        replace: true,
      });
    }
  }, [isLoaded, initialFiltersLoaded, applied, navigate]);

  const overviewContent = useMemo(() => {
    if (!applied || overview.loading) {
      return (
        <Skeleton
          width="100%"
          height="600px"
          length={1}
          dataTestId="loading-skeleton-category-health-overview"
        />
      );
    }

    if (overviewData) {
      return (
        <DataTable
          data={overviewData}
          showAxis
          headerGap
          headerColumnGap
          groupBorder
          rowBorder={false}
          axisClickable={true}
          rowHover
          cellHover
          disableHighlightHover={true}
          hoverRowColumn={true}
          onCellClick={handleCellClick}
          dataTestId="table-category-health-overview"
        />
      );
    }

    return (
      <StyledNoDataContainer>
        <NoDataYet dataTestId="no-data-category-health-overview" />
      </StyledNoDataContainer>
    );
  }, [applied, overview.loading, overviewData, handleCellClick]);

  return (
    <>
      <StickyScrollWithFilters
        filter={{
          pageName: FILTER_CONFIGS.pageName,
          visibleFields: FILTER_CONFIGS.visibleFields,
        }}
        breadcrumbs={{
          showIcon: true,
          pageList: [
            {
              pageName: 'Category',
              href: '/category',
            },
            {
              pageName: formatMessage({
                id: 'Category.CategoryHealth.title',
              }),
              href: '',
            },
          ],
          dataTestId: 'breadcrumbs-category-health-overview',
        }}
        dataTestId="filter-category-health-overview"
      />

      <StyledGridContainer>
        <Grid.Item
          xs={12}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <PageTitle
            title={formatMessage({ id: 'Category.CategoryHealth.title' })}
            description={formatMessage({
              id: 'Category.CategoryHealth.description',
            })}
            tooltip={
              <StyledTooltip>
                {formatMessage({
                  id: 'Category.CategoryHealth.tooltip',
                })}
              </StyledTooltip>
            }
            dataTestId="page-title"
          />

          <BasicContainer
            header={{
              title: formatMessage({
                id: 'Category.CategoryHealth.Overview.title',
              }),
              titleSize: 'H2',
              bottomTag: refreshDateLabel ? (
                <Tag Icon={CalendarClock} text={`: ${refreshDateLabel}`} />
              ) : null,
            }}
            layout={{ bodyPadding: true, background: '#F9F9F9' }}
            dataTestId="basic-container-category-health-overview"
          >
            <StyledOverviewContainer>{overviewContent}</StyledOverviewContainer>
          </BasicContainer>
        </Grid.Item>
      </StyledGridContainer>
    </>
  );
};

export default CategoryHealth;
