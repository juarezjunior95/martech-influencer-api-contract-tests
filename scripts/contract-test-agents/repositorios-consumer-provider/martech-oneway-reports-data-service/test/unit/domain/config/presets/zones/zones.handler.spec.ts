import { getCountryFlag } from "@common/utils/images/country-image.utils";
import { zonesHandler } from "@domain/config/presets/zones/zones.handler";
import {
  ZonesFilterItem,
  ZonesPresetValue,
} from "@domain/config/presets/zones/zones.types";
import { showGlobalDatasetIdForSubject } from "@domain/config/presets/show-global-data/show-global-data.types";
import { DataItem, Dataset } from "@domain/entities/common/base-config.entity";
import { PresetDefinition } from "@domain/entities/preset.entity";
import { UserEntity } from "@domain/entities/user.entity";
import { VIEWER_SCOPES } from "@domain/entities/scopes";

function buildItem(overrides: Partial<ZonesFilterItem> = {}): ZonesFilterItem {
  return { type: "zones", ...overrides };
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

describe("zoneHandler", () => {
  describe("without user (unrestricted)", () => {
    it("emits ABI first followed by regional zones sorted alphabetically", () => {
      const preset: PresetDefinition = { zones: buildItem() };

      const result = zonesHandler.handle(preset) as { zones: ZonesPresetValue };

      expect(result.zones.enabled).toBe(true);
      const ids = result.zones.values.map((entry) => entry.value);
      expect(ids[0]).toBe("ABI");
      const regional = ids.slice(1);
      expect(regional).toEqual([...regional].sort());
      expect(regional).toEqual(
        expect.arrayContaining(["AFR", "APAC", "EUR", "MAZ", "NAZ", "SAZ"]),
      );
    });

    it("includes image_url on each zone row resolved at request time", () => {
      const preset: PresetDefinition = {
        zones: buildItem({ scope: ["ABI", "SAZ"] }),
      };

      const result = zonesHandler.handle(preset) as { zones: ZonesPresetValue };

      const abi = result.zones.values.find((e) => e.value === "ABI");
      const saz = result.zones.values.find((e) => e.value === "SAZ");
      expect(abi?.image_url).toBe(getCountryFlag("ABI"));
      expect(saz?.image_url).toBe(getCountryFlag("SAZ"));
      expect(saz?.image_url).toContain("countries/rounded_flags");
    });

    it("uses the Global default when ABI is in scope", () => {
      const preset: PresetDefinition = { zones: buildItem() };

      const result = zonesHandler.handle(preset) as { zones: ZonesPresetValue };

      expect(result.zones.default).toEqual({
        value: "ABI",
        label: "Global",
        quick_filter_label: "Global",
        image_url: getCountryFlag("ABI"),
      });
    });
  });

  describe("scope filter", () => {
    it("trims values to the listed zones (no ABI)", () => {
      const preset: PresetDefinition = {
        zones: buildItem({ scope: ["EUR", "SAZ"] }),
      };

      const result = zonesHandler.handle(preset) as { zones: ZonesPresetValue };

      const ids = result.zones.values.map((entry) => entry.value);
      expect(ids).toEqual(expect.arrayContaining(["EUR", "SAZ"]));
      expect(ids).not.toContain("ABI");
      expect(ids).not.toContain("AFR");
    });

    it("includes ABI when listed alongside regional zones", () => {
      const preset: PresetDefinition = {
        zones: buildItem({ scope: ["ABI", "SAZ"] }),
      };

      const result = zonesHandler.handle(preset) as { zones: ZonesPresetValue };

      const ids = result.zones.values.map((entry) => entry.value);
      expect(ids[0]).toBe("ABI");
      expect(ids).toContain("SAZ");
    });

    it("treats scope=[ABI] as wildcard expanding to every zone", () => {
      const preset: PresetDefinition = {
        zones: buildItem({ scope: ["ABI"] }),
      };

      const result = zonesHandler.handle(preset) as { zones: ZonesPresetValue };

      const ids = result.zones.values.map((entry) => entry.value);
      expect(ids).toEqual(
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
  });

  describe("permission trimming", () => {
    it("returns an empty list for deny-mode users", () => {
      const user = UserEntity.create({
        scopes: ["unrelated.scope"],
        country: null,
        supportedCountries: [],
      });
      const preset: PresetDefinition = { zones: buildItem() };

      const result = zonesHandler.handle(preset, undefined, user) as {
        zones: ZonesPresetValue;
      };

      expect(result.zones.values).toEqual([]);
    });

    it("ZoneViewer.SAZ exposes only SAZ and uses the user country as default", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.ZONE.SAZ],
        country: "BR",
        supportedCountries: [],
      });
      const preset: PresetDefinition = { zones: buildItem() };

      const result = zonesHandler.handle(preset, undefined, user) as {
        zones: ZonesPresetValue;
      };

      const ids = result.zones.values.map((entry) => entry.value);
      expect(ids).toEqual(["SAZ"]);
      expect(result.zones.default.value).toBe("SAZ");
    });

    it("GlobalViewer keeps ABI and every regional zone", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.GLOBAL],
        country: "BR",
        supportedCountries: [],
      });
      const preset: PresetDefinition = { zones: buildItem() };

      const result = zonesHandler.handle(preset, undefined, user) as {
        zones: ZonesPresetValue;
      };

      const ids = result.zones.values.map((entry) => entry.value);
      expect(ids).toContain("ABI");
      expect(ids).toContain("SAZ");
      expect(result.zones.default.value).toBe("ABI");
    });

    it("CountryViewer derives reachable zones from supportedCountries", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.COUNTRY],
        country: "BR",
        supportedCountries: ["BR", "MX"],
      });
      const preset: PresetDefinition = { zones: buildItem() };

      const result = zonesHandler.handle(preset, undefined, user) as {
        zones: ZonesPresetValue;
      };

      const ids = result.zones.values.map((entry) => entry.value);
      expect(ids).toEqual(expect.arrayContaining(["SAZ", "MAZ"]));
      expect(ids).not.toContain("EUR");
      expect(ids).not.toContain("ABI");
    });
  });

  describe("countryScope mirror", () => {
    it("does not affect values (only the default computation)", () => {
      const presetWithoutMirror: PresetDefinition = {
        zones: buildItem({ scope: ["SAZ"] }),
      };
      const presetWithMirror: PresetDefinition = {
        zones: buildItem({ scope: ["SAZ"], countryScope: ["BRA"] }),
      };

      const a = zonesHandler.handle(presetWithoutMirror) as {
        zones: ZonesPresetValue;
      };
      const b = zonesHandler.handle(presetWithMirror) as {
        zones: ZonesPresetValue;
      };

      expect(a.zones.values).toEqual(b.zones.values);
    });
  });

  describe("excludeGlobal filter", () => {
    it("drops the ABI row for unrestricted callers", () => {
      const preset: PresetDefinition = {
        zones: buildItem({ excludeGlobal: true }),
      };

      const result = zonesHandler.handle(preset) as { zones: ZonesPresetValue };

      const ids = result.zones.values.map((entry) => entry.value);
      expect(ids).not.toContain("ABI");
      expect(ids).toEqual(
        expect.arrayContaining(["AFR", "APAC", "EUR", "MAZ", "NAZ", "SAZ"]),
      );
    });

    it("falls back to the user country zone when ABI would have been the default", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.GLOBAL],
        country: "BR",
        supportedCountries: [],
      });
      const preset: PresetDefinition = {
        zones: buildItem({ excludeGlobal: true }),
      };

      const result = zonesHandler.handle(preset, undefined, user) as {
        zones: ZonesPresetValue;
      };

      const ids = result.zones.values.map((entry) => entry.value);
      expect(ids).not.toContain("ABI");
      expect(result.zones.default.value).toBe("SAZ");
    });

    it("ignores ABI even when explicitly listed in scope", () => {
      const preset: PresetDefinition = {
        zones: buildItem({ scope: ["ABI", "SAZ"], excludeGlobal: true }),
      };

      const result = zonesHandler.handle(preset) as { zones: ZonesPresetValue };

      const ids = result.zones.values.map((entry) => entry.value);
      expect(ids).not.toContain("ABI");
      expect(ids).toContain("SAZ");
    });

    it("accepts excludeGlobal as a stringified boolean from the query pipeline", () => {
      const preset: PresetDefinition = {
        zones: buildItem({
          excludeGlobal: "true" as unknown as boolean,
        }),
      };

      const result = zonesHandler.handle(preset) as { zones: ZonesPresetValue };

      const ids = result.zones.values.map((entry) => entry.value);
      expect(ids).not.toContain("ABI");
    });
  });

  describe("hideGlobalForKpi (show-global-data flags)", () => {
    it("declares no datasets when hideGlobalForKpi is unset", () => {
      expect(zonesHandler.datasets({ zones: buildItem() })).toEqual([]);
    });

    it("declares datasets for distinct KPIs on multiple keys", () => {
      const preset: PresetDefinition = {
        z1: buildItem({ hideGlobalForKpi: "pos" }),
        z2: buildItem({ hideGlobalForKpi: "power" }),
      };
      const ds = zonesHandler.datasets(preset);
      expect(ds).toHaveLength(2);
    });

    it("drops the ABI row when UAT flag is n for pos", () => {
      const prev = process.env.NODE_ENV;
      process.env.NODE_ENV = "uat";
      try {
        const preset: PresetDefinition = {
          zones: buildItem({ hideGlobalForKpi: "pos" }),
        };
        const datasets = [
          buildShowGlobalDataset("pos", [
            { flag_uat: "n", flag_prd: "y" } as DataItem,
          ]),
        ];
        const result = zonesHandler.handle(preset, datasets) as {
          zones: ZonesPresetValue;
        };
        const ids = result.zones.values.map((e) => e.value);
        expect(ids).not.toContain("ABI");
      } finally {
        process.env.NODE_ENV = prev;
      }
    });

    it("drops the ABI row when prod flag is n for power", () => {
      const prev = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";
      try {
        const preset: PresetDefinition = {
          zones: buildItem({ hideGlobalForKpi: "power" }),
        };
        const datasets = [
          buildShowGlobalDataset("power", [
            { flag_uat: "y", flag_prd: "n" } as DataItem,
          ]),
        ];
        const result = zonesHandler.handle(preset, datasets) as {
          zones: ZonesPresetValue;
        };
        expect(result.zones.values.map((e) => e.value)).not.toContain("ABI");
      } finally {
        process.env.NODE_ENV = prev;
      }
    });

    it("keeps ABI when the active env flag is y", () => {
      const prev = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";
      try {
        const preset: PresetDefinition = {
          zones: buildItem({ hideGlobalForKpi: "pos" }),
        };
        const datasets = [
          buildShowGlobalDataset("pos", [{ flag_prd: "y" } as DataItem]),
        ];
        const result = zonesHandler.handle(preset, datasets) as {
          zones: ZonesPresetValue;
        };
        expect(result.zones.values.map((e) => e.value)).toContain("ABI");
      } finally {
        process.env.NODE_ENV = prev;
      }
    });

    it("ignores ABI in scope when KPI suppresses Global", () => {
      const prev = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";
      try {
        const preset: PresetDefinition = {
          zones: buildItem({
            scope: ["ABI", "SAZ"],
            hideGlobalForKpi: "power",
          }),
        };
        const datasets = [
          buildShowGlobalDataset("power", [{ flag_prd: "n" } as DataItem]),
        ];
        const result = zonesHandler.handle(preset, datasets) as {
          zones: ZonesPresetValue;
        };
        const ids = result.zones.values.map((e) => e.value);
        expect(ids).not.toContain("ABI");
        expect(ids).toContain("SAZ");
      } finally {
        process.env.NODE_ENV = prev;
      }
    });

    it("still hides ABI when excludeGlobal is true even if KPI flag is y", () => {
      const prev = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";
      try {
        const preset: PresetDefinition = {
          zones: buildItem({
            excludeGlobal: true,
            hideGlobalForKpi: "pos",
          }),
        };
        const datasets = [
          buildShowGlobalDataset("pos", [{ flag_prd: "y" } as DataItem]),
        ];
        const result = zonesHandler.handle(preset, datasets) as {
          zones: ZonesPresetValue;
        };
        expect(result.zones.values.map((e) => e.value)).not.toContain("ABI");
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
          zones: buildItem({
            page: "category_home",
            hideGlobalForKpi: "pos",
          }),
        };
        const datasets = [
          buildShowGlobalDataset("pos", [{ flag_uat: "n" } as DataItem]),
        ];
        const result = zonesHandler.handle(preset, datasets, user) as {
          zones: ZonesPresetValue;
        };
        expect(result.zones.values.map((e) => e.value)).not.toContain("ABI");
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
          zones: buildItem({
            page: "category_home",
            hideGlobalForKpi: "pos",
          }),
        };
        const datasets = [
          buildShowGlobalDataset("pos", [{ flag_uat: "y" } as DataItem]),
        ];
        const result = zonesHandler.handle(preset, datasets, user) as {
          zones: ZonesPresetValue;
        };
        expect(result.zones.values.map((e) => e.value)).toContain("ABI");
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
        zones: buildItem({ page: "category_home" }),
      };

      const result = zonesHandler.handle(preset, undefined, user) as {
        zones: ZonesPresetValue;
      };

      const ids = result.zones.values.map((entry) => entry.value);
      expect(ids).toEqual(
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

    it("produces the same zone list on bypass pages as for an unrestricted caller", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.COUNTRY],
        country: "BR",
        supportedCountries: ["AR"],
      });
      const bypassed: PresetDefinition = {
        zones: buildItem({ page: "category_home" }),
      };
      const unrestricted: PresetDefinition = { zones: buildItem() };

      const bypassedResult = zonesHandler.handle(bypassed, undefined, user) as {
        zones: ZonesPresetValue;
      };
      const unrestrictedResult = zonesHandler.handle(unrestricted) as {
        zones: ZonesPresetValue;
      };

      expect(bypassedResult.zones.values).toEqual(
        unrestrictedResult.zones.values,
      );
    });

    it("falls back to the Global default on bypass pages when ABI is in scope", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.COUNTRY],
        country: "BR",
        supportedCountries: ["AR"],
      });
      const preset: PresetDefinition = {
        zones: buildItem({ page: "category_home" }),
      };

      const result = zonesHandler.handle(preset, undefined, user) as {
        zones: ZonesPresetValue;
      };

      expect(result.zones.default).toEqual({
        value: "ABI",
        label: "Global",
        quick_filter_label: "Global",
        image_url: getCountryFlag("ABI"),
      });
    });

    it("still trims by policy when the page is not in the bypass list", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.COUNTRY],
        country: "BR",
        supportedCountries: ["AR"],
      });
      const preset: PresetDefinition = {
        zones: buildItem({ page: "category_other" }),
      };

      const result = zonesHandler.handle(preset, undefined, user) as {
        zones: ZonesPresetValue;
      };

      const ids = result.zones.values.map((entry) => entry.value);
      expect(ids).toEqual(["SAZ"]);
    });

    it("still honors scope on bypass pages (page only disables policy, not config)", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.COUNTRY],
        country: "BR",
        supportedCountries: ["AR"],
      });
      const preset: PresetDefinition = {
        zones: buildItem({ page: "category_home", scope: ["EUR", "SAZ"] }),
      };

      const result = zonesHandler.handle(preset, undefined, user) as {
        zones: ZonesPresetValue;
      };

      const ids = result.zones.values.map((entry) => entry.value);
      expect(ids).toEqual(expect.arrayContaining(["EUR", "SAZ"]));
      expect(ids).not.toContain("ABI");
      expect(ids).not.toContain("AFR");
    });

    it("still honors excludeGlobal on bypass pages", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.COUNTRY],
        country: "BR",
        supportedCountries: ["AR"],
      });
      const preset: PresetDefinition = {
        zones: buildItem({ page: "category_home", excludeGlobal: true }),
      };

      const result = zonesHandler.handle(preset, undefined, user) as {
        zones: ZonesPresetValue;
      };

      const ids = result.zones.values.map((entry) => entry.value);
      expect(ids).not.toContain("ABI");
      expect(ids).toEqual(
        expect.arrayContaining(["AFR", "APAC", "EUR", "MAZ", "NAZ", "SAZ"]),
      );
    });
  });

  describe("non zone items", () => {
    it("passes through entries that are not ZoneFilterItem", () => {
      const preset: PresetDefinition = {
        unrelated: { foo: "bar" },
      };

      const result = zonesHandler.handle(preset);

      expect(result.unrelated).toEqual({ foo: "bar" });
    });
  });
});
