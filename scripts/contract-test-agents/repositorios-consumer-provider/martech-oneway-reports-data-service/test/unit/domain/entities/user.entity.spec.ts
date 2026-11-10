import { VIEWER_SCOPES } from "@domain/entities/scopes";
import { UserEntity } from "@domain/entities/user.entity";

describe("UserEntity policy resolution", () => {
  it("unrestricted when no JWT inputs are provided", () => {
    const user = UserEntity.create({
      scopes: [],
      country: null,
      supportedCountries: [],
    });
    expect(user.policy.mode).toBe("unrestricted");
    expect(user.hasCountryAccess("BRA")).toBe(true);
  });

  it("GlobalViewer wins over zone/country viewer scopes", () => {
    const user = UserEntity.create({
      scopes: [
        VIEWER_SCOPES.GLOBAL,
        VIEWER_SCOPES.ZONE.AFR,
        VIEWER_SCOPES.COUNTRY,
      ],
      country: "BR",
      supportedCountries: ["BR"],
    });
    expect(user.policy.mode).toBe("all");
    expect(user.hasCountryAccess("USA")).toBe(true);
    expect(user.hasCountryAccess("ZAF")).toBe(true);
  });

  it("multiple zone scopes union their countries", () => {
    const user = UserEntity.create({
      scopes: [VIEWER_SCOPES.ZONE.AFR, VIEWER_SCOPES.ZONE.EUR],
      country: null,
      supportedCountries: [],
    });
    expect(user.policy.mode).toBe("explicit");
    expect(user.hasCountryAccess("ZAF")).toBe(true); // AFR
    expect(user.hasCountryAccess("FRA")).toBe(true); // EUR
    expect(user.hasCountryAccess("BRA")).toBe(false); // SAZ
  });

  it("ZoneViewer + jwt.country does NOT grant access outside the zone (no CountryViewer)", () => {
    const user = UserEntity.create({
      scopes: [VIEWER_SCOPES.ZONE.AFR],
      country: "BR", // ISO2 of BRA, outside AFR
      supportedCountries: [],
    });
    expect(user.policy.mode).toBe("explicit");
    expect(user.hasCountryAccess("BRA")).toBe(false);
    expect(user.hasCountryAccess("ZAF")).toBe(true);
  });

  it("ZoneViewer + jwt.country inside the zone is unchanged (zone wins)", () => {
    const user = UserEntity.create({
      scopes: [VIEWER_SCOPES.ZONE.AFR],
      country: "ZA",
      supportedCountries: [],
    });
    if (user.policy.mode !== "explicit") {
      throw new Error("Expected explicit mode");
    }
    expect(user.policy.iso3Set.has("ZAF")).toBe(true);
  });

  it("CountryViewer grants access to all supportedCountries plus jwt.country", () => {
    const user = UserEntity.create({
      scopes: [VIEWER_SCOPES.COUNTRY],
      country: "BR",
      supportedCountries: ["BR", "US"],
    });
    expect(user.policy.mode).toBe("explicit");
    expect(user.hasCountryAccess("BRA")).toBe(true);
    expect(user.hasCountryAccess("USA")).toBe(true);
    expect(user.hasCountryAccess("ARG")).toBe(false);
  });

  it("CountryViewer with jwt.country outside supportedCountries -> both included", () => {
    const user = UserEntity.create({
      scopes: [VIEWER_SCOPES.COUNTRY],
      country: "BR",
      supportedCountries: ["US"],
    });
    expect(user.policy.mode).toBe("explicit");
    expect(user.hasCountryAccess("BRA")).toBe(true);
    expect(user.hasCountryAccess("USA")).toBe(true);
  });

  it("JWT present but no viewer scope -> deny", () => {
    const user = UserEntity.create({
      scopes: ["OneWayReports.TradeExecution.Read"],
      country: "BR",
      supportedCountries: ["BR", "US"],
    });
    expect(user.policy.mode).toBe("deny");
    expect(user.hasCountryAccess("BRA")).toBe(false);
  });

  it("ISO2 entries unknown to registry are silently dropped", () => {
    const user = UserEntity.create({
      scopes: [VIEWER_SCOPES.COUNTRY],
      country: "BR",
      supportedCountries: ["BR", "ZZ"],
    });
    expect(user.policy.mode).toBe("explicit");
    expect(user.hasCountryAccess("BRA")).toBe(true);
  });

  it("CountryViewer with `*` wildcard -> promoted to `all`", () => {
    const user = UserEntity.create({
      scopes: [VIEWER_SCOPES.COUNTRY],
      country: null,
      supportedCountries: ["*"],
    });
    expect(user.policy.mode).toBe("all");
    expect(user.hasCountryAccess("BRA")).toBe(true);
    expect(user.hasCountryAccess("ZAF")).toBe(true);
  });

  it("CountryViewer with the full ISO2 list -> promoted to `all`", () => {
    const allIso2 = [
      "MZ",
      "NG",
      "ZA",
      "TZ",
      "UG",
      "ZM",
      "CN",
      "IN",
      "JP",
      "KR",
      "VN",
      "BE",
      "FR",
      "DE",
      "IT",
      "NL",
      "GB",
      "CO",
      "DO",
      "EC",
      "SV",
      "GT",
      "HN",
      "MX",
      "PA",
      "PE",
      "CA",
      "US",
      "AR",
      "BO",
      "BR",
      "CL",
      "PY",
      "UY",
    ];
    const user = UserEntity.create({
      scopes: [VIEWER_SCOPES.COUNTRY],
      country: null,
      supportedCountries: allIso2,
    });
    expect(user.policy.mode).toBe("all");
  });

  it("CountryViewer missing one country stays in `explicit`", () => {
    const allIso2ExceptOne = [
      "MZ",
      "NG",
      "ZA",
      "TZ",
      "UG",
      "ZM",
      "CN",
      "IN",
      "JP",
      "KR",
      "VN",
      "BE",
      "FR",
      "DE",
      "IT",
      "NL",
      "GB",
      "CO",
      "DO",
      "EC",
      "SV",
      "GT",
      "HN",
      "MX",
      "PA",
      "PE",
      "CA",
      "US",
      "AR",
      "BO",
      "BR",
      "CL",
      "PY",
      // UY missing
    ];
    const user = UserEntity.create({
      scopes: [VIEWER_SCOPES.COUNTRY],
      country: null,
      supportedCountries: allIso2ExceptOne,
    });
    expect(user.policy.mode).toBe("explicit");
    expect(user.hasCountryAccess("BRA")).toBe(true);
    expect(user.hasCountryAccess("URY")).toBe(false);
  });

  describe("ZoneViewer + CountryViewer (additive scopes)", () => {
    it("merges zone countries with supportedCountries and jwt.country", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.ZONE.APAC, VIEWER_SCOPES.COUNTRY],
        country: "BR",
        supportedCountries: ["US"],
      });

      expect(user.policy.mode).toBe("explicit");
      // APAC zone countries reachable via ZoneViewer.
      expect(user.hasCountryAccess("CHN")).toBe(true);
      expect(user.hasCountryAccess("KOR")).toBe(true);
      // CountryViewer extras: US (supportedCountries) + BR (jwt claim).
      expect(user.hasCountryAccess("USA")).toBe(true);
      expect(user.hasCountryAccess("BRA")).toBe(true);
      // Other regional countries remain out of reach.
      expect(user.hasCountryAccess("ARG")).toBe(false);
      expect(user.hasCountryAccess("FRA")).toBe(false);
    });

    it("with empty supportedCountries falls back to zone-only access", () => {
      const user = UserEntity.create({
        scopes: [VIEWER_SCOPES.ZONE.APAC, VIEWER_SCOPES.COUNTRY],
        country: null,
        supportedCountries: [],
      });

      expect(user.policy.mode).toBe("explicit");
      expect(user.hasCountryAccess("CHN")).toBe(true);
      expect(user.hasCountryAccess("BRA")).toBe(false);
    });

    it("multiple zone scopes + CountryViewer all merge together", () => {
      const user = UserEntity.create({
        scopes: [
          VIEWER_SCOPES.ZONE.APAC,
          VIEWER_SCOPES.ZONE.NAZ,
          VIEWER_SCOPES.COUNTRY,
        ],
        country: "BR",
        supportedCountries: [],
      });

      expect(user.policy.mode).toBe("explicit");
      expect(user.hasCountryAccess("CHN")).toBe(true); // APAC
      expect(user.hasCountryAccess("USA")).toBe(true); // NAZ
      expect(user.hasCountryAccess("BRA")).toBe(true); // jwt country claim
      expect(user.hasCountryAccess("ARG")).toBe(false);
    });
  });

  it("getSupportedCountries returns the effective ISO3 list when explicit", () => {
    const user = UserEntity.create({
      scopes: [VIEWER_SCOPES.ZONE.NAZ],
      country: null,
      supportedCountries: [],
    });
    const list = user.getSupportedCountries().sort();
    expect(list).toEqual(["CAN", "USA"]);
  });
});
