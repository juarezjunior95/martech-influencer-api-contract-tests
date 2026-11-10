import {
  Dataset,
  DatasetConfig,
} from "@domain/entities/common/base-config.entity";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";
import { IPresetHandler } from "@domain/interfaces/preset-handler.interface";
import { createDeltalakeProcedureFetchDataConfig } from "@domain/factories/dataset-repository.factory";
import {
  PosToolDrilldownBrandDimension,
  PosToolDrilldownBrandTuple,
  PosToolDrilldownFilterRulesValue,
  PosToolDrilldownPresetValue,
  PosToolDrilldownRawRow,
  PosToolDrilldownTuple,
} from "@domain/config/presets/category/pos-tool-drilldown/pos-tool-drilldown.types";
import { getPosToolDrilldownViewbyTuples } from "@domain/config/presets/category/pos-tool-drilldown/pos-tool-drilldown-viewby.model";
import { getPosToolDrilldownFilterRulesCommands } from "@domain/config/presets/category/pos-tool-drilldown/filter-rules";
import {
  getAllAgeGroupTuples,
  getAllGenderTuples,
  getAllSocialEconomicLevelTuples,
} from "@domain/config/presets/cohorts/demographic-options.model";
import {
  CountryFilterItem,
  CountryPresetValue,
  isCountryFilterItem,
} from "@domain/config/presets/country/country.types";
import { countryHandler } from "@domain/config/presets/country/country.handler";
import { collectShowGlobalDataDatasetConfigs } from "@domain/config/presets/show-global-data/show-global-data.datasets";
import {
  ZonesFilterItem,
  ZonesPresetValue,
} from "@domain/config/presets/zones/zones.types";
import { zonesHandler } from "@domain/config/presets/zones/zones.handler";
import {
  getKpisForGroup,
  KPI_GROUP_POS_TOOL_DRILLDOWN,
} from "@domain/config/presets/kpis/kpis.model";
import { getPosToolDrilldownTimeframeTuples } from "@domain/config/presets/category/pos-tool/pos-tool-timeframe.model";
import { timeFrameHandler } from "@domain/config/presets/time-frame/time-frame.handler";
import {
  normalizePosToolDrilldownCategoryValue,
  normalizePosToolDrilldownGrowthLever,
  normalizePosToolDrilldownPortfolio,
  POS_TOOL_DRILLDOWN_CATEGORY_BEER_BEYOND_BEER,
  POS_TOOL_DRILLDOWN_GROWTH_LEVERS,
  POS_TOOL_DRILLDOWN_PORTFOLIO,
  resolvePosToolDrilldownCategoryDedupKey,
} from "@domain/config/presets/category/pos-tool-drilldown/pos-tool-drilldown.constants";
import { ALL_BRANDS } from "@domain/config/presets/performance-tool/performance-tool.constants";
export const POS_TOOL_DRILLDOWN_FILTERS_PROCEDURE_ID =
  "category-pos-tool-drilldown";
export const POS_TOOL_DRILLDOWN_FUNCTION_NAME = "1_category_home_filters";
export const CATEGORY_POS_TOOL_DRILLDOWN_PAGE = "category_pos-tool-drilldown";

const ALL_TUPLE: PosToolDrilldownTuple = {
  value: "All",
  label: "All",
  full: "",
};

const BRAND_ALL_TUPLE: PosToolDrilldownBrandTuple = {
  ...ALL_TUPLE,
  countries: [],
  regions: [],
  manufacturers: [],
  categories: [],
  Portfolio: {},
  "Growth Levers": {},
};

class PosToolDrilldownPresetHandler implements IPresetHandler<PresetResponse> {
  get name(): string {
    return this.constructor.name;
  }

  datasets(): DatasetConfig[] {
    return [
      {
        id: POS_TOOL_DRILLDOWN_FILTERS_PROCEDURE_ID,
        config: createDeltalakeProcedureFetchDataConfig({
          functionName: POS_TOOL_DRILLDOWN_FUNCTION_NAME,
          parameters: [],
        }),
      },
      ...collectShowGlobalDataDatasetConfigs(["pos"]),
      ...(timeFrameHandler.datasets?.() ?? []),
    ];
  }

  handle(preset: PresetDefinition, datasets?: Dataset[]): PresetResponse {
    const rows = this.extractRows(datasets);
    const timeframeValues = getPosToolDrilldownTimeframeTuples(datasets);

    const kpiTuples: PosToolDrilldownTuple[] = getKpisForGroup(
      KPI_GROUP_POS_TOOL_DRILLDOWN,
    ).map((kpi) => ({
      value: kpi.value,
      label: kpi.label,
      full: kpi.full || kpi.label,
    }));

    const kpiDefault =
      kpiTuples.find((row) => row.value === "p4w") ??
      kpiTuples[0] ??
      ({} as Record<string, never>);

    // Keep the preset's KPI ordering stable and group them as the unit test expects.
    const kpiGroupsOrder: string[] = [];
    const kpiGroupsMap = new Map<string, PosToolDrilldownTuple[]>();
    for (const kpi of kpiTuples) {
      const group = kpi.label.split(" ")[0];
      if (!group) {
        continue;
      }
      if (!kpiGroupsMap.has(group)) {
        kpiGroupsMap.set(group, []);
        kpiGroupsOrder.push(group);
      }
      kpiGroupsMap.get(group)?.push(kpi);
    }

    const kpiGroupedValues = kpiGroupsOrder.map((group) => ({
      group,
      values: kpiGroupsMap.get(group) ?? [],
    }));

    const payload: PosToolDrilldownPresetValue = {
      viewby: this.toDimension(getPosToolDrilldownViewbyTuples(), "Category"),
      country: this.buildCountryDimension(preset, datasets),
      zone: this.buildZoneDimension(),
      region: this.buildRegionDimension(rows),
      timeframe: {
        enabled: true,
        default:
          timeframeValues.find((row) => row.value === "R12M") ??
          timeframeValues[0] ??
          ({} as Record<string, never>),
        values: timeframeValues,
      },
      category: this.toDimension(this.extractDistinctCategoryValues(rows)),
      manufacturer: this.buildManufacturerDimension(rows),
      cohort: this.buildCohortDimension(),
      brand_segments: {
        enabled: true,
        default: ALL_TUPLE,
        values: this.buildBrandSegmentsValues(),
      },
      kpi: {
        enabled: true,
        default: kpiDefault,
        values: kpiGroupedValues,
      },
      brand: this.buildBrandDimension(rows),
      filter_rules: this.buildFilterRules(),
    };

    return { "pos-tool-drilldown": payload };
  }

  private buildCohortDimension(): PosToolDrilldownPresetValue["cohort"] {
    return {
      enabled: true,
      default: ALL_TUPLE,
      values: [
        {
          group: "Gender",
          values: getAllGenderTuples()
            .filter((r) => r.label !== "All")
            .map((r) => ({ value: r.value, label: r.label, full: r.full })),
        },
        {
          group: "Age",
          values: getAllAgeGroupTuples()
            .filter((r) => r.label !== "All")
            .map((r) => ({ value: r.value, label: r.label, full: r.full })),
        },
        {
          group: "Social Economic Level",
          values: getAllSocialEconomicLevelTuples()
            .filter((r) => r.label !== "All")
            .map((r) => ({ value: r.value, label: r.label, full: r.full })),
        },
      ],
    };
  }

  private extractRows(datasets?: Dataset[]): PosToolDrilldownRawRow[] {
    const dataset = datasets?.find(
      (d) => d.id === POS_TOOL_DRILLDOWN_FILTERS_PROCEDURE_ID,
    );
    if (!dataset?.data?.length) {
      return [];
    }

    const out: PosToolDrilldownRawRow[] = [];
    for (const raw of dataset.data) {
      if (!raw || typeof raw !== "object") {
        continue;
      }
      out.push(raw as PosToolDrilldownRawRow);
    }
    return out;
  }

  private toDimension(
    values: PosToolDrilldownTuple[],
    defaultLabel?: string,
  ): {
    enabled: boolean;
    default: PosToolDrilldownTuple | Record<string, never>;
    values: PosToolDrilldownTuple[];
  } {
    const defaultValue =
      values.find((row) => row.label === defaultLabel) ??
      values[0] ??
      ({} as Record<string, never>);

    return {
      enabled: true,
      default: defaultValue,
      values,
    };
  }

  private buildCountryDimension(
    preset: PresetDefinition,
    datasets?: Dataset[],
  ): CountryPresetValue {
    const raw = preset[CATEGORY_POS_TOOL_DRILLDOWN_PAGE];
    const countryItem: CountryFilterItem = isCountryFilterItem(raw)
      ? raw
      : {
          type: "country",
          page: CATEGORY_POS_TOOL_DRILLDOWN_PAGE,
          hideGlobalForKpi: "pos",
        };
    const response = countryHandler.handle({ country: countryItem }, datasets);
    return response.country as CountryPresetValue;
  }

  private buildZoneDimension(): ZonesPresetValue {
    const preset: { zone: ZonesFilterItem } = {
      zone: { type: "zones" },
    };
    const response = zonesHandler.handle(preset);
    return response.zone as ZonesPresetValue;
  }

  private buildRegionDimension(rows: PosToolDrilldownRawRow[]): {
    enabled: boolean;
    default: PosToolDrilldownTuple | Record<string, never>;
    values: PosToolDrilldownTuple[];
  } {
    const regionToCountries = new Map<
      string,
      { label: string; countries: Map<string, string> }
    >();

    for (const row of rows) {
      const rawRegion = pickString(row, ["region"]);
      const region = rawRegion.trim();
      if (!region) {
        continue;
      }

      const regionKey = region.toLowerCase();
      const existing = regionToCountries.get(regionKey) ?? {
        label: region,
        countries: new Map<string, string>(),
      };

      const rawCountry = pickString(row, ["country"]);
      const country = rawCountry.trim();

      if (country) {
        const countryKey = country.toLowerCase();
        if (!existing.countries.has(countryKey)) {
          existing.countries.set(countryKey, country);
        }
      }

      regionToCountries.set(regionKey, existing);
    }

    const values: PosToolDrilldownTuple[] = Array.from(
      regionToCountries.values(),
    )
      .map(({ label, countries }) => ({
        value: label,
        label,
        full: "",
        country: Array.from(countries.values()).sort((a, b) =>
          a.localeCompare(b),
        ),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return {
      enabled: true,
      default: ALL_TUPLE,
      values,
    };
  }

  private buildManufacturerDimension(rows: PosToolDrilldownRawRow[]): {
    enabled: boolean;
    default: PosToolDrilldownTuple | Record<string, never>;
    values: PosToolDrilldownTuple[];
  } {
    const values = this.extractDistinctValues(rows, ["manufacturer"]);
    return {
      enabled: true,
      default: ALL_TUPLE,
      values: [ALL_TUPLE, ...values],
    };
  }

  private extractDistinctCategoryValues(
    rows: PosToolDrilldownRawRow[],
  ): PosToolDrilldownTuple[] {
    const seen = new Set<string>();
    const values: PosToolDrilldownTuple[] = [];

    for (const row of rows) {
      const raw = pickString(row, ["category"]);
      if (!raw) {
        continue;
      }

      const canonical = raw.trim();
      if (!canonical) {
        continue;
      }

      const seenKey = resolvePosToolDrilldownCategoryDedupKey(canonical);
      if (seen.has(seenKey)) {
        continue;
      }
      seen.add(seenKey);

      const normalized = normalizePosToolDrilldownCategoryValue(canonical);
      if (!normalized) {
        continue;
      }

      values.push({
        value: normalized,
        label: normalized,
        full:
          normalized === POS_TOOL_DRILLDOWN_CATEGORY_BEER_BEYOND_BEER
            ? POS_TOOL_DRILLDOWN_CATEGORY_BEER_BEYOND_BEER
            : "",
      });
    }

    values.sort((a, b) => a.label.localeCompare(b.label));
    return values;
  }

  private extractDistinctValues(
    rows: PosToolDrilldownRawRow[],
    keys: string[],
  ): PosToolDrilldownTuple[] {
    const seen = new Set<string>();
    const values: PosToolDrilldownTuple[] = [];

    for (const row of rows) {
      const raw = pickString(row, keys);
      if (!raw) {
        continue;
      }

      const canonical = raw.trim();
      if (!canonical) {
        continue;
      }

      const seenKey = canonical.toLowerCase();
      if (seen.has(seenKey)) {
        continue;
      }
      seen.add(seenKey);

      values.push({
        value: canonical,
        label: canonical,
        full: "",
      });
    }

    values.sort((a, b) => a.label.localeCompare(b.label));
    return values;
  }

  private buildBrandSegmentsValues(): Array<{
    group: string;
    values: PosToolDrilldownTuple[];
  }> {
    return [
      {
        group: ALL_BRANDS,
        values: [{ value: ALL_BRANDS, label: ALL_BRANDS, full: "" }],
      },
      {
        group: "Portfolio",
        values: POS_TOOL_DRILLDOWN_PORTFOLIO.map((row) => ({ ...row })),
      },
      {
        group: "Growth Levers",
        values: POS_TOOL_DRILLDOWN_GROWTH_LEVERS.map((row) => ({ ...row })),
      },
    ];
  }

  private buildBrandDimension(
    rows: PosToolDrilldownRawRow[],
  ): PosToolDrilldownBrandDimension {
    const baseBrandValues = this.extractDistinctValues(rows, ["brand"]);
    const membership = this.buildBrandMembershipMap(rows);

    const values: PosToolDrilldownBrandTuple[] = baseBrandValues.map(
      (brand) => {
        const normalized = normalizeBrand(brand.value);
        const attrs = membership.get(normalized) ?? {
          countries: [],
          regions: [],
          manufacturers: [],
          categories: [],
          portfolio: {},
          growthLevers: {},
        };

        return {
          ...brand,
          countries: attrs.countries,
          regions: attrs.regions,
          manufacturers: attrs.manufacturers,
          categories: attrs.categories,
          Portfolio: attrs.portfolio,
          "Growth Levers": attrs.growthLevers,
        };
      },
    );

    return {
      enabled: true,
      default: ALL_TUPLE,
      values: [BRAND_ALL_TUPLE, ...values],
    };
  }

  private buildFilterRules(): PosToolDrilldownFilterRulesValue {
    const commands = getPosToolDrilldownFilterRulesCommands();

    const filters = commands.reduce<
      PosToolDrilldownFilterRulesValue["filters"]
    >(
      (acc, command) => {
        acc[command.filterKey] = command.execute();
        return acc;
      },
      {} as PosToolDrilldownFilterRulesValue["filters"],
    );

    return { filters };
  }

  private buildBrandMembershipMap(
    rows: PosToolDrilldownRawRow[],
  ): Map<string, PosToolDrilldownBrandMembership> {
    const map = new Map<string, PosToolDrilldownBrandMembership>();

    for (const row of rows) {
      const brand = pickString(row, ["brand"]);
      if (!brand) {
        continue;
      }

      const key = normalizeBrand(brand);
      const current = map.get(key) ?? createEmptyBrandMembership();

      const country = pickString(row, ["country"]);
      const region = pickFieldValue(row, ["region"]);
      const manufacturer = pickFieldValue(row, ["manufacturer"]);
      const category = pickFieldValue(row, ["category"]);

      addDistinctValue(current.countries, country);
      addDistinctValue(current.regions, region);
      addDistinctValue(current.manufacturers, manufacturer);
      addDistinctValue(current.categories, category);

      if (country) {
        const portfolio = pickFieldValue(row, ["portfolio"]);
        const growthLever = pickFieldValue(row, ["growth_lever"]);

        if (portfolio) {
          current.portfolio[country] =
            normalizePosToolDrilldownPortfolio(portfolio);
        }
        if (growthLever) {
          current.growthLevers[country] =
            normalizePosToolDrilldownGrowthLever(growthLever);
        }
      }

      map.set(key, current);
    }

    return map;
  }
}

function pickString(raw: PosToolDrilldownRawRow, keys: string[]): string {
  for (const key of keys) {
    const direct = raw[key];
    if (typeof direct === "string" && direct.trim().length > 0) {
      return direct;
    }

    const upper = raw[key.toUpperCase()];
    if (typeof upper === "string" && upper.trim().length > 0) {
      return upper;
    }
  }
  return "";
}

function pickFieldValue(raw: PosToolDrilldownRawRow, keys: string[]): string {
  for (const key of keys) {
    const direct = raw[key];
    if (typeof direct === "string" && direct.trim().length > 0) {
      return normalizeFieldValue(direct);
    }

    const upper = raw[key.toUpperCase()];
    if (typeof upper === "string" && upper.trim().length > 0) {
      return normalizeFieldValue(upper);
    }
  }
  return "";
}

function normalizeFieldValue(value: string): string {
  const trimmed = value.trim();
  if (trimmed.toLowerCase() === "n/a") {
    return "";
  }
  return trimmed;
}

function normalizeBrand(value: string): string {
  return value.trim().toLowerCase();
}

interface PosToolDrilldownBrandMembership {
  countries: string[];
  regions: string[];
  manufacturers: string[];
  categories: string[];
  portfolio: Record<string, string>;
  growthLevers: Record<string, string>;
}

function createEmptyBrandMembership(): PosToolDrilldownBrandMembership {
  return {
    countries: [],
    regions: [],
    manufacturers: [],
    categories: [],
    portfolio: {},
    growthLevers: {},
  };
}

function addDistinctValue(list: string[], value: string): void {
  if (!value) {
    return;
  }

  const exists = list.some(
    (entry) => entry.toLowerCase() === value.toLowerCase(),
  );
  if (!exists) {
    list.push(value);
  }
}

export const posToolDrilldownHandler = new PosToolDrilldownPresetHandler();
