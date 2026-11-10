import Ajv from "ajv";
import addFormats from "ajv-formats";
import {
  tableHeaderItemSchema,
  tableHeaderSchema,
  variationSchema,
  tableCellValueSchema,
  tableCellTypeSchema,
  tableRowsSchema,
  tableDataSchema,
} from "@infrastructure/schema/components/table.schema";

describe("Table Schemas", () => {
  let ajv: Ajv;

  beforeAll(() => {
    ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
  });

  describe("tableHeaderItemSchema", () => {
    it("should validate header item with id and title", () => {
      const data = {
        id: "column1",
        title: "Column 1",
      };
      const validate = ajv.compile(tableHeaderItemSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail without required id", () => {
      const data = {
        title: "Column 1",
      };
      const validate = ajv.compile(tableHeaderItemSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without required title", () => {
      const data = {
        id: "column1",
      };
      const validate = ajv.compile(tableHeaderItemSchema);
      expect(validate(data)).toBe(false);
    });
  });

  describe("tableHeaderSchema", () => {
    it("should validate array of header items", () => {
      const data = [
        { id: "col1", title: "Column 1" },
        { id: "col2", title: "Column 2" },
        { id: "col3", title: "Column 3" },
      ];
      const validate = ajv.compile(tableHeaderSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail with empty array", () => {
      const validate = ajv.compile(tableHeaderSchema);
      expect(validate([])).toBe(false);
    });

    it("should fail with non-array", () => {
      const validate = ajv.compile(tableHeaderSchema);
      expect(validate({})).toBe(false);
      expect(validate("header")).toBe(false);
    });
  });

  describe("variationSchema", () => {
    it("should validate complete variation object", () => {
      const data = {
        unitOfMeasure: "pp",
        variationDirection: "#49764B",
        value: 2.5,
      };
      const validate = ajv.compile(variationSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate unitOfMeasure enum values", () => {
      const validate = ajv.compile(variationSchema);
      const units = ["pp", "%", "hl", "number"];

      units.forEach((unit) => {
        const data = {
          unitOfMeasure: unit,
          variationDirection: "#49764B",
          value: 5,
        };
        expect(validate(data)).toBe(true);
      });
    });

    it("should fail with invalid unitOfMeasure", () => {
      const data = {
        unitOfMeasure: "invalid",
        variationDirection: "#49764B",
        value: 5,
      };
      const validate = ajv.compile(variationSchema);
      expect(validate(data)).toBe(false);
    });

    it("should validate variationDirection hex color", () => {
      const validate = ajv.compile(variationSchema);
      const colors = ["#49764B", "#A20A0A", "#000000", "#FFFFFF"];

      colors.forEach((color) => {
        const data = {
          unitOfMeasure: "pp",
          variationDirection: color,
          value: 5,
        };
        expect(validate(data)).toBe(true);
      });
    });

    it("should fail with invalid color format", () => {
      const validate = ajv.compile(variationSchema);

      expect(
        validate({
          unitMeasure: "pp",
          variationDirection: "green",
          value: 5,
        }),
      ).toBe(false);
      expect(
        validate({
          unitMeasure: "pp",
          variationDirection: "#FFF",
          value: 5,
        }),
      ).toBe(false);
    });

    it("should fail without required fields", () => {
      const validate = ajv.compile(variationSchema);

      expect(
        validate({ unitMeasure: "pp", variationDirection: "#49764B" }),
      ).toBe(false);
      expect(validate({ unitMeasure: "pp", value: 5 })).toBe(false);
      expect(validate({ variationDirection: "#49764B", value: 5 })).toBe(false);
    });
  });

  describe("tableCellValueSchema", () => {
    it("should validate cell with string value", () => {
      const data = { value: "Test" };
      const validate = ajv.compile(tableCellValueSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate cell with number value", () => {
      const data = { value: 100 };
      const validate = ajv.compile(tableCellValueSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate cell with boolean value", () => {
      const validate = ajv.compile(tableCellValueSchema);
      expect(validate({ value: true })).toBe(true);
      expect(validate({ value: false })).toBe(true);
    });

    it("should require value property", () => {
      const validate = ajv.compile(tableCellValueSchema);
      expect(validate({})).toBe(false);
      expect(validate({ value: "test" })).toBe(true);
    });
  });

  describe("tableCellTypeSchema", () => {
    it("should validate cell type", () => {
      const validate = ajv.compile(tableCellTypeSchema);
      expect(validate({ value: "abi" })).toBe(true);
      expect(validate({ value: "competitor" })).toBe(true);
      expect(validate({ value: "custom" })).toBe(true);
    });

    it("should fail without value", () => {
      const validate = ajv.compile(tableCellTypeSchema);
      expect(validate({})).toBe(false);
    });

    it("should fail with non-string value", () => {
      const validate = ajv.compile(tableCellTypeSchema);
      expect(validate({ value: 123 })).toBe(false);
      expect(validate({ value: true })).toBe(false);
    });
  });

  describe("tableRowsSchema", () => {
    it("should validate empty rows array", () => {
      const validate = ajv.compile(tableRowsSchema);
      expect(validate([])).toBe(true);
    });

    it("should validate rows with data", () => {
      const data = [
        [{ id: { value: "Item 1" } }, { value: { value: 100 } }],
        [{ id: { value: "Item 2" } }, { value: { value: 200 } }],
      ];
      const validate = ajv.compile(tableRowsSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail with non-array", () => {
      const validate = ajv.compile(tableRowsSchema);
      expect(validate({})).toBe(false);
      expect(validate("rows")).toBe(false);
    });
  });

  describe("tableDataSchema", () => {
    it("should validate complete table structure", () => {
      const data = {
        header: [
          { id: "col1", title: "Column 1" },
          { id: "col2", title: "Column 2" },
        ],
        rows: [
          [{ col1: { value: "A" } }, { col2: { value: 1 } }],
          [{ col1: { value: "B" } }, { col2: { value: 2 } }],
        ],
      };
      const validate = ajv.compile(tableDataSchema);
      expect(validate(data)).toBe(true);
    });

    it("should validate table with empty rows", () => {
      const data = {
        header: [{ id: "col1", title: "Column 1" }],
        rows: [],
      };
      const validate = ajv.compile(tableDataSchema);
      expect(validate(data)).toBe(true);
    });

    it("should fail without header", () => {
      const data = {
        rows: [],
      };
      const validate = ajv.compile(tableDataSchema);
      expect(validate(data)).toBe(false);
    });

    it("should fail without rows", () => {
      const data = {
        header: [{ id: "col1", title: "Column 1" }],
      };
      const validate = ajv.compile(tableDataSchema);
      expect(validate(data)).toBe(false);
    });
  });
});
