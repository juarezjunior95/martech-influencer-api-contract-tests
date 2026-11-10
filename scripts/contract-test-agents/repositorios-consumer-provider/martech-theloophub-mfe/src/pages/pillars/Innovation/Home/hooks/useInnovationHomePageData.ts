import { useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useLastDataRefresh } from 'contexts';
import {
  useBffData,
  useMediaQuery,
  usePageFilterApplied,
  usePageFilterStatus,
  useSubFilters,
} from 'hooks';
import { BigNumberSparkLineCardData } from 'pages/components';
import { getViewtype } from 'utils/filter';

import { INNOVATION_PAGE_NAME } from '../../constants';
import type { HowWeDoItSection } from '../components';
import { HOW_WE_DO_IT_CONFIG } from '../constants';

export function useInnovationHomePageData() {
  const isDesktopLarge = useMediaQuery('(min-width: 1440px)');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setSubFilterValue } = useSubFilters();
  const { applied } = usePageFilterApplied(INNOVATION_PAGE_NAME);
  const { isLoading: filtersLoading } =
    usePageFilterStatus(INNOVATION_PAGE_NAME);
  const { lastDataRefreshKpisDateMonthYear } = useLastDataRefresh();

  const portfolioHealthDtEnd = useMemo(() => {
    return lastDataRefreshKpisDateMonthYear?.['portfolio-health'];
  }, [lastDataRefreshKpisDateMonthYear]);

  const pillarRennovationDtEnd = useMemo(() => {
    return lastDataRefreshKpisDateMonthYear?.['pillar-rennovation'];
  }, [lastDataRefreshKpisDateMonthYear]);

  const viewtype = useMemo(
    () => getViewtype(applied.country),
    [applied.country],
  );

  const portfolioHealthFilters = useMemo(() => {
    return {
      'portfolio-health': {
        country: applied.country,
        zone: applied.zone,
        viewtype,
        dt_end: portfolioHealthDtEnd,
      },
    };
  }, [applied.country, applied.zone, viewtype, portfolioHealthDtEnd]);

  const pillarRennovationFilters = useMemo(() => {
    return {
      'pillar-rennovation': {
        country: applied.country,
        viewtype,
        dt_end: pillarRennovationDtEnd,
      },
    };
  }, [applied.country, viewtype, pillarRennovationDtEnd]);

  const bffSubFilters = useMemo(
    () => ({
      ...portfolioHealthFilters,
      ...pillarRennovationFilters,
    }),
    [portfolioHealthFilters, pillarRennovationFilters],
  );

  const pageData = useBffData({
    id: 'innovation_home_home',
    kpiGroup: 'innovation',
    subFilters: bffSubFilters,
    skipRequest: filtersLoading,
  });

  const mainCardsData = useMemo(() => {
    const data = (pageData?.data?.['innovation-home-big-numbers-trend'] ||
      []) as BigNumberSparkLineCardData[];

    const findTrend = (legacyTitle: string, shortTitle: string) =>
      data.find((item) => item.chartTitle === legacyTitle) ??
      data.find((item) => item.chartTitle === shortTitle) ??
      null;

    return {
      innovationVolume: findTrend('Innovation Volume', 'Volume'),
      innovationNetRevenue: findTrend('Innovation Net Revenue', 'Net Revenue'),
    };
  }, [pageData]);

  const howWeDoItCardsData = useMemo(() => {
    const data = pageData?.data?.['innovation-home-big-numbers'] as Partial<
      Record<(typeof HOW_WE_DO_IT_CONFIG)[number]['dataKey'], HowWeDoItSection>
    > | null;
    return data ?? null;
  }, [pageData]);

  const onKpiClick = useCallback(
    (kpiId: string) => {
      setSubFilterValue('kpis', kpiId);
      const newParams = new URLSearchParams(searchParams);
      newParams.set('kpi', kpiId);
      navigate(
        `/innovation/innovation/performance-and-breakdown?${newParams.toString()}`,
      );
    },
    [navigate, searchParams, setSubFilterValue],
  );

  return {
    isDesktopLarge,
    pageData,
    mainCardsData,
    howWeDoItCardsData,
    onKpiClick,
  };
}

export type InnovationHomePageDataBundle = ReturnType<
  typeof useInnovationHomePageData
>;
