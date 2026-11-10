import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';

import {
  BarClickParams,
  ViewByDisabledCondition,
  WaterfallConfig,
} from './types';

const POWER_VIEW_BY_DISABLED_CONDITIONS: ViewByDisabledCondition[] = [
  ({ contextKey }) => contextKey === 'portfolio',
  ({ applied }) =>
    Boolean(
      applied?.portfolios &&
      applied.portfolios !== 'All' &&
      applied.country === 'ABI',
    ),
];

export const powerWaterfallConfig: WaterfallConfig = {
  kpiName: 'power',

  viewByToGrouping: {
    portfolio: 'Portfolio',
    brand: 'All Brands',
    country: 'All Brands',
  },

  groupingToViewBy: {
    country: { Portfolio: 'portfolio', 'All Brands': 'brand' },
    global: { Portfolio: 'portfolio', 'All Brands': 'country' },
  },

  isViewByDisabled: (contextKey, activeSubFilters, applied) =>
    POWER_VIEW_BY_DISABLED_CONDITIONS.some((condition) =>
      condition({ contextKey, activeSubFilters, applied }),
    ),

  getDisabledIndexes: (labels = []) => {
    const indices = new Set<number>([0, labels.length - 1]);
    labels.forEach((label, index) => {
      const blockedLabels = ['EUR', 'Others', 'N/A'];
      if (blockedLabels.includes(label)) {
        indices.add(index);
      }
    });
    return Array.from(indices);
  },

  handleBarClick: ({
    index,
    labels,
    activeSubFilters,
    dataFilters,
    updateForm,
    apply,
  }: BarClickParams) => {
    const clickedLabel = labels?.[index];
    if (!clickedLabel) return;

    const currentView = activeSubFilters?.waterfall_view_by;

    if (currentView === 'country') {
      const accessor = FilterDataAccessor.getInstance();
      const zoneOption = accessor.getZoneByCountry(dataFilters, clickedLabel);
      if (zoneOption) {
        updateForm('zone', String(zoneOption.value));
        updateForm('country', clickedLabel);
        apply();
      }
    }

    if (currentView === 'brand') {
      updateForm('brands', clickedLabel);
      apply();
    }

    if (currentView === 'portfolio') {
      updateForm('brand_filter_groupings', 'Portfolio');
      updateForm('portfolios', clickedLabel);
      updateForm('brands', 'All');
      apply();
    }
  },

  shouldSyncSubFilters: (contextKey) => {
    return contextKey === 'country' || contextKey === 'global';
  },

  getViewByForForcedSync: (applied) => {
    if (
      applied?.portfolios &&
      applied?.portfolios !== 'All' &&
      applied?.country === 'ABI'
    ) {
      return 'country';
    }
    return null;
  },

  getContextKey: (applied, isGlobalZone) => {
    if (!applied) return 'global';
    if (
      applied.portfolios &&
      applied.portfolios !== 'All' &&
      applied.country !== 'ABI'
    )
      return 'portfolio';
    if (!isGlobalZone) return 'country';
    return 'global';
  },
};
