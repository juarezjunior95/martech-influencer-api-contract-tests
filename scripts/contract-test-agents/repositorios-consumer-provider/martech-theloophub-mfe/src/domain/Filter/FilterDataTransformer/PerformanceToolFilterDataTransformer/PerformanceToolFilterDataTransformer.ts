import type { FilterDataStructure, FilterForm } from 'models/Filters';

import {
  BaseFilterDataTransformer,
  type FilterOption,
  type FlatFilterField,
} from '../BaseFilterDataTransformer';

interface KpiOption {
  value: string;
  label: string;
  full: string;
}

type AssetValue =
  | string
  | {
      image_url?: string;
    };

interface PerformanceToolData {
  kpis: {
    default: KpiOption;
    values: KpiOption[];
    enabled: boolean;
  };
  performance_tool: {
    brand_assets?: Record<string, AssetValue>;
    zones: Array<{
      label: string;
      value: string;
      image_url?: string;
    }>;
    countries: Array<{
      id: string;
      label: string;
      zone?: string;
      value?: string;
      image_url?: string;
      quick_filter_label?: string;
    }>;
    kpi: Record<string, KpiData>;
  };
}

interface KpiData {
  brand_assets?: Record<string, AssetValue>;
  brands_classification: string[];
  growth_levers?: string[];
  periods: {
    values: Array<{ value: string; label: string; full: string }>;
    default: { value: string; label: string; full: string };
  };
  relations: {
    brand_assets?: Record<string, AssetValue>;
    zone_countries: Record<string, string>;
    brand_classification: Record<string, any>;
    subbrands: {
      country_subbrands: Record<string, string>;
      brand_country_subbrands: Record<string, Record<string, string>>;
      global_brand_country_subbrands?: Record<string, Record<string, string>>;
    };
    growth_levers?: Record<
      string,
      {
        brand_classification: Record<string, any>;
        subbrands: {
          country_subbrands: Record<string, string>;
          brand_country_subbrands: Record<string, Record<string, string>>;
        };
      }
    >;
  };
}

export class PerformanceToolFilterDataTransformer extends BaseFilterDataTransformer<PerformanceToolData> {
  private readonly data: PerformanceToolData;
  private readonly filters: FilterForm;
  private readonly kpiData: KpiData | null;
  private readonly relations: any;
  private readonly activeKpi: string;
  private readonly normalizedBrandAssets: Record<
    string,
    {
      image_url?: string;
    }
  >;

  constructor(data: PerformanceToolData, appliedFilters?: FilterForm) {
    super();
    this.data = data;
    this.filters = appliedFilters || {};

    const pt = this.data;
    const activeKpi = String(
      this.filters.kpis || pt.kpis.values[0]?.value || '',
    ).toLowerCase();
    this.kpiData = pt.performance_tool.kpi[activeKpi] || null;
    this.relations = this.getActiveRelations();
    this.activeKpi = activeKpi;
    const globalBrandAssets = this.normalizeAssetMap(
      pt.performance_tool?.brand_assets,
    );
    const kpiBrandAssets = this.normalizeAssetMap(this.kpiData?.brand_assets);
    const relationBrandAssets = this.normalizeAssetMap(
      this.relations?.brand_assets,
    );
    const unifiedAssets = {
      ...globalBrandAssets,
      ...kpiBrandAssets,
      ...relationBrandAssets,
    };

    this.normalizedBrandAssets = unifiedAssets;
  }

  // ==================== Static API ====================

  static transform(
    data: any,
    selectedKpi?: string,
    appliedFilters?: FilterForm,
  ): FilterDataStructure {
    if (!this.isValidFormat(data)) {
      return {};
    }

    const filtersWithKpi: FilterForm = {
      ...appliedFilters,
      kpis: selectedKpi || appliedFilters?.kpis,
    };

    const mapper = new PerformanceToolFilterDataTransformer(
      data,
      filtersWithKpi,
    );
    return mapper.toFlat();
  }

  static isValidFormat(data: any): boolean {
    const pt = data?.performance_tool;
    if (!pt) return false;
    return !!data?.kpis?.values && Array.isArray(pt.zones) && !!pt.kpi;
  }

  static buildSubBrandToBrandMap(
    data: any,
    selectedKpi?: string,
    appliedFilters?: FilterForm,
  ): Record<string, string> {
    if (!this.isValidFormat(data)) return {};

    const filtersWithKpi: FilterForm = {
      ...appliedFilters,
      kpis: selectedKpi || appliedFilters?.kpis,
    };

    const mapper = new PerformanceToolFilterDataTransformer(
      data,
      filtersWithKpi,
    );
    return mapper.getSubBrandToBrandMap();
  }

  // ==================== Instance Methods ====================

  toFlat(): Record<string, FlatFilterField> {
    if (!this.kpiData) {
      return this.emptyFlat();
    }

    return {
      kpis: this.mapKpis(),
      growth_levers: this.mapGrowthLevers(),
      zones: this.mapZones(),
      country: this.mapCountries(),
      brand_filter_groupings: this.mapBrandFilterGroupings(),
      brands: this.mapBrands(),
      sub_brands: this.mapSubBrands(),
      global_brands: this.mapGlobalBrands(),
      portfolios: this.mapPortfolios(),
      beer_price_segment: this.mapBeerPriceSegment(),
      periods: this.mapPeriods(),
    };
  }

  // ==================== Helper Methods ====================

  private getActiveRelations(): any {
    if (!this.kpiData) return null;

    const growthLever = this.filters.growth_levers as string;

    if (
      growthLever &&
      growthLever !== 'All' &&
      this.kpiData.relations.growth_levers?.[growthLever]
    ) {
      return {
        ...this.kpiData.relations,
        brand_classification:
          this.kpiData.relations.growth_levers[growthLever]
            .brand_classification,
        subbrands: this.kpiData.relations.growth_levers[growthLever].subbrands,
      };
    }

    return this.kpiData.relations;
  }

  private getActiveZone(): string {
    return (this.filters.zone as string) || 'ABI';
  }

  private getActiveCountry(): string {
    const zone = this.getActiveZone();
    const appliedCountry = this.filters.country as string;

    const zoneCountries = this.kpiData?.relations?.zone_countries?.[zone] || '';
    const countriesInZone = zoneCountries
      .split('|')
      .map((s: string) => s.trim())
      .filter(Boolean);

    if (appliedCountry && countriesInZone.includes(appliedCountry)) {
      return appliedCountry;
    }

    return countriesInZone[0] || zone;
  }

  private getActiveBrandClass(): string {
    return (this.filters.brand_filter_groupings as string) || 'All Brands';
  }

  private getActiveClassValue(): string | null {
    return (
      (this.filters.portfolios as string) ||
      (this.filters.beer_price_segment as string) ||
      null
    );
  }

  private getActiveBrand(): string | null {
    const brandClass = this.getActiveBrandClass();

    if (brandClass === 'Global Brands') {
      return (this.filters.global_brands as string) || null;
    }

    return (this.filters.brands as string) || null;
  }

  private normalizeAssetKey(value: string): string {
    return String(value || '')
      .trim()
      .toLowerCase();
  }

  private normalizeAssetMap<T extends AssetValue>(
    assets?: Record<string, T>,
  ): Record<
    string,
    {
      image_url?: string;
    }
  > {
    if (!assets) return {};

    return Object.entries(assets).reduce(
      (acc, [rawKey, item]) => {
        const normalizedItem =
          typeof item === 'string'
            ? { image_url: item }
            : {
                image_url: item?.image_url,
              };

        const aliases = String(rawKey || '')
          .split('|')
          .map((value) => value.trim())
          .filter(Boolean);

        const keys = aliases.length ? aliases : [rawKey];
        keys.forEach((key) => {
          acc[this.normalizeAssetKey(key)] = normalizedItem;
        });

        return acc;
      },
      {} as Record<
        string,
        {
          image_url?: string;
        }
      >,
    );
  }

  private getBrandAsset(brandName: string) {
    return (
      this.normalizedBrandAssets[this.normalizeAssetKey(brandName)] || null
    );
  }

  private toFilterOption(value: string, label = value): FilterOption {
    return { value, label };
  }

  private toImageAwareOption(value: string, label = value): FilterOption {
    const asset = this.getBrandAsset(value);

    if (!asset) return this.toFilterOption(value, label);

    return {
      value,
      label,
      image_url: asset.image_url,
    };
  }

  // ==================== Mappers ====================

  private mapKpis(): FlatFilterField {
    const { values: rawValues, default: rawDefault, enabled } = this.data.kpis;

    const values = rawValues.map((k) => ({
      value: k.value,
      label: k.label,
    }));

    const defaultValue = rawDefault
      ? { value: rawDefault.value, label: rawDefault.label }
      : values[0] || null;

    return {
      values,
      default: defaultValue,
      enabled: enabled ?? values.length > 0,
    };
  }

  private mapGrowthLevers(): FlatFilterField {
    const growthLevers = this.kpiData?.growth_levers;

    if (!growthLevers || growthLevers.length === 0) {
      return { values: [], default: null, enabled: false };
    }

    const country = (this.filters.country as string) || '';

    const values = growthLevers
      .filter((gl) => this.isGrowthLeverAvailableForCountry(gl, country))
      .map((gl) => ({ value: gl, label: gl }));

    return {
      values,
      default: { value: 'All', label: 'All' },
      enabled: true,
    };
  }

  private isGrowthLeverAvailableForCountry(
    growthLever: string,
    country: string,
  ): boolean {
    if (!country || country === 'ABI') return true;

    if (this.kpiData?.relations?.zone_countries?.[country]) return true;

    const glRelations = this.kpiData?.relations?.growth_levers?.[growthLever];
    if (!glRelations) return true;

    const allBrands = glRelations.brand_classification?.['All Brands'];
    if (!allBrands) return true;

    return allBrands[country] !== undefined;
  }

  private mapZones(): FlatFilterField {
    const pt = this.data.performance_tool;
    const zoneCountries = this.kpiData?.relations?.zone_countries || {};

    const availableZones = pt.zones.filter((z) => zoneCountries[z.value]);

    const values = availableZones.map((z) => ({
      value: z.value,
      label: z.label,
    }));

    return {
      values,
      default: values[0] || null,
      enabled: values.length > 0,
    };
  }

  private mapCountries(): FlatFilterField {
    const pt = this.data.performance_tool;
    const zoneCountries = this.kpiData?.relations?.zone_countries || {};
    const countryToZone = this.buildCountryToZoneMap(zoneCountries);

    const firstZone = Object.keys(zoneCountries)[0] || 'ABI';
    const valuesByZone: Record<string, FilterOption[]> = {};

    Object.entries(zoneCountries).forEach(([zone, countryIdsCSV]) => {
      const countryIds = countryIdsCSV
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean);

      valuesByZone[zone] = countryIds.map((countryId) => {
        const countryInfo = pt.countries.find((c) => c.id === countryId);
        return {
          value: countryInfo?.value || countryId,
          label: countryInfo?.label || countryId,
          image_url: countryInfo?.image_url,
          zone: countryToZone[countryId] || zone,
          quick_filter_label:
            countryInfo?.quick_filter_label || countryInfo?.label || countryId,
        };
      });
    });

    const defaultZoneCountries = valuesByZone[firstZone] || [];
    const defaultCountry = defaultZoneCountries[0] || null;

    return {
      values: valuesByZone,
      default: defaultCountry,
      enabled: Object.keys(valuesByZone).length > 0,
    };
  }

  private buildCountryToZoneMap(
    zoneCountries: Record<string, string>,
  ): Record<string, string> {
    const countryToZone: Record<string, string> = {};

    Object.entries(zoneCountries).forEach(([zone, countriesCSV]) => {
      const countryIds = countriesCSV
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean);
      countryIds.forEach((countryId) => {
        if (zone !== 'ABI') {
          countryToZone[countryId] = zone;
        }
      });
    });

    return countryToZone;
  }

  private mapBrandFilterGroupings(): FlatFilterField {
    const classifications = this.kpiData?.brands_classification || [];

    const availableClassifications = classifications.filter(
      (c) => this.relations?.brand_classification?.[c],
    );

    const values = availableClassifications.map((c) => ({
      value: c,
      label: c,
    }));

    const portfolioIndex = values.findIndex((v) => v.value === 'Portfolio');
    const defaultIndex =
      this.activeKpi === 'volume' ||
      this.activeKpi === 'nr' ||
      this.activeKpi === 'cores'
        ? portfolioIndex
        : 0;

    return {
      values,
      default: values[defaultIndex] || null,
      enabled: values.length > 0,
    };
  }

  private mapBrands(): FlatFilterField {
    const country = this.getActiveCountry();
    const brandClass = this.getActiveBrandClass();
    const classValue = this.getActiveClassValue();
    const brandData = this.relations?.brand_classification;

    if (brandClass === 'Global Brands') {
      return { values: [], default: null, enabled: true };
    }

    if (!brandData?.[brandClass]) {
      return { values: [], default: null, enabled: true };
    }

    let brandsCSV = '';

    if (brandClass === 'Portfolio') {
      if (
        classValue &&
        classValue !== 'All' &&
        brandData[brandClass][classValue]
      ) {
        const entry = brandData[brandClass][classValue];
        brandsCSV = entry?.brands?.[country] || entry?.brands?.['ABI'] || '';
      } else {
        brandsCSV = this.aggregateBrandsAcrossEntries(
          brandData[brandClass],
          country,
          'brands',
        );
      }
    } else if (brandClass === 'Beer Price Segment') {
      if (
        classValue &&
        classValue !== 'All' &&
        brandData[brandClass][classValue]
      ) {
        brandsCSV =
          brandData[brandClass][classValue][country] ||
          brandData[brandClass][classValue]['ABI'] ||
          '';
      } else {
        brandsCSV = this.aggregateBrandsAcrossEntries(
          brandData[brandClass],
          country,
        );
      }
    } else {
      brandsCSV =
        brandData[brandClass][country] || brandData[brandClass]['ABI'] || '';
    }

    const brandsList = brandsCSV
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean);

    const values: FilterOption[] = [];
    if (brandsList.length > 0) {
      values.push({ value: 'All', label: 'All' });
      brandsList
        .filter((b) => b !== 'All')
        .forEach((b) => values.push(this.toImageAwareOption(b)));
    }

    return {
      values,
      default: values[0] || null,
      enabled: true,
    };
  }

  private mapSubBrands(): FlatFilterField {
    const country = this.getActiveCountry();
    const brand = this.getActiveBrand();
    const brandClass = this.getActiveBrandClass();
    const classValue = this.getActiveClassValue();
    const hasSpecificPortfolio =
      brandClass === 'Portfolio' && !!classValue && classValue !== 'All';
    const hasSpecificBrand = !!brand && brand !== 'All';

    if (hasSpecificPortfolio && !hasSpecificBrand && classValue) {
      const result = this.resolvePortfolioSubBrands(classValue, country);
      if (result) return result;
    }

    const subBrandsData = this.relations?.subbrands;
    if (!subBrandsData) {
      return { values: [], default: null, enabled: true };
    }

    const subBrandsCSV = hasSpecificBrand
      ? subBrandsData.global_brand_country_subbrands?.[brand]?.[country] ||
        subBrandsData.brand_country_subbrands?.[brand]?.[country] ||
        ''
      : subBrandsData.country_subbrands?.[country] || '';

    const subBrandsList = subBrandsCSV
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean);

    const values = subBrandsList.map((sb) => this.toImageAwareOption(sb));

    if (hasSpecificBrand && hasSpecificPortfolio && classValue) {
      const result = this.resolveSpecificPortfolioSubBrands(
        classValue,
        country,
        values,
      );
      if (result) return result;
    }

    return {
      values,
      default: values[0] || null,
      enabled: true,
    };
  }

  private resolvePortfolioSubBrands(
    classValue: string,
    country: string,
  ): FlatFilterField | null {
    const portfolioEntry =
      this.relations?.brand_classification?.['Portfolio']?.[classValue];

    const subBrandsCSV =
      portfolioEntry?.subbrands?.[country] ||
      portfolioEntry?.subbrands?.['ABI'] ||
      '';

    if (!subBrandsCSV) return null;

    const subBrandsList = subBrandsCSV
      .split('|')
      .map((s: string) => s.trim())
      .filter(Boolean);

    const values = subBrandsList.map((sb: string) =>
      this.toImageAwareOption(sb),
    );

    return {
      values,
      default: values[0] || null,
      enabled: true,
    };
  }

  private resolveSpecificPortfolioSubBrands(
    classValue: string,
    country: string,
    rawSubBrands: FilterOption[],
  ): FlatFilterField | null {
    const portfolioSubBrands = this.resolvePortfolioSubBrands(
      classValue,
      country,
    );
    const portfolioValues = Array.isArray(portfolioSubBrands?.values)
      ? portfolioSubBrands.values
      : [];
    const allowedSubBrands = new Set(portfolioValues.map((v) => v.value));
    const filteredValues = allowedSubBrands.size
      ? rawSubBrands.filter((v) => allowedSubBrands.has(v.value))
      : rawSubBrands;

    return {
      values: filteredValues,
      default: filteredValues[0] || null,
      enabled: true,
    };
  }

  private mapGlobalBrands(): FlatFilterField {
    const country = this.getActiveCountry();
    const brandClass = this.getActiveBrandClass();

    if (brandClass !== 'Global Brands') {
      return { values: [], default: null, enabled: true };
    }

    const globalBrandsCSV =
      this.relations?.brand_classification?.['Global Brands']?.[country] ||
      this.relations?.brand_classification?.['Global Brands']?.['ABI'] ||
      '';

    const brandsList = globalBrandsCSV
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean)
      .sort();

    const values = brandsList.map((b) => this.toImageAwareOption(b));

    return {
      values,
      default: values[0] || null,
      enabled: true,
    };
  }

  private mapPortfolios(): FlatFilterField {
    const brandClass = this.getActiveBrandClass();

    if (brandClass !== 'Portfolio') {
      return { values: [], default: null, enabled: true };
    }

    const portfolioData = this.relations?.brand_classification?.['Portfolio'];
    if (!portfolioData) {
      return { values: [], default: null, enabled: true };
    }

    const country = this.getActiveCountry();
    const isZoneView =
      !country ||
      country === 'ABI' ||
      !!this.kpiData?.relations?.zone_countries?.[country];
    const portfolios = Object.keys(portfolioData).filter((p) => {
      if (isZoneView) return true;
      return portfolioData[p]?.brands?.[country] !== undefined;
    });
    const values: FilterOption[] = [{ value: 'All', label: 'All' }];
    portfolios.forEach((p) => {
      values.push({ value: p, label: p });
    });

    return {
      values,
      default: { value: 'All', label: 'All' },
      enabled: true,
    };
  }

  private mapBeerPriceSegment(): FlatFilterField {
    const brandClass = this.getActiveBrandClass();

    if (brandClass !== 'Beer Price Segment') {
      return { values: [], default: null, enabled: true };
    }

    const bpsData =
      this.relations?.brand_classification?.['Beer Price Segment'];
    if (!bpsData) {
      return { values: [], default: null, enabled: true };
    }

    const country = this.getActiveCountry();
    const isZoneView =
      !country ||
      country === 'ABI' ||
      !!this.kpiData?.relations?.zone_countries?.[country];
    const bpsOptions = Object.keys(bpsData).filter((b) => {
      if (isZoneView) return true;
      return bpsData[b]?.[country] !== undefined;
    });
    const values: FilterOption[] = [{ value: 'All', label: 'All' }];
    bpsOptions.forEach((b) => {
      values.push({ value: b, label: b });
    });

    return {
      values,
      default: { value: 'All', label: 'All' },
      enabled: true,
    };
  }

  private mapPeriods(): FlatFilterField {
    const periods = this.kpiData?.periods;
    if (!periods) {
      return { values: [], default: null, enabled: true };
    }

    const values = periods.values.map((p) => ({
      value: p.value,
      label: p.label,
      full: p.full,
    }));

    const defaultPeriod = periods.default
      ? {
          value: periods.default.value,
          label: periods.default.label,
          full: periods.default.full,
        }
      : values[0] || null;

    return {
      values,
      default: defaultPeriod,
      enabled: true,
    };
  }

  // ==================== Utilities ====================

  private getSubBrandToBrandMap(): Record<string, string> {
    const country = this.getActiveCountry();
    const subBrandsData = this.relations?.subbrands;
    if (!subBrandsData) return {};

    const map: Record<string, string> = {};

    const processEntries = (
      brandSubbrands: Record<string, Record<string, string>> | undefined,
    ) => {
      if (!brandSubbrands) return;
      Object.entries(brandSubbrands).forEach(([brandName, countryData]) => {
        if (!countryData) return;
        const subBrandsString = countryData[country] || countryData['ABI'];
        if (!subBrandsString) return;
        subBrandsString
          .split('|')
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((subBrand) => {
            map[subBrand] = brandName;
          });
      });
    };

    processEntries(subBrandsData.global_brand_country_subbrands);
    processEntries(subBrandsData.brand_country_subbrands);

    return map;
  }

  private aggregateBrandsAcrossEntries(
    classData: Record<string, any> | undefined,
    countryValue: string,
    nestedKey?: string,
  ): string {
    if (!classData) return '';

    const allBrands = new Set<string>();

    Object.values(classData).forEach((entry) => {
      const source = nestedKey ? entry?.[nestedKey] : entry;
      const brandsCSV = source?.[countryValue] || source?.['ABI'] || '';
      if (brandsCSV) {
        brandsCSV.split('|').forEach((b: string) => {
          const brand = b.trim();
          if (brand) {
            allBrands.add(brand);
          }
        });
      }
    });

    return Array.from(allBrands).join('|');
  }

  private emptyFlat(): Record<string, FlatFilterField> {
    const emptyField: FlatFilterField = {
      values: [],
      default: null,
      enabled: true,
    };
    return {
      kpis: emptyField,
      growth_levers: { ...emptyField, enabled: false },
      zones: emptyField,
      country: emptyField,
      brand_filter_groupings: emptyField,
      brands: emptyField,
      sub_brands: emptyField,
      global_brands: emptyField,
      portfolios: emptyField,
      beer_price_segment: emptyField,
      periods: emptyField,
    };
  }
}
