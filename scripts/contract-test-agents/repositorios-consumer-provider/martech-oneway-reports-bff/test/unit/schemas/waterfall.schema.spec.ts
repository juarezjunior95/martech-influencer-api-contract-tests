import Ajv from "ajv";
import addFormats from "ajv-formats";
import {
  comparisonLineDataItemSchema,
  comparisonLineSchema,
  brandImageSchema,
  connectorSchema,
  waterfallDataSchema,
} from "@infrastructure/schema/components/waterfall.schema";

describe("Waterfall Schemas", () => {
  let ajv: Ajv;

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
  });

  describe("comparisonLineDataItemSchema", () => {
    it("should validate comparison line data item with hex color", () => {
      const data = {
        value: "1.1",
        measure: "%",
        color: "#007800",
      };
      const validate = ajv.compile(comparisonLineDataItemSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate comparison line data item with empty string color", () => {
      const data = {
        value: "",
        measure: "",
        color: "",
      };
      const validate = ajv.compile(comparisonLineDataItemSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with different unit of measure values", () => {
      const measures = ["%", "pp", "hl", "number"];
      measures.forEach((measure) => {
        const data = {
          value: "5.2",
          measure,
          color: "#A20A0A",
        };
        const validate = ajv.compile(comparisonLineDataItemSchema);
        expect(validate(data)).toBe(true);
      });
    });

    it("should fail without required value", () => {
      const data = {
        measure: "%",
        color: "#007800",
      };
      const validate = ajv.compile(comparisonLineDataItemSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without required measure", () => {
      const data = {
        value: "1.1",
        color: "#007800",
      };
      const validate = ajv.compile(comparisonLineDataItemSchema);
      expect(validate(data)).toBe(false);
    });

    it("should pass without color (color is optional)", () => {
      const data = {
        value: "1.1",
        measure: "%",
      };
      const validate = ajv.compile(comparisonLineDataItemSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail with invalid measure enum", () => {
      const data = {
        value: "1.1",
        measure: "invalid",
        color: "#007800",
      };
      const validate = ajv.compile(comparisonLineDataItemSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with invalid hex color format", () => {
      const data = {
        value: "1.1",
        measure: "%",
        color: "red",
      };
      const validate = ajv.compile(comparisonLineDataItemSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with additional properties", () => {
      const data = {
        value: "1.1",
        measure: "%",
        color: "#007800",
        extra: "property",
      };
      const validate = ajv.compile(comparisonLineDataItemSchema);
      expect(validate(data)).toBe(false);
    });
  });

  describe("comparisonLineSchema", () => {
    it("should validate comparison line with multiple data points", () => {
      const data = {
        title: "Vol. Growth Contrib.",
        data: [
          {
            value: "1.1",
            measure: "%",
            color: "#007800",
          },
          {
            value: "-1.1",
            measure: "%",
            color: "#A20A0A",
          },
          {
            value: "0.1",
            measure: "%",
            color: "",
          },
        ],
      };
      const validate = ajv.compile(comparisonLineSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail without required title", () => {
      const data = {
        data: [
          {
            value: "1.1",
            measure: "%",
            color: "#007800",
          },
        ],
      };
      const validate = ajv.compile(comparisonLineSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without required data", () => {
      const data = {
        title: "Vol. % vs LY",
      };
      const validate = ajv.compile(comparisonLineSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with empty title", () => {
      const data = {
        title: "",
        data: [
          {
            value: "1.1",
            measure: "%",
            color: "#007800",
          },
        ],
      };
      const validate = ajv.compile(comparisonLineSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with empty data array", () => {
      const data = {
        title: "Vol. % vs LY",
        data: [],
      };
      const validate = ajv.compile(comparisonLineSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with additional properties", () => {
      const data = {
        title: "Vol. % vs LY",
        data: [
          {
            value: "1.1",
            measure: "%",
            color: "#007800",
          },
        ],
        extra: "property",
      };
      const validate = ajv.compile(comparisonLineSchema);
      expect(validate(data)).toBe(false);
    });
  });

  describe("brandImageSchema", () => {
    it("should validate brand image with mainBrand and title", () => {
      const data = {
        mainBrand: {
          src: "https://example.com/image.png",
          alt: "Brand 1",
        },
        title: "Label",
      };
      const validate = ajv.compile(brandImageSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail without required mainBrand", () => {
      const data = {
        title: "Label",
      };
      const validate = ajv.compile(brandImageSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without required title", () => {
      const data = {
        mainBrand: {
          src: "image.png",
          alt: "Brand 1",
        },
      };
      const validate = ajv.compile(brandImageSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without required src in mainBrand", () => {
      const data = {
        mainBrand: {
          alt: "Brand 1",
        },
        title: "Label",
      };
      const validate = ajv.compile(brandImageSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without required alt in mainBrand", () => {
      const data = {
        mainBrand: {
          src: "image.png",
        },
        title: "Label",
      };
      const validate = ajv.compile(brandImageSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with empty alt text", () => {
      const data = {
        mainBrand: {
          src: "image.png",
          alt: "",
        },
        title: "Label",
      };
      const validate = ajv.compile(brandImageSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with additional properties in mainBrand", () => {
      const data = {
        mainBrand: {
          src: "image.png",
          alt: "Brand 1",
          extra: "property",
        },
        title: "Label",
      };
      const validate = ajv.compile(brandImageSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with additional properties", () => {
      const data = {
        mainBrand: {
          src: "image.png",
          alt: "Brand 1",
        },
        title: "Label",
        extra: "property",
      };
      const validate = ajv.compile(brandImageSchema);
      expect(validate(data)).toBe(false);
    });
  });

  describe("connectorSchema", () => {
    it("should validate connector with all required fields", () => {
      const data = {
        value: 100.5,
        from: "Vol. 24'FY",
        to: "Vol. 25'LE",
        backgroundColor: "#FFE6E6",
        textColor: "#BA0B0B",
        measure: "%",
      };
      const validate = ajv.compile(connectorSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate connector with empty string measure", () => {
      const data = {
        value: 100,
        from: "Vol. 24'FY",
        to: "Vol. 25'LE",
        backgroundColor: "#FFE6E6",
        textColor: "#BA0B0B",
        measure: "",
      };
      const validate = ajv.compile(connectorSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with different unit of measure values", () => {
      const measures = ["%", "pp", "hl", "number"];
      measures.forEach((measure) => {
        const data = {
          value: 50.5,
          from: "Vol. 24'FY",
          to: "Vol. 25'LE",
          backgroundColor: "#FFE6E6",
          textColor: "#BA0B0B",
          measure,
        };
        const validate = ajv.compile(connectorSchema);
        expect(validate(data)).toBe(true);
      });
    });

    it("should fail without required value", () => {
      const data = {
        from: "Vol. 24'FY",
        to: "Vol. 25'LE",
        backgroundColor: "#FFE6E6",
        textColor: "#BA0B0B",
        measure: "%",
      };
      const validate = ajv.compile(connectorSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without required from", () => {
      const data = {
        value: 100,
        to: "Vol. 25'LE",
        backgroundColor: "#FFE6E6",
        textColor: "#BA0B0B",
        measure: "%",
      };
      const validate = ajv.compile(connectorSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without required to", () => {
      const data = {
        value: 100,
        from: "Vol. 24'FY",
        backgroundColor: "#FFE6E6",
        textColor: "#BA0B0B",
        measure: "%",
      };
      const validate = ajv.compile(connectorSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without required backgroundColor", () => {
      const data = {
        value: 100,
        from: "Vol. 24'FY",
        to: "Vol. 25'LE",
        textColor: "#BA0B0B",
        measure: "%",
      };
      const validate = ajv.compile(connectorSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without required textColor", () => {
      const data = {
        value: 100,
        from: "Vol. 24'FY",
        to: "Vol. 25'LE",
        backgroundColor: "#FFE6E6",
        measure: "%",
      };
      const validate = ajv.compile(connectorSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without required measure", () => {
      const data = {
        value: 100,
        from: "Vol. 24'FY",
        to: "Vol. 25'LE",
        backgroundColor: "#FFE6E6",
        textColor: "#BA0B0B",
      };
      const validate = ajv.compile(connectorSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with non-numeric value", () => {
      const data = {
        value: "100",
        from: "Vol. 24'FY",
        to: "Vol. 25'LE",
        backgroundColor: "#FFE6E6",
        textColor: "#BA0B0B",
        measure: "%",
      };
      const validate = ajv.compile(connectorSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with invalid hex color formats", () => {
      const data = {
        value: 100,
        from: "Vol. 24'FY",
        to: "Vol. 25'LE",
        backgroundColor: "red",
        textColor: "blue",
        measure: "%",
      };
      const validate = ajv.compile(connectorSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with invalid measure enum", () => {
      const data = {
        value: 100,
        from: "Vol. 24'FY",
        to: "Vol. 25'LE",
        backgroundColor: "#FFE6E6",
        textColor: "#BA0B0B",
        measure: "invalid",
      };
      const validate = ajv.compile(connectorSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with additional properties", () => {
      const data = {
        value: 100,
        from: "Vol. 24'FY",
        to: "Vol. 25'LE",
        backgroundColor: "#FFE6E6",
        textColor: "#BA0B0B",
        measure: "%",
        extra: "property",
      };
      const validate = ajv.compile(connectorSchema);
      expect(validate(data)).toBe(false);
    });
  });

  describe("waterfallDataSchema", () => {
    it("should validate complete waterfall data with all fields", () => {
      const data = {
        data: [291790.9, -411.3, -1623.4, -3970.7],
        labels: ["2024", "1", "2", "3"],
        comparisonLineData: [
          {
            title: "Vol. % vs LY",
            data: [
              {
                value: "1.1",
                measure: "%",
                color: "#007800",
              },
            ],
          },
        ],
        brandsImg: [
          {
            mainBrand: {
              src: "`${COUNTRY_FLAG_BASE_URL}USA.png`",
              alt: "Brand 1",
            },
            title: "Label",
          },
        ],
        connector: {
          value: 100.5,
          from: "Vol. 24'FY",
          to: "Vol. 25'LE",
          backgroundColor: "#FFE6E6",
          textColor: "#BA0B0B",
          measure: "%",
        },
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate waterfall data with only required fields", () => {
      const data = {
        data: [100, 200, 300],
        labels: ["A", "B", "C"],
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail without required data", () => {
      const data = {
        labels: ["A", "B"],
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without required labels", () => {
      const data = {
        data: [100, 200],
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with empty data array", () => {
      const data = {
        data: [],
        labels: ["A", "B"],
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with empty labels array", () => {
      const data = {
        data: [100, 200],
        labels: [],
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with non-numeric data values", () => {
      const data = {
        data: ["100", "200"],
        labels: ["A", "B"],
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with empty label strings", () => {
      const data = {
        data: [100, 200],
        labels: ["A", ""],
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with additional properties", () => {
      const data = {
        data: [100, 200],
        labels: ["A", "B"],
        extra: "property",
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should validate waterfall data with specialIndexes containing all required properties", () => {
      const data = {
        data: [100, 200, 300],
        labels: ["A", "B", "C"],
        specialIndexes: {
          first: 0,
          last: 2,
          retained: 1,
        },
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail with specialIndexes missing first property", () => {
      const data = {
        data: [100, 200, 300],
        labels: ["A", "B", "C"],
        specialIndexes: {
          last: 2,
          retained: 1,
        },
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with specialIndexes missing last property", () => {
      const data = {
        data: [100, 200, 300],
        labels: ["A", "B", "C"],
        specialIndexes: {
          first: 0,
          retained: 1,
        },
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with specialIndexes missing retained property", () => {
      const data = {
        data: [100, 200, 300],
        labels: ["A", "B", "C"],
        specialIndexes: {
          first: 0,
          last: 2,
        },
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with empty specialIndexes object", () => {
      const data = {
        data: [100, 200, 300],
        labels: ["A", "B", "C"],
        specialIndexes: {},
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with non-numeric values in specialIndexes", () => {
      const data = {
        data: [100, 200],
        labels: ["A", "B"],
        specialIndexes: {
          first: "0",
          last: "4",
          retained: "2",
        },
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with additional properties in specialIndexes", () => {
      const data = {
        data: [100, 200],
        labels: ["A", "B"],
        specialIndexes: {
          first: 0,
          last: 1,
          retained: 0,
          extra: "property",
        },
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should validate waterfall data with clickableIndexes containing single index", () => {
      const data = {
        data: [100, 200, 300],
        labels: ["A", "B", "C"],
        clickableIndexes: [{ index: 0, value: "y1" }],
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate waterfall data with clickableIndexes containing multiple indexes", () => {
      const data = {
        data: [100, 200, 300, 400],
        labels: ["A", "B", "C", "D"],
        clickableIndexes: [
          { index: 0, value: "y1" },
          { index: 1, value: "y2" },
          { index: 2, value: "y3" },
          { index: 3, value: "y4" },
        ],
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail with empty clickableIndexes array", () => {
      const data = {
        data: [100, 200],
        labels: ["A", "B"],
        clickableIndexes: [],
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with non-numeric values in clickableIndexes", () => {
      const data = {
        data: [100, 200],
        labels: ["A", "B"],
        clickableIndexes: [
          { index: "0", value: "y1" },
          { index: "1", value: "y2" },
        ],
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should validate complete waterfall data with all optional fields including clickableIndexes", () => {
      const data = {
        data: [291790.9, -411.3, -1623.4, -3970.7],
        labels: ["2024", "1", "2", "3"],
        comparisonLineData: [
          {
            title: "Vol. % vs LY",
            data: [
              {
                value: "1.1",
                measure: "%",
                color: "#007800",
              },
            ],
          },
        ],
        brandsImg: [
          {
            mainBrand: {
              src: "`${COUNTRY_FLAG_BASE_URL}USA.png`",
              alt: "Brand 1",
            },
            title: "Label",
          },
        ],
        specialIndexes: {
          first: 0,
          last: 3,
          retained: 1,
        },
        clickableIndexes: [
          { index: 0, value: "y1" },
          { index: 1, value: "y2" },
          { index: 2, value: "y3" },
          { index: 3, value: "y4" },
        ],
        connector: {
          value: -150.25,
          from: "Vol. 24'FY",
          to: "Vol. 25'LE",
          backgroundColor: "#FFE6E6",
          textColor: "#BA0B0B",
          measure: "pp",
        },
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate waterfall data with connector only", () => {
      const data = {
        data: [100, 200, 300],
        labels: ["A", "B", "C"],
        connector: {
          value: 50.5,
          from: "Vol. 24'FY",
          to: "Vol. 25'LE",
          backgroundColor: "#E6F3E6",
          textColor: "#007800",
          measure: "%",
        },
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate waterfall data with connector having empty string measure", () => {
      const data = {
        data: [100, 200],
        labels: ["A", "B"],
        connector: {
          value: 0,
          from: "Vol. 24'FY",
          to: "Vol. 25'LE",
          backgroundColor: "#5C5C5C",
          textColor: "#FFFFFF",
          measure: "",
        },
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail with invalid connector missing required fields", () => {
      const data = {
        data: [100, 200],
        labels: ["A", "B"],
        connector: {
          value: 100,
          from: "Vol. 24'FY",
          // missing to, backgroundColor, textColor, measure
        },
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with invalid connector backgroundColor format", () => {
      const data = {
        data: [100, 200],
        labels: ["A", "B"],
        connector: {
          value: 100,
          from: "Vol. 24'FY",
          to: "Vol. 25'LE",
          backgroundColor: "red",
          textColor: "#BA0B0B",
          measure: "%",
        },
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with invalid connector textColor format", () => {
      const data = {
        data: [100, 200],
        labels: ["A", "B"],
        connector: {
          value: 100,
          from: "Vol. 24'FY",
          to: "Vol. 25'LE",
          backgroundColor: "#FFE6E6",
          textColor: "blue",
          measure: "%",
        },
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with invalid connector measure enum", () => {
      const data = {
        data: [100, 200],
        labels: ["A", "B"],
        connector: {
          value: 100,
          from: "Vol. 24'FY",
          to: "Vol. 25'LE",
          backgroundColor: "#FFE6E6",
          textColor: "#BA0B0B",
          measure: "invalid",
        },
      };
      const validate = ajv.compile(waterfallDataSchema);
      expect(validate(data)).toBe(false);
    });
  });
});
