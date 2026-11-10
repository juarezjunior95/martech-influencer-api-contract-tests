import Ajv from "ajv";
import addFormats from "ajv-formats";
import {
  chartDataSchema,
  chartVariationCaptionDataItemSchema,
  chartVariationCaptionSchema,
  chartDatasetSchema,
  lineChartSchema,
} from "@infrastructure/schema/components/chart.schema";

describe("Chart Schemas", () => {
  let ajv: Ajv;

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
  });

  describe("chartDataSchema", () => {
    it("should validate complete chart data", () => {
      const data = {
        data: [75.5, 68.2, 82.1],
        backgroundColor: ["#EDCD20", "#EDCD20", "#EDCD20"],
        secondaryBackgroundColor: ["#EDDAB1", "#EDDAB1", "#EDDAB1"],
      };
      const validate = ajv.compile(chartDataSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate without secondaryBackgroundColor", () => {
      const data = {
        data: [75.5, 68.2, 82.1],
        backgroundColor: ["#EDCD20", "#EDCD20", "#EDCD20"],
      };
      const validate = ajv.compile(chartDataSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate single item arrays", () => {
      const data = {
        data: [100],
        backgroundColor: ["#EDCD20"],
      };
      const validate = ajv.compile(chartDataSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate multiple data points", () => {
      const data = {
        data: [10, 20, 30, 40, 50],
        backgroundColor: [
          "#EDCD20",
          "#EDCD20",
          "#EDCD20",
          "#EDCD20",
          "#EDCD20",
        ],
      };
      const validate = ajv.compile(chartDataSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate hex color format in backgroundColor", () => {
      const data = {
        data: [100],
        backgroundColor: ["#000000"],
      };
      const validate = ajv.compile(chartDataSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate hex color format in secondaryBackgroundColor", () => {
      const data = {
        data: [100],
        backgroundColor: ["#EDCD20"],
        secondaryBackgroundColor: ["#FFFFFF"],
      };
      const validate = ajv.compile(chartDataSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail without data", () => {
      const data = {
        backgroundColor: ["#EDCD20"],
      };
      const validate = ajv.compile(chartDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without backgroundColor", () => {
      const data = {
        data: [100],
      };
      const validate = ajv.compile(chartDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with empty data array", () => {
      const data = {
        data: [],
        backgroundColor: [],
      };
      const validate = ajv.compile(chartDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with invalid hex color in backgroundColor", () => {
      const data = {
        data: [100],
        backgroundColor: ["red"],
      };
      const validate = ajv.compile(chartDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with invalid hex color in secondaryBackgroundColor", () => {
      const data = {
        data: [100],
        backgroundColor: ["#EDCD20"],
        secondaryBackgroundColor: ["blue"],
      };
      const validate = ajv.compile(chartDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with non-numeric data values", () => {
      const data = {
        data: ["100", "200"],
        backgroundColor: ["#EDCD20", "#EDCD20"],
      };
      const validate = ajv.compile(chartDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should accept decimal numbers in data", () => {
      const data = {
        data: [10.5, 20.75, 30.25],
        backgroundColor: ["#EDCD20", "#EDCD20", "#EDCD20"],
      };
      const validate = ajv.compile(chartDataSchema);
      expect(validate(data)).toBe(true);
    });
  });

  describe("chartVariationCaptionDataItemSchema", () => {
    it("should validate complete variation caption data item", () => {
      const data = {
        value: "5.2",
        color: "#EDCD20",
        measure: "%",
      };
      const validate = ajv.compile(chartVariationCaptionDataItemSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with rgba color", () => {
      const data = {
        value: "-22.1",
        color: "rgba(237, 205, 32, 0.5)",
        measure: "pp",
      };
      const validate = ajv.compile(chartVariationCaptionDataItemSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with empty color string", () => {
      const data = {
        value: "-",
        color: "",
        measure: "%",
      };
      const validate = ajv.compile(chartVariationCaptionDataItemSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with only value", () => {
      const data = {
        value: "10.5",
      };
      const validate = ajv.compile(chartVariationCaptionDataItemSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with only color", () => {
      const data = {
        color: "#FFFFFF",
      };
      const validate = ajv.compile(chartVariationCaptionDataItemSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with only measure", () => {
      const data = {
        measure: "%",
      };
      const validate = ajv.compile(chartVariationCaptionDataItemSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate empty object", () => {
      const data = {};
      const validate = ajv.compile(chartVariationCaptionDataItemSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail with invalid hex color", () => {
      const data = {
        value: "5.2",
        color: "red",
        measure: "%",
      };
      const validate = ajv.compile(chartVariationCaptionDataItemSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with invalid rgba format", () => {
      const data = {
        value: "5.2",
        color: "rgb(255, 0, 0)",
        measure: "%",
      };
      const validate = ajv.compile(chartVariationCaptionDataItemSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with additional properties", () => {
      const data = {
        value: "5.2",
        color: "#EDCD20",
        measure: "%",
        extra: "not allowed",
      };
      const validate = ajv.compile(chartVariationCaptionDataItemSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with non-string value", () => {
      const data = {
        value: 5.2,
        color: "#EDCD20",
        measure: "%",
      };
      const validate = ajv.compile(chartVariationCaptionDataItemSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with non-string measure", () => {
      const data = {
        value: "5.2",
        color: "#EDCD20",
        measure: 100,
      };
      const validate = ajv.compile(chartVariationCaptionDataItemSchema);
      expect(validate(data)).toBe(false);
    });
  });

  describe("chartVariationCaptionSchema", () => {
    it("should validate with array of data items", () => {
      const data = {
        title: "vs LY",
        data: [
          { value: "5.2", color: "#EDCD20", measure: "%" },
          { value: "-22.1", color: "#FF0000", measure: "pp" },
        ],
      };
      const validate = ajv.compile(chartVariationCaptionSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with single data item object", () => {
      const data = {
        title: "vs LY",
        data: { value: "5.2", color: "#EDCD20", measure: "%" },
      };
      const validate = ajv.compile(chartVariationCaptionSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with empty data array", () => {
      const data = {
        title: "vs LY",
        data: [],
      };
      const validate = ajv.compile(chartVariationCaptionSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with minimal data item", () => {
      const data = {
        title: "vs LY",
        data: { value: "5.2" },
      };
      const validate = ajv.compile(chartVariationCaptionSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with rgba color in data item", () => {
      const data = {
        title: "vs LY",
        data: {
          value: "10.5",
          color: "rgba(237, 205, 32, 0.5)",
          measure: "%",
        },
      };
      const validate = ajv.compile(chartVariationCaptionSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with empty color string in data item", () => {
      const data = {
        title: "vs LY",
        data: {
          value: "-",
          color: "",
          measure: "%",
        },
      };
      const validate = ajv.compile(chartVariationCaptionSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail without title", () => {
      const data = {
        data: [{ value: "5.2", color: "#EDCD20", measure: "%" }],
      };
      const validate = ajv.compile(chartVariationCaptionSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without data", () => {
      const data = {
        title: "vs LY",
      };
      const validate = ajv.compile(chartVariationCaptionSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with invalid data item in array", () => {
      const data = {
        title: "vs LY",
        data: [
          { value: "5.2", color: "#EDCD20", measure: "%" },
          { value: "10", color: "invalid", measure: "%" },
        ],
      };
      const validate = ajv.compile(chartVariationCaptionSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with non-string title", () => {
      const data = {
        title: 123,
        data: [{ value: "5.2", color: "#EDCD20", measure: "%" }],
      };
      const validate = ajv.compile(chartVariationCaptionSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with additional properties", () => {
      const data = {
        title: "vs LY",
        data: [{ value: "5.2", color: "#EDCD20", measure: "%" }],
        extra: "not allowed",
      };
      const validate = ajv.compile(chartVariationCaptionSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with invalid data type (number)", () => {
      const data = {
        title: "vs LY",
        data: 123,
      };
      const validate = ajv.compile(chartVariationCaptionSchema);
      expect(validate(data)).toBe(false);
    });
  });

  describe("chartDatasetSchema", () => {
    it("should validate bar chart dataset with array data", () => {
      const data = {
        data: [10, 20, 30],
        type: "bar",
        label: "Current Year",
        borderColor: "#EDCD20",
        backgroundColor: ["#EDCD20", "#EDCD20", "#EDCD20"],
      };
      const validate = ajv.compile(chartDatasetSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate line chart dataset with array data", () => {
      const data = {
        data: [10, 20, 30],
        type: "line",
        label: "Previous Year",
        borderColor: "#FF0000",
        backgroundColor: "#FF0000",
      };
      const validate = ajv.compile(chartDatasetSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate line chart dataset with single number data", () => {
      const data = {
        data: 100,
        type: "line",
        label: "Single Point",
        borderColor: "#EDCD20",
        backgroundColor: "#EDCD20",
      };
      const validate = ajv.compile(chartDatasetSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with empty array data", () => {
      const data = {
        data: [],
        type: "bar",
      };
      const validate = ajv.compile(chartDatasetSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with rgba borderColor", () => {
      const data = {
        data: [10, 20, 30],
        type: "line",
        borderColor: "rgba(237, 205, 32, 0.5)",
        backgroundColor: "rgba(237, 205, 32, 0.3)",
      };
      const validate = ajv.compile(chartDatasetSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with rgba backgroundColor array", () => {
      const data = {
        data: [10, 20, 30],
        type: "bar",
        backgroundColor: [
          "rgba(237, 205, 32, 0.5)",
          "rgba(255, 0, 0, 0.5)",
          "rgba(0, 255, 0, 0.5)",
        ],
      };
      const validate = ajv.compile(chartDatasetSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with only required fields", () => {
      const data = {
        data: [10, 20, 30],
        type: "bar",
      };
      const validate = ajv.compile(chartDatasetSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with decimal numbers in data array", () => {
      const data = {
        data: [10.5, 20.75, 30.25],
        type: "bar",
      };
      const validate = ajv.compile(chartDatasetSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with additional properties", () => {
      const data = {
        data: [10, 20, 30],
        type: "bar",
        extraProperty: "allowed",
      };
      const validate = ajv.compile(chartDatasetSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail without data", () => {
      const data = {
        type: "bar",
      };
      const validate = ajv.compile(chartDatasetSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without type", () => {
      const data = {
        data: [10, 20, 30],
      };
      const validate = ajv.compile(chartDatasetSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with invalid type", () => {
      const data = {
        data: [10, 20, 30],
        type: "pie",
      };
      const validate = ajv.compile(chartDatasetSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with invalid hex color in borderColor", () => {
      const data = {
        data: [10, 20, 30],
        type: "line",
        borderColor: "red",
      };
      const validate = ajv.compile(chartDatasetSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with invalid hex color in backgroundColor", () => {
      const data = {
        data: [10, 20, 30],
        type: "bar",
        backgroundColor: ["red", "blue"],
      };
      const validate = ajv.compile(chartDatasetSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with invalid rgba format in borderColor", () => {
      const data = {
        data: [10, 20, 30],
        type: "line",
        borderColor: "rgb(255, 0, 0)",
      };
      const validate = ajv.compile(chartDatasetSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with non-numeric values in data array", () => {
      const data = {
        data: ["10", "20", "30"],
        type: "bar",
      };
      const validate = ajv.compile(chartDatasetSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with non-number single data value", () => {
      const data = {
        data: "100",
        type: "line",
      };
      const validate = ajv.compile(chartDatasetSchema);
      expect(validate(data)).toBe(false);
    });
  });

  describe("lineChartSchema", () => {
    it("should validate complete line chart", () => {
      const data = {
        datasets: [
          {
            data: [10, 20, 30],
            type: "line",
            label: "Current Year",
            borderColor: "#EDCD20",
            backgroundColor: "#EDCD20",
          },
        ],
        type: "line",
        labels: ["Jan", "Feb", "Mar"],
        labels_type: "months",
        referencialUnitMeasure: "%",
        comparison_unit_of_measure: "pp",
        formatted_data: true,
        variation_caption: [
          {
            title: "vs LY",
            data: [{ value: "5.2", color: "#EDCD20", measure: "%" }],
          },
        ],
        backgroundColor: ["#EDCD20", "#EDCD20", "#EDCD20"],
      };
      const validate = ajv.compile(lineChartSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with minimal required fields", () => {
      const data = {
        datasets: [
          {
            data: [10, 20, 30],
            type: "line",
          },
        ],
        type: "line",
        labels: ["Jan", "Feb", "Mar"],
      };
      const validate = ajv.compile(lineChartSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with empty datasets array", () => {
      const data = {
        datasets: [],
        type: "line",
        labels: ["Jan", "Feb", "Mar"],
      };
      const validate = ajv.compile(lineChartSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with empty labels array", () => {
      const data = {
        datasets: [
          {
            data: [10, 20, 30],
            type: "line",
          },
        ],
        type: "line",
        labels: [],
      };
      const validate = ajv.compile(lineChartSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with single number data in dataset", () => {
      const data = {
        datasets: [
          {
            data: 100,
            type: "line",
          },
        ],
        type: "line",
        labels: ["Single Point"],
      };
      const validate = ajv.compile(lineChartSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with multiple datasets", () => {
      const data = {
        datasets: [
          {
            data: [10, 20, 30],
            type: "line",
            label: "Current Year",
          },
          {
            data: [15, 25, 35],
            type: "line",
            label: "Previous Year",
          },
        ],
        type: "line",
        labels: ["Jan", "Feb", "Mar"],
      };
      const validate = ajv.compile(lineChartSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with variation_caption array", () => {
      const data = {
        datasets: [
          {
            data: [10, 20, 30],
            type: "line",
          },
        ],
        type: "line",
        labels: ["Jan", "Feb", "Mar"],
        variation_caption: [
          {
            title: "vs LY",
            data: [
              { value: "5.2", color: "#EDCD20", measure: "%" },
              { value: "-2.1", color: "#FF0000", measure: "pp" },
            ],
          },
        ],
      };
      const validate = ajv.compile(lineChartSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with single data item in variation_caption", () => {
      const data = {
        datasets: [
          {
            data: [10, 20, 30],
            type: "line",
          },
        ],
        type: "line",
        labels: ["Jan", "Feb", "Mar"],
        variation_caption: [
          {
            title: "vs LY",
            data: { value: "5.2", color: "#EDCD20", measure: "%" },
          },
        ],
      };
      const validate = ajv.compile(lineChartSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with empty variation_caption array", () => {
      const data = {
        datasets: [
          {
            data: [10, 20, 30],
            type: "line",
          },
        ],
        type: "line",
        labels: ["Jan", "Feb", "Mar"],
        variation_caption: [],
      };
      const validate = ajv.compile(lineChartSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate with hex colors in backgroundColor", () => {
      const data = {
        datasets: [
          {
            data: [10, 20, 30],
            type: "line",
          },
        ],
        type: "line",
        labels: ["Jan", "Feb", "Mar"],
        backgroundColor: ["#EDCD20", "#FF0000", "#00FF00"],
      };
      const validate = ajv.compile(lineChartSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail without datasets", () => {
      const data = {
        type: "line",
        labels: ["Jan", "Feb", "Mar"],
      };
      const validate = ajv.compile(lineChartSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without type", () => {
      const data = {
        datasets: [
          {
            data: [10, 20, 30],
            type: "line",
          },
        ],
        labels: ["Jan", "Feb", "Mar"],
      };
      const validate = ajv.compile(lineChartSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without labels", () => {
      const data = {
        datasets: [
          {
            data: [10, 20, 30],
            type: "line",
          },
        ],
        type: "line",
      };
      const validate = ajv.compile(lineChartSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with invalid type (not 'line')", () => {
      const data = {
        datasets: [
          {
            data: [10, 20, 30],
            type: "line",
          },
        ],
        type: "bar",
        labels: ["Jan", "Feb", "Mar"],
      };
      const validate = ajv.compile(lineChartSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with invalid dataset", () => {
      const data = {
        datasets: [
          {
            data: [10, 20, 30],
            type: "pie",
          },
        ],
        type: "line",
        labels: ["Jan", "Feb", "Mar"],
      };
      const validate = ajv.compile(lineChartSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with invalid hex color in backgroundColor", () => {
      const data = {
        datasets: [
          {
            data: [10, 20, 30],
            type: "line",
          },
        ],
        type: "line",
        labels: ["Jan", "Feb", "Mar"],
        backgroundColor: ["red", "blue"],
      };
      const validate = ajv.compile(lineChartSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with invalid variation_caption", () => {
      const data = {
        datasets: [
          {
            data: [10, 20, 30],
            type: "line",
          },
        ],
        type: "line",
        labels: ["Jan", "Feb", "Mar"],
        variation_caption: [
          {
            title: "vs LY",
            data: [{ value: "5.2", color: "invalid", measure: "%" }],
          },
        ],
      };
      const validate = ajv.compile(lineChartSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with non-string labels", () => {
      const data = {
        datasets: [
          {
            data: [10, 20, 30],
            type: "line",
          },
        ],
        type: "line",
        labels: [1, 2, 3],
      };
      const validate = ajv.compile(lineChartSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with additional properties", () => {
      const data = {
        datasets: [
          {
            data: [10, 20, 30],
            type: "line",
          },
        ],
        type: "line",
        labels: ["Jan", "Feb", "Mar"],
        extraProperty: "not allowed",
      };
      const validate = ajv.compile(lineChartSchema);
      expect(validate(data)).toBe(false);
    });
  });
});
