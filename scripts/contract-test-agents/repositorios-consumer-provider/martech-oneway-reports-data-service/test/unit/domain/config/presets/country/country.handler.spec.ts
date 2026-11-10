import { getCountryFlag } from "@common/utils/images/country-image.utils";
import { countryHandler } from "@domain/config/presets/country/country.handler";
import {
  CountryFilterItem,
  CountryPresetValue,
} from "@domain/config/presets/country/country.types";
import { showGlobalDatasetIdForSubject } from "@domain/config/presets/show-global-data/show-global-data.types";
import { DataItem, Dataset } from "@domain/entities/common/base-config.entity";
import { PresetDefinition } from "@domain/entities/preset.entity";
import { UserEntity } from "@domain/entities/user.entity";
import { VIEWER_SCOPES } from "@domain/entities/scopes";

function buildItem(
  overrides: Partial<CountryFilterItem> = {},
): CountryFilterItem {
  return { type: "country", ...overrides };
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

describe("countryHandler", () => {
  describe("without user (unrestricted)", () => {
    it("emits the synthetic ABI bucket plus every regional zone", () => {
      const preset: PresetDefinition = { country: buildItem() };

      const result = countryHandler.handle(preset) as {
        country: CountryPresetValue;
      };

      expect(result.country.enabled).toBe(true);
      expect(Object.keys(result.country.values)).toEqual(
        expect.arrayContaining([
          "ABI",
          "AFR",
          "APAC",
          "EUR",
          "MAZ",
          "NAZ",
          "SAZ",
        ]),
      );
    });

    it("places the synthetic Global row at the head of the ABI bucket", () => {
      const preset: PresetDefinition = { country: buildItem() };

      const result = countryHandler.handle(preset) as {
        country: CountryPresetValue;
      };

      const abi = result.country.values.ABI;
      expect(abi[0]).toEqual({
        value: "ABI",
        label: "All",
        zone: "ABI",
        quick_filter_label: "Global",
        image_url: getCountryFlag("ABI"),
      });
    });

    it("sorts countries inside each bucket alphabetically by title", () => {
      const preset: PresetDefinition = { country: buildItem() };

      const result = countryHandler.handle(preset) as {
        country: CountryPresetValue;
      };

      const eurLabels = result.country.values.EUR.map((entry) => entry.label);
      expect(eurLabels).toEqual([...eurLabels].sort());
    });

    it("returns Global default when ABI is in effective", () => {
      const preset: PresetDefinition = { country: buildItem() };

      const result = countryHandler.handle(preset) as {
        country: CountryPresetValue;
      };

      expect(result.country.default).toEqual({
        value: "ABI",
        label: "Global",
        quick_filter_label: "Global",
      });
    });

    it("includes image_url on country rows aligned with the countries registry", () => {
      const preset: PresetDefinition = {
        country: buildItem({ scope: ["BRA"] }),
      };

      const result = countryHandler.handle(preset) as {
        country: CountryPresetValue;
      };

      const brazil = result.country.values.SAZ.find((e) => e.value === "BRA");
      expect(brazil?.image_url).toBe(getCountryFlag("BRA"));
      expect(brazil?.image_url).toContain("countries/rounded_flags");
    });
  });

  describe("scope filter", () => {
    it("trims countries to those listed in scope", () => {
      const preset: PresetDefinition = {
        country: buildItem({ scope: ["BRA", "ARG", "USA"] }),
      };

      const result = countryHandler.handle(preset) as {
        country: CountryPresetValue;
      };

      const sazIds = result.country.values.SAZ.map((entry) => entry.value);
      const nazIds = result.country.values.NAZ.map((entry) => entry.value);

      expect(sazIds).toEqual(expect.arrayContaining(["BRA", "ARG"]));
      expect(sazIds).not.toContain("CHL");
      expect(nazIds).toEqual(["USA"]);
    });

    it("prunes empty zone buckets", () => {
      const preset: PresetDefinition = {
        country: buildItem({ scope: ["BRA"] }),
      };

      const result = countryHandler.handle(preset) as {
        country: CountryPresetValue;
      };

      expect(result.country.values.SAZ).toBeDefined();
      expect(result.country.values.AFR).toBeUndefined();
      expect(result.country.values.EUR).toBeUndefined();
    });
  });

  describe("zoneScope filter", () => {
    it("only emits buckets for zones listed in zoneScope (no ABI when omitted)", () => {
      const preset: PresetDefinition = {
        country: buildItem({ zoneScope: ["SAZ", "EUR"] }),
      };

      const result = countryHandler.handle(preset) as {
        country: CountryPresetValue;
      };

      expect(Object.keys(result.country.values).sort()).toEqual(["EUR", "SAZ"]);
      expect(result.country.values.ABI).toBeUndefined();
    });

    it("emits the ABI bucket when ABI is explicitly included in zoneScope", () => {
      const preset: PresetDefinition = {
        country: buildItem({ zoneScope: ["ABI", "SAZ"] }),
      };

      const result = countryHandler.handle(preset) as {
        country: CountryPresetValue;
      };

      expect(result.country.values.ABI).toBeDefined();
      expect(result.country.values.ABI[0].value).toBe("ABI");
    });
  });

  describe("permission trimming", () => {
    it("drops countries the CountryViewer cannot access", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.COUNTRY],
        country: "BR",
        supportedCountries: ["BR", "AR"],
      });
      const preset: PresetDefinition = { country: buildItem() };

      const result = countryHandler.handle(preset, undefined, user) as {
        country: CountryPresetValue;
      };

      const sazIds = result.country.values.SAZ.map((entry) => entry.value);
      expect(sazIds).toEqual(expect.arrayContaining(["ARG", "BRA"]));
      expect(sazIds).not.toContain("CHL");
      expect(result.country.values.EUR).toBeUndefined();
    });

    it("returns an empty values map for deny-mode users", () => {
      const user = UserEntity.create({
        scopes: ["unrelated.scope"],
        country: null,
        supportedCountries: [],
      });
      const preset: PresetDefinition = { country: buildItem() };

      const result = countryHandler.handle(preset, undefined, user) as {
        country: CountryPresetValue;
      };

      expect(result.country.values).toEqual({});
    });

    it("ZoneViewer.SAZ keeps SAZ and drops other regional zones plus ABI", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.ZONE.SAZ],
        country: "BR",
        supportedCountries: [],
      });
      const preset: PresetDefinition = { country: buildItem() };

      const result = countryHandler.handle(preset, undefined, user) as {
        country: CountryPresetValue;
      };

      expect(Object.keys(result.country.values)).toEqual(["SAZ"]);
      expect(result.country.default.value).toBe("BRA");
    });

    it("GlobalViewer keeps all buckets including the synthetic ABI row", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.GLOBAL],
        country: "BR",
        supportedCountries: [],
      });
      const preset: PresetDefinition = { country: buildItem() };

      const result = countryHandler.handle(preset, undefined, user) as {
        country: CountryPresetValue;
      };

      expect(result.country.values.ABI).toBeDefined();
      expect(result.country.values.ABI[0].value).toBe("ABI");
      expect(result.country.default.value).toBe("ABI");
    });
  });

  describe("excludeGlobal filter", () => {
    it("drops the ABI bucket for unrestricted callers", () => {
      const preset: PresetDefinition = {
        country: buildItem({ excludeGlobal: true }),
      };

      const result = countryHandler.handle(preset) as {
        country: CountryPresetValue;
      };

      expect(result.country.values.ABI).toBeUndefined();
      expect(Object.keys(result.country.values)).toEqual(
        expect.arrayContaining(["AFR", "APAC", "EUR", "MAZ", "NAZ", "SAZ"]),
      );
    });

    it("falls back to the user country when ABI would have been the default", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.GLOBAL],
        country: "BR",
        supportedCountries: [],
      });
      const preset: PresetDefinition = {
        country: buildItem({ excludeGlobal: true }),
      };

      const result = countryHandler.handle(preset, undefined, user) as {
        country: CountryPresetValue;
      };

      expect(result.country.values.ABI).toBeUndefined();
      expect(result.country.default.value).toBe("BRA");
    });

    it("ignores ABI even when explicitly listed in zoneScope", () => {
      const preset: PresetDefinition = {
        country: buildItem({
          zoneScope: ["ABI", "SAZ"],
          excludeGlobal: true,
        }),
      };

      const result = countryHandler.handle(preset) as {
        country: CountryPresetValue;
      };

      expect(result.country.values.ABI).toBeUndefined();
      expect(result.country.values.SAZ).toBeDefined();
    });

    it("accepts excludeGlobal as a stringified boolean from the query pipeline", () => {
      const preset: PresetDefinition = {
        country: buildItem({
          excludeGlobal: "true" as unknown as boolean,
        }),
      };

      const result = countryHandler.handle(preset) as {
        country: CountryPresetValue;
      };

      expect(result.country.values.ABI).toBeUndefined();
    });
  });

  describe("hideGlobalForKpi (show-global-data flags)", () => {
    it("declares no datasets when hideGlobalForKpi is unset", () => {
      expect(countryHandler.datasets({ country: buildItem() })).toEqual([]);
    });

    it("declares one dataset per distinct KPI referenced", () => {
      const preset: PresetDefinition = {
        a: buildItem({ hideGlobalForKpi: "pos" }),
        b: buildItem({ hideGlobalForKpi: "power" }),
      };
      const ds = countryHandler.datasets(preset);
      expect(ds).toHaveLength(2);
      expect(ds.map((d) => d.id).sort()).toEqual(
        [
          showGlobalDatasetIdForSubject("pos"),
          showGlobalDatasetIdForSubject("power"),
        ].sort(),
      );
    });

    it("dedupes datasets when two keys share the same KPI", () => {
      const preset: PresetDefinition = {
        a: buildItem({ hideGlobalForKpi: "pos" }),
        b: buildItem({ hideGlobalForKpi: "pos" }),
      };
      expect(countryHandler.datasets(preset)).toHaveLength(1);
    });

    it("drops the ABI bucket when the active env flag is n for that KPI (UAT)", () => {
      const prev = process.env.NODE_ENV;
      process.env.NODE_ENV = "uat";
      try {
        const preset: PresetDefinition = {
          country: buildItem({ hideGlobalForKpi: "pos" }),
        };
        const datasets = [
          buildShowGlobalDataset("pos", [
            { flag_uat: "n", flag_prd: "y" } as DataItem,
          ]),
        ];
        const result = countryHandler.handle(preset, datasets) as {
          country: CountryPresetValue;
        };
        expect(result.country.values.ABI).toBeUndefined();
      } finally {
        process.env.NODE_ENV = prev;
      }
    });

    it("drops the ABI bucket when the active env flag is n for power in production", () => {
      const prev = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";
      try {
        const preset: PresetDefinition = {
          country: buildItem({ hideGlobalForKpi: "power" }),
        };
        const datasets = [
          buildShowGlobalDataset("power", [
            { flag_uat: "y", flag_prd: "n" } as DataItem,
          ]),
        ];
        const result = countryHandler.handle(preset, datasets) as {
          country: CountryPresetValue;
        };
        expect(result.country.values.ABI).toBeUndefined();
      } finally {
        process.env.NODE_ENV = prev;
      }
    });

    it("keeps ABI when the active env flag is y for that KPI", () => {
      const prev = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";
      try {
        const preset: PresetDefinition = {
          country: buildItem({ hideGlobalForKpi: "pos" }),
        };
        const datasets = [
          buildShowGlobalDataset("pos", [
            { flag_uat: "n", flag_prd: "y" } as DataItem,
          ]),
        ];
        const result = countryHandler.handle(preset, datasets) as {
          country: CountryPresetValue;
        };
        expect(result.country.values.ABI).toBeDefined();
        expect(result.country.values.ABI![0].value).toBe("ABI");
      } finally {
        process.env.NODE_ENV = prev;
      }
    });

    it("falls back default like excludeGlobal when KPI hides Global", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.GLOBAL],
        country: "BR",
        supportedCountries: [],
      });
      const prev = process.env.NODE_ENV;
      process.env.NODE_ENV = "uat";
      try {
        const preset: PresetDefinition = {
          country: buildItem({ hideGlobalForKpi: "pos" }),
        };
        const datasets = [
          buildShowGlobalDataset("pos", [{ flag_uat: "n" } as DataItem]),
        ];
        const result = countryHandler.handle(preset, datasets, user) as {
          country: CountryPresetValue;
        };
        expect(result.country.values.ABI).toBeUndefined();
        expect(result.country.default.value).toBe("BRA");
      } finally {
        process.env.NODE_ENV = prev;
      }
    });

    it("ignores ABI in zoneScope when KPI suppresses Global", () => {
      const prev = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";
      try {
        const preset: PresetDefinition = {
          country: buildItem({
            zoneScope: ["ABI", "SAZ"],
            hideGlobalForKpi: "power",
          }),
        };
        const datasets = [
          buildShowGlobalDataset("power", [{ flag_prd: "n" } as DataItem]),
        ];
        const result = countryHandler.handle(preset, datasets) as {
          country: CountryPresetValue;
        };
        expect(result.country.values.ABI).toBeUndefined();
        expect(result.country.values.SAZ).toBeDefined();
      } finally {
        process.env.NODE_ENV = prev;
      }
    });

    it("still hides Global when excludeGlobal is true even if KPI flag is y", () => {
      const prev = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";
      try {
        const preset: PresetDefinition = {
          country: buildItem({
            excludeGlobal: true,
            hideGlobalForKpi: "pos",
          }),
        };
        const datasets = [
          buildShowGlobalDataset("pos", [{ flag_prd: "y" } as DataItem]),
        ];
        const result = countryHandler.handle(preset, datasets) as {
          country: CountryPresetValue;
        };
        expect(result.country.values.ABI).toBeUndefined();
      } finally {
        process.env.NODE_ENV = prev;
      }
    });

    it("hides Global from KPI when excludeGlobal is false and flag is n", () => {
      const prev = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";
      try {
        const preset: PresetDefinition = {
          country: buildItem({
            excludeGlobal: false,
            hideGlobalForKpi: "pos",
          }),
        };
        const datasets = [
          buildShowGlobalDataset("pos", [{ flag_prd: "n" } as DataItem]),
        ];
        const result = countryHandler.handle(preset, datasets) as {
          country: CountryPresetValue;
        };
        expect(result.country.values.ABI).toBeUndefined();
      } finally {
        process.env.NODE_ENV = prev;
      }
    });

    it("still honors hideGlobalForKpi on bypass pages when flag is n", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.COUNTRY],
        country: "BR",
        supportedCountries: ["AR"],
      });
      const prev = process.env.NODE_ENV;
      process.env.NODE_ENV = "uat";
      try {
        const preset: PresetDefinition = {
          country: buildItem({
            page: "category_home",
            hideGlobalForKpi: "pos",
          }),
        };
        const datasets = [
          buildShowGlobalDataset("pos", [{ flag_uat: "n" } as DataItem]),
        ];
        const result = countryHandler.handle(preset, datasets, user) as {
          country: CountryPresetValue;
        };
        expect(result.country.values.ABI).toBeUndefined();
      } finally {
        process.env.NODE_ENV = prev;
      }
    });

    it("keeps ABI on bypass pages when KPI flag is y", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.GLOBAL],
        country: "BR",
        supportedCountries: [],
      });
      const prev = process.env.NODE_ENV;
      process.env.NODE_ENV = "uat";
      try {
        const preset: PresetDefinition = {
          country: buildItem({
            page: "category_home",
            hideGlobalForKpi: "pos",
          }),
        };
        const datasets = [
          buildShowGlobalDataset("pos", [{ flag_uat: "y" } as DataItem]),
        ];
        const result = countryHandler.handle(preset, datasets, user) as {
          country: CountryPresetValue;
        };
        expect(result.country.values.ABI).toBeDefined();
      } finally {
        process.env.NODE_ENV = prev;
      }
    });
  });

  describe("page bypass (NO_VALIDATION_PAGES)", () => {
    it("exposes every zone for a CountryViewer when the page is in the bypass list", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.COUNTRY],
        country: "BR",
        supportedCountries: ["AR"],
      });
      const preset: PresetDefinition = {
        country: buildItem({ page: "category_home" }),
      };

      const result = countryHandler.handle(preset, undefined, user) as {
        country: CountryPresetValue;
      };

      expect(Object.keys(result.country.values)).toEqual(
        expect.arrayContaining([
          "ABI",
          "AFR",
          "APAC",
          "EUR",
          "MAZ",
          "NAZ",
          "SAZ",
        ]),
      );
    });

    it("keeps every country inside each bucket on bypass pages", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.COUNTRY],
        country: "BR",
        supportedCountries: ["AR"],
      });
      const bypassed: PresetDefinition = {
        country: buildItem({ page: "category_home" }),
      };
      const restricted: PresetDefinition = { country: buildItem() };

      const bypassedResult = countryHandler.handle(
        bypassed,
        undefined,
        user,
      ) as { country: CountryPresetValue };
      const restrictedResult = countryHandler.handle(
        restricted,
        undefined,
        user,
      ) as { country: CountryPresetValue };

      const bypassedSazIds = bypassedResult.country.values.SAZ.map(
        (entry) => entry.value,
      );
      const restrictedSazIds = restrictedResult.country.values.SAZ.map(
        (entry) => entry.value,
      );

      expect(bypassedSazIds).toEqual(expect.arrayContaining(restrictedSazIds));
      expect(bypassedSazIds.length).toBeGreaterThan(restrictedSazIds.length);
    });

    it("still honors scope on bypass pages (page only disables policy, not config)", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.COUNTRY],
        country: "BR",
        supportedCountries: ["AR"],
      });
      const preset: PresetDefinition = {
        country: buildItem({ page: "category_home", scope: ["BRA", "USA"] }),
      };

      const result = countryHandler.handle(preset, undefined, user) as {
        country: CountryPresetValue;
      };

      const sazIds = result.country.values.SAZ.map((entry) => entry.value);
      const nazIds = result.country.values.NAZ.map((entry) => entry.value);
      expect(sazIds).toEqual(["BRA"]);
      expect(nazIds).toEqual(["USA"]);
      expect(result.country.values.EUR).toBeUndefined();
    });

    it("still honors excludeGlobal on bypass pages", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.COUNTRY],
        country: "BR",
        supportedCountries: ["AR"],
      });
      const preset: PresetDefinition = {
        country: buildItem({ page: "category_home", excludeGlobal: true }),
      };

      const result = countryHandler.handle(preset, undefined, user) as {
        country: CountryPresetValue;
      };

      expect(result.country.values.ABI).toBeUndefined();
      expect(Object.keys(result.country.values)).toEqual(
        expect.arrayContaining(["AFR", "APAC", "EUR", "MAZ", "NAZ", "SAZ"]),
      );
    });
  });

  describe("non country items", () => {
    it("passes through entries that are not CountryFilterItem", () => {
      const preset: PresetDefinition = {
        unrelated: { foo: "bar" },
      };

      const result = countryHandler.handle(preset);

      expect(result.unrelated).toEqual({ foo: "bar" });
    });
  });
});
