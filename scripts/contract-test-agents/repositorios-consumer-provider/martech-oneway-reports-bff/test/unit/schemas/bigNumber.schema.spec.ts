import Ajv from "ajv";
import addFormats from "ajv-formats";
import {
  bigNumberSimpleSchema,
  bigNumberComplexSchema,
  bigNumberEmptySchema,
  bigNumberUnavailableSchema,
} from "@infrastructure/schema/components/big-number";

describe("BigNumber Schemas", () => {
  let ajv: Ajv;

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
  });

  describe("bigNumberSimpleSchema", () => {
    it("should validate a number", () => {
      const validate = ajv.compile(bigNumberSimpleSchema);
      expect(validate(100)).toBe(true);
      expect(validate(0)).toBe(true);
      expect(validate(-50.5)).toBe(true);
    });

    it("should fail with non-number values", () => {
      const validate = ajv.compile(bigNumberSimpleSchema);
      expect(validate("100")).toBe(false);
      expect(validate(null)).toBe(false);
      expect(validate({})).toBe(false);
      expect(validate([])).toBe(false);
    });
  });

  describe("bigNumberComplexSchema", () => {
    it("should validate minimal complex BigNumber", () => {
      const data = {
        title: "Power vs LY",
        bigNumber: 2.5,
      };
      const validate = ajv.compile(bigNumberComplexSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate full complex BigNumber", () => {
      const data = {
        title: "Power vs LY",
        measure: "pp",
        tooltipContent: [{ type: "text" }],
        bigNumber: 2.5,
        bigNumberUnit: "pp",
        bigNumberDirection: "up",
        bigNumberColor: "#E6F9E6",
        variation: 1.2,
        variationMeasure: "%",
        variationDirection: "up",
        versus: "vs LY",
        total: 75.3,
        totalPrefix: "#:",
        totalMeasure: "[%]",
        totalLabel: "Total",
        totalUnitOfMeasureLabel: "Percentage",
        period: "MAT Oct-24",
        divider: true,
        titleSize: "H3",
        dateRefresh: "2024-11-12",
        lastEstimated: "2024-11-10",
      };
      const validate = ajv.compile(bigNumberComplexSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate titleSize enum values", () => {
      const validate = ajv.compile(bigNumberComplexSchema);
      const sizes = ["H2", "H3", "H4", "H5"];

      sizes.forEach((size) => {
        const data = {
          title: "Test",
          bigNumber: 10,
          titleSize: size,
        };
        expect(validate(data)).toBe(true);
      });
    });

    it("should fail with invalid titleSize", () => {
      const data = {
        title: "Test",
        bigNumber: 10,
        titleSize: "H1",
      };
      const validate = ajv.compile(bigNumberComplexSchema);
      expect(validate(data)).toBe(false);
    });

    it("should validate bigNumberColor hex format", () => {
      const validate = ajv.compile(bigNumberComplexSchema);

      expect(validate({ title: "Test", bigNumberColor: "#E6F9E6" })).toBe(true);
      expect(validate({ title: "Test", bigNumberColor: "#000000" })).toBe(true);
      expect(validate({ title: "Test", bigNumberColor: "#FFFFFF" })).toBe(true);
    });

    it("should fail with invalid bigNumberColor format", () => {
      const validate = ajv.compile(bigNumberComplexSchema);

      expect(validate({ title: "Test", bigNumberColor: "green" })).toBe(false);
      expect(validate({ title: "Test", bigNumberColor: "#FFF" })).toBe(false);
      expect(validate({ title: "Test", bigNumberColor: "E6F9E6" })).toBe(false);
    });

    it("should allow empty object when not required", () => {
      const validate = ajv.compile(bigNumberComplexSchema);
      expect(validate({})).toBe(true);
    });
  });

  describe("bigNumberEmptySchema", () => {
    it("should validate empty state", () => {
      const data = {
        empty: true,
      };
      const validate = ajv.compile(bigNumberEmptySchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate empty state with title", () => {
      const data = {
        title: "Power vs LY",
        empty: true,
      };
      const validate = ajv.compile(bigNumberEmptySchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail when empty is not true", () => {
      const validate = ajv.compile(bigNumberEmptySchema);
      expect(validate({ empty: false })).toBe(false);
      expect(validate({ empty: null })).toBe(false);
    });

    it("should fail when empty is missing", () => {
      const data = {
        title: "Test",
      };
      const validate = ajv.compile(bigNumberEmptySchema);
      expect(validate(data)).toBe(false);
    });
  });

  describe("bigNumberUnavailableSchema", () => {
    it("should validate unavailable state", () => {
      const data = {
        unavailable: true,
      };
      const validate = ajv.compile(bigNumberUnavailableSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate unavailable state with title", () => {
      const data = {
        title: "Category Health",
        unavailable: true,
      };
      const validate = ajv.compile(bigNumberUnavailableSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail when unavailable is not true", () => {
      const validate = ajv.compile(bigNumberUnavailableSchema);
      expect(validate({ unavailable: false })).toBe(false);
    });

    it("should fail when unavailable is missing", () => {
      const data = {
        title: "Test",
      };
      const validate = ajv.compile(bigNumberUnavailableSchema);
      expect(validate(data)).toBe(false);
    });
  });
});
