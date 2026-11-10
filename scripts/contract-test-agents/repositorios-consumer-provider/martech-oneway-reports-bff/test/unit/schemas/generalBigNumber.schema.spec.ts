import Ajv from "ajv";
import addFormats from "ajv-formats";
import {
  generalBigNumberCardSchema,
  generalBigNumberDataItemSchema,
  generalBigNumbersArraySchema,
  generalBigNumbersSchema,
} from "@infrastructure/schema/components/generalBigNumbers.schema";

describe("General BigNumbers Schemas", () => {
  let ajv: Ajv;

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
  });

  describe("generalBigNumberDataItemSchema", () => {
    const validDataItem = {
      bigNumber: { value: "5.2", measure: "%", trend: "positive" },
      secondaryInfo: { value: "5,573.4", label: "[ % ]" },
      comparison: { label: "vs", value: "vs LY" },
    };

    it("should validate a complete item", () => {
      const validate = ajv.compile(generalBigNumberDataItemSchema);
      expect(validate(validDataItem)).toBe(true);
    });

    it("should accept missing optional fields", () => {
      const minimalDataItem = {
        bigNumber: { value: "1.0", measure: "pp" },
        secondaryInfo: { value: "-" },
        comparison: { value: "vs PP" },
      };
      const validate = ajv.compile(generalBigNumberDataItemSchema);
      expect(validate(minimalDataItem)).toBe(true);
    });

    it("should fail without required fields", () => {
      const invalidItem = {
        secondaryInfo: { value: "10.0" },
        comparison: { value: "vs LY" },
      };
      const validate = ajv.compile(generalBigNumberDataItemSchema);
      expect(validate(invalidItem)).toBe(false);
    });

    it("should fail with invalid measure or trend", () => {
      const validate = ajv.compile(generalBigNumberDataItemSchema);

      expect(
        validate({
          ...validDataItem,
          bigNumber: { value: "5.2", measure: "usd" },
        }),
      ).toBe(false);

      expect(
        validate({
          ...validDataItem,
          bigNumber: { value: "5.2", measure: "%", trend: "flat" },
        }),
      ).toBe(false);
    });
  });

  describe("generalBigNumberCardSchema", () => {
    const validCard = {
      header: { title: "Power YTD", measure: "[ % ]" },
      data: [
        {
          bigNumber: { value: "5.2", measure: "%", trend: "positive" },
          secondaryInfo: { value: "5,573.4", label: "[ % ]" },
          comparison: { label: "vs", value: "vs LY" },
        },
      ],
    };

    it("should validate card with full data", () => {
      const validate = ajv.compile(generalBigNumberCardSchema);
      expect(validate(validCard)).toBe(true);
    });

    it("should validate card with empty data array", () => {
      const cardWithEmptyData = {
        header: { title: "Power YTD", measure: "[ % ]" },
        data: [],
      };
      const validate = ajv.compile(generalBigNumberCardSchema);
      expect(validate(cardWithEmptyData)).toBe(true);
    });

    it("should fail without header or data", () => {
      const validate = ajv.compile(generalBigNumberCardSchema);
      expect(validate({ data: [] })).toBe(false);
      expect(validate({ header: { title: "Power", measure: "[ % ]" } })).toBe(
        false,
      );
    });

    it("should fail with incomplete header", () => {
      const validate = ajv.compile(generalBigNumberCardSchema);
      expect(validate({ header: { title: "Power" }, data: [] })).toBe(false);
      expect(validate({ header: { measure: "[ % ]" }, data: [] })).toBe(false);
    });
  });

  describe("generalBigNumbersArraySchema", () => {
    it("should validate array with at least one card", () => {
      const data = [
        {
          header: { title: "Power YTD", measure: "[ % ]" },
          data: [
            {
              bigNumber: { value: "5.2", measure: "%", trend: "positive" },
              secondaryInfo: { value: "5,573.4", label: "[ % ]" },
              comparison: { label: "vs", value: "vs LY" },
            },
          ],
        },
      ];

      const validate = ajv.compile(generalBigNumbersArraySchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail with empty array", () => {
      const validate = ajv.compile(generalBigNumbersArraySchema);
      expect(validate([])).toBe(false);
    });
  });

  describe("generalBigNumbersSchema", () => {
    it("should validate data using the root schema", () => {
      const data = [
        {
          header: { title: "Power YTD", measure: "[ % ]" },
          data: [
            {
              bigNumber: { value: "5.2", measure: "%", trend: "positive" },
              secondaryInfo: { value: "5,573.4", label: "[ % ]" },
              comparison: { label: "vs", value: "vs LY" },
            },
          ],
        },
      ];

      const validate = ajv.compile(generalBigNumbersSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail when value is not an array of cards", () => {
      const invalidData = {
        header: { title: "Power YTD", measure: "[ % ]" },
        data: [],
      };

      const validate = ajv.compile(generalBigNumbersSchema);
      expect(validate(invalidData)).toBe(false);
    });
  });
});
