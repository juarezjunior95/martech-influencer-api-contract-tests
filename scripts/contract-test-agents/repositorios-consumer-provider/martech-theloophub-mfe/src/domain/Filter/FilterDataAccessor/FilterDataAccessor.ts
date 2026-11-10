import type {
  FilterDataStructure,
  FilterForm,
  FilterOption,
  Option,
} from 'models/Filters';

import { ValueCreationData } from '../FilterDataTransformer';

type GetOptionsHandler = (
  dataFilters: FilterDataStructure,
  applied: FilterForm,
) => Option[] | FilterOption[];

const getOptionsHandlers: Record<string, GetOptionsHandler> = {
  kpis: (dataFilters) => dataFilters?.kpis?.values || [],

  zone: (dataFilters) => dataFilters?.zones?.values || [],

  country: (dataFilters, applied) => {
    const countryValues = dataFilters?.country?.values;
    if (Array.isArray(countryValues)) {
      return countryValues;
    }
    return countryValues?.[applied.zone] || [];
  },

  brands: (dataFilters, applied) => {
    if (
      dataFilters?.brands?.values &&
      Array.isArray(dataFilters.brands.values)
    ) {
      return dataFilters.brands.values;
    }
    return dataFilters?.brands?.values?.[applied.country]?.brands || [];
  },

  brand_filter_groupings: (dataFilters) =>
    dataFilters?.brand_filter_groupings?.values || [],

  sub_brands: (dataFilters, applied) => {
    if (dataFilters?.sub_brands?.values) {
      return dataFilters.sub_brands.values;
    }
    return (
      dataFilters?.brands?.values?.[applied.country]?.brands?.find(
        (brand: Option) => brand.value === applied.brands,
      )?.sub_brands || []
    );
  },

  brands_abi: (dataFilters, applied) =>
    dataFilters?.brands_abi?.values?.[applied.country] || [],

  brands_comp: (dataFilters, applied) =>
    dataFilters?.brands_comp?.values?.[applied.country] || [],

  beer_price_segment: (dataFilters) =>
    dataFilters?.beer_price_segment?.values || [],

  global_brands: (dataFilters) => dataFilters?.global_brands?.values || [],

  growth_levers: (dataFilters) => dataFilters?.growth_levers?.values || [],

  value_creation_growth_levers: (
    dataFilters: ValueCreationData & FilterDataStructure,
    applied,
  ) => {
    const zoneCountries = dataFilters?.country?.values?.[applied.zone];
    if (!zoneCountries) return [];
    const country = zoneCountries.find(
      (country) => country.value === applied.country,
    );
    if (!country) return [];

    return (
      country?.growth_levers?.map((gl) => ({
        value: gl.value,
        label: gl.label,
        isDisabled: gl.disabled,
      })) || []
    );
  },

  audience_targeting_brands: (dataFilters, applied) =>
    dataFilters?.audience_targeting_brands?.values?.[applied.country] || [],

  audience_targeting_brands_comp: (dataFilters, applied) =>
    dataFilters?.audience_targeting_brands?.values?.[applied.country]?.find(
      (item) => item.value === applied.audience_targeting_brands,
    )?.competitor || [],

  portfolios: (dataFilters) => dataFilters?.portfolios?.values || [],

  pos_periods: (dataFilters) => dataFilters?.pos_periods?.values || [],

  periods: (dataFilters) => dataFilters?.periods?.values || [],

  scopes: (dataFilters) => dataFilters?.brand_power_book_scopes?.values || [],

  sub_scopes: (dataFilters, applied) => {
    if (applied.scopes === 'portfolio') {
      return dataFilters?.portfolio?.values || [];
    }
    if (applied.scopes === 'global_brands') {
      return dataFilters?.global_brands?.values || [];
    }
    if (applied.scopes === 'segment') {
      return dataFilters?.segments?.values || [];
    }
    return [];
  },

  time_frame: () => [],

  'ytd-month': (dataFilters) => dataFilters?.['ytd-month']?.values || [],

  distribution_scopes: (dataFilters) =>
    dataFilters?.distribution_scopes?.values || [],

  years: (dataFilters) => dataFilters?.years?.values || [],

  segments: (dataFilters) => dataFilters?.segments?.values || [],

  product_scope: (dataFilters) => dataFilters?.product_scope?.values || [],
};

/**
 * FilterDataAccessor
 *
 * Singleton utility class to access filter data in a type-safe way
 * Provides methods to safely extract and transform filter data
 */
class FilterDataAccessor {
  private static instance: FilterDataAccessor;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  /**
   * Returns the singleton instance
   */
  public static getInstance(): FilterDataAccessor {
    if (!FilterDataAccessor.instance) {
      FilterDataAccessor.instance = new FilterDataAccessor();
    }
    return FilterDataAccessor.instance;
  }

  /**
   * Get options for any field dynamically
   */
  public getOptions(
    fieldKey: string,
    dataFilters: FilterDataStructure,
    applied: FilterForm,
  ): Option[] | FilterOption[] {
    const handler = getOptionsHandlers[fieldKey];
    return handler ? handler(dataFilters, applied) : [];
  }

  /**
   * Get country options for quick filters
   * Used specifically in quick filter context without zone dependency
   */
  public getCountryOptions(dataFilters: FilterDataStructure): Option[] {
    const countryValues = dataFilters?.country?.values;

    if (Array.isArray(countryValues)) {
      const sorted = [...countryValues].sort((a, b) => {
        if (a.value === 'ABI') return -1;
        if (b.value === 'ABI') return 1;
        const labelA = (a.label || '').toString().toLowerCase();
        const labelB = (b.label || '').toString().toLowerCase();
        return labelA.localeCompare(labelB);
      });
      return sorted;
    }
    const optionsMap = new Map<string, Option>();
    Object.values(countryValues || {}).forEach((values) => {
      values.forEach((option) => {
        if (option.value && !optionsMap.has(option.value as string)) {
          optionsMap.set(option.value as string, option);
        }
      });
    });

    return Array.from(optionsMap.values()).sort((a, b) => {
      if (a.value === 'ABI') return -1;
      if (b.value === 'ABI') return 1;
      const labelA = (a.label || '').toString().toLowerCase();
      const labelB = (b.label || '').toString().toLowerCase();
      return labelA.localeCompare(labelB);
    });
  }

  /**
   * Get zone option
   */
  public getZone(
    dataFilters: FilterDataStructure,
    applied: FilterForm,
  ): Option | null {
    if (!dataFilters?.zones?.values) return null;
    const zone = dataFilters.zones.values.find(
      (z: { value: string; label: string }) => z.value === applied?.zone,
    );
    return {
      value: zone?.value || null,
      label: zone?.label || null,
    };
  }

  /**
   * Get zone from a given country
   * Searches through all zones to find which zone contains the specified country
   */
  public getZoneByCountry(
    dataFilters: FilterDataStructure,
    country: string,
  ): Option | null {
    if (!country || !dataFilters?.country?.values) {
      return null;
    }

    if (country === 'ABI') {
      return { value: 'ABI', label: 'Global' };
    }

    const countryValues = dataFilters.country.values;
    if (Array.isArray(countryValues)) {
      return dataFilters.zones?.values?.[0] || null;
    }

    const zoneEntries = Object.entries(countryValues).filter(
      ([zoneValue]) => zoneValue !== 'ABI',
    );

    for (const [zoneValue, countries] of zoneEntries) {
      const countryExists = countries.some((c: Option) => c.value === country);

      if (countryExists) {
        const zoneOption = dataFilters.zones?.values?.find(
          (z: Option) => z.value === zoneValue,
        );

        return {
          value: zoneValue,
          label: zoneOption?.label || zoneValue,
        };
      }
    }

    return null;
  }

  /**
   * Get country option with formatted label
   */
  public getCountry(
    dataFilters: FilterDataStructure,
    applied: FilterForm,
    rawData?: any,
  ): Option | null {
    if (!applied?.country) return null;

    if (rawData?.performance_tool?.countries) {
      return rawData?.performance_tool?.countries?.find(
        (c: Option) => c.value === applied.country && c.zone === applied.zone,
      );
    }

    const countryValues = dataFilters?.country?.values;
    if (!countryValues) return null;

    let country: Option | undefined;

    if (Array.isArray(countryValues)) {
      country = countryValues.find((c: Option) => c.value === applied.country);
    } else if (applied.zone && countryValues[applied.zone]) {
      country = countryValues[applied.zone].find(
        (c: Option) => c.value === applied.country,
      );
    }

    if (!country) return null;

    const label = country.label === 'All' ? 'Global' : country.label;

    return {
      value: country.value,
      label: label || null,
      quick_filter_label: country.quick_filter_label || null,
    };
  }

  /**
   * Get brand competitor option
   * Searches through brands_comp groups to find the specific brand competitor
   */
  public getBrandComp(
    dataFilters: FilterDataStructure,
    applied: FilterForm,
  ): Option | undefined {
    if (!applied?.country || !applied?.brands_comp) {
      return undefined;
    }

    const countryBrandsComp = dataFilters?.brands_comp?.values?.[
      applied.country
    ] as FilterOption[];

    if (!Array.isArray(countryBrandsComp)) {
      return undefined;
    }

    const brandCompGroup = countryBrandsComp.find((group: FilterOption) =>
      group.values?.some((b) => b.value === applied.brands_comp),
    );

    const brandComp = brandCompGroup?.values?.find(
      (b: { value: string; label: string }) => b.value === applied.brands_comp,
    );

    if (!brandComp) {
      return undefined;
    }

    return {
      value: brandComp.value || null,
      label: brandComp.label || null,
    };
  }

  /**
   * Get brand family ABI (the group containing the selected brands_abi)
   * Returns the FilterOption group that contains the selected brands_abi value
   */
  public getBrandFamilyAbi(
    dataFilters: FilterDataStructure,
    applied: FilterForm,
  ): FilterOption | undefined {
    if (!applied?.country || !applied?.brands_abi) {
      return undefined;
    }

    const countryBrandsAbi = dataFilters?.brands_abi?.values?.[
      applied.country
    ] as FilterOption[];

    if (!Array.isArray(countryBrandsAbi)) {
      return undefined;
    }

    return countryBrandsAbi.find((group: FilterOption) =>
      group.values?.some((b) => b.value === applied.brands_abi),
    );
  }

  public getTimeFrame(
    dataFilters: FilterDataStructure,
    period: 'end' | 'ini' = 'end',
  ): string | null {
    if (!dataFilters?.time_frame?.default) return null;
    const timeFrame = dataFilters.time_frame.default[period];

    return timeFrame;
  }

  public getKpi(
    dataFilters: FilterDataStructure,
    applied: FilterForm,
  ): Option | null {
    const options = this.getOptions('kpis', dataFilters, applied);

    if (!Array.isArray(options)) return null;

    const kpi = (options as Option[]).find(
      (o: Option) => o.value === applied.kpis,
    );
    if (!kpi) return null;

    return kpi;
  }
}

export default FilterDataAccessor;
