import {
  resolveCountries,
  resolveCountriesByZone,
  resolveCountryByIso2,
} from "@domain/registries/resolver";

describe("registry resolver", () => {
  describe("resolveCountries", () => {
    it("resolves known ids in order, preserving input order", () => {
      const records = resolveCountries(["BRA", "ARG", "MEX"]);
      expect(records.map((r) => r.id)).toEqual(["BRA", "ARG", "MEX"]);
      expect(records[0].title).toBe("Brazil");
      expect(records[0].zone).toBe("SAZ");
    });

    it("silently drops unknown ids", () => {
      const records = resolveCountries(["BRA", "ZZZ", "ARG"]);
      expect(records.map((r) => r.id)).toEqual(["BRA", "ARG"]);
    });

    it("expands ['*'] into every registered country", () => {
      const records = resolveCountries(["*"]);
      expect(records.length).toBeGreaterThan(3);
      expect(records.map((r) => r.id)).toContain("BRA");
      expect(records.map((r) => r.id)).toContain("USA");
    });

    it("returns empty array for empty input", () => {
      expect(resolveCountries([])).toEqual([]);
    });
  });

  describe("resolveCountryByIso2", () => {
    it("returns the canonical record for a known ISO2 code", () => {
      const record = resolveCountryByIso2("BR");
      expect(record?.id).toBe("BRA");
      expect(record?.zone).toBe("SAZ");
    });

    it("is case-insensitive", () => {
      expect(resolveCountryByIso2("br")?.id).toBe("BRA");
    });

    it("returns undefined for unknown codes", () => {
      expect(resolveCountryByIso2("ZZ")).toBeUndefined();
      expect(resolveCountryByIso2("")).toBeUndefined();
    });
  });

  describe("resolveCountriesByZone", () => {
    it("returns every country in the requested zone", () => {
      const ids = resolveCountriesByZone("NAZ")
        .map((c) => c.id)
        .sort();
      expect(ids).toEqual(["CAN", "USA"]);
    });

    it("returns empty array for unknown zones", () => {
      expect(resolveCountriesByZone("ZZZ")).toEqual([]);
      expect(resolveCountriesByZone("")).toEqual([]);
    });
  });
});
