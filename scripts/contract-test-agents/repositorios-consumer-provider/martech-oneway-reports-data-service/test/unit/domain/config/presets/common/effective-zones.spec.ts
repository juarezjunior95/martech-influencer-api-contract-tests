import { computeEffectiveZones } from "@domain/config/presets/common/effective-zones";
import { UserEntity } from "@domain/entities/user.entity";
import { VIEWER_SCOPES } from "@domain/entities/scopes";

describe("computeEffectiveZones", () => {
  describe("without user (no JWT)", () => {
    it("returns every zone including ABI when scope is omitted", () => {
      const { effective, includesGlobal } = computeEffectiveZones(
        undefined,
        undefined,
      );

      expect(effective).toEqual(
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
      expect(includesGlobal).toBe(true);
    });

    it("returns every zone when scope is empty array", () => {
      const { effective, includesGlobal } = computeEffectiveZones(
        [],
        undefined,
      );

      expect(effective).toEqual(
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
      expect(includesGlobal).toBe(true);
    });

    it("treats scope=[ABI] as a wildcard expanding to every zone", () => {
      const { effective, includesGlobal } = computeEffectiveZones(
        ["ABI"],
        undefined,
      );

      expect(effective).toEqual(
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
      expect(includesGlobal).toBe(true);
    });

    it("filters down to the explicit scope when ABI is absent", () => {
      const { effective, includesGlobal } = computeEffectiveZones(
        ["AFR", "EUR"],
        undefined,
      );

      expect(effective).toEqual(["AFR", "EUR"]);
      expect(includesGlobal).toBe(false);
    });

    it("emits ABI when listed alongside regional zones", () => {
      const { effective, includesGlobal } = computeEffectiveZones(
        ["ABI", "AFR"],
        undefined,
      );

      expect(effective).toEqual(expect.arrayContaining(["ABI", "AFR"]));
      expect(includesGlobal).toBe(true);
    });

    it("drops unknown zone ids", () => {
      const { effective } = computeEffectiveZones(
        ["AFR", "XXX", "EUR"],
        undefined,
      );

      expect(effective).toEqual(["AFR", "EUR"]);
    });
  });

  describe("with GlobalViewer (mode=all)", () => {
    it("returns every zone including ABI", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.GLOBAL],
        country: null,
        supportedCountries: [],
      });

      const { effective, includesGlobal } = computeEffectiveZones(
        undefined,
        user,
      );

      expect(effective).toContain("ABI");
      expect(effective).toContain("SAZ");
      expect(includesGlobal).toBe(true);
    });
  });

  describe("with deny mode", () => {
    it("returns no zones when user has no viewer scopes", () => {
      const user = UserEntity.create({
        scopes: ["unrelated.scope"],
        country: null,
        supportedCountries: [],
      });

      const { effective, includesGlobal } = computeEffectiveZones(
        undefined,
        user,
      );

      expect(effective).toEqual([]);
      expect(includesGlobal).toBe(false);
    });
  });

  describe("with ZoneViewer (explicit mode)", () => {
    it("emits only the user's zones (no ABI)", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.ZONE.SAZ],
        country: "BR",
        supportedCountries: [],
      });

      const { effective, includesGlobal } = computeEffectiveZones(
        undefined,
        user,
      );

      expect(effective).toEqual(["SAZ"]);
      expect(includesGlobal).toBe(false);
    });

    it("intersects user reachable zones with the requested scope", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.ZONE.SAZ, VIEWER_SCOPES.ZONE.EUR],
        country: null,
        supportedCountries: [],
      });

      const { effective } = computeEffectiveZones(["SAZ", "AFR"], user);

      expect(effective).toEqual(["SAZ"]);
    });
  });

  describe("with CountryViewer (transitive zones)", () => {
    it("derives zones from accessible countries", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.COUNTRY],
        country: "BR",
        supportedCountries: ["BR", "MX"],
      });

      const { effective, includesGlobal } = computeEffectiveZones(
        undefined,
        user,
      );

      expect(effective).toEqual(expect.arrayContaining(["SAZ", "MAZ"]));
      expect(effective).not.toContain("EUR");
      expect(includesGlobal).toBe(false);
    });
  });

  describe("skipReachabilityFilter (NO_VALIDATION_PAGES bypass)", () => {
    it("returns every candidate zone for a restricted user", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.COUNTRY],
        country: "BR",
        supportedCountries: ["AR"],
      });

      const { effective, includesGlobal } = computeEffectiveZones(
        undefined,
        user,
        { skipReachabilityFilter: true },
      );

      expect(effective).toEqual(
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
      expect(includesGlobal).toBe(true);
    });
  });
});
