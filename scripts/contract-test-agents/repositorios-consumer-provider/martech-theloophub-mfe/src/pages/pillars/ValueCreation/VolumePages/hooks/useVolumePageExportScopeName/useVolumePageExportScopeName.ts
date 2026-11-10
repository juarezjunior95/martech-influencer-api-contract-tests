import { useMemo } from 'react';

import { featureToggles } from 'config/featureToggle';
import { useFeatureToggle, usePageFilterApplied } from 'hooks';
import {
  KPI_TO_PAGE_NAME,
  useVolumePagesKpi,
} from 'pages/pillars/ValueCreation/VolumePages/contexts';

export const useVolumePageExportScopeName = () => {
  const { kpi } = useVolumePagesKpi();
  const [showProductScopeFilter, isProductScopeFilterLoading] =
    useFeatureToggle(
      featureToggles.pillar.valueCreation.submenus.volumePages.filters
        .productScope,
    );
  const isProductScopeVisible =
    showProductScopeFilter && !isProductScopeFilterLoading;
  const { applied } = usePageFilterApplied(KPI_TO_PAGE_NAME[kpi]);
  const selectedProductScope =
    typeof applied?.product_scope === 'string'
      ? applied.product_scope
      : undefined;

  return useMemo(
    () =>
      isProductScopeVisible && selectedProductScope === 'Beer + Adjacencies'
        ? 'Beer + Adj'
        : 'Total ABI',
    [isProductScopeVisible, selectedProductScope],
  );
};
