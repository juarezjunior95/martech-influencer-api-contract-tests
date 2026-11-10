import { computeZoneCountryDefaults } from "@domain/config/presets/common/zone-country-defaults";
import { UserEntity } from "@domain/entities/user.entity";
import { VIEWER_SCOPES } from "@domain/entities/scopes";

describe("computeZoneCountryDefaults", () => {
  describe("rule 1: ABI in effective", () => {
    it("returns the Global default for zone and country", () => {
      const result = computeZoneCountryDefaults(
        ["ABI", "SAZ", "EUR"],
        undefined,
      );

      expect(result.zone).toEqual({
        value: "ABI",
        label: "Global",
        quick_filter_label: "Global",
      });
      expect(result.country).toEqual({
        value: "ABI",
        label: "Global",
        quick_filter_label: "Global",
      });
    });

    it("returns Global default even when user is restricted, as long as ABI is effective", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.GLOBAL],
        country: "BR",
        supportedCountries: [],
      });

      const result = computeZoneCountryDefaults(["ABI", "SAZ"], user);

      expect(result.zone.value).toBe("ABI");
      expect(result.country.value).toBe("ABI");
    });
  });

  describe("rule 2: user's JWT country is reachable and in effective", () => {
    it("picks the user's home country and its zone", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.ZONE.SAZ],
        country: "BR",
        supportedCountries: [],
      });

      const result = computeZoneCountryDefaults(["SAZ"], user);

      expect(result.zone).toEqual({
        value: "SAZ",
        label: "SAZ",
        quick_filter_label: "SAZ",
      });
      expect(result.country).toEqual({
        value: "BRA",
        label: "Brazil",
        quick_filter_label: "Brazil",
      });
    });

    it("accepts ISO3 form on the JWT country claim", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.ZONE.SAZ],
        country: "BRA",
        supportedCountries: [],
      });

      const result = computeZoneCountryDefaults(["SAZ"], user);

      expect(result.country.value).toBe("BRA");
    });

    it("respects availableCountryIds when filtering candidates", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.ZONE.SAZ],
        country: "BR",
        supportedCountries: [],
      });

      const result = computeZoneCountryDefaults(
        ["SAZ"],
        user,
        new Set(["ARG"]),
      );

      expect(result.zone.value).toBe("SAZ");
      expect(result.country.value).toBe("ARG");
    });
  });

  describe("rule 3: user's home zone is in effective but country is not available", () => {
    it("falls back to the first available country in the user's home zone", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.ZONE.SAZ],
        country: "BR",
        supportedCountries: [],
      });

      const result = computeZoneCountryDefaults(
        ["SAZ"],
        user,
        new Set(["ARG", "CHL"]),
      );

      expect(result.zone.value).toBe("SAZ");
      expect(result.country.value).toBe("ARG");
    });
  });

  describe("rule 4 (fallback): first zone in effective with available country", () => {
    it("picks the first zone (registry order) and its first available country when user has no home zone match", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.ZONE.AFR],
        country: "BR",
        supportedCountries: [],
      });

      const result = computeZoneCountryDefaults(["AFR"], user);

      expect(result.zone.value).toBe("AFR");
      expect(result.country.value).toBeTruthy();
      expect(result.country.value).not.toBe("");
    });

    it("works without a user (unrestricted) by picking deterministic registry order", () => {
      const result = computeZoneCountryDefaults(["EUR"], undefined);

      expect(result.zone.value).toBe("EUR");
      expect(result.country.value).toBeTruthy();
    });
  });

  describe("edge cases", () => {
    it("returns ABI default when effective contains only ABI", () => {
      const result = computeZoneCountryDefaults(["ABI"], undefined);

      expect(result.zone.value).toBe("ABI");
      expect(result.country.value).toBe("ABI");
    });

    it("returns ABI default when effective is empty (regional empty)", () => {
      const result = computeZoneCountryDefaults([], undefined);

      expect(result.zone.value).toBe("ABI");
      expect(result.country.value).toBe("ABI");
    });

    it("emits empty country when no zone has any available country (last-resort)", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.ZONE.SAZ],
        country: null,
        supportedCountries: [],
      });

      const result = computeZoneCountryDefaults(
        ["SAZ"],
        user,
        new Set<string>(),
      );

      expect(result.zone.value).toBe("SAZ");
      expect(result.country).toEqual({
        value: "",
        label: "",
        quick_filter_label: "",
      });
    });
  });
});
