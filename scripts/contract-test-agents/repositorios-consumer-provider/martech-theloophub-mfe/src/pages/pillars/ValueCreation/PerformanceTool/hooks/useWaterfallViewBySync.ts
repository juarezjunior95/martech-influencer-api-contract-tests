import { useCallback, useEffect, useMemo, useRef } from 'react';

import {
  useCurrentPage,
  usePageFilterApplied,
  usePageFilterManagement,
  useSubFilters,
} from 'hooks';
import { WaterfallConfig } from 'pages/pillars/ValueCreation/PerformanceTool/config';

const WF_VIEW_BY_PARAM = 'waterfall_view_by';
export const WATERFALL_RESET_EVENT = 'waterfall:filter-reset';

let waterfallViewBySelectionCache: string | null = null;

function getUrlParam(key: string): string | null {
  return new URLSearchParams(globalThis.location.search).get(key);
}

function updateUrlParam(key: string, value?: string): void {
  const params = new URLSearchParams(globalThis.location.search);
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
  globalThis.history.replaceState({}, '', `?${params.toString()}`);
}

interface UseWaterfallViewBySyncParams {
  config: WaterfallConfig;
  contextKey: string;
}

export const useWaterfallViewBySync = ({
  config,
  contextKey,
}: UseWaterfallViewBySyncParams) => {
  const { currentPage } = useCurrentPage();
  const { applied } = usePageFilterApplied(currentPage);
  const { updateForm, apply } = usePageFilterManagement(currentPage);
  const { setSubFilterValue } = useSubFilters();

  const urlViewByRef = useRef<string | null>(getUrlParam(WF_VIEW_BY_PARAM));
  const prevSyncKeyRef = useRef<{ key: string; forced: boolean } | null>(null);
  const prevContextKeyRef = useRef<string>(contextKey);

  const viewByToGrouping = config.viewByToGrouping;

  const handleViewByChange = useCallback(
    (value: string) => {
      const newGrouping = viewByToGrouping[value];

      if (contextKey === 'global') {
        waterfallViewBySelectionCache = value;
      }

      updateUrlParam(WF_VIEW_BY_PARAM, newGrouping ? undefined : value);

      if (!newGrouping) {
        prevSyncKeyRef.current = null;
        return;
      }

      if (applied?.brand_filter_groupings === newGrouping) {
        return;
      }

      updateForm('brand_filter_groupings', newGrouping);
      apply();
    },
    [
      applied?.brand_filter_groupings,
      viewByToGrouping,
      updateForm,
      apply,
      contextKey,
    ],
  );

  const relevantAppliedFilters = useMemo(
    () => ({
      beer_price_segment: applied?.beer_price_segment,
      brand_filter_groupings: applied?.brand_filter_groupings,
      distribution_scopes: applied?.distribution_scopes,
      portfolios: applied?.portfolios,
      country: applied?.country,
      global_brands: applied?.global_brands,
      zone: applied?.zone,
      brands: applied?.brands,
      sub_brands: applied?.sub_brands,
      kpis: applied?.kpis,
      value_creation_levers: applied?.value_creation_levers,
    }),
    [
      applied?.beer_price_segment,
      applied?.brand_filter_groupings,
      applied?.distribution_scopes,
      applied?.portfolios,
      applied?.country,
      applied?.global_brands,
      applied?.zone,
      applied?.brands,
      applied?.sub_brands,
      applied?.kpis,
      applied?.value_creation_levers,
    ],
  );

  useEffect(() => {
    return () => updateUrlParam(WF_VIEW_BY_PARAM);
  }, []);

  useEffect(() => {
    const handleFilterReset = () => {
      updateUrlParam(WF_VIEW_BY_PARAM);
      prevSyncKeyRef.current = null;
      waterfallViewBySelectionCache = null;
      const grouping = applied?.brand_filter_groupings as string;
      const expectedViewBy = config.groupingToViewBy[contextKey]?.[grouping];
      if (expectedViewBy) {
        setSubFilterValue('waterfall_view_by', expectedViewBy);
      }
    };
    globalThis.addEventListener(WATERFALL_RESET_EVENT, handleFilterReset);
    return () =>
      globalThis.removeEventListener(WATERFALL_RESET_EVENT, handleFilterReset);
  }, [config, contextKey, applied, setSubFilterValue]);

  useEffect(() => {
    if (!config.shouldSyncSubFilters?.(contextKey)) {
      prevContextKeyRef.current = contextKey;
      return;
    }

    const grouping = relevantAppliedFilters?.brand_filter_groupings as string;
    if (!grouping) {
      prevContextKeyRef.current = contextKey;
      return;
    }

    const syncKey = `${contextKey}|${grouping}`;
    const contextKeyChanged = prevContextKeyRef.current !== contextKey;
    prevContextKeyRef.current = contextKey;

    const forcedViewBy = config.getViewByForForcedSync?.(
      relevantAppliedFilters,
    );
    if (forcedViewBy) {
      setSubFilterValue('waterfall_view_by', forcedViewBy);
      updateUrlParam(WF_VIEW_BY_PARAM);
      urlViewByRef.current = null;
      prevSyncKeyRef.current = { key: syncKey, forced: true };
      return;
    }

    if (urlViewByRef.current) {
      setSubFilterValue('waterfall_view_by', urlViewByRef.current);
      updateUrlParam(WF_VIEW_BY_PARAM, urlViewByRef.current);
      urlViewByRef.current = null;
      prevSyncKeyRef.current = { key: syncKey, forced: false };
      return;
    }

    const prev = prevSyncKeyRef.current;
    const isFirstRun = prev === null;
    const keyChanged = !isFirstRun && prev.key !== syncKey;
    const wasPrevForced = prev?.forced ?? false;
    const isReturningToGlobal = contextKeyChanged && contextKey === 'global';

    prevSyncKeyRef.current = { key: syncKey, forced: false };

    if (!isFirstRun && !keyChanged && !wasPrevForced && !contextKeyChanged) {
      return;
    }

    if (isReturningToGlobal && waterfallViewBySelectionCache) {
      setSubFilterValue('waterfall_view_by', waterfallViewBySelectionCache);
      updateUrlParam(WF_VIEW_BY_PARAM);
      return;
    }

    const expectedViewBy = config.groupingToViewBy[contextKey]?.[grouping];
    if (expectedViewBy) {
      setSubFilterValue('waterfall_view_by', expectedViewBy);
      updateUrlParam(WF_VIEW_BY_PARAM);
    }
  }, [config, contextKey, relevantAppliedFilters, setSubFilterValue]);

  return { handleViewByChange };
};
