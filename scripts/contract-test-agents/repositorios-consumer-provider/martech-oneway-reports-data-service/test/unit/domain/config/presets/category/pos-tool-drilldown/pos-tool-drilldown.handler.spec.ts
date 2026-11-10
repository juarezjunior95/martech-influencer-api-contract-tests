import { getPosToolDrilldownFilterRulesCommands } from "@domain/config/presets/category/pos-tool-drilldown/filter-rules";
import * as posToolDrilldownConstants from "@domain/config/presets/category/pos-tool-drilldown/pos-tool-drilldown.constants";
import {
  CATEGORY_POS_TOOL_DRILLDOWN_PAGE,
  POS_TOOL_DRILLDOWN_FILTERS_PROCEDURE_ID,
  POS_TOOL_DRILLDOWN_FUNCTION_NAME,
  posToolDrilldownHandler,
} from "@domain/config/presets/category/pos-tool-drilldown/pos-tool-drilldown.handler";
import { PosToolDrilldownFilterRuleItem } from "@domain/config/presets/category/pos-tool-drilldown/pos-tool-drilldown.types";
import { CountryFilterItem } from "@domain/config/presets/country/country.types";
import { KPI_GROUP_DATASET_ID } from "@domain/config/presets/kpi-group/kpi-group.types";
import { showGlobalDatasetIdForSubject } from "@domain/config/presets/show-global-data/show-global-data.types";
import { DataItem, Dataset } from "@domain/entities/common/base-config.entity";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";

/** Mirrors BFF `POS_BOOK_SCOPE` in country-scopes.ts. */
const POS_BOOK_SCOPE = [
  "ABI",
  "USA",
  "CAN",
  "GBR",
  "KOR",
  "ARG",
  "CHN",
  "BRA",
  "ZAF",
  "MEX",
  "COL",
  "PER",
  "ECU",
  "DOM",
  "PAN",
  "SLV",
  "HND",
  "BEL",
] as const;

function buildPosBookScopePreset(
  overrides: Partial<CountryFilterItem> = {},
): PresetDefinition {
  return {
    [CATEGORY_POS_TOOL_DRILLDOWN_PAGE]: {
      type: "country",
      scope: [...POS_BOOK_SCOPE],
      page: CATEGORY_POS_TOOL_DRILLDOWN_PAGE,
      hideGlobalForKpi: "pos",
      ...overrides,
    },
  };
}

function buildShowGlobalDataset(
  subject: "pos" | "power",
  rows: DataItem[],
): Dataset {
  return {
    id: showGlobalDatasetIdForSubject(subject),
    data: rows,
  };
}

function collectCountryIdsFromValues(
  values: Record<string, Array<{ value: string }>>,
): string[] {
  const ids = new Set<string>();
  for (const list of Object.values(values)) {
    for (const entry of list) {
      if (entry.value !== "ABI") {
        ids.add(entry.value);
      }
    }
  }
  return [...ids];
}

function unwrapPosToolDrilldown(
  result: PresetResponse,
): Record<string, unknown> {
  const preset = result["pos-tool-drilldown"];
  if (!preset || typeof preset !== "object") {
    throw new Error('Expected result["pos-tool-drilldown"] preset payload');
  }

  return preset as Record<string, unknown>;
}

describe("posToolDrilldownHandler", () => {
  const showGlobalPosDataset = buildShowGlobalDataset("pos", [
    { flag_uat: "y", flag_prd: "y" } as DataItem,
  ]);

  it("builds country from countryHandler using zone-keyed ABI payload", () => {
    const result = posToolDrilldownHandler.handle(buildPosBookScopePreset(), [
      showGlobalPosDataset,
    ]);
    const payload = unwrapPosToolDrilldown(result);
    const country = payload.country as Record<string, unknown>;

    expect(country.enabled).toBe(true);
    expect(country.default).toEqual({
      value: "ABI",
      label: "Global",
      quick_filter_label: "Global",
    });

    const values = country.values as Record<
      string,
      Array<Record<string, unknown>>
    >;
    expect(values.ABI).toBeDefined();
    expect(Array.isArray(values.ABI)).toBe(true);
    expect(values.ABI[0]).toEqual({
      value: "ABI",
      label: "All",
      zone: "ABI",
      quick_filter_label: "Global",
      image_url: expect.any(String),
    });
  });

  it("limits country values to POS Book scope", () => {
    const result = posToolDrilldownHandler.handle(buildPosBookScopePreset(), [
      showGlobalPosDataset,
    ]);
    const payload = unwrapPosToolDrilldown(result);
    const values = (
      payload.country as { values: Record<string, Array<{ value: string }>> }
    ).values;

    const countryIds = collectCountryIdsFromValues(values);
    const posBookCountryIds = POS_BOOK_SCOPE.filter((id) => id !== "ABI");

    expect(countryIds.sort()).toEqual([...posBookCountryIds].sort());
    expect(countryIds).not.toContain("JPN");
    expect(countryIds).not.toContain("IND");
    expect(countryIds).not.toContain("FRA");
  });

  it("drops the ABI bucket when POS global data is disabled for the env", () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "uat";
    try {
      const result = posToolDrilldownHandler.handle(buildPosBookScopePreset(), [
        buildShowGlobalDataset("pos", [
          { flag_uat: "n", flag_prd: "y" } as DataItem,
        ]),
      ]);
      const payload = unwrapPosToolDrilldown(result);
      const values = (payload.country as { values: Record<string, unknown> })
        .values;

      expect(values.ABI).toBeUndefined();
    } finally {
      process.env.NODE_ENV = prev;
    }
  });

  it("builds zone from zonesHandler using ABI-based payload", () => {
    const result = posToolDrilldownHandler.handle({}, []);
    const payload = unwrapPosToolDrilldown(result);
    const zone = payload.zone as Record<string, unknown>;

    expect(zone.enabled).toBe(true);
    expect(zone.default).toEqual({
      value: "ABI",
      label: "Global",
      quick_filter_label: "Global",
      image_url: expect.any(String),
    });

    const values = zone.values as Array<Record<string, unknown>>;
    expect(Array.isArray(values)).toBe(true);
    expect(values[0]).toEqual({
      value: "ABI",
      label: "Global",
      quick_filter_label: "Global",
      image_url: expect.any(String),
    });
  });

  it("includes age cohort values without the aggregate All option", () => {
    const result = posToolDrilldownHandler.handle({}, []);
    const payload = unwrapPosToolDrilldown(result);
    const cohort = payload.cohort as Record<string, unknown>;
    const groups = cohort.values as Array<Record<string, unknown>>;

    const ageGroup = groups.find((group) => group.group === "Age");
    expect(ageGroup).toBeDefined();

    const ageValues =
      (ageGroup?.values as Array<Record<string, string>> | undefined) ?? [];
    expect(ageValues.map((v) => v.label)).toEqual([
      "LDA-24",
      "25-34",
      "35-44",
      "45-54",
      "55+",
    ]);
    expect(ageValues.some((v) => v.label === "All")).toBe(false);
  });

  it("builds timeframe with period labels and descriptive full names", () => {
    const result = posToolDrilldownHandler.handle({}, []);
    const payload = unwrapPosToolDrilldown(result);
    const timeframe = payload.timeframe as Record<string, unknown>;

    expect(timeframe.enabled).toBe(true);
    expect(timeframe.default).toEqual({
      value: "R12M",
      label: expect.stringMatching(/^R12M Q\d'26$/),
      full: "Rolling 12 Months (R12M)",
    });

    const values = timeframe.values as Array<Record<string, string>>;
    expect(values).toEqual([
      {
        value: "R12M",
        label: expect.stringMatching(/^R12M Q\d'26$/),
        full: "Rolling 12 Months (R12M)",
      },
      {
        value: "Quarter",
        label: expect.stringMatching(/^QTD Q\d'26$/),
        full: "Quarter (QTR)",
      },
    ]);
  });

  it("derives timeframe quarter from kpi-group pos refresh date, not volume", () => {
    const result = posToolDrilldownHandler.handle({}, [
      {
        id: KPI_GROUP_DATASET_ID,
        data: [
          { kpi_name: "pos", time_frame: "01-06-2026" },
          { kpi_name: "volume", time_frame: "01-09-2026" },
        ],
      },
    ]);
    const payload = unwrapPosToolDrilldown(result);
    const timeframe = payload.timeframe as {
      default: { label: string };
      values: Array<{ label: string }>;
    };

    expect(timeframe.default.label).toBe("R12M Q2'26");
    expect(timeframe.values.map((row) => row.label)).toEqual([
      "R12M Q2'26",
      "QTD Q2'26",
    ]);
  });

  it("groups kpis into Participation, Occasions, and Servings", () => {
    const result = posToolDrilldownHandler.handle({}, []);
    const payload = unwrapPosToolDrilldown(result);
    const kpi = payload.kpi as Record<string, unknown>;

    expect(kpi.enabled).toBe(true);
    expect(kpi.default).toEqual({
      value: "p4w",
      label: "Participation P4W",
      full: "Participation P4W",
    });

    const groups = kpi.values as Array<Record<string, unknown>>;
    expect(groups.map((group) => group.group)).toEqual([
      "Participation",
      "Occasions",
      "Servings",
    ]);

    expect(
      (
        (
          groups[0] as {
            values?: Array<{ value: string; label: string; full: string }>;
          }
        ).values ?? []
      )
        .map((item) => item.value)
        .sort(),
    ).toEqual(["p4w", "p7d"].sort());

    expect(
      (
        (
          groups[0] as {
            values?: Array<{ value: string; label: string; full: string }>;
          }
        ).values ?? []
      )
        .map((item) => item.full)
        .sort(),
    ).toEqual(["Participation P4W", "Participation P7D"].sort());

    expect(
      ((
        groups[1] as {
          values?: Array<{ value: string; label: string; full: string }>;
        }
      ).values ?? [])[0],
    ).toEqual({
      value: "occasions",
      label: "Occasions P7D/P4W",
      full: "Occasions P7D/P4W",
    });

    expect(
      ((
        groups[2] as {
          values?: Array<{ value: string; label: string; full: string }>;
        }
      ).values ?? [])[0],
    ).toEqual({
      value: "servings",
      label: "Servings Total",
      full: "Servings Total",
    });
  });

  it("declares filter, show-global and kpi-group datasets", () => {
    const datasets = posToolDrilldownHandler.datasets();

    expect(datasets).toHaveLength(3);
    expect(datasets[0]?.id).toBe(POS_TOOL_DRILLDOWN_FILTERS_PROCEDURE_ID);
    expect(datasets[0]?.config).toEqual(
      expect.objectContaining({
        executionType: "procedure",
        type: "DatabricksDataRepository",
      }),
    );
    expect(String(datasets[0]?.config?.procedure)).toContain(
      POS_TOOL_DRILLDOWN_FUNCTION_NAME,
    );
    expect(datasets[1]?.id).toBe(showGlobalDatasetIdForSubject("pos"));
    expect(datasets[2]?.id).toBe(KPI_GROUP_DATASET_ID);
  });

  it("sets brand Portfolio and Growth Levers as country maps from procedure rows", () => {
    const result = posToolDrilldownHandler.handle({}, [
      {
        id: POS_TOOL_DRILLDOWN_FILTERS_PROCEDURE_ID,
        data: [
          {
            brand: "1890",
            country: "ARG",
            zone: "SAZ",
            region: "AMBA",
            category: "Beer",
            manufacturer: "ABINBEV",
            portfolio: "MEGA BRAND",
            growth_lever: "CORE CO",
          },
          {
            brand: "Stella",
            country: "USA",
            portfolio: "Megabrands",
            growth_lever: "Superior Core",
          },
          {
            brand: "Stella",
            country: "BRA",
            portfolio: "",
            growth_lever: "Lead Premium",
          },
          {
            brand: "Corona",
            country: "MEX",
            portfolio: "N/A",
            growth_lever: "n/a",
          },
          {
            brand: "Budweiser",
            portfolio: "Expansion",
            growth_lever: "Beyond Beer",
          },
          {
            brand: "Competitor",
            country: "USA",
          },
        ],
      },
    ]);
    const payload = unwrapPosToolDrilldown(result);
    const brand = payload.brand as Record<string, unknown>;
    const values = brand.values as Array<Record<string, unknown>>;

    expect(values).toEqual([
      {
        value: "All",
        label: "All",
        full: "",
        countries: [],
        regions: [],
        manufacturers: [],
        categories: [],
        Portfolio: {},
        "Growth Levers": {},
      },
      {
        value: "1890",
        label: "1890",
        full: "",
        countries: ["ARG"],
        regions: ["AMBA"],
        manufacturers: ["ABINBEV"],
        categories: ["Beer"],
        Portfolio: { ARG: "Megabrands" },
        "Growth Levers": { ARG: "Core Co" },
      },
      {
        value: "Budweiser",
        label: "Budweiser",
        full: "",
        countries: [],
        regions: [],
        manufacturers: [],
        categories: [],
        Portfolio: {},
        "Growth Levers": {},
      },
      {
        value: "Competitor",
        label: "Competitor",
        full: "",
        countries: ["USA"],
        regions: [],
        manufacturers: [],
        categories: [],
        Portfolio: {},
        "Growth Levers": {},
      },
      {
        value: "Corona",
        label: "Corona",
        full: "",
        countries: ["MEX"],
        regions: [],
        manufacturers: [],
        categories: [],
        Portfolio: {},
        "Growth Levers": {},
      },
      {
        value: "Stella",
        label: "Stella",
        full: "",
        countries: ["USA", "BRA"],
        regions: [],
        manufacturers: [],
        categories: [],
        Portfolio: { USA: "Megabrands" },
        "Growth Levers": { USA: "Core Co", BRA: "Premium Co" },
      },
    ]);
  });

  it("emits Global growth levers in brand_segments with full labels", () => {
    const result = posToolDrilldownHandler.handle({}, []);
    const payload = unwrapPosToolDrilldown(result);
    const brandSegments = payload.brand_segments as {
      values: Array<{ group: string; values: Array<Record<string, string>> }>;
    };

    const portfolio = brandSegments.values.find(
      (group) => group.group === "Portfolio",
    );

    expect(portfolio?.values).toEqual([
      { value: "Megabrands", label: "Megabrands", full: "" },
      { value: "Expansion", label: "Expansion", full: "" },
      { value: "Sustain", label: "Sustain", full: "" },
      { value: "Tail", label: "Tail", full: "" },
    ]);

    const growthLevers = brandSegments.values.find(
      (group) => group.group === "Growth Levers",
    );

    expect(growthLevers?.values).toEqual([
      { value: "Core Co", label: "Core Co", full: "Core Co" },
      { value: "Premium Co", label: "Premium Co", full: "Premium Co" },
      { value: "Beyond Beer", label: "Beyond Beer", full: "Beyond Beer" },
      { value: "NAB", label: "NAB", full: "Non-Alcoholic Beer" },
    ]);
  });

  it("aggregates countries per region as deduped arrays", () => {
    const result = posToolDrilldownHandler.handle({}, [
      {
        id: POS_TOOL_DRILLDOWN_FILTERS_PROCEDURE_ID,
        data: [
          { region: "LATAM", country: "BRA" },
          { region: "LATAM", country: "ARG" },
          { region: "LATAM", country: "BRA" },
          { region: "Europe", country: "FRA" },
        ],
      },
    ]);
    const payload = unwrapPosToolDrilldown(result);
    const region = payload.region as Record<string, unknown>;
    const values = region.values as Array<Record<string, unknown>>;

    expect(values).toEqual([
      {
        value: "Europe",
        label: "Europe",
        full: "",
        country: ["FRA"],
      },
      {
        value: "LATAM",
        label: "LATAM",
        full: "",
        country: ["ARG", "BRA"],
      },
    ]);
    expect(region.default).toEqual({
      value: "All",
      label: "All",
      full: "",
    });
  });

  it("defaults manufacturer, brand, cohort, and brand_segments to All", () => {
    const result = posToolDrilldownHandler.handle({}, [
      {
        id: POS_TOOL_DRILLDOWN_FILTERS_PROCEDURE_ID,
        data: [
          {
            brand: "Stella",
            manufacturer: "ABINBEV",
            region: "LATAM",
            country: "BRA",
          },
        ],
      },
    ]);
    const payload = unwrapPosToolDrilldown(result);

    expect(payload.manufacturer).toEqual(
      expect.objectContaining({
        default: { value: "All", label: "All", full: "" },
        values: [
          { value: "All", label: "All", full: "" },
          { value: "ABINBEV", label: "ABINBEV", full: "" },
        ],
      }),
    );
    expect(payload.brand).toEqual(
      expect.objectContaining({
        default: { value: "All", label: "All", full: "" },
        values: expect.arrayContaining([
          {
            value: "All",
            label: "All",
            full: "",
            countries: [],
            regions: [],
            manufacturers: [],
            categories: [],
            Portfolio: {},
            "Growth Levers": {},
          },
          {
            value: "Stella",
            label: "Stella",
            full: "",
            countries: ["BRA"],
            regions: ["LATAM"],
            manufacturers: ["ABINBEV"],
            categories: [],
            Portfolio: {},
            "Growth Levers": {},
          },
        ]),
      }),
    );
    expect(payload.cohort).toEqual(
      expect.objectContaining({
        default: { value: "All", label: "All", full: "" },
      }),
    );
    expect(payload.brand_segments).toEqual(
      expect.objectContaining({
        default: { value: "All", label: "All", full: "" },
      }),
    );
  });

  it("keeps filter_rules output unchanged", () => {
    const result = posToolDrilldownHandler.handle({}, []);
    const payload = unwrapPosToolDrilldown(result);

    expect(payload.filter_rules).toEqual({
      filters: {
        category: {
          enable_rules: {
            category_alcohol_enable: {
              values: ["Alcohol"],
              condition_type: "eq",
              apply_to: ["brand", "cohort", "vb_category"],
            },
          },
          disable_rules: {
            category_alcohol_disable: {
              values: ["Alcohol"],
              condition_type: "eq",
              apply_to: [
                "manufacturer",
                "portfolio",
                "growth_levers",
                "vb_manufacturer",
                "vb_portfolio",
                "vb_growth_levers",
              ],
            },
          },
        },
        country: {
          enable_rules: {
            country_specific_enable_region: {
              values: ["Global"],
              condition_type: "neq",
              apply_to: ["region", "vb_region"],
            },
          },
          disable_rules: {
            country_global_disable_region: {
              values: ["Global"],
              condition_type: "eq",
              apply_to: ["region", "vb_region"],
            },
          },
        },
        manufacturer: {
          enable_rules: {
            manufacturer_abi_enable_portfolio_gl: {
              values: ["ABI"],
              condition_type: "eq",
              apply_to: [
                "portfolio",
                "growth_levers",
                "vb_portfolio",
                "vb_growth_levers",
              ],
            },
          },
          disable_rules: {
            manufacturer_non_abi_disable_portfolio_gl: {
              values: ["ABI", ""],
              condition_type: "nin",
              apply_to: [
                "portfolio",
                "growth_levers",
                "vb_portfolio",
                "vb_growth_levers",
              ],
            },
            manufacturer_competitor_disable_vb_manufacturer: {
              values: ["Heineken", "Molson", "Constellation"],
              condition_type: "in",
              apply_to: [
                "growth_levers",
                "portfolio",
                "vb_growth_levers",
                "vb_portfolio",
                "vb_manufacturer",
              ],
            },
          },
        },
        brand: {
          enable_rules: {},
          disable_rules: {
            brand_selected_disable_portfolio_gl: {
              values: [],
              condition_type: "neq",
              apply_to: [
                "portfolio",
                "growth_levers",
                "manufacturer",
                "vb_brand",
                "vb_portfolio",
                "vb_growth_levers",
                "vb_manufacturer",
              ],
            },
          },
        },
        brand_segments: {
          enable_rules: {},
          disable_rules: {
            portfolio_selected_disable_growth_levers: {
              values: ["Portfolio"],
              condition_type: "eq",
              apply_to: [
                "growth_levers",
                "brand",
                "vb_portfolio",
                "vb_growth_levers",
                "vb_brand",
              ],
            },
          },
        },
        growth_levers: {
          enable_rules: {},
          disable_rules: {
            growth_levers_selected_disable_portfolio: {
              values: ["Growth Levers"],
              condition_type: "eq",
              apply_to: [
                "portfolio",
                "brand",
                "manufacturer",
                "vb_growth_levers",
                "vb_portfolio",
                "vb_brand",
              ],
            },
          },
        },
      },
    });
  });

  it("registers and dispatches one command per filter key", () => {
    const commands = getPosToolDrilldownFilterRulesCommands();
    expect(commands.map((command) => command.filterKey)).toEqual([
      "category",
      "country",
      "manufacturer",
      "brand",
      "brand_segments",
      "growth_levers",
    ]);

    const filters = commands.reduce<
      Record<string, PosToolDrilldownFilterRuleItem>
    >((acc, command) => {
      acc[command.filterKey] = command.execute();
      return acc;
    }, {});

    expect(Object.keys(filters)).toEqual([
      "category",
      "country",
      "manufacturer",
      "brand",
      "brand_segments",
      "growth_levers",
    ]);
  });

  it("maps Beer + BB category to canonical Beer + Beyond Beer tuple", () => {
    const result = posToolDrilldownHandler.handle({}, [
      {
        id: POS_TOOL_DRILLDOWN_FILTERS_PROCEDURE_ID,
        data: [
          {
            brand: "Stella",
            category: "Beer + BB",
            country: "BRA",
          },
        ],
      },
    ]);
    const payload = unwrapPosToolDrilldown(result);
    const category = payload.category as {
      values: Array<{ value: string; label: string; full: string }>;
    };

    expect(category.values).toEqual([
      {
        value: "Beer + Beyond Beer",
        label: "Beer + Beyond Beer",
        full: "Beer + Beyond Beer",
      },
    ]);
  });

  it("deduplicates Beer + BB and Beer + BYB category aliases", () => {
    const result = posToolDrilldownHandler.handle({}, [
      {
        id: POS_TOOL_DRILLDOWN_FILTERS_PROCEDURE_ID,
        data: [
          {
            brand: "Stella",
            category: "Beer + BB",
            country: "BRA",
          },
          {
            brand: "Corona",
            category: "Beer + BYB",
            country: "MEX",
          },
        ],
      },
    ]);
    const payload = unwrapPosToolDrilldown(result);
    const category = payload.category as {
      values: Array<{ value: string; label: string; full: string }>;
    };

    expect(category.values).toHaveLength(1);
    expect(category.values[0]).toEqual({
      value: "Beer + Beyond Beer",
      label: "Beer + Beyond Beer",
      full: "Beer + Beyond Beer",
    });
  });

  it("skips category values when normalization returns an empty string", () => {
    const normalizeSpy = jest
      .spyOn(
        posToolDrilldownConstants,
        "normalizePosToolDrilldownCategoryValue",
      )
      .mockReturnValue("");

    try {
      const result = posToolDrilldownHandler.handle({}, [
        {
          id: POS_TOOL_DRILLDOWN_FILTERS_PROCEDURE_ID,
          data: [
            {
              brand: "Stella",
              category: "Beer",
              country: "BRA",
            },
          ],
        },
      ]);
      const payload = unwrapPosToolDrilldown(result);
      const category = payload.category as {
        values: Array<{ value: string; label: string; full: string }>;
      };

      expect(category.values).toEqual([]);
    } finally {
      normalizeSpy.mockRestore();
    }
  });
});
