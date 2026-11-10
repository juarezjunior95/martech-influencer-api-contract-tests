import Ajv from "ajv";
import addFormats from "ajv-formats";
import {
  columnConfigSchema,
  columnChildSchema,
  headerGroupComponentParamsSchema,
  columnDefSchema,
  chartConfigSchema,
  cellConfigSchema,
  rowDataItemSchema,
  breakdownTableDataSchema,
} from "@infrastructure/schema/components/breakdownTable.schema";

describe("BreakdownTable Schemas", () => {
  let ajv: Ajv;

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
  });

  describe("columnConfigSchema", () => {
    it("should validate empty config", () => {
      const validate = ajv.compile(columnConfigSchema);
      expect(validate({})).toBe(true);
    });

    it("should validate config with lastColGroup", () => {
      const data = {
        lastColGroup: true,
      };
      const validate = ajv.compile(columnConfigSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate config with intermediateColGroup", () => {
      const data = {
        intermediateColGroup: [
          {
            initial: 0,
            final: 14,
          },
        ],
      };
      const validate = ajv.compile(columnConfigSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate complete config", () => {
      const data = {
        lastColGroup: true,
        intermediateColGroup: [
          {
            initial: 0,
            final: 14,
          },
        ],
        merge: true,
      };
      const validate = ajv.compile(columnConfigSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail with invalid intermediateColGroup", () => {
      const data = {
        intermediateColGroup: [
          {
            initial: 0,
          },
        ],
      };
      const validate = ajv.compile(columnConfigSchema);
      expect(validate(data)).toBe(false);
    });
  });

  describe("columnChildSchema", () => {
    it("should validate column child with required fields", () => {
      const data = {
        headerName: "Weight TT ABI [%]",
        field: "group_1_2",
      };
      const validate = ajv.compile(columnChildSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate column child with all fields", () => {
      const data = {
        headerName: "Weight TT ABI [%]",
        field: "group_1_2",
        minWidth: 154,
        maxWidth: 385,
        headerClass: ["ag-header-background-gray-60", "ag-header-color-white"],
        config: {
          lastColGroup: true,
          merge: false,
        },
      };
      const validate = ajv.compile(columnChildSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail without headerName", () => {
      const data = {
        field: "group_1_2",
      };
      const validate = ajv.compile(columnChildSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without field", () => {
      const data = {
        headerName: "Weight",
      };
      const validate = ajv.compile(columnChildSchema);
      expect(validate(data)).toBe(false);
    });
  });

  describe("headerGroupComponentParamsSchema", () => {
    it("should validate empty params", () => {
      const validate = ajv.compile(headerGroupComponentParamsSchema);
      expect(validate({})).toBe(true);
    });

    it("should validate params with icon", () => {
      const data = {
        icon: "region",
      };
      const validate = ajv.compile(headerGroupComponentParamsSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate complete params", () => {
      const data = {
        icon: "kpi",
        subtitle: "Oct'25",
        dateEndStorageKey: "kpi_date_end",
      };
      const validate = ajv.compile(headerGroupComponentParamsSchema);
      expect(validate(data)).toBe(true);
    });
  });

  describe("columnDefSchema", () => {
    it("should validate column def with required headerName", () => {
      const data = {
        headerName: "Region",
      };
      const validate = ajv.compile(columnDefSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate column def with children", () => {
      const data = {
        headerName: "Volume",
        headerClass: ["icon--kpi"],
        headerGroupComponentParams: {
          icon: "kpi",
          subtitle: "Oct'25",
        },
        children: [
          {
            headerName: "Weight",
            field: "group_1_1",
          },
        ],
      };
      const validate = ajv.compile(columnDefSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail without headerName", () => {
      const data = {
        headerClass: ["icon--kpi"],
      };
      const validate = ajv.compile(columnDefSchema);
      expect(validate(data)).toBe(false);
    });
  });

  describe("chartConfigSchema", () => {
    it("should validate empty chart config", () => {
      const validate = ajv.compile(chartConfigSchema);
      expect(validate({})).toBe(true);
    });

    it("should validate chart config with merge", () => {
      const data = {
        merge: 1,
      };
      const validate = ajv.compile(chartConfigSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate complete chart config", () => {
      const data = {
        merge: 1,
        chartData: [417066.3, -5.9, -3910.3, 405155],
        chartLabel: ["Oct'24", "MAZ", "SAZ", "Oct'25"],
      };
      const validate = ajv.compile(chartConfigSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail with non-numeric chartData", () => {
      const data = {
        chartData: ["100", "200"],
      };
      const validate = ajv.compile(chartConfigSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with non-string chartLabel", () => {
      const data = {
        chartLabel: [100, 200],
      };
      const validate = ajv.compile(chartConfigSchema);
      expect(validate(data)).toBe(false);
    });
  });

  describe("cellConfigSchema", () => {
    it("should validate empty cell config", () => {
      const validate = ajv.compile(cellConfigSchema);
      expect(validate({})).toBe(true);
    });

    it("should validate cell config with basic properties", () => {
      const data = {
        unitMeasure: "%",
        textAlign: "center",
        mergeCol: true,
      };
      const validate = ajv.compile(cellConfigSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate textAlign enum values", () => {
      const validate = ajv.compile(cellConfigSchema);
      const alignments = ["left", "center", "right"];

      alignments.forEach((align) => {
        const data = {
          textAlign: align,
        };
        expect(validate(data)).toBe(true);
      });
    });

    it("should fail with invalid textAlign", () => {
      const data = {
        textAlign: "invalid",
      };
      const validate = ajv.compile(cellConfigSchema);
      expect(validate(data)).toBe(false);
    });

    it("should validate variationDirection enum values", () => {
      const validate = ajv.compile(cellConfigSchema);
      const directions = ["up", "down", "neutral"];

      directions.forEach((dir) => {
        const data = {
          variationDirection: dir,
        };
        expect(validate(data)).toBe(true);
      });
    });

    it("should fail with invalid variationDirection", () => {
      const data = {
        variationDirection: "invalid",
      };
      const validate = ajv.compile(cellConfigSchema);
      expect(validate(data)).toBe(false);
    });

    it("should validate backgroundColorCode hex format", () => {
      const validate = ajv.compile(cellConfigSchema);
      const colors = ["#C9D1D6", "#000000", "#FFFFFF"];

      colors.forEach((color) => {
        const data = {
          backgroundColorCode: color,
        };
        expect(validate(data)).toBe(true);
      });
    });

    it("should fail with invalid backgroundColorCode format", () => {
      const validate = ajv.compile(cellConfigSchema);

      expect(validate({ backgroundColorCode: "gray" })).toBe(false);
      expect(validate({ backgroundColorCode: "#FFF" })).toBe(false);
      expect(validate({ backgroundColorCode: "C9D1D6" })).toBe(false);
    });

    it("should validate complete cell config with all properties", () => {
      const data = {
        unitMeasure: "%",
        textAlign: "center",
        mergeCol: true,
        merge: 1,
        variationDirection: "down",
        textWeight: "B",
        backgroundColorCode: "#C9D1D6",
        chartData: [100, 200, 300],
        chartLabel: ["A", "B", "C"],
      };
      const validate = ajv.compile(cellConfigSchema);
      expect(validate(data)).toBe(true);
    });
  });

  describe("rowDataItemSchema", () => {
    it("should validate empty row item", () => {
      const validate = ajv.compile(rowDataItemSchema);
      expect(validate({})).toBe(true);
    });

    it("should validate row item with dynamic fields", () => {
      const data = {
        group_1_1: "_chart",
        group_1_1_config: {
          merge: 1,
        },
        group_1_2: 24.9,
        group_1_2_config: {
          unitMeasure: "%",
          textAlign: "center",
        },
      };
      const validate = ajv.compile(rowDataItemSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate row item with string value", () => {
      const data = {
        group_1_1: "_chart",
        group_1_1_config: {},
      };
      const validate = ajv.compile(rowDataItemSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate row item with number value", () => {
      const data = {
        group_1_1: 100,
        group_1_1_config: {
          unitMeasure: "%",
        },
      };
      const validate = ajv.compile(rowDataItemSchema);
      expect(validate(data)).toBe(true);
    });
  });

  describe("breakdownTableDataSchema", () => {
    it("should validate complete breakdown table", () => {
      const data = {
        columnDefs: [
          {
            headerName: "Region",
            headerClass: ["icon--region"],
            headerGroupComponentParams: {
              icon: "region",
            },
            children: [
              {
                headerName: "Volume OG vs LY",
                field: "group_1_1",
                minWidth: 510,
                maxWidth: 510,
                config: {
                  lastColGroup: true,
                  merge: true,
                },
              },
            ],
          },
          {
            headerName: "Volume",
            headerGroupComponentParams: {
              subtitle: "Oct'25",
              icon: "kpi",
            },
            children: [
              {
                headerName: "Weight",
                field: "group_1_2",
              },
            ],
          },
        ],
        rowData: [
          {
            group_1_1: "_chart",
            group_1_1_config: {
              merge: 1,
              chartData: [100, 200, 300],
              chartLabel: ["A", "B", "C"],
            },
            group_1_2: 24.9,
            group_1_2_config: {
              unitMeasure: "%",
              textAlign: "center",
            },
          },
        ],
      };
      const validate = ajv.compile(breakdownTableDataSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate table with multiple rows", () => {
      const data = {
        columnDefs: [
          {
            headerName: "Test",
            children: [
              {
                headerName: "Col",
                field: "group_1_1",
              },
            ],
          },
        ],
        rowData: [
          {
            group_1_1: 100,
            group_1_1_config: {},
          },
          {
            group_1_1: 200,
            group_1_1_config: {},
          },
          {
            group_1_1: 300,
            group_1_1_config: { textWeight: "B" },
          },
        ],
      };
      const validate = ajv.compile(breakdownTableDataSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail without columnDefs", () => {
      const data = {
        rowData: [],
      };
      const validate = ajv.compile(breakdownTableDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without rowData", () => {
      const data = {
        columnDefs: [
          {
            headerName: "Test",
            children: [{ headerName: "Col", field: "group_1_1" }],
          },
        ],
      };
      const validate = ajv.compile(breakdownTableDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with empty columnDefs array", () => {
      const data = {
        columnDefs: [],
        rowData: [],
      };
      const validate = ajv.compile(breakdownTableDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail with empty rowData array", () => {
      const data = {
        columnDefs: [
          {
            headerName: "Test",
            children: [{ headerName: "Col", field: "group_1_1" }],
          },
        ],
        rowData: [],
      };
      const validate = ajv.compile(breakdownTableDataSchema);
      expect(validate(data)).toBe(false);
    });
  });
});
