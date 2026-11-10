import { getCountryFlag } from "@common/utils/images/country-image.utils";
import { COUNTRY_IMAGE_PLACEHOLDER_PATH } from "@common/utils/images/country-image-paths.constants";

const imagePathPrefix = "http://localhost:3030/images";
const withPrefix = (imagePath: string) => `${imagePathPrefix}/${imagePath}`;

describe("getCountryFlag", () => {
  beforeEach(() => {
    process.env.APP_PORT = "3030";
    process.env.CDN_BASE_URL = imagePathPrefix;
  });

  afterEach(() => {
    delete process.env.APP_PORT;
    delete process.env.CDN_BASE_URL;
    delete process.env.CDN_PATH_PREFIX;
  });

  describe("icon format (default)", () => {
    it("should return icon image for a matching country", () => {
      const result = getCountryFlag("BRAZIL");

      expect(result).toBe(withPrefix("countries/rounded_flags/BRA.png"));
    });

    it("should return icon image when format is explicitly specified", () => {
      const result = getCountryFlag("BRAZIL", { format: "icon" });

      expect(result).toBe(withPrefix("countries/rounded_flags/BRA.png"));
    });

    it("should normalize country name by converting to uppercase", () => {
      const result = getCountryFlag("brazil");

      expect(result).toBe(withPrefix("countries/rounded_flags/BRA.png"));
    });

    it("should normalize country name by replacing spaces with underscores", () => {
      const result = getCountryFlag("united states");

      expect(result).toBe(withPrefix("countries/rounded_flags/USA.png"));
    });

    it("should match alternative country names", () => {
      const result = getCountryFlag("USA");

      expect(result).toBe(withPrefix("countries/rounded_flags/USA.png"));
    });
  });

  describe("waving format", () => {
    it("should return waving image when format is waving", () => {
      const result = getCountryFlag("BRAZIL", { format: "waving" });

      expect(result).toBe(withPrefix("countries/waving/BRA.png"));
    });

    it("should return deterministic waving path for a matching country", () => {
      const result = getCountryFlag("JPN", { format: "waving" });

      expect(result).toBe(withPrefix("countries/waving/JPN.png"));
    });
  });

  describe("business unit names renamed in MARTLH-12000", () => {
    it("should resolve UK&I to the West Europe asset", () => {
      const result = getCountryFlag("UK&I", { format: "waving" });

      expect(result).toBe(withPrefix("countries/waving/WEST_EUROPE.png"));
    });

    it("should resolve United State (singular) to the USA asset", () => {
      const result = getCountryFlag("UNITED STATE", { format: "waving" });

      expect(result).toBe(withPrefix("countries/waving/USA.png"));
    });

    it("should resolve Greater Europe", () => {
      const result = getCountryFlag("GREATER EUROPE", { format: "waving" });

      expect(result).toBe(
        withPrefix("countries/waving/EUR_GREATER_EUROPE.png"),
      );
    });
  });

  describe("fallbacks", () => {
    it("should return placeholder when country is not found", () => {
      const result = getCountryFlag("UNKNOWN_COUNTRY");

      expect(result).toBe(withPrefix(COUNTRY_IMAGE_PLACEHOLDER_PATH));
    });

    it("should return placeholder for unknown waving image", () => {
      const result = getCountryFlag("UNKNOWN_COUNTRY", { format: "waving" });

      expect(result).toBe(withPrefix(COUNTRY_IMAGE_PLACEHOLDER_PATH));
    });
  });

  describe("environment", () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it("should concatenate CDN_BASE_URL even for non-http values", () => {
      const badPrefix =
        "data:image/svg+xml,%3Csvg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;40&quot; height=&quot;40&quot; viewBox=&quot;0 0 40 40&quot;%3E%3Crect width=&quot;40&quot; height=&quot;40&quot; fill=&quot;%23e0e0e0&quot;/%3E%3C/svg%3E";
      process.env.CDN_BASE_URL = badPrefix;

      const result = getCountryFlag("BRAZIL");

      expect(result).toBe(`${badPrefix}/countries/rounded_flags/BRA.png`);
    });
  });

  describe("edge cases", () => {
    it("should return empty string for null value", () => {
      const result = getCountryFlag(null as any);

      expect(result).toBe("");
    });

    it("should return empty string for undefined value", () => {
      const result = getCountryFlag(undefined as any);

      expect(result).toBe("");
    });

    it("should handle numeric values", () => {
      const result = getCountryFlag(123);

      expect(result).toBe(withPrefix(COUNTRY_IMAGE_PLACEHOLDER_PATH));
    });

    it("should handle empty string", () => {
      const result = getCountryFlag("");

      expect(result).toBe(withPrefix(COUNTRY_IMAGE_PLACEHOLDER_PATH));
    });

    it("should handle mixed case input", () => {
      const result = getCountryFlag("BrAzIl");

      expect(result).toBe(withPrefix("countries/rounded_flags/BRA.png"));
    });
  });
});
