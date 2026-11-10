import { useCallback, useMemo } from 'react';

import {
  FilterFieldConfig,
  FilterRuleConfig,
  FilterState,
  getGrowthLeverRule,
  getKpiRule,
} from 'domain/Filter/FilterRules';
import {
  hasGrowthLevers,
  isPerformanceToolKpi,
  requiresClassificationForBrand,
} from 'domain/Filter/FilterRules/constants/kpiRules';

// =============================================================================
// TYPES
// =============================================================================

type GeoType = 'global' | 'zone' | 'country' | 'eur';

interface RuleContext {
  state: FilterState;
  geoType: GeoType;
  kpiLower: string;
  rule: FilterRuleConfig; // Combined rule (GL has priority over KPI)
  glRule: FilterRuleConfig | null;
  kpiRule: FilterRuleConfig | null;
}

// =============================================================================
// HELPERS
// =============================================================================

const determineGeoType = (zone: string, country: string): GeoType => {
  if (country && country !== 'ABI' && country !== 'All') return 'country';
  if (zone === 'EUR') return 'eur';
  if (zone && zone !== 'ABI' && zone !== 'All') return 'zone';
  return 'global';
};

const createConfig = (
  overrides: Partial<FilterFieldConfig> = {},
): FilterFieldConfig => ({
  disabled: false,
  hidden: false,
  allowedValues: null,
  defaultValue: null,
  label: '',
  placeholder: undefined,
  ...overrides,
});

const getClassValue = (
  brandClass: string,
  portfolio?: string,
  beerPriceSegment?: string,
): string | null => {
  if (brandClass === 'Portfolio') return portfolio || null;
  if (brandClass === 'Beer Price Segment') return beerPriceSegment || null;
  return null;
};

const getPlaceholder = (brandClass: string, kpi?: string): string | null => {
  const kpiLower = kpi?.toLowerCase() || '';
  if (requiresClassificationForBrand(kpiLower)) {
    return brandClass === 'Portfolio'
      ? 'Select a Portfolio first'
      : 'Select a Segment first';
  }

  return null;
};

const isClassEmpty = (value: string | null): boolean =>
  value === 'All' || !value;

/**
 * Combines GL and KPI rules (GL has priority)
 */
const mergeRules = (
  glRule: FilterRuleConfig | null,
  kpiRule: FilterRuleConfig | null,
): FilterRuleConfig => {
  return {
    ...kpiRule,
    ...glRule, // GL overrides KPI
  };
};

const getComparableOptionValue = (value: unknown): string | null => {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return String(value);
  }

  return null;
};

export const filterOptions = <T extends { value: unknown; label: unknown }>(
  options: T[],
  allowed: string[] | null,
): T[] => {
  if (!allowed?.length) return options;
  return options.filter((opt) => {
    const value = getComparableOptionValue(opt.value);
    return value === 'All' || (value !== null && allowed.includes(value));
  });
};

// =============================================================================
// BRANDS HANDLER - Configs based
// =============================================================================

const handleBrandsField = (ctx: RuleContext): FilterFieldConfig => {
  const { state, rule, kpiLower } = ctx;
  const { brandClass, portfolio, beerPriceSegment } = state;
  const classValue = getClassValue(brandClass, portfolio, beerPriceSegment);

  const isGlobalBrands = brandClass === 'Global Brands';
  const isAllBrands = brandClass === 'All Brands';
  const isPortfolio = brandClass === 'Portfolio';
  const isPortfolioOrBPS = isPortfolio || brandClass === 'Beer Price Segment';

  // 1. Global Brands → use global_brands field, brands field is hidden
  if (isGlobalBrands) {
    return createConfig({ hidden: true, label: 'Global Brand' });
  }

  // 2. Apply rules from config
  // brandHidden → hidden
  if (rule.brandHidden) {
    return createConfig({ hidden: true, label: 'Brand' });
  }

  // locked → disabled with value All
  if (rule.locked) {
    return createConfig({
      disabled: true,
      defaultValue: 'All',
      label: 'Brand',
    });
  }

  // source = global_brands → hidden (redirects to global_brands)
  if (rule.source === 'global_brands') {
    return createConfig({ hidden: true, label: 'Brand' });
  }

  // brandLocked → disabled when classValue = All
  if (rule.brandLocked && isClassEmpty(classValue)) {
    if (isAllBrands) {
      return createConfig({
        disabled: false,
        defaultValue: 'All',
        label: 'Brand',
      });
    }
    return createConfig({
      disabled: true,
      placeholder: getPlaceholder(brandClass, kpiLower),
      label: 'Brand',
    });
  }

  // 3. Defaults based on brandClass
  if (isAllBrands) {
    return createConfig({ defaultValue: 'All', label: 'Brand' });
  }

  if (isPortfolioOrBPS) {
    return createConfig({ label: 'Brand', placeholder: 'Select a brand' });
  }

  return createConfig({ label: 'Brand' });
};

// =============================================================================
// GLOBAL_BRANDS HANDLER - Configs based
// =============================================================================

const handleGlobalBrandsField = (
  ctx: RuleContext,
  isBrandClassAvailable: (brandClass: string, state: FilterState) => boolean,
): FilterFieldConfig => {
  const { state, rule } = ctx;
  const isGlobalBrands = state.brandClass === 'Global Brands';

  // notAvailable → disabled and hidden
  if (!isBrandClassAvailable('Global Brands', state)) {
    return createConfig({
      disabled: true,
      hidden: true,
      label: 'Global Brand',
    });
  }

  return createConfig({
    hidden: !isGlobalBrands,
    defaultValue: rule.noAllOption ? null : 'All',
    label: 'Global Brand',
  });
};

// =============================================================================
// SUB_BRANDS HANDLER - Configs based
// =============================================================================

const handleSubBrandsField = (ctx: RuleContext): FilterFieldConfig => {
  const { state, geoType, kpiLower, rule } = ctx;
  const { brandClass, brand, portfolio, beerPriceSegment } = state;
  const classValue = getClassValue(brandClass, portfolio, beerPriceSegment);

  const isCountry = geoType === 'country';
  const isGlobalBrands = brandClass === 'Global Brands';
  const isPortfolio = brandClass === 'Portfolio';
  const isPortfolioOrBPS = isPortfolio || brandClass === 'Beer Price Segment';
  const isBrandAll = brand === 'All' || !brand;
  const isPerformanceTool = isPerformanceToolKpi(kpiLower);

  const config = createConfig({ label: 'Sub-Brand' });

  // Apply sub_brand_hidden rule
  if (rule.subBrandHidden) {
    return { ...config, hidden: true };
  }

  // Performance Tool: hidden if not in country
  if (isPerformanceTool && !isCountry) {
    return { ...config, hidden: true };
  }

  // Performance Tool + Country: check brand_locked
  if (isPerformanceTool && isCountry) {
    if (isPortfolioOrBPS && isClassEmpty(classValue)) {
      return {
        ...config,
        disabled: true,
        placeholder: getPlaceholder(brandClass, kpiLower),
      };
    }
    return config;
  }

  // Other pages (not Performance Tool pages)
  if (isGlobalBrands) {
    return {
      ...config,
      disabled: true,
    };
  }

  if (isBrandAll) {
    return {
      ...config,
      disabled: true,
    };
  }

  if (geoType === 'global') {
    return { ...config, hidden: true };
  }

  return config;
};

// =============================================================================
// SIMPLE FIELD HANDLERS - Configs based
// =============================================================================

const handlePortfoliosField = (
  ctx: RuleContext,
  isBrandClassAvailable: (brandClass: string, state: FilterState) => boolean,
): FilterFieldConfig => {
  const { state, rule } = ctx;

  if (!isBrandClassAvailable('Portfolio', state)) {
    return createConfig({
      disabled: true,
      hidden: true,
      label: 'Portfolio',
    });
  }

  return createConfig({
    hidden: state.brandClass !== 'Portfolio',
    allowedValues: rule.allowed || null,
    defaultValue: 'All',
    label: 'Portfolio',
  });
};

const handleBeerPriceSegmentField = (
  ctx: RuleContext,
  isBrandClassAvailable: (brandClass: string, state: FilterState) => boolean,
): FilterFieldConfig => {
  const { state, rule } = ctx;

  if (!isBrandClassAvailable('Beer Price Segment', state)) {
    return createConfig({
      disabled: true,
      hidden: true,
      label: 'Beer Price Segment',
    });
  }

  return createConfig({
    hidden: state.brandClass !== 'Beer Price Segment',
    allowedValues: rule.allowed || null,
    defaultValue: 'All',
    label: 'Beer Price Segment',
  });
};

const handleBrandFilterGroupingsField = (): FilterFieldConfig =>
  createConfig({ defaultValue: 'All Brands', label: 'Brand Classification' });

const handleGrowthLeversField = (ctx: RuleContext): FilterFieldConfig =>
  createConfig({
    hidden: !hasGrowthLevers(ctx.kpiLower),
    defaultValue: 'All',
    label: 'Growth Lever',
  });

// =============================================================================
// HOOK
// =============================================================================

export interface UseFilterRulesReturn {
  getFieldConfig: (fieldKey: string, state: FilterState) => FilterFieldConfig;
  isBrandClassAvailable: (brandClass: string, state: FilterState) => boolean;
  filterOptions: typeof filterOptions;
}

export const useFilterRules = (): UseFilterRulesReturn => {
  const isBrandClassAvailable = useCallback(
    (brandClass: string, state: FilterState): boolean => {
      const { kpi, growthLever, zone, country } = state;
      const geoType = determineGeoType(zone, country);

      const glRule = getGrowthLeverRule(growthLever, geoType, brandClass);
      if (glRule?.notAvailable) return false;

      const kpiRule = getKpiRule(kpi, geoType, brandClass);
      if (kpiRule?.notAvailable) return false;

      return true;
    },
    [],
  );

  const getFieldConfig = useCallback(
    (fieldKey: string, state: FilterState): FilterFieldConfig => {
      const { kpi, growthLever, zone, country, brandClass } = state;
      const geoType = determineGeoType(zone, country);
      const kpiLower = kpi?.toLowerCase() || '';

      // Get configs
      const glRule = getGrowthLeverRule(growthLever, geoType, brandClass);
      const kpiRule = getKpiRule(kpi, geoType, brandClass);
      const rule = mergeRules(glRule, kpiRule);

      const ctx: RuleContext = {
        state,
        geoType,
        kpiLower,
        rule,
        glRule,
        kpiRule,
      };

      // Apply rules
      let config: FilterFieldConfig;

      switch (fieldKey) {
        case 'brands':
          config = handleBrandsField(ctx);
          break;
        case 'global_brands':
          config = handleGlobalBrandsField(ctx, isBrandClassAvailable);
          break;
        case 'sub_brands':
          config = handleSubBrandsField(ctx);
          break;
        case 'portfolios':
          config = handlePortfoliosField(ctx, isBrandClassAvailable);
          break;
        case 'beer_price_segment':
          config = handleBeerPriceSegmentField(ctx, isBrandClassAvailable);
          break;
        case 'brand_filter_groupings':
          config = handleBrandFilterGroupingsField();
          break;
        case 'growth_levers':
          config = handleGrowthLeversField(ctx);
          break;
        default:
          config = createConfig({ label: fieldKey });
      }

      return config;
    },
    [isBrandClassAvailable],
  );

  return useMemo(
    () => ({ getFieldConfig, isBrandClassAvailable, filterOptions }),
    [getFieldConfig, isBrandClassAvailable],
  );
};

export default useFilterRules;
