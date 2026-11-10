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
import { StickyScrollWithFilters } from 'components';
import { useDataRefreshForTab } from 'contexts/DataRefreshModal/useDataRefreshForTab';
import { FilterDataAccessor } from 'domain/Filter';
import { useBffData } from 'hooks';
import { PageTitle } from 'pages/components';
import { StyledGridContainer, StyledTooltip } from 'shared/Styles';

import { FILTER_CONFIGS } from '../../constants';
import { useCategoryHealthFilters } from '../../hooks/useCategoryHealthFilters';
import { syncUrlFiltersToRedux } from '../../utils/syncUrlFiltersToRedux';
import {
  Drivers,
  LineChartPerformance,
  OvertimePerformance,
  ShareOfThroatPerformance,
} from './components';
import {
  CHART_DATA_TEST_ID,
  CHART_LINE_COLOR,
  SELECTED_KPI_TO_BACKEND_KPI,
  Y_AXIS_CONFIG,
} from './constants';
import { useDrillDownBreadcrumbs } from './hooks/useDrillDownBreadcrumbs';
import { KPIType } from './types';
import { extractChartResponse } from './utils/extractChartResponse';
import { mapBigNumbersResponse } from './utils/mapBigNumbersResponse';

const getLocationSearch = (): string =>
  globalThis.window === undefined ? '' : globalThis.window.location.search;

export const DrillDown: React.FC = () => {
  useEffect(() => {
    globalThis.scrollTo?.(0, 0);
  }, []);
  useDataRefreshForTab('Category Health - DrillDown');
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    applied,
    isLoaded,
    dataFilters,
    refreshDateLabel,
    handleClearAllAndNavigateOverview,
    dispatch,
  } = useCategoryHealthFilters();

  const [selectedKPI, setSelectedKPI] = useState<KPIType | undefined>(() => {
    const urlParams = new URLSearchParams(getLocationSearch());
    const selectedKpiFromUrl = urlParams.get(
      'overtime_performance',
    ) as KPIType | null;
    return selectedKpiFromUrl || 'volume';
  });
  const [initialFiltersLoaded, setInitialFiltersLoaded] = useState(false);

  const shouldSkipRequest =
    !initialFiltersLoaded ||
    !applied?.years ||
    !applied?.zone ||
    !applied?.segments;

  const filterKey = `${applied?.segments}-${applied?.country}-${applied?.years}`;
  const [loadedFilterKey, setLoadedFilterKey] = useState<string | null>(null);

  const viewtype =
    applied?.zone === 'ABI' || applied?.country === 'ABI'
      ? 'global'
      : 'country';

  const overtimePerformance = useBffData({
    id: 'category_category-health_drill-down_big-numbers-drill',
    kpiGroup: 'category-health',
    subFilters: {
      viewtype,
      category: applied?.segments,
      country: applied?.country,
      year: applied?.years,
    },
    skipMainFilters: false,
    skipRequest: shouldSkipRequest,
  });

  const isOvertimeStale =
    loadedFilterKey !== null && loadedFilterKey !== filterKey;

  const isOvertimeLoading = overtimePerformance.loading || isOvertimeStale;

  const overtimePerformanceData = useMemo(() => {
    if (isOvertimeStale) return undefined;

    const raw =
      overtimePerformance.data?.['category-health_drill-down-big-numbers'];

    if (!raw || !Array.isArray(raw)) return undefined;

    return mapBigNumbersResponse(raw);
  }, [overtimePerformance.data, isOvertimeStale]);

  const kpiResolvedForView = useMemo((): KPIType | undefined => {
    if (!selectedKPI) return selectedKPI;
    if (!overtimePerformanceData) return selectedKPI;
    const card = overtimePerformanceData.find((c) => c.kpiKey === selectedKPI);
    if (card?.data.length === 0 && selectedKPI !== 'volume') {
      return 'volume';
    }
    return selectedKPI;
  }, [selectedKPI, overtimePerformanceData]);

  const charts = useBffData({
    id: 'category_category-health_drill-down_line-chart-drill',
    kpiGroup: 'category-health',
    subFilters: {
      viewtype,
      category: applied?.segments,
      country: applied?.country,
      year: applied?.years,
      kpi_name: kpiResolvedForView
        ? SELECTED_KPI_TO_BACKEND_KPI[kpiResolvedForView]
        : undefined,
    },
    skipMainFilters: false,
    skipRequest:
      shouldSkipRequest || !overtimePerformanceData || !kpiResolvedForView,
  });

  useEffect(() => {
    if (overtimePerformance.data) {
      setLoadedFilterKey(filterKey);
    }
  }, [overtimePerformance.data, filterKey]);

  const handleKPISelect = useCallback(
    (kpi: string) => {
      setSelectedKPI(kpi as KPIType);

      const searchParams = new URLSearchParams(getLocationSearch());
      searchParams.set('overtime_performance', kpi);
      navigate(`?${searchParams.toString()}`, { replace: true });
    },
    [navigate],
  );

  useLayoutEffect(() => {
    if (!overtimePerformanceData || !selectedKPI) return;
    if (kpiResolvedForView !== selectedKPI && kpiResolvedForView) {
      handleKPISelect(kpiResolvedForView);
    }
  }, [
    overtimePerformanceData,
    selectedKPI,
    kpiResolvedForView,
    handleKPISelect,
  ]);

  const chartsTargetKey = useMemo(() => {
    if (!overtimePerformanceData || !kpiResolvedForView) return null;
    const kpiName = SELECTED_KPI_TO_BACKEND_KPI[kpiResolvedForView];
    if (!kpiName) return null;
    return `${filterKey}|${kpiName}`;
  }, [overtimePerformanceData, kpiResolvedForView, filterKey]);

  const [chartDataSyncedKey, setChartDataSyncedKey] = useState<string | null>(
    null,
  );
  const inFlightChartKeyRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    setChartDataSyncedKey(null);
  }, [chartsTargetKey]);

  useEffect(() => {
    if (charts.loading && chartsTargetKey) {
      inFlightChartKeyRef.current = chartsTargetKey;
    } else if (
      !charts.loading &&
      chartsTargetKey != null &&
      inFlightChartKeyRef.current === chartsTargetKey
    ) {
      setChartDataSyncedKey(chartsTargetKey);
      inFlightChartKeyRef.current = null;
    }
  }, [charts.loading, chartsTargetKey]);

  const chartVisualLoading =
    !overtimePerformanceData ||
    charts.loading ||
    (chartsTargetKey != null && chartDataSyncedKey !== chartsTargetKey);

  const { lineChartData, driversData, stackedAreaChartData } = useMemo(
    () => extractChartResponse(charts.data),
    [charts.data],
  );

  const pageTitle = useMemo(() => {
    const baseTitle = formatMessage({ id: 'Category.CategoryHealth.title' });

    const countryData = FilterDataAccessor.getInstance().getCountry(
      dataFilters,
      applied,
    );
    const countryLabel = countryData?.label;

    return countryLabel ? `${countryLabel} ${baseTitle}` : baseTitle;
  }, [dataFilters, formatMessage, applied]);

  const highlightYear = useMemo(() => {
    return applied?.years ? String(applied.years) : null;
  }, [applied?.years]);

  const breadcrumbPageList = useDrillDownBreadcrumbs({
    applied,
    dataFilters,
  });

  useEffect(() => {
    if (!isLoaded) return;
    const urlParams = new URLSearchParams(getLocationSearch());

    if (!initialFiltersLoaded) {
      const synced = syncUrlFiltersToRedux(dispatch, applied, {
        zone: urlParams.get('filter_zone'),
        country: urlParams.get('filter_country'),
        years: urlParams.get('filter_years'),
        segments: urlParams.get('filter_segments'),
      });
      if (synced) return;
      setInitialFiltersLoaded(true);
    }
  }, [
    isLoaded,
    applied?.country,
    applied?.zone,
    applied?.years,
    applied?.segments,
    initialFiltersLoaded,
    dispatch,
    applied,
  ]);

  useEffect(() => {
    if (!initialFiltersLoaded) return;

    const urlParams = new URLSearchParams(getLocationSearch());
    const currentKpiInUrl = urlParams.get('overtime_performance');

    if (!currentKpiInUrl && selectedKPI) {
      const searchParams = new URLSearchParams(getLocationSearch());
      searchParams.set('overtime_performance', selectedKPI);
      navigate(`?${searchParams.toString()}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFiltersLoaded, selectedKPI]);

  return (
    <div ref={containerRef}>
      <StickyScrollWithFilters
        filter={{
          pageName: FILTER_CONFIGS.pageName,
          visibleFields: FILTER_CONFIGS.visibleFields,
          onReset: handleClearAllAndNavigateOverview,
        }}
        breadcrumbs={{
          showIcon: true,
          pageList: breadcrumbPageList,
          dataTestId: 'drill-down',
        }}
        dataTestId="drill-down"
      />

      <StyledGridContainer>
        <Grid.Item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <PageTitle
            title={pageTitle}
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
            dataTestId="drill-down"
          />

          <OvertimePerformance
            refreshDateLabel={refreshDateLabel}
            selectedKPI={kpiResolvedForView}
            onKPISelect={handleKPISelect}
            data={overtimePerformanceData}
            productType={applied?.segments}
            loading={isOvertimeLoading}
            dataTestId="drill-down"
          />

          {kpiResolvedForView !== 'sot' && (
            <LineChartPerformance
              data={lineChartData}
              highlightLabel={highlightYear}
              dataTestId={
                kpiResolvedForView
                  ? CHART_DATA_TEST_ID[kpiResolvedForView]
                  : undefined
              }
              yAxisConfig={
                kpiResolvedForView
                  ? Y_AXIS_CONFIG[kpiResolvedForView]
                  : undefined
              }
              lineColor={
                kpiResolvedForView
                  ? CHART_LINE_COLOR[kpiResolvedForView]
                  : undefined
              }
              loading={chartVisualLoading}
            />
          )}

          {kpiResolvedForView === 'sot' && (
            <ShareOfThroatPerformance
              data={stackedAreaChartData}
              dataTestId="drill-down"
              loading={chartVisualLoading}
            />
          )}

          {kpiResolvedForView === 'volume' && (
            <Drivers
              data={driversData}
              highlightLabel={highlightYear}
              dataTestId="drill-down"
              loading={chartVisualLoading}
            />
          )}
        </Grid.Item>
      </StyledGridContainer>
    </div>
  );
};

export default DrillDown;
