import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { featureToggles } from 'config/featureToggle';
import {
  useBffData,
  useFeatureToggle,
  useMultiplesFeatureToggles,
  usePageFilterApplied,
  usePageFilterManagement,
} from 'hooks';
import { UseBffDataResponse } from 'hooks/useBffData/useBffData';

import {
  BEES_DISTRIBUTION_OVERVIEW_PATH,
  TRADE_EXECUTION_HOME_PAGE_NAME,
} from '../constants';

export type TradeExecutionHomePageData = Pick<
  UseBffDataResponse,
  'data' | 'loading' | 'error'
>;

interface UseTradeExecutionHomeReturn {
  isHomeContentEnabled: boolean;
  pageData: TradeExecutionHomePageData;
  handleCardClick: (distributionScope: string) => void;
  isAISummaryTotalEnabled: boolean;
  isAISummaryMegabrandsEnabled: boolean;
  togglesReady: boolean;
}

export const useTradeExecutionHome = (): UseTradeExecutionHomeReturn => {
  const navigate = useNavigate();
  const { apply: applyFilters, updateForm } = usePageFilterManagement(
    TRADE_EXECUTION_HOME_PAGE_NAME,
  );
  const { applied } = usePageFilterApplied(TRADE_EXECUTION_HOME_PAGE_NAME);

  const [tradeExecutionHomeContentEnabled, tradeExecutionHomeContentLoading] =
    useFeatureToggle(
      featureToggles.pillar.tradeExecution.trade_execution_home_content,
    );

  const isHomeContentEnabled =
    tradeExecutionHomeContentEnabled && !tradeExecutionHomeContentLoading;

  const pageData = useBffData({
    id: 'trade-execution_home_home',
    kpiGroup: 'bees-distribution',
    subFilters: {
      zone: applied.zone,
      country: applied.country,
    },
  });

  const { featuresListByToggleName: tabToggles, togglesReady } =
    useMultiplesFeatureToggles([
      featureToggles.pillar.tradeExecution.home.aiSummary.total,
      featureToggles.pillar.tradeExecution.home.aiSummary.megabrands,
    ]);

  const isAISummaryTotalEnabled =
    tabToggles[featureToggles.pillar.tradeExecution.home.aiSummary.total];

  const isAISummaryMegabrandsEnabled =
    tabToggles[featureToggles.pillar.tradeExecution.home.aiSummary.megabrands];

  const handleCardClick = useCallback(
    (distributionScope: string) => {
      updateForm('distribution_scopes', distributionScope);
      applyFilters();
      navigate(BEES_DISTRIBUTION_OVERVIEW_PATH);
    },
    [updateForm, applyFilters, navigate],
  );

  return {
    isHomeContentEnabled,
    pageData,
    handleCardClick,
    isAISummaryTotalEnabled,
    isAISummaryMegabrandsEnabled,
    togglesReady,
  };
};
