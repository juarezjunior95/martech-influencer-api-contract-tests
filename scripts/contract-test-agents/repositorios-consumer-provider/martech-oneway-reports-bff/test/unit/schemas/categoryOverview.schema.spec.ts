import Ajv from "ajv";
import addFormats from "ajv-formats";
import {
  kpiValueSchema,
  kpiRowSchema,
  kpiTableSchema,
  categoryOverviewItemSchema,
  categoryOverviewArraySchema,
  categoryOverviewEmptySchema,
  categoryOverviewDataSchema,
} from "../../../src/infrastructure/schema/components/categoryOverview.schema";

describe("CategoryOverview Schemas", () => {
  let ajv: Ajv;

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
  });

  describe("kpiValueSchema", () => {
    it("should validate KPI value with required fields", () => {
      const data = {
        value: "27.2",
      };
      const validate = ajv.compile(kpiValueSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate KPI value with all fields", () => {
      const data = {
        value: "27.2",
        unitOfMeasure: "%",
        direction: "down",
      };
      const validate = ajv.compile(kpiValueSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate direction enum values", () => {
      const validate = ajv.compile(kpiValueSchema);
      const directions = ["up", "down", "neutral"];

      directions.forEach((dir) => {
        const data = {
          value: "5",
          direction: dir,
        };
        expect(validate(data)).toBe(true);
      });
    });

    it("should fail with invalid direction", () => {
      const data = {
        value: "5",
        direction: "invalid",
      };
      const validate = ajv.compile(kpiValueSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without value", () => {
      const data = {
        unitOfMeasure: "%",
      };
      const validate = ajv.compile(kpiValueSchema);
      expect(validate(data)).toBe(false);
    });
  });

  describe("kpiRowSchema", () => {
    it("should validate KPI row with label", () => {
      const data = {
        label: "P7D",
      };
      const validate = ajv.compile(kpiRowSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate KPI row with dynamic properties", () => {
      const data = {
        label: "P7D",
        mix: {
          value: "27.2",
          unitOfMeasure: "%",
        },
        vsLy: {
          value: "-0.4",
          unitOfMeasure: "pp",
          direction: "down",
        },
      };
      const validate = ajv.compile(kpiRowSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail without label", () => {
      const data = {
        mix: {
          value: "27.2",
        },
      };
      const validate = ajv.compile(kpiRowSchema);
      expect(validate(data)).toBe(false);
    });
  });

  describe("kpiTableSchema", () => {
    it("should validate complete KPI table", () => {
      const data = {
        header: [
          { id: "label", title: "" },
          { id: "mix", title: "TT ABI" },
          { id: "vsLy", title: "vs LY" },
        ],
        rows: [
          {
            label: "P7D",
            mix: { value: "27.2", unitOfMeasure: "%" },
            vsLy: { value: "-0.4", unitOfMeasure: "pp", direction: "down" },
          },
        ],
      };
      const validate = ajv.compile(kpiTableSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail without header", () => {
      const data = {
        rows: [{ label: "P7D" }],
      };
      const validate = ajv.compile(kpiTableSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without rows", () => {
      const data = {
        header: [{ id: "label", title: "" }],
      };
      const validate = ajv.compile(kpiTableSchema);
      expect(validate(data)).toBe(false);
    });
  });

  describe("categoryOverviewItemSchema", () => {
    it("should validate item with required fields", () => {
      const data = {
        title: "Beer Participation",
        kpi: {
          header: [{ id: "label", title: "" }],
          rows: [{ label: "P7D" }],
        },
      };
      const validate = ajv.compile(categoryOverviewItemSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate item with all fields", () => {
      const data = {
        title: "Beer Participation",
        versus: "vs Q3'24 YTD",
        kpi_name: "p7d",
        dateRefresh: "Q3'25",
        kpi: {
          header: [{ id: "label", title: "" }],
          rows: [{ label: "P7D" }],
        },
        footerInfo: "Non-Alc Beer",
        tooltip: "Tooltip text",
      };
      const validate = ajv.compile(categoryOverviewItemSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail without title", () => {
      const data = {
        kpi: {
          header: [{ id: "label", title: "" }],
          rows: [{ label: "P7D" }],
        },
      };
      const validate = ajv.compile(categoryOverviewItemSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without kpi", () => {
      const data = {
        title: "Beer Participation",
      };
      const validate = ajv.compile(categoryOverviewItemSchema);
      expect(validate(data)).toBe(false);
    });
  });

  describe("categoryOverviewArraySchema", () => {
    it("should validate array of category items", () => {
      const data = [
        {
          title: "Beer Participation",
          kpi: {
            header: [{ id: "label", title: "" }],
            rows: [{ label: "P7D" }],
          },
        },
        {
          title: "Superior Core",
          kpi: {
            header: [{ id: "label", title: "" }],
            rows: [{ label: "Vol" }],
          },
        },
      ];
      const validate = ajv.compile(categoryOverviewArraySchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail with empty array", () => {
      const validate = ajv.compile(categoryOverviewArraySchema);
      expect(validate([])).toBe(false);
    });

    it("should fail with non-array", () => {
      const validate = ajv.compile(categoryOverviewArraySchema);
      expect(validate({})).toBe(false);
    });
  });

  describe("categoryOverviewEmptySchema", () => {
    it("should validate empty state", () => {
      const data = {
        empty: true,
      };
      const validate = ajv.compile(categoryOverviewEmptySchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail when empty is false", () => {
      const data = {
        empty: false,
      };
      const validate = ajv.compile(categoryOverviewEmptySchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without empty", () => {
      const data = {
        title: "Test",
      };
      const validate = ajv.compile(categoryOverviewEmptySchema);
      expect(validate(data)).toBe(false);
    });
  });

  describe("categoryOverviewDataSchema", () => {
    it("should accept array of items", () => {
      const data = [
        {
          title: "Beer Participation",
          kpi: {
            header: [{ id: "label", title: "" }],
            rows: [{ label: "P7D" }],
          },
        },
      ];
      const validate = ajv.compile(categoryOverviewDataSchema);
      expect(validate(data)).toBe(true);
    });

    it("should accept empty state", () => {
      const data = {
        empty: true,
      };
      const validate = ajv.compile(categoryOverviewDataSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail with invalid structure", () => {
      const data = {
        invalid: "data",
      };
      const validate = ajv.compile(categoryOverviewDataSchema);
      expect(validate(data)).toBe(false);
    });
  });
});
