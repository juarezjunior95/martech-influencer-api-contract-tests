import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { FilterValue } from 'models';

import {
  BarClickParams,
  ViewByDisabledCondition,
  WaterfallConfig,
  WaterfallConfigOverrides,
} from './types';

const BASE_VIEW_BY_DISABLED_CONDITIONS: ViewByDisabledCondition[] = [
  ({ activeSubFilters }) => activeSubFilters?.waterfall_view_by === 'sub_brand',
  ({ applied }) => applied?.zone === 'EUR' && applied?.brands !== 'All',
  ({ applied }) => applied?.global_brands && applied?.global_brands !== 'All',
  ({ contextKey, applied }) =>
    contextKey === 'portfolio' &&
    Boolean(
      applied?.portfolios &&
      applied.portfolios !== 'All' &&
      applied.country !== 'ABI',
    ),
  ({ contextKey, applied }) =>
    (contextKey === 'beer_price_segment' || contextKey === 'country') &&
    Boolean(
      applied?.beer_price_segment &&
      applied.beer_price_segment !== 'All' &&
      applied.country !== 'ABI',
    ),
];

const BASE_ALLOWED_CONTEXTS = [
  'brand',
  'beer_price_segment',
  'portfolio',
  'country',
  'global',
  'beyond_beer_global',
  'beyond_beer_country',
];

const BASE_GROUPING_TO_VIEW_BY: Record<string, Record<string, string>> = {
  portfolio: {
    Portfolio: 'brand',
    'All Brands': 'brand',
  },
  beer_price_segment: {
    'Beer Price Segment': 'brand',
  },
  brand: {
    'All Brands': 'sub_brand',
    Portfolio: 'sub_brand',
    'Beer Price Segment': 'sub_brand',
  },
  global: {
    Portfolio: 'portfolio',
    'All Brands': 'brand',
    'Beer Price Segment': 'beer_price_segment',
    'Global Brands': 'country',
  },
  country: {
    Portfolio: 'portfolio',
    'All Brands': 'brand',
    'Beer Price Segment': 'beer_price_segment',
    'Global Brands': 'country',
  },
  beyond_beer_global: {
    Portfolio: 'portfolio',
    'All Brands': 'brand',
    'Beer Price Segment': 'beer_price_segment',
    'Global Brands': 'country',
  },
  beyond_beer_country: {
    Portfolio: 'portfolio',
    'All Brands': 'brand',
  },
};

export const createBaseWaterfallConfig = (
  kpiName: string,
  overrides?: WaterfallConfigOverrides,
): WaterfallConfig => ({
  kpiName,

  viewByToGrouping: {
    brand: 'All Brands',
    portfolio: 'Portfolio',
    beer_price_segment: 'Beer Price Segment',
    global: 'Global Brands',
  },

  groupingToViewBy: {
    ...BASE_GROUPING_TO_VIEW_BY,
    ...overrides?.additionalGroupingToViewBy,
  },

  isViewByDisabled: (contextKey, activeSubFilters, applied) =>
    BASE_VIEW_BY_DISABLED_CONDITIONS.some((condition) =>
      condition({ contextKey, activeSubFilters, applied }),
    ) ||
    overrides?.isViewByDisabled?.({ contextKey, activeSubFilters, applied }),

  getDisabledIndexes: (labels = [], context?: { country?: string }) => {
    const indices = new Set<number>([0, labels.length - 1]);

    labels.forEach((label, index) => {
      const parsedLabel = Array.isArray(label) ? label[0] : label;

      if (['N/A', 'NAB + Others', 'Others'].includes(parsedLabel)) {
        indices.add(index);
      }

      if (
        parsedLabel === 'Other' &&
        ['ABI', 'Global', 'CAN'].includes(context?.country ?? '')
      ) {
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
    applied,
    updateForm,
    apply,
  }: BarClickParams) => {
    const clickedLabel = labels?.[index];
    if (!clickedLabel) return;

    const currentView = activeSubFilters?.waterfall_view_by as string;
    const accessor = FilterDataAccessor.getInstance();

    const handleCountryView = () => {
      if (clickedLabel === 'EUR') {
        updateForm('zone', 'EUR');

        if (applied.global_brands) {
          updateForm('global_brands', null);
          updateForm('brands', String(applied.global_brands));
        }

        apply();
        return;
      }

      const zoneOption = accessor.getZoneByCountry(dataFilters, clickedLabel);

      if (zoneOption) {
        updateForm('zone', String(zoneOption.value));
        updateForm('country', clickedLabel);
      }

      if (applied.brand_filter_groupings === 'Global Brands') {
        const globalBrand = applied.global_brands || applied.brands;

        updateForm('brand_filter_groupings', 'Global Brands');

        if (globalBrand) {
          updateForm('global_brands', String(globalBrand));
        }
      } else if (applied.brands) {
        updateForm('brands', String(applied.brands));
      }

      apply();
    };

    const handleBrandView = () => {
      const brandLabel = Array.isArray(clickedLabel)
        ? clickedLabel[0]
        : clickedLabel;

      const zoneOption = accessor.getZoneByCountry(
        dataFilters,
        clickedLabel[1],
      );

      if (zoneOption) {
        updateForm('zone', String(zoneOption.value));
        updateForm('country', clickedLabel[1]);
      }

      if (clickedLabel[1] === 'ABI') {
        updateForm('brand_filter_groupings', 'Global Brands');
        updateForm('global_brands', clickedLabel[0]);
        apply();
        return;
      }

      if (hasSpecificValue(applied.portfolios)) {
        updateForm('brand_filter_groupings', 'Portfolio');
        updateForm('portfolios', String(applied.portfolios));
      }

      if (hasSpecificValue(applied.beer_price_segment)) {
        updateForm('brand_filter_groupings', 'Beer Price Segment');
        updateForm('beer_price_segment', String(applied.beer_price_segment));
      }

      updateForm('brands', brandLabel);
      apply();
    };

    const handlePortfolioView = () => {
      updateForm('brand_filter_groupings', 'Portfolio');
      updateForm('portfolios', clickedLabel);
      apply();
    };

    const handleBeerPriceSegmentView = () => {
      updateForm('brand_filter_groupings', 'Beer Price Segment');
      updateForm('beer_price_segment', clickedLabel);
      updateForm('brands', 'All');
      apply();
    };

    const handleSubBrandView = () => {
      updateForm('sub_brands', clickedLabel);
      apply();
    };

    const handlers: Record<string, VoidFunction> = {
      country: handleCountryView,
      brand: handleBrandView,
      portfolio: handlePortfolioView,
      beer_price_segment: handleBeerPriceSegmentView,
      sub_brand: handleSubBrandView,
    };

    handlers[currentView]?.();
  },

  shouldSyncSubFilters: (contextKey) => {
    const allowedContexts = [
      ...BASE_ALLOWED_CONTEXTS,
      ...(overrides?.additionalAllowedContexts || []),
    ];

    return allowedContexts.includes(contextKey);
  },

  getViewByForForcedSync: (applied) => {
    if (
      applied?.zone === 'EUR' &&
      applied?.brands !== 'All' &&
      applied?.country === 'ABI'
    ) {
      return 'country';
    }
    if (
      applied?.brand_filter_groupings === 'Global Brands' &&
      applied?.global_brands &&
      applied?.global_brands !== 'All' &&
      applied?.country !== 'ABI'
    ) {
      return 'sub_brand';
    }
    return null;
  },

  getContextKey: (applied, isGlobalZone) => {
    if (!applied) return 'global';

    if (overrides?.getContextKeyOverride) {
      const result = overrides.getContextKeyOverride(applied, isGlobalZone);
      if (result !== null) return result;
    }

    if (
      hasSpecificValue(applied.brands) ||
      hasSpecificValue(applied.global_brands) ||
      (applied.zone === 'EUR' && hasSpecificValue(applied.brands))
    )
      return 'brand';

    if (
      applied.brand_filter_groupings === 'Beer Price Segment' &&
      hasSpecificValue(applied.beer_price_segment)
    )
      return 'beer_price_segment';

    if (hasSpecificValue(applied.portfolios)) return 'portfolio';

    if (applied.growth_levers && applied.growth_levers === 'Beyond Beer')
      return isGlobalZone ? 'beyond_beer_global' : 'beyond_beer_country';

    if (!isGlobalZone) return 'country';

    return 'global';
  },
});

const hasSpecificValue = (value?: FilterValue) => value && value !== 'All';
