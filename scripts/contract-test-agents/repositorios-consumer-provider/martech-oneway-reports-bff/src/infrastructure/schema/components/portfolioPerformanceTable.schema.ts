import {
  VARIATION_DIRECTIONS,
  HEX_COLOR_PATTERN,
  DYNAMIC_PROPERTY_PATTERN,
} from "../constants/enums";

export const portfolioTableHeaderChildSchema = {
  type: "object",
  required: ["id", "title"],
  additionalProperties: false,
  properties: {
    id: {
      type: "string",
      minLength: 0,
      maxLength: 50,
      description: "Column identifier (can be empty for label columns)",
    },
    title: {
      type: "string",
      minLength: 0,
      maxLength: 100,
      description: "Column title",
    },
  },
};

export const portfolioTableHeaderSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      description: "Header identifier (optional for parent headers)",
    },
    title: {
      type: "string",
      description: "Header title",
    },
    subtitle: {
      type: "string",
      description: "Header subtitle (e.g., date period like 'Oct'25')",
    },
    dateEndStorageKey: {
      type: "string",
      description: "Storage key for date end reference",
    },
    children: {
      type: "array",
      items: portfolioTableHeaderChildSchema,
      description: "Nested column headers",
    },
  },
};

export const brandItemSchema = {
  type: "object",
  required: ["name"],
  additionalProperties: false,
  properties: {
    src: {
      type: "string",
      format: "uri",
      description: "Brand logo image URL",
    },
    name: {
      type: "string",
      minLength: 1,
      maxLength: 100,
      description: "Brand name",
    },
    variation: {
      type: "number",
      description: "Variation value",
    },
    variationMeasure: {
      type: "string",
      maxLength: 10,
      description: "Variation unit of measure (%, pp, etc)",
    },
    variationDirection: {
      type: "string",
      enum: VARIATION_DIRECTIONS,
      description: "Variation direction indicator",
    },
    country: {
      type: "string",
      minLength: 2,
      maxLength: 3,
      description: "Country code (USA, BRA, MEX, etc)",
    },
  },
};

export const portfolioTableCellValueSchema = {
  type: "object",
  required: ["value"],
  additionalProperties: false,
  properties: {
    value: {
      oneOf: [{ type: "string" }, { type: "number" }],
      description: "Cell value",
    },
    unitMeasure: {
      type: "string",
      maxLength: 10,
      description: "Unit of measure (%, pp, etc)",
    },
    variationDirection: {
      type: "string",
      pattern: HEX_COLOR_PATTERN,
      description: "Hexadecimal color for variation direction",
    },
    marginBottom: {
      type: "boolean",
      description: "Apply margin bottom styling",
    },
    radiusRight: {
      type: "boolean",
      description: "Apply right border radius styling",
    },
    radiusTop: {
      type: "boolean",
      description: "Apply top border radius styling",
    },
    brands: {
      type: "array",
      items: brandItemSchema,
      description: "Array of brand items (for Brands column)",
    },
  },
};

export const portfolioTableRowSchema = {
  type: "array",
  items: {
    type: "object",
    description: "Row cells - keys match header IDs",
    patternProperties: {
      [DYNAMIC_PROPERTY_PATTERN]: portfolioTableCellValueSchema,
    },
    additionalProperties: true,
  },
  description: "Array of row data",
};

export const portfolioTableSectionSchema = {
  type: "object",
  required: ["header", "rows"],
  additionalProperties: false,
  properties: {
    header: {
      type: "array",
      minItems: 1,
      items: portfolioTableHeaderSchema,
      description: "Section headers",
    },
    rows: {
      type: "array",
      items: portfolioTableRowSchema,
      description: "Section rows data",
    },
  },
  description: "Individual table section (Portfolio, Volume, etc)",
};

export const portfolioPerformanceTableDataSchema = {
  type: "object",
  properties: {
    Portfolio: portfolioTableSectionSchema,
    Volume: portfolioTableSectionSchema,
    "Net Revenue": portfolioTableSectionSchema,
    "S&M": portfolioTableSectionSchema,
    Brands: portfolioTableSectionSchema,
  },
  description:
    "Complete Portfolio Performance table data structure with multiple sections",
};
