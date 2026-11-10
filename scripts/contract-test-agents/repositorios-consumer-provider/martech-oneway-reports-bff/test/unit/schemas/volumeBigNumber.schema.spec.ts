import Ajv from "ajv";
import addFormats from "ajv-formats";
import {
  volumeBigNumberCardSchema,
  volumeBigNumberDataItemSchema,
  volumeBigNumbersArraySchema,
  volumeBigNumbersSchema,
} from "@infrastructure/schema/components/volumeBigNumber.schema";

describe("Volume BigNumbers Schemas", () => {
  let ajv: Ajv;

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
  });

  describe("volumeBigNumberDataItemSchema", () => {
    const validDataItemWithSecondaryInfo = {
      bigNumber: { value: "2.8", measure: "%", trend: "positive" },
      secondaryInfo: { value: "51,448.1", label: "[ k hl ]" },
      comparison: { label: "vs", value: "LY" },
    };

    const validDataItemWithoutSecondaryInfo = {
      bigNumber: { value: "-1.7", measure: "%", trend: "negative" },
      comparison: { label: "vs", value: "BU" },
    };

    it("should validate item with secondaryInfo (first comparison item)", () => {
      const validate = ajv.compile(volumeBigNumberDataItemSchema);
      expect(validate(validDataItemWithSecondaryInfo)).toBe(true);
    });

    it("should validate item without secondaryInfo (second comparison item)", () => {
      const validate = ajv.compile(volumeBigNumberDataItemSchema);
      expect(validate(validDataItemWithoutSecondaryInfo)).toBe(true);
    });

    it("should accept minimal required fields", () => {
      const minimalDataItem = {
        bigNumber: { value: "1.0", measure: "pp" },
        comparison: { value: "BU" },
      };
      const validate = ajv.compile(volumeBigNumberDataItemSchema);
      expect(validate(minimalDataItem)).toBe(true);
    });

    it("should fail without required bigNumber", () => {
      const invalidItem = {
        secondaryInfo: { value: "10.0" },
        comparison: { value: "LY" },
      };
      const validate = ajv.compile(volumeBigNumberDataItemSchema);
      expect(validate(invalidItem)).toBe(false);
    });

    it("should fail without required comparison", () => {
      const invalidItem = {
        bigNumber: { value: "5.2", measure: "%" },
        secondaryInfo: { value: "10.0" },
      };
      const validate = ajv.compile(volumeBigNumberDataItemSchema);
      expect(validate(invalidItem)).toBe(false);
    });

    it("should fail with invalid measure", () => {
      const validate = ajv.compile(volumeBigNumberDataItemSchema);

      expect(
        validate({
          ...validDataItemWithSecondaryInfo,
          bigNumber: { value: "5.2", measure: "invalid" },
        }),
      ).toBe(false);
    });

    it("should fail with invalid trend", () => {
      const validate = ajv.compile(volumeBigNumberDataItemSchema);

      expect(
        validate({
          ...validDataItemWithSecondaryInfo,
          bigNumber: { value: "5.2", measure: "%", trend: "neutral" },
        }),
      ).toBe(false);
    });

    it("should validate trend values 'positive' and 'negative'", () => {
      const validate = ajv.compile(volumeBigNumberDataItemSchema);

      const positiveItem = {
        bigNumber: { value: "5.2", measure: "%", trend: "positive" },
        comparison: { value: "LY" },
      };

      const negativeItem = {
        bigNumber: { value: "-2.3", measure: "%", trend: "negative" },
        comparison: { value: "BU" },
      };

      expect(validate(positiveItem)).toBe(true);
      expect(validate(negativeItem)).toBe(true);
    });
  });

  describe("volumeBigNumberCardSchema", () => {
    const validCard = {
      header: { title: "Volume YTD", measure: "[ k hl ]" },
      data: [
        {
          bigNumber: { value: "-2.4", measure: "%", trend: "negative" },
          secondaryInfo: { value: "561,100.2", label: "[ k hl ]" },
          comparison: { label: "vs", value: "LY" },
        },
        {
          bigNumber: { value: "-3.8", measure: "%", trend: "negative" },
          comparison: { label: "vs", value: "BU" },
        },
      ],
    };

    it("should validate card with full data (2 items)", () => {
      const validate = ajv.compile(volumeBigNumberCardSchema);
      expect(validate(validCard)).toBe(true);
    });

    it("should validate card with empty data array", () => {
      const cardWithEmptyData = {
        header: { title: "Volume YTD", measure: "[ k hl ]" },
        data: [],
      };
      const validate = ajv.compile(volumeBigNumberCardSchema);
      expect(validate(cardWithEmptyData)).toBe(true);
    });

    it("should validate Volume L3M card", () => {
      const l3mCard = {
        header: { title: "Volume L3M", measure: "[ k hl ]" },
        data: [
          {
            bigNumber: { value: "-1.6", measure: "%", trend: "negative" },
            secondaryInfo: { value: "139,165.9", label: "[ k hl ]" },
            comparison: { label: "vs", value: "LY" },
          },
          {
            bigNumber: { value: "-4.6", measure: "%", trend: "negative" },
            comparison: { label: "vs", value: "BU" },
          },
        ],
      };
      const validate = ajv.compile(volumeBigNumberCardSchema);
      expect(validate(l3mCard)).toBe(true);
    });

    it("should validate Volume MTH card with dynamic month", () => {
      const mthCard = {
        header: { title: "Volume Dec'25", measure: "[ k hl ]" },
        data: [
          {
            bigNumber: { value: "2.8", measure: "%", trend: "positive" },
            secondaryInfo: { value: "51,448.1", label: "[ k hl ]" },
            comparison: { label: "vs", value: "LY" },
          },
          {
            bigNumber: { value: "-1.7", measure: "%", trend: "negative" },
            comparison: { label: "vs", value: "BU" },
          },
        ],
      };
      const validate = ajv.compile(volumeBigNumberCardSchema);
      expect(validate(mthCard)).toBe(true);
    });

    it("should fail without header", () => {
      const validate = ajv.compile(volumeBigNumberCardSchema);
      expect(validate({ data: [] })).toBe(false);
    });

    it("should fail without data", () => {
      const validate = ajv.compile(volumeBigNumberCardSchema);
      expect(
        validate({ header: { title: "Volume", measure: "[ k hl ]" } }),
      ).toBe(false);
    });

    it("should fail with incomplete header", () => {
      const validate = ajv.compile(volumeBigNumberCardSchema);
      expect(validate({ header: { title: "Volume" }, data: [] })).toBe(false);
      expect(validate({ header: { measure: "[ k hl ]" }, data: [] })).toBe(
        false,
      );
    });

    it("should allow empty measure string", () => {
      const cardWithEmptyMeasure = {
        header: { title: "Volume YTD", measure: "" },
        data: [],
      };
      const validate = ajv.compile(volumeBigNumberCardSchema);
      expect(validate(cardWithEmptyMeasure)).toBe(true);
    });
  });

  describe("volumeBigNumbersArraySchema", () => {
    const validArray = [
      {
        header: { title: "Volume YTD", measure: "[ k hl ]" },
        data: [
          {
            bigNumber: { value: "-2.4", measure: "%", trend: "negative" },
            secondaryInfo: { value: "561,100.2", label: "[ k hl ]" },
            comparison: { label: "vs", value: "LY" },
          },
          {
            bigNumber: { value: "-3.8", measure: "%", trend: "negative" },
            comparison: { label: "vs", value: "BU" },
          },
        ],
      },
      {
        header: { title: "Volume L3M", measure: "[ k hl ]" },
        data: [
          {
            bigNumber: { value: "-1.6", measure: "%", trend: "negative" },
            secondaryInfo: { value: "139,165.9", label: "[ k hl ]" },
            comparison: { label: "vs", value: "LY" },
          },
          {
            bigNumber: { value: "-4.6", measure: "%", trend: "negative" },
            comparison: { label: "vs", value: "BU" },
          },
        ],
      },
      {
        header: { title: "Volume Dec'25", measure: "[ k hl ]" },
        data: [
          {
            bigNumber: { value: "2.8", measure: "%", trend: "positive" },
            secondaryInfo: { value: "51,448.1", label: "[ k hl ]" },
            comparison: { label: "vs", value: "LY" },
          },
          {
            bigNumber: { value: "-1.7", measure: "%", trend: "negative" },
            comparison: { label: "vs", value: "BU" },
          },
        ],
      },
    ];

    it("should validate array with exactly 3 cards", () => {
      const validate = ajv.compile(volumeBigNumbersArraySchema);
      expect(validate(validArray)).toBe(true);
    });

    it("should validate array with 3 cards where some have empty data", () => {
      const arrayWithEmptyCards = [
        {
          header: { title: "Volume YTD", measure: "[ k hl ]" },
          data: [
            {
              bigNumber: { value: "-2.4", measure: "%", trend: "negative" },
              secondaryInfo: { value: "561,100.2", label: "[ k hl ]" },
              comparison: { label: "vs", value: "LY" },
            },
            {
              bigNumber: { value: "-3.8", measure: "%", trend: "negative" },
              comparison: { label: "vs", value: "BU" },
            },
          ],
        },
        {
          header: { title: "Volume R3M", measure: "[ k hl ]" },
          data: [],
        },
        {
          header: { title: "Volume MTH", measure: "[ k hl ]" },
          data: [],
        },
      ];

      const validate = ajv.compile(volumeBigNumbersArraySchema);
      expect(validate(arrayWithEmptyCards)).toBe(true);
    });

    it("should fail with less than 3 cards", () => {
      const validate = ajv.compile(volumeBigNumbersArraySchema);

      const twoCards = validArray.slice(0, 2);
      expect(validate(twoCards)).toBe(false);

      const oneCard = validArray.slice(0, 1);
      expect(validate(oneCard)).toBe(false);
    });

    it("should fail with more than 3 cards", () => {
      const validate = ajv.compile(volumeBigNumbersArraySchema);

      const fourCards = [
        ...validArray,
        {
          header: { title: "Volume Extra", measure: "[ k hl ]" },
          data: [],
        },
      ];
      expect(validate(fourCards)).toBe(false);
    });

    it("should fail with empty array", () => {
      const validate = ajv.compile(volumeBigNumbersArraySchema);
      expect(validate([])).toBe(false);
    });
  });

  describe("volumeBigNumbersSchema", () => {
    const validData = [
      {
        header: { title: "Volume YTD", measure: "[ k hl ]" },
        data: [
          {
            bigNumber: { value: "-2.4", measure: "%", trend: "negative" },
            secondaryInfo: { value: "561,100.2", label: "[ k hl ]" },
            comparison: { label: "vs", value: "LY" },
          },
          {
            bigNumber: { value: "-3.8", measure: "%", trend: "negative" },
            comparison: { label: "vs", value: "BU" },
          },
        ],
      },
      {
        header: { title: "Volume L3M", measure: "[ k hl ]" },
        data: [
          {
            bigNumber: { value: "-1.6", measure: "%", trend: "negative" },
            secondaryInfo: { value: "139,165.9", label: "[ k hl ]" },
            comparison: { label: "vs", value: "LY" },
          },
          {
            bigNumber: { value: "-4.6", measure: "%", trend: "negative" },
            comparison: { label: "vs", value: "BU" },
          },
        ],
      },
      {
        header: { title: "Volume Dec'25", measure: "[ k hl ]" },
        data: [
          {
            bigNumber: { value: "2.8", measure: "%", trend: "positive" },
            secondaryInfo: { value: "51,448.1", label: "[ k hl ]" },
            comparison: { label: "vs", value: "LY" },
          },
          {
            bigNumber: { value: "-1.7", measure: "%", trend: "negative" },
            comparison: { label: "vs", value: "BU" },
          },
        ],
      },
    ];

    it("should validate data using the root schema", () => {
      const validate = ajv.compile(volumeBigNumbersSchema);
      expect(validate(validData)).toBe(true);
    });

    it("should validate with all empty data arrays", () => {
      const emptyData = [
        {
          header: { title: "Volume YTD", measure: "[ k hl ]" },
          data: [],
        },
        {
          header: { title: "Volume R3M", measure: "[ k hl ]" },
          data: [],
        },
        {
          header: { title: "Volume MTH", measure: "[ k hl ]" },
          data: [],
        },
      ];

      const validate = ajv.compile(volumeBigNumbersSchema);
      expect(validate(emptyData)).toBe(true);
    });

    it("should fail when value is not an array", () => {
      const invalidData = {
        header: { title: "Volume YTD", measure: "[ k hl ]" },
        data: [],
      };

      const validate = ajv.compile(volumeBigNumbersSchema);
      expect(validate(invalidData)).toBe(false);
    });

    it("should fail when array has wrong number of cards", () => {
      const validate = ajv.compile(volumeBigNumbersSchema);

      const twoCards = validData.slice(0, 2);
      expect(validate(twoCards)).toBe(false);
    });
  });
});
