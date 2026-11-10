import { UNIT_OF_MEASURE, HEX_COLOR_PATTERN } from "../constants/enums";

export const tableHeaderItemSchema = {
  type: "object",
  required: ["id", "title"],
  additionalProperties: false,
  properties: {
    id: {
      type: "string",
      minLength: 0,
      maxLength: 50,
      description: "Unique column ID (can be empty for label columns)",
    },
    title: {
      type: "string",
      minLength: 0,
      maxLength: 100,
      description: "Column title displayed in header",
    },
  },
};

export const tableHeaderSchema = {
  type: "array",
  minItems: 1,
  items: tableHeaderItemSchema,
  description: "Array of table headers (columns)",
};

export const variationSchema = {
  type: "object",
  required: ["unitOfMeasure", "variationDirection", "value"],
  additionalProperties: false,
  properties: {
    unitOfMeasure: {
      type: "string",
      enum: UNIT_OF_MEASURE,
      description: "Variation unit of measure",
    },
    variationDirection: {
      type: "string",
      pattern: HEX_COLOR_PATTERN,
      description:
        "Hexadecimal color indicating direction (green=up, red=down)",
    },
    value: {
      type: "number",
      description: "Numeric variation value",
    },
  },
};

export const tableCellValueSchema = {
  type: "object",
  required: ["value"],
  properties: {
    value: {
      oneOf: [{ type: "string" }, { type: "number" }, { type: "boolean" }],
      description: "Cell value (can be string, number or boolean)",
    },
  },
};

export const tableCellTypeSchema = {
  type: "object",
  required: ["value"],
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      minLength: 1,
      maxLength: 50,
      description: "Cell type (e.g.: 'abi', 'competitor', etc)",
    },
  },
};

export const tableRowsSchema = {
  type: "array",
  items: {
    type: "array",
    description: "Array of objects representing row cells",
    items: {
      type: "object",
      description:
        "Table cell - structure varies by column (id, type, variation, chartData, etc)",
    },
  },
  description: "Array of table rows",
};

export const tableDataSchema = {
  type: "object",
  required: ["header", "rows"],
  properties: {
    header: tableHeaderSchema,
    rows: tableRowsSchema,
  },
  description:
    "Complete table data structure (TableDataType) - header defines columns, rows contains data",
};
