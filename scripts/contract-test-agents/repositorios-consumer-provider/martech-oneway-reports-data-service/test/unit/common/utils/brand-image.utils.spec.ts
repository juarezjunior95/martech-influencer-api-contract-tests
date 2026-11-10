import {
  getBrandImage,
  getBrandImageSingleUrl,
} from "@common/utils/images/brand-image.utils";
import { BRAND_IMAGE_PLACEHOLDER_PATH } from "@common/utils/images/brand-image-paths.constants";

const imagePathPrefix = "http://localhost:3030/images";
const withPrefix = (imagePath: string) => `${imagePathPrefix}/${imagePath}`;

describe("getBrandImage", () => {
  beforeEach(() => {
    process.env.APP_PORT = "3030";
    process.env.CDN_BASE_URL = imagePathPrefix;
  });

  afterEach(() => {
    delete process.env.APP_PORT;
    delete process.env.CDN_BASE_URL;
    delete process.env.CDN_PATH_PREFIX;
  });

  describe("getBrandImageSingleUrl", () => {
    it("matches square getBrandImage for resolved brands", () => {
      expect(getBrandImageSingleUrl("2m")).toBe(getBrandImage("2m"));
    });

    it("uses placeholder for unknown brands", () => {
      expect(getBrandImageSingleUrl("totally_unknown_xyz")).toBe(
        getBrandImage("totally_unknown_xyz"),
      );
      expect(getBrandImageSingleUrl("totally_unknown_xyz")).toBe(
        withPrefix(BRAND_IMAGE_PLACEHOLDER_PATH),
      );
    });
  });

  describe("square format (default)", () => {
    it("should return square image for a matching brand database name", () => {
      const result = getBrandImage("2m");

      expect(result).toBe(withPrefix("brands/2m/square.png"));
    });

    it("should normalize brand name by converting to lowercase", () => {
      const result = getBrandImage("2M");

      expect(result).toBe(withPrefix("brands/2m/square.png"));
    });

    it("should normalize brand name by replacing spaces with underscores", () => {
      const result = getBrandImage("bbc bogota beer");

      expect(result).toBe(withPrefix("brands/bbc_bogota_beer/square.png"));
    });

    it("should normalize brand name by removing parentheses", () => {
      const result = getBrandImage("bbc bogota (beer)");

      expect(result).toBe(withPrefix("brands/bbc_bogota_beer/square.png"));
    });

    it("should normalize brand name by removing apostrophes", () => {
      const result = getBrandImage("bbc bogota 'beer'");

      expect(result).toBe(withPrefix("brands/bbc_bogota_beer/square.png"));
    });
  });

  describe("table format", () => {
    it("should return table image when format is table", () => {
      const result = getBrandImage("2m", { format: "table" });

      expect(result).toBe(withPrefix("brands/2m/table.png"));
    });
  });

  describe("square format explicit", () => {
    it("should return square image when format is square", () => {
      const result = getBrandImage("2m", { format: "square" });

      expect(result).toBe(withPrefix("brands/2m/square.png"));
    });
  });

  describe("fallbacks", () => {
    it("should return brand family image when brand is not found", () => {
      const result = getBrandImage("unknown_sub_brand", {
        brand_family: "aguila",
        format: "square",
      });

      expect(result).toBe(withPrefix("brands/aguila/square.png"));
    });

    it("should return brand image when brand family is specified but brand is found", () => {
      const result = getBrandImage("2m", {
        brand_family: "aguila",
        format: "square",
      });

      expect(result).toBe(withPrefix("brands/2m/square.png"));
    });

    it("should return placeholder when brand is not found", () => {
      const result = getBrandImage("unknown_brand");

      expect(result).toBe(withPrefix(BRAND_IMAGE_PLACEHOLDER_PATH));
    });

    it("should return placeholder for brands mapped to no-image-available", () => {
      const result = getBrandImage("private_label_na", { format: "square" });

      expect(result).toBe(withPrefix(BRAND_IMAGE_PLACEHOLDER_PATH));
    });

    it("resolves Busch Light line sub-brands to busch_light before parent family fallback", () => {
      const busch = withPrefix("brands/busch/square.png");
      const buschLight = withPrefix("brands/busch_light/square.png");

      expect(
        getBrandImageSingleUrl("Busch Light Flavors", {
          brand_family: "Busch",
        }),
      ).toBe(buschLight);
      expect(
        getBrandImageSingleUrl("Busch Light", { brand_family: "Busch" }),
      ).toBe(buschLight);
      expect(
        getBrandImageSingleUrl("Busch NA", { brand_family: "Busch" }),
      ).toBe(busch);
      expect(
        getBrandImageSingleUrl("Busch Ice", { brand_family: "Busch" }),
      ).toBe(busch);
      expect(getBrandImageSingleUrl("Busch")).toBe(busch);
    });

    it("resolves compound sub-brand lines without brand_family when alias key is multi-token", () => {
      const buschLight = withPrefix("brands/busch_light/square.png");

      expect(getBrandImageSingleUrl("Busch Light Flavors")).toBe(buschLight);
    });
  });

  describe("environment", () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it("should use the same local source in production", () => {
      process.env.NODE_ENV = "production";

      const result = getBrandImage("2m");

      expect(result).toBe(withPrefix("brands/2m/square.png"));
    });

    it("should concatenate CDN_BASE_URL even for non-http values", () => {
      const badPrefix =
        "data:image/svg+xml,%3Csvg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;40&quot; height=&quot;40&quot; viewBox=&quot;0 0 40 40&quot;%3E%3Crect width=&quot;40&quot; height=&quot;40&quot; fill=&quot;%23e0e0e0&quot;/%3E%3C/svg%3E";
      process.env.CDN_BASE_URL = badPrefix;

      const result = getBrandImage("2m");

      expect(result).toBe(`${badPrefix}/brands/2m/square.png`);
    });
  });

  describe("edge cases", () => {
    it("should return empty string for null value", () => {
      const result = getBrandImage(null as any);

      expect(result).toBe("");
    });

    it("should return empty string for undefined value", () => {
      const result = getBrandImage(undefined as any);

      expect(result).toBe("");
    });

    it("should handle numeric values", () => {
      const result = getBrandImage(123);

      expect(result).toBe(withPrefix(BRAND_IMAGE_PLACEHOLDER_PATH));
    });

    it("should handle empty string", () => {
      const result = getBrandImage("");

      expect(result).toBe(withPrefix(BRAND_IMAGE_PLACEHOLDER_PATH));
    });
  });
});
