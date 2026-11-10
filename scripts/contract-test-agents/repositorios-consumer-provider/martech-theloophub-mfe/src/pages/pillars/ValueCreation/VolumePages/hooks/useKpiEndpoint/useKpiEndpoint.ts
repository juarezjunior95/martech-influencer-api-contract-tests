import { useMemo } from 'react';

import { featureToggles } from 'config/featureToggle';
import { useFeatureToggle } from 'hooks';
import { KpiConfig } from 'pages/pillars/ValueCreation/VolumePages/config/kpiConfigs';

type AppliedFilters = {
  product_scope?: unknown;
};

const isStringValue = (value: unknown): value is string =>
  typeof value === 'string';

const resolveAppliedProductScope = (applied?: AppliedFilters) => {
  return isStringValue(applied?.product_scope)
    ? applied.product_scope
    : undefined;
};

export const useKpiEndpoint = (config: KpiConfig, applied?: AppliedFilters) => {
  const [isProductScopeEnabled] = useFeatureToggle(
    featureToggles.pillar.valueCreation.submenus.volumePages.filters
      .productScope,
  );
  const productScope = resolveAppliedProductScope(applied);

  return useMemo(() => {
    if (!isProductScopeEnabled || !config.beerAdjEndpoints) {
      return config.endpoints;
    }

    return productScope === 'Beer + Adjacencies'
      ? config.beerAdjEndpoints
      : config.endpoints;
  }, [
    config.beerAdjEndpoints,
    config.endpoints,
    isProductScopeEnabled,
    productScope,
  ]);
};
