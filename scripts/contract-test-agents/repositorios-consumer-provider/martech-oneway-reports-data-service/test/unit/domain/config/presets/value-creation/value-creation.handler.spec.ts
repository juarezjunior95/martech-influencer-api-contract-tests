import { valueCreationHandler } from "@domain/config/presets/value-creation/value-creation.handler";
import type { ValueCreationFilterPresetValue } from "@domain/config/presets/value-creation/value-creation.types";
import {
  VALUE_CREATION_DATASET_ID,
  VALUE_CREATION_FILTER_SP_NAME,
} from "@domain/config/presets/value-creation/value-creation.types";
import {
  DeltalakeExecutionType,
  DeltalakeFetchDataConfig,
} from "@domain/factories/dataset-repository.factory";
import { getCountryFlag } from "@common/utils/images/country-image.utils";
import { KPI_GROUP_DATASET_ID } from "@domain/config/presets/kpi-group/kpi-group.types";
import {
  PresetDefinition,
  PresetResponse,
} from "@domain/entities/preset.entity";
import { Dataset } from "@domain/entities/common/base-config.entity";
import { UserEntity } from "@domain/entities/user.entity";
import { VIEWER_SCOPES } from "@domain/entities/scopes";

/** Handler wraps payload under `value-creation` (preset namespace). */
function unwrapValueCreation(
  result: PresetResponse,
): ValueCreationFilterPresetValue {
  const inner = result["value-creation"];
  if (!inner || typeof inner !== "object") {
    throw new Error('Expected result["value-creation"] preset payload');
  }
  return inner as ValueCreationFilterPresetValue;
}

describe("valueCreationHandler", () => {
  it("declares the kpi-group query then the value-creation function call", () => {
    const ds = valueCreationHandler.datasets?.() ?? [];
    expect(ds).toHaveLength(2);
    expect(ds[0]).toEqual(
      expect.objectContaining({
        id: KPI_GROUP_DATASET_ID,
        config: expect.objectContaining({
          query: "presets/kpi-group/kpi-group",
          type: expect.any(String),
        }),
      }),
    );

    expect(ds[1].id).toBe(VALUE_CREATION_DATASET_ID);
    const { procedure, executionType } = ds[1]
      .config as DeltalakeFetchDataConfig;
    expect(procedure).toContain("{{DATABRICKS_SCHEMA}}.owr_result_query_sp");
    expect(procedure).toContain(VALUE_CREATION_FILTER_SP_NAME);
    expect(procedure).toContain('"environment"');
    expect(executionType).toBe(DeltalakeExecutionType.procedure);
  });

  it("ingests lowercase columns the same way as uppercase ones", () => {
    const upper = valueCreationHandler.handle({}, [
      {
        id: VALUE_CREATION_DATASET_ID,
        data: [
          {
            ABI_ZONE: "EUR",
            RAW_GEOGRAPHY: "Brazil",
            COUNTRY_ISO_CODE_3: "BRA",
            GROWTHLEVER: "Superior Core",
          },
        ],
      },
    ]);
    const lower = valueCreationHandler.handle({}, [
      {
        id: VALUE_CREATION_DATASET_ID,
        data: [
          {
            abi_zone: "EUR",
            raw_geography: "Brazil",
            country_iso_code_3: "BRA",
            growthlever: "Superior Core",
          },
        ],
      },
    ]);

    expect(unwrapValueCreation(lower)).toEqual(unwrapValueCreation(upper));
    expect(
      unwrapValueCreation(lower)
        .country.values.EUR?.find((c) => c.value === "BRA")
        ?.growth_levers.find((g) => g.value === "Superior Core")?.disabled,
    ).toBe(false);
  });

  it("returns mock-backed country, zones, and periods when the dataset is empty", () => {
    const preset: PresetDefinition = {};
    const result = valueCreationHandler.handle(preset, []);
    const block = unwrapValueCreation(result);

    expect(block.country.values.ABI?.length).toBeGreaterThan(0);
    expect(block.country.values.EUR?.length).toBeGreaterThan(0);
    expect(block.zones.values.map((z) => z.value).sort()).toEqual(
      ["ABI", "EUR"].sort(),
    );
    const abiZone = block.zones.values.find((z) => z.value === "ABI");
    expect(abiZone?.image_url).toBe(getCountryFlag("ABI"));
    const eurZone = block.zones.values.find((z) => z.value === "EUR");
    expect(eurZone?.image_url).toBe(getCountryFlag("EUR"));
    expect(block.periods.values.map((p) => p.value)).toEqual([
      "YTD",
      "L3M",
      "MTD",
    ]);
    expect(block.periods.default).toMatchObject({ value: "YTD" });

    const abiGlobal = block.country.values.ABI?.find((c) => c.value === "ABI");
    expect(abiGlobal?.image_url).toBe(getCountryFlag("ABI"));
    const eurAll = block.country.values.EUR?.find((c) => c.value === "ABI");
    expect(eurAll?.image_url).toBe(getCountryFlag("ABI"));
  });

  it("merges SQL rows and enables matching growth levers", () => {
    const preset: PresetDefinition = {};
    const datasets: Dataset[] = [
      {
        id: VALUE_CREATION_DATASET_ID,
        data: [
          {
            ABI_ZONE: "EUR",
            RAW_GEOGRAPHY: "Brazil",
            COUNTRY_ISO_CODE_3: "BRA",
            GROWTHLEVER: "Superior Core",
          },
        ],
      },
    ];
    const result = valueCreationHandler.handle(preset, datasets);
    const block = unwrapValueCreation(result);

    const bra = block.country.values.EUR?.find((c) => c.value === "BRA");
    expect(
      bra?.growth_levers.find((g) => g.value === "Superior Core")?.disabled,
    ).toBe(false);
    expect(
      bra?.growth_levers.find((g) => g.value === "Lead Premium")?.disabled,
    ).toBe(true);
  });

  it("returns empty dimensions for deny users", () => {
    const user = UserEntity.create({
      scopes: ["not-a-viewer-scope"],
      country: null,
      supportedCountries: [],
    });
    const preset: PresetDefinition = {};
    const result = valueCreationHandler.handle(preset, [], user);
    const block = unwrapValueCreation(result);

    expect(block.country.values).toEqual({});
    expect(block.zones.values).toEqual([]);
  });

  it("drops countries the user cannot access", () => {
    const user = UserEntity.create({
      scopes: [VIEWER_SCOPES.COUNTRY],
      country: null,
      supportedCountries: ["AR"],
    });
    const preset: PresetDefinition = {};
    const datasets: Dataset[] = [
      {
        id: VALUE_CREATION_DATASET_ID,
        data: [
          {
            ABI_ZONE: "EUR",
            RAW_GEOGRAPHY: "Brazil",
            COUNTRY_ISO_CODE_3: "BRA",
            GROWTHLEVER: "Superior Core",
          },
          {
            ABI_ZONE: "EUR",
            RAW_GEOGRAPHY: "Argentina",
            COUNTRY_ISO_CODE_3: "ARG",
            GROWTHLEVER: "Beyond Beer",
          },
        ],
      },
    ];
    const result = valueCreationHandler.handle(preset, datasets, user);
    const block = unwrapValueCreation(result);

    const eurCountries = block.country.values.EUR?.map((c) => c.value) ?? [];
    expect(eurCountries).toContain("ARG");
    expect(eurCountries).not.toContain("BRA");
    expect(block.zones.values.map((z) => z.value)).toEqual(["EUR"]);
  });

  it("does not duplicate the ABI entry in the Global zone country list", () => {
    const preset: PresetDefinition = {};
    const result = valueCreationHandler.handle(preset, []);
    const block = unwrapValueCreation(result);

    const abiEntries = block.country.values.ABI?.filter(
      (c) => c.value === "ABI",
    );
    expect(abiEntries?.length).toBe(1);
  });

  it("shows ABI and EUR aggregates only for Global / unrestricted-equivalent users when dataset is empty", () => {
    const globalUser = UserEntity.create({
      scopes: [VIEWER_SCOPES.GLOBAL],
      country: null,
      supportedCountries: [],
    });
    const preset: PresetDefinition = {};
    const withGlobal = valueCreationHandler.handle(preset, [], globalUser);
    const g = unwrapValueCreation(withGlobal);
    expect(g.zones.values.map((z) => z.value).sort()).toEqual(
      ["ABI", "EUR"].sort(),
    );
  });

  it("hides the Global (ABI) and EUR aggregate options for explicit CountryViewer without EUR zone or full-EUR country list", () => {
    const user = UserEntity.create({
      scopes: [VIEWER_SCOPES.COUNTRY],
      country: null,
      supportedCountries: ["AR"],
    });
    const preset: PresetDefinition = {};
    const result = valueCreationHandler.handle(preset, [], user);
    const block = unwrapValueCreation(result);

    expect(block.zones.values).toEqual([]);
    expect(block.country.values).toEqual({});
  });

  it("shows the EUR aggregate for Europe zone viewers but not Global (ABI)", () => {
    const user = UserEntity.create({
      scopes: [VIEWER_SCOPES.ZONE.EUR],
      country: null,
      supportedCountries: [],
    });
    const preset: PresetDefinition = {};
    const result = valueCreationHandler.handle(preset, [], user);
    const block = unwrapValueCreation(result);

    expect(block.zones.values.map((z) => z.value)).toEqual(["EUR"]);
    expect(block.country.values.ABI).toBeUndefined();
    expect(block.country.values.EUR?.length).toBeGreaterThan(0);
  });
});
