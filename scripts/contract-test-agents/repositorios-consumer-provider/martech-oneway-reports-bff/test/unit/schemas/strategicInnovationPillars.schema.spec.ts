import Ajv from "ajv";
import addFormats from "ajv-formats";
import {
  portfolioHealthSchema,
  portfolioPillarItemSchema,
  otherPillarItemSchema,
  strategicInnovationPillarBigNumberSchema,
  strategicInnovationPillarChartDatasetSchema,
  strategicInnovationPillarChartConnectorSchema,
  strategicInnovationPillarChartComparisonLineDataItemSchema,
  strategicInnovationPillarChartComparisonLineSchema,
  strategicInnovationPillarChartSchema,
  strategicInnovationPillarChartSectionSchema,
  strategicInnovationPillarItemSchema,
  strategicInnovationPillarsArraySchema,
  strategicInnovationPillarsSchema,
} from "../../../src/infrastructure/schema/components/strategicInnovationPillars.schema";

describe("Strategic Innovation Pillars Schemas", () => {
  let ajv: Ajv;

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
  });

  describe("portfolioHealthSchema", () => {
    it("should validate complete portfolio health data", () => {
      const data = {
        id: "health",
        period: "H1'25",
        bigNumbers: [
          {
            data: [
              {
                bigNumber: {
                  value: "85.4",
                },
                comparison: {
                  label: "vs",
                  value: "Jul'24",
                  number: {
                    value: "1.1",
                    measure: "pp",
                    trend: "positive",
                  },
                },
              },
            ],
          },
          {
            data: [
              {
                bigNumber: {
                  value: "77.7",
                },
                comparison: {
                  label: "vs",
                  value: "Jul'24",
                  number: {
                    value: "-0.5",
                    measure: "pp",
                    trend: "negative",
                  },
                },
              },
            ],
          },
        ],
        legend: [{ label: "Innovation" }, { label: "Mature" }],
      };
      const validate = ajv.compile(portfolioHealthSchema);
      const isValid = validate(data);
      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }
      expect(isValid).toBe(true);
    });

    it("should validate H2 period format", () => {
      const data = {
        id: "health",
        period: "H2'25",
        bigNumbers: [
          {
            data: [
              {
                bigNumber: { value: "85.4" },
                comparison: {
                  label: "vs",
                  value: "Dec'24",
                  number: {
                    value: "1.1",
                    measure: "pp",
                    trend: "positive",
                  },
                },
              },
            ],
          },
        ],
        legend: [{ label: "Innovation" }],
      };
      const validate = ajv.compile(portfolioHealthSchema);
      const isValid = validate(data);
      expect(isValid).toBe(true);
    });

    it("should fail with invalid period format", () => {
      const data = {
        id: "health",
        period: "Dec'25",
        bigNumbers: [
          {
            data: [
              {
                bigNumber: { value: "85.4" },
                comparison: {
                  label: "vs",
                  value: "Jul'24",
                  number: { value: "1.1", measure: "pp", trend: "positive" },
                },
              },
            ],
          },
        ],
        legend: [{ label: "Innovation" }],
      };
      const validate = ajv.compile(portfolioHealthSchema);
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });

    it("should fail with invalid trend value", () => {
      const data = {
        id: "health",
        period: "H1'25",
        bigNumbers: [
          {
            data: [
              {
                bigNumber: { value: "85.4" },
                comparison: {
                  label: "vs",
                  value: "Jul'24",
                  number: { value: "1.1", measure: "pp", trend: "up" },
                },
              },
            ],
          },
        ],
        legend: [{ label: "Innovation" }],
      };
      const validate = ajv.compile(portfolioHealthSchema);
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });

    it("should fail without id", () => {
      const data = {
        period: "H1'25",
        bigNumbers: [],
        legend: [],
      };
      const validate = ajv.compile(portfolioHealthSchema);
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });

    it("should fail without period", () => {
      const data = {
        id: "health",
        bigNumbers: [],
        legend: [],
      };
      const validate = ajv.compile(portfolioHealthSchema);
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });

    it("should fail with empty bigNumbers array", () => {
      const data = {
        id: "health",
        period: "H1'25",
        bigNumbers: [],
        legend: [{ label: "Innovation" }],
      };
      const validate = ajv.compile(portfolioHealthSchema);
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });

    it("should fail with empty legend array", () => {
      const data = {
        id: "health",
        period: "H1'25",
        bigNumbers: [
          {
            data: [
              {
                bigNumber: { value: "85.4" },
                comparison: {
                  label: "vs",
                  value: "Jul'24",
                  number: { value: "1.1", measure: "pp", trend: "positive" },
                },
              },
            ],
          },
        ],
        legend: [],
      };
      const validate = ajv.compile(portfolioHealthSchema);
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });
  });

  describe("portfolioPillarItemSchema", () => {
    it("should validate portfolio pillar with health data", () => {
      const data = {
        id: "portfolio",
        health: {
          id: "health",
          period: "H1'25",
          bigNumbers: [
            {
              data: [
                {
                  bigNumber: { value: "85.4" },
                  comparison: {
                    label: "vs",
                    value: "Jul'24",
                    number: {
                      value: "1.1",
                      measure: "pp",
                      trend: "positive",
                    },
                  },
                },
              ],
            },
          ],
          legend: [{ label: "Innovation" }],
        },
      };
      const validate = ajv.compile(portfolioPillarItemSchema);
      const isValid = validate(data);
      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }
      expect(isValid).toBe(true);
    });

    it("should validate portfolio pillar with empty health", () => {
      const data = {
        id: "portfolio",
        health: {},
      };
      const validate = ajv.compile(portfolioPillarItemSchema);
      const isValid = validate(data);
      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }
      expect(isValid).toBe(true);
    });

    it("should fail with non-portfolio id", () => {
      const data = {
        id: "packPrice",
        health: {},
      };
      const validate = ajv.compile(portfolioPillarItemSchema);
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });

    it("should fail without health", () => {
      const data = {
        id: "portfolio",
      };
      const validate = ajv.compile(portfolioPillarItemSchema);
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });

    it("should fail with headerColor (not allowed in portfolio)", () => {
      const data = {
        id: "portfolio",
        health: {},
        headerColor: "#FFF4E6",
      };
      const validate = ajv.compile(portfolioPillarItemSchema);
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });
  });

  describe("otherPillarItemSchema", () => {
    it("should validate packPrice pillar with chartSection", () => {
      const data = {
        id: "packPrice",
        headerColor: "#F7EFBB",
        chartSection: {
          bigNumber: {
            id: "packPriceBigNumber",
            period: "Dec'24",
            data: [
              {
                bigNumber: {
                  value: "11.1",
                  measure: "%",
                  color: "#007800",
                },
                comparison: {
                  label: "vs",
                  value: "Dec'23",
                },
              },
            ],
          },
          chart: {
            datasets: [
              {
                label: "Dataset 1",
                data: [7255.6],
                backgroundColor: "#D3E3EE",
              },
            ],
            labels: ["2023"],
            connector: {
              value: 41.1,
              from: "2022",
              to: "2024",
              backgroundColor: "#E6F9E6",
              textColor: "#007800",
              measure: "%",
            },
            comparisonLine: {
              title: "vs LY",
              data: [{ value: "10.3", measure: "%", color: "#007800" }],
            },
          },
        },
      };
      const validate = ajv.compile(otherPillarItemSchema);
      const isValid = validate(data);
      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }
      expect(isValid).toBe(true);
    });

    it("should fail with portfolio id", () => {
      const data = {
        id: "portfolio",
        headerColor: "#FFF4E6",
        chartSection: {},
      };
      const validate = ajv.compile(otherPillarItemSchema);
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });

    it("should fail without headerColor", () => {
      const data = {
        id: "packPrice",
        chartSection: {},
      };
      const validate = ajv.compile(otherPillarItemSchema);
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });

    it("should fail without chartSection", () => {
      const data = {
        id: "packPrice",
        headerColor: "#F7EFBB",
      };
      const validate = ajv.compile(otherPillarItemSchema);
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });
  });

  describe("strategicInnovationPillarBigNumberSchema", () => {
    it("should validate big number with required fields", () => {
      const data = {
        id: "packPriceBigNumber",
        period: "Dec'24",
        data: [
          {
            bigNumber: {
              value: "11.1",
              measure: "%",
              color: "#007800",
            },
            comparison: {
              label: "vs",
              value: "Dec'23",
            },
          },
        ],
      };
      const validate = ajv.compile(strategicInnovationPillarBigNumberSchema);
      const isValid = validate(data);
      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }
      expect(isValid).toBe(true);
    });

    it("should fail without id", () => {
      const data = {
        period: "Dec'24",
        data: [],
      };
      const validate = ajv.compile(strategicInnovationPillarBigNumberSchema);
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });

    it("should fail without period", () => {
      const data = {
        id: "packPriceBigNumber",
        data: [],
      };
      const validate = ajv.compile(strategicInnovationPillarBigNumberSchema);
      const isValid = validate(data);

      expect(isValid).toBe(false);
    });

    it("should fail without data", () => {
      const data = {
        id: "packPriceBigNumber",
        period: "Dec'24",
      };
      const validate = ajv.compile(strategicInnovationPillarBigNumberSchema);
      const isValid = validate(data);

      expect(isValid).toBe(false);
    });
  });

  describe("strategicInnovationPillarChartDatasetSchema", () => {
    it("should validate chart dataset with required fields", () => {
      const data = {
        label: "Dataset 1",
        data: [7255.6, 9187],
        backgroundColor: "#D3E3EE",
      };
      const validate = ajv.compile(strategicInnovationPillarChartDatasetSchema);
      const isValid = validate(data);
      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }
      expect(isValid).toBe(true);
    });

    it("should fail with invalid hex color", () => {
      const data = {
        label: "Dataset 1",
        data: [100],
        backgroundColor: "red",
      };
      const validate = ajv.compile(strategicInnovationPillarChartDatasetSchema);
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });

    it("should fail without label", () => {
      const data = {
        data: [100],
        backgroundColor: "#D3E3EE",
      };
      const validate = ajv.compile(strategicInnovationPillarChartDatasetSchema);
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });

    it("should validate chart dataset with formattedData", () => {
      const data = {
        label: "Dataset 1",
        data: [7255.6, 9187],
        formattedData: ["7.2k", "9.1k"],
        backgroundColor: "#D3E3EE",
      };
      const validate = ajv.compile(strategicInnovationPillarChartDatasetSchema);
      const isValid = validate(data);
      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }
      expect(isValid).toBe(true);
    });

    it("should fail with empty formattedData array", () => {
      const data = {
        label: "Dataset 1",
        data: [7255.6, 9187],
        formattedData: [],
        backgroundColor: "#D3E3EE",
      };
      const validate = ajv.compile(strategicInnovationPillarChartDatasetSchema);
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });

    it("should fail with non-string items in formattedData", () => {
      const data = {
        label: "Dataset 1",
        data: [7255.6, 9187],
        formattedData: [7255.6, "9,187.0"],
        backgroundColor: "#D3E3EE",
      };
      const validate = ajv.compile(strategicInnovationPillarChartDatasetSchema);
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });

    it("should fail with non-array formattedData", () => {
      const data = {
        label: "Dataset 1",
        data: [7255.6, 9187],
        formattedData: "7,255.6",
        backgroundColor: "#D3E3EE",
      };
      const validate = ajv.compile(strategicInnovationPillarChartDatasetSchema);
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });
  });

  describe("strategicInnovationPillarChartConnectorSchema", () => {
    it("should validate connector with required fields", () => {
      const data = {
        value: 2947.0,
        from: "2022",
        to: "2023",
        backgroundColor: "#E6F9E6",
        textColor: "#007800",
        measure: "%",
      };
      const validate = ajv.compile(
        strategicInnovationPillarChartConnectorSchema,
      );
      const isValid = validate(data);
      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }
      expect(isValid).toBe(true);
    });

    it("should fail without value", () => {
      const data = {
        from: "2022",
        to: "2023",
        backgroundColor: "#E6F9E6",
        textColor: "#007800",
        measure: "%",
      };
      const validate = ajv.compile(
        strategicInnovationPillarChartConnectorSchema,
      );
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });
  });

  describe("strategicInnovationPillarChartComparisonLineDataItemSchema", () => {
    it("should validate comparison line data item with required value", () => {
      const data = {
        value: "26.6",
      };
      const validate = ajv.compile(
        strategicInnovationPillarChartComparisonLineDataItemSchema,
      );
      const isValid = validate(data);
      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }
      expect(isValid).toBe(true);
    });

    it("should validate with all fields", () => {
      const data = {
        value: "26.6",
        measure: "%",
        color: "#007800",
      };
      const validate = ajv.compile(
        strategicInnovationPillarChartComparisonLineDataItemSchema,
      );
      const isValid = validate(data);
      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }
      expect(isValid).toBe(true);
    });

    it("should validate with dash value", () => {
      const data = {
        value: "-",
      };
      const validate = ajv.compile(
        strategicInnovationPillarChartComparisonLineDataItemSchema,
      );
      const isValid = validate(data);
      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }
      expect(isValid).toBe(true);
    });

    it("should fail without value", () => {
      const data = {
        measure: "%",
        color: "#007800",
      };
      const validate = ajv.compile(
        strategicInnovationPillarChartComparisonLineDataItemSchema,
      );
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });
  });

  describe("strategicInnovationPillarChartComparisonLineSchema", () => {
    it("should validate comparison line with required fields", () => {
      const data = {
        title: "vs LY",
        data: [
          {
            value: "-",
          },
          {
            value: "26.6",
            measure: "%",
            color: "#007800",
          },
        ],
      };
      const validate = ajv.compile(
        strategicInnovationPillarChartComparisonLineSchema,
      );
      const isValid = validate(data);
      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }
      expect(isValid).toBe(true);
    });

    it("should fail without title", () => {
      const data = {
        data: [
          {
            value: "26.6",
          },
        ],
      };
      const validate = ajv.compile(
        strategicInnovationPillarChartComparisonLineSchema,
      );
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });

    it("should fail without data", () => {
      const data = {
        title: "vs LY",
      };
      const validate = ajv.compile(
        strategicInnovationPillarChartComparisonLineSchema,
      );
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });

    it("should fail with empty data array", () => {
      const data = {
        title: "vs LY",
        data: [],
      };
      const validate = ajv.compile(
        strategicInnovationPillarChartComparisonLineSchema,
      );
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });
  });

  describe("strategicInnovationPillarChartSchema", () => {
    it("should validate chart with required fields", () => {
      const data = {
        datasets: [
          {
            label: "Dataset 1",
            data: [7255.6, 9187],
            backgroundColor: "#D3E3EE",
          },
        ],
        labels: ["2022", "2023"],
        connector: {
          value: 2947.0,
          from: "2022",
          to: "2023",
          backgroundColor: "#E6F9E6",
          textColor: "#007800",
          measure: "%",
        },
        comparisonLine: {
          title: "vs LY",
          data: [
            {
              value: "-",
            },
            {
              value: "26.6",
              measure: "%",
              color: "#007800",
            },
          ],
        },
      };
      const validate = ajv.compile(strategicInnovationPillarChartSchema);
      const isValid = validate(data);
      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }
      expect(isValid).toBe(true);
    });

    it("should fail without datasets", () => {
      const data = {
        labels: ["2022", "2023"],
        connector: {
          value: 2947.0,
          from: "2022",
          to: "2023",
          backgroundColor: "#E6F9E6",
          textColor: "#007800",
          measure: "%",
        },
        comparisonLine: {
          title: "vs LY",
          data: [
            {
              value: "-",
            },
          ],
        },
      };
      const validate = ajv.compile(strategicInnovationPillarChartSchema);
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });

    it("should fail without labels", () => {
      const data = {
        datasets: [
          {
            label: "Dataset 1",
            data: [7255.6, 9187],
            backgroundColor: "#D3E3EE",
          },
        ],
        connector: {
          value: 2947.0,
          from: "2022",
          to: "2023",
          backgroundColor: "#E6F9E6",
          textColor: "#007800",
          measure: "%",
        },
        comparisonLine: {
          title: "vs LY",
          data: [
            {
              value: "-",
            },
          ],
        },
      };
      const validate = ajv.compile(strategicInnovationPillarChartSchema);
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });

    it("should validate chart with formattedData in datasets", () => {
      const data = {
        datasets: [
          {
            label: "Dataset 1",
            data: [7255.6, 9187],
            formattedData: ["7,255.6", "9,187.0"],
            backgroundColor: "#D3E3EE",
          },
        ],
        labels: ["2022", "2023"],
        connector: {
          value: 2947.0,
          from: "2022",
          to: "2023",
          backgroundColor: "#E6F9E6",
          textColor: "#007800",
          measure: "%",
        },
        comparisonLine: {
          title: "vs LY",
          data: [
            {
              value: "-",
            },
            {
              value: "26.6",
              measure: "%",
              color: "#007800",
            },
          ],
        },
      };
      const validate = ajv.compile(strategicInnovationPillarChartSchema);
      const isValid = validate(data);
      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }
      expect(isValid).toBe(true);
    });
  });

  describe("strategicInnovationPillarChartSectionSchema", () => {
    it("should validate chart section with required fields", () => {
      const data = {
        bigNumber: {
          id: "packPriceBigNumber",
          period: "Dec'24",
          data: [
            {
              bigNumber: {
                value: "11.1",
                measure: "%",
                color: "#007800",
              },
              comparison: {
                label: "vs",
                value: "Dec'23",
              },
            },
          ],
        },
        chart: {
          datasets: [
            {
              label: "Dataset 1",
              data: [7255.6, 9187],
              backgroundColor: "#D3E3EE",
            },
          ],
          labels: ["2022", "2023"],
          connector: {
            value: 2947.0,
            from: "2022",
            to: "2023",
            backgroundColor: "#E6F9E6",
            textColor: "#007800",
            measure: "%",
          },
          comparisonLine: {
            title: "vs LY",
            data: [
              {
                value: "-",
              },
              {
                value: "26.6",
                measure: "%",
                color: "#007800",
              },
            ],
          },
        },
      };
      const validate = ajv.compile(strategicInnovationPillarChartSectionSchema);
      const isValid = validate(data);
      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }
      expect(isValid).toBe(true);
    });

    it("should validate with only bigNumber", () => {
      const data = {
        bigNumber: {
          id: "packPriceBigNumber",
          period: "Dec'24",
          data: [
            {
              bigNumber: {
                value: "11.1",
                measure: "%",
                color: "#007800",
              },
              comparison: {
                label: "vs",
                value: "Dec'23",
              },
            },
          ],
        },
      };
      const validate = ajv.compile(strategicInnovationPillarChartSectionSchema);
      const isValid = validate(data);
      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }
      expect(isValid).toBe(true);
    });

    it("should validate with only chart", () => {
      const data = {
        chart: {
          datasets: [
            {
              label: "Dataset 1",
              data: [7255.6, 9187],
              backgroundColor: "#D3E3EE",
            },
          ],
          labels: ["2022", "2023"],
          connector: {
            value: 2947.0,
            from: "2022",
            to: "2023",
            backgroundColor: "#E6F9E6",
            textColor: "#007800",
            measure: "%",
          },
          comparisonLine: {
            title: "vs LY",
            data: [
              {
                value: "-",
              },
            ],
          },
        },
      };
      const validate = ajv.compile(strategicInnovationPillarChartSectionSchema);
      const isValid = validate(data);
      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }
      expect(isValid).toBe(true);
    });
  });

  describe("strategicInnovationPillarItemSchema", () => {
    it("should validate portfolio pillar with empty health", () => {
      const data = {
        id: "portfolio",
        health: {},
      };
      const validate = ajv.compile(strategicInnovationPillarItemSchema);
      const isValid = validate(data);
      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }
      expect(isValid).toBe(true);
    });

    it("should validate portfolio pillar with complete health data", () => {
      const data = {
        id: "portfolio",
        health: {
          id: "health",
          period: "H1'25",
          bigNumbers: [
            {
              data: [
                {
                  bigNumber: { value: "85.4" },
                  comparison: {
                    label: "vs",
                    value: "Jul'24",
                    number: {
                      value: "1.1",
                      measure: "pp",
                      trend: "positive",
                    },
                  },
                },
              ],
            },
          ],
          legend: [{ label: "Innovation" }],
        },
      };
      const validate = ajv.compile(strategicInnovationPillarItemSchema);
      const isValid = validate(data);
      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }
      expect(isValid).toBe(true);
    });

    it("should validate pillar item with chartSection", () => {
      const data = {
        id: "packPrice",
        headerColor: "#F7EFBB",
        chartSection: {
          bigNumber: {
            id: "packPriceBigNumber",
            period: "Dec'24",
            data: [
              {
                bigNumber: {
                  value: "11.1",
                  measure: "%",
                  color: "#007800",
                },
                comparison: {
                  label: "vs",
                  value: "Dec'23",
                },
              },
            ],
          },
          chart: {
            datasets: [
              {
                label: "Dataset 1",
                data: [7255.6, 9187],
                backgroundColor: "#D3E3EE",
              },
            ],
            labels: ["2022", "2023"],
            connector: {
              value: 2947.0,
              from: "2022",
              to: "2023",
              backgroundColor: "#E6F9E6",
              textColor: "#007800",
              measure: "%",
            },
            comparisonLine: {
              title: "vs LY",
              data: [
                {
                  value: "-",
                },
                {
                  value: "26.6",
                  measure: "%",
                  color: "#007800",
                },
              ],
            },
          },
        },
      };
      const validate = ajv.compile(strategicInnovationPillarItemSchema);
      const isValid = validate(data);
      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }
      expect(isValid).toBe(true);
    });

    it("should validate pillar item with chartSection containing formattedData", () => {
      const data = {
        id: "packPrice",
        headerColor: "#F7EFBB",
        chartSection: {
          bigNumber: {
            id: "packPriceBigNumber",
            period: "Dec'24",
            data: [
              {
                bigNumber: {
                  value: "11.1",
                  measure: "%",
                  color: "#007800",
                },
                comparison: {
                  label: "vs",
                  value: "Dec'23",
                },
              },
            ],
          },
          chart: {
            datasets: [
              {
                label: "Dataset 1",
                data: [7255.6, 9187],
                formattedData: ["7,255.6", "9,187.0"],
                backgroundColor: "#D3E3EE",
              },
            ],
            labels: ["2022", "2023"],
            connector: {
              value: 2947.0,
              from: "2022",
              to: "2023",
              backgroundColor: "#E6F9E6",
              textColor: "#007800",
              measure: "%",
            },
            comparisonLine: {
              title: "vs LY",
              data: [
                {
                  value: "-",
                },
                {
                  value: "26.6",
                  measure: "%",
                  color: "#007800",
                },
              ],
            },
          },
        },
      };
      const validate = ajv.compile(strategicInnovationPillarItemSchema);
      const isValid = validate(data);
      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }
      expect(isValid).toBe(true);
    });

    it("should validate all pillar id enum values", () => {
      const validate = ajv.compile(strategicInnovationPillarItemSchema);

      // Portfolio
      expect(
        validate({
          id: "portfolio",
          health: {},
        }),
      ).toBe(true);

      // Other pillars
      const otherIds = ["packPrice", "renovation", "newOpportunities"];
      otherIds.forEach((id) => {
        expect(
          validate({
            id: id,
            headerColor: "#FFF4E6",
            chartSection: {},
          }),
        ).toBe(true);
      });
    });

    it("should fail with invalid id", () => {
      const data = {
        id: "invalid",
        headerColor: "#FFF4E6",
        chartSection: {},
      };
      const validate = ajv.compile(strategicInnovationPillarItemSchema);
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });

    it("should fail portfolio without health", () => {
      const data = {
        id: "portfolio",
      };
      const validate = ajv.compile(strategicInnovationPillarItemSchema);
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });

    it("should fail other pillar without headerColor", () => {
      const data = {
        id: "packPrice",
        chartSection: {},
      };
      const validate = ajv.compile(strategicInnovationPillarItemSchema);
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });

    it("should fail portfolio with headerColor (not allowed)", () => {
      const data = {
        id: "portfolio",
        health: {},
        headerColor: "#FFF4E6",
      };
      const validate = ajv.compile(strategicInnovationPillarItemSchema);
      const isValid = validate(data);
      expect(isValid).toBe(false);
    });
  });

  describe("strategicInnovationPillarsArraySchema", () => {
    it("should validate array of pillars with portfolio and others", () => {
      const data = [
        {
          id: "portfolio",
          health: {},
        },
        {
          id: "packPrice",
          headerColor: "#F7EFBB",
          chartSection: {},
        },
      ];
      const validate = ajv.compile(strategicInnovationPillarsArraySchema);
      const isValid = validate(data);
      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }
      expect(isValid).toBe(true);
    });

    it("should fail with empty array", () => {
      const validate = ajv.compile(strategicInnovationPillarsArraySchema);
      const isValid = validate([]);
      expect(isValid).toBe(false);
    });

    it("should fail with non-array", () => {
      const validate = ajv.compile(strategicInnovationPillarsArraySchema);
      const isValid1 = validate({});
      if (!isValid1) {
        console.log("Validation errors for {}:", validate.errors);
      }
      expect(isValid1).toBe(false);
      const isValid2 = validate("pillars");
      if (!isValid2) {
        console.log("Validation errors for 'pillars':", validate.errors);
      }
      expect(isValid2).toBe(false);
    });
  });

  describe("strategicInnovationPillarsSchema", () => {
    it("should validate array of pillars with portfolio and others", () => {
      const data = [
        {
          id: "portfolio",
          health: {},
        },
        {
          id: "packPrice",
          headerColor: "#F7EFBB",
          chartSection: {},
        },
      ];
      const validate = ajv.compile(strategicInnovationPillarsSchema);
      const isValid = validate(data);
      if (!isValid) {
        console.log("Validation errors:", validate.errors);
      }
      expect(isValid).toBe(true);
    });

    it("should fail with invalid data", () => {
      const validate = ajv.compile(strategicInnovationPillarsSchema);
      const isValid1 = validate({});
      if (!isValid1) {
        console.log("Validation errors for {}:", validate.errors);
      }
      expect(isValid1).toBe(false);
      const isValid2 = validate("invalid");
      if (!isValid2) {
        console.log("Validation errors for 'invalid':", validate.errors);
      }
      expect(isValid2).toBe(false);
    });
  });
});
