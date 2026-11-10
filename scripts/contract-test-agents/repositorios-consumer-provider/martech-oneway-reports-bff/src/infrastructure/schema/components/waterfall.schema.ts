import { HEX_COLOR_PATTERN, UNIT_OF_MEASURE } from "../constants/enums";

export const comparisonLineDataItemSchema = {
  type: "object",
  required: ["value", "measure"],
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      description: "Comparison value (e.g., '1.1', '-1.1')",
    },
    measure: {
      type: "string",
      oneOf: [{ enum: UNIT_OF_MEASURE }, { const: "" }],
      description:
        "Unit of measure for the comparison value (%, pp, etc) or empty string",
    },
    color: {
      type: "string",
      oneOf: [{ pattern: HEX_COLOR_PATTERN }, { const: "" }],
      description:
        "Color code in hexadecimal format (e.g., '#007800', '#A20A0A', '#5C5C5C') or empty string",
    },
    trend: {
      type: "string",
      enum: ["positive", "negative", "neutral", ""],
      description:
        "Trend direction (e.g., 'positive', 'negative') or empty string",
    },
  },
  description: "Single data point in a comparison line",
};

export const comparisonLineSchema = {
  type: "object",
  required: ["title", "data"],
  additionalProperties: false,
  properties: {
    title: {
      type: "string",
      minLength: 1,
      maxLength: 200,
      description:
        "Comparison line title (e.g., 'Vol. % vs LY', 'Vol. Growth Contrib.')",
    },
    data: {
      type: "array",
      items: comparisonLineDataItemSchema,
      minItems: 1,
      description: "Array of comparison data points",
    },
  },
  description: "Single comparison line with title and data points",
};

export const brandImageSchema = {
  type: "object",
  required: ["mainBrand", "title"],
  additionalProperties: false,
  properties: {
    mainBrand: {
      type: "object",
      required: ["src", "alt"],
      additionalProperties: false,
      properties: {
        src: {
          type: "string",
          description: "Image source URL",
        },
        alt: {
          type: "string",
          minLength: 1,
          maxLength: 200,
          description: "Alternative text for the brand image",
        },
      },
      description: "Main brand image information",
    },
    title: {
      type: "string",
      minLength: 1,
      maxLength: 200,
      description: "Brand image label",
    },
    badgeFlag: {
      type: "object",
      required: ["src", "alt"],
      additionalProperties: false,
      properties: {
        src: {
          type: "string",
          description: "Badge / flag image source URL",
        },
        alt: {
          type: "string",
          minLength: 1,
          maxLength: 200,
          description: "Alternative text for the badge image",
        },
      },
      description: "Optional secondary badge or flag image",
    },
  },
  description: "Brand image with main brand and label",
};

export const connectorSchema = {
  type: "object",
  required: ["value", "from", "to", "backgroundColor", "textColor", "measure"],
  additionalProperties: false,
  properties: {
    value: {
      type: "number",
      description: "Connector value (can be positive or negative)",
    },
    from: {
      type: "string",
      minLength: 1,
      maxLength: 100,
      description: "Source label for the connector (e.g., 'Vol. 24'FY')",
    },
    to: {
      type: "string",
      minLength: 1,
      maxLength: 100,
      description: "Target label for the connector (e.g., 'Vol. 25'LE')",
    },
    backgroundColor: {
      type: "string",
      pattern: HEX_COLOR_PATTERN,
      description:
        "Background color code in hexadecimal format (e.g., '#FFE6E6')",
    },
    textColor: {
      type: "string",
      pattern: HEX_COLOR_PATTERN,
      description: "Text color code in hexadecimal format (e.g., '#BA0B0B')",
    },
    measure: {
      type: "string",
      oneOf: [{ enum: UNIT_OF_MEASURE }, { const: "" }],
      description:
        "Unit of measure for the connector value (%, pp, etc) or empty string",
    },
  },
  description: "Connector object linking two data points with styling",
};

export const clickableIndexesSchemaItem = {
  type: "object",
  required: ["index", "value"],
  additionalProperties: false,
  properties: {
    index: {
      type: "number",
      description: "Clickable index",
    },
    value: {
      type: "string",
      description: "Clickable value (e.g., 'y1', 'y2', 'y3', 'y4', 'y5')",
    },
  },
  description: "Clickable index and value",
};

export const waterfallDataSchema = {
  type: "object",
  anyOf: [{ required: ["data", "labels"] }, { required: ["values", "labels"] }],
  additionalProperties: false,
  properties: {
    data: {
      type: "array",
      items: {
        type: "number",
      },
      minItems: 1,
      description:
        "Array of numeric values for waterfall data points (can be positive or negative)",
    },
    values: {
      type: "array",
      items: {
        type: "number",
      },
      minItems: 1,
      description:
        "Array of numeric values for waterfall data points (alternative to data)",
    },
    labels: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
        maxLength: 100,
      },
      minItems: 1,
      description:
        "Array of labels for each data point (e.g., years, periods, identifiers)",
    },
    comparisonLineData: {
      type: "array",
      items: comparisonLineSchema,
      description: "Optional array of comparison lines with their data points",
    },
    comparisonLine: {
      type: "object",
      additionalProperties: false,
      properties: {
        data: {
          type: "array",
          items: comparisonLineSchema,
          description: "Array of comparison lines with title and data points",
        },
      },
      description:
        "Optional comparison line wrapper with data array (alternative to comparisonLineData)",
    },
    brandsImg: {
      type: "array",
      items: brandImageSchema,
      description: "Optional array of brand images associated with data points",
    },
    images: {
      type: "object",
      additionalProperties: false,
      properties: {
        data: {
          type: "array",
          items: brandImageSchema,
          description: "Array of brand images",
        },
      },
      description:
        "Optional images wrapper with data array (alternative to brandsImg)",
    },
    formattedData: {
      type: "array",
      items: {
        type: "array",
        items: {
          type: "string",
        },
      },
      description: "Formatted values for display (e.g., '46.3K', '1.2M')",
    },
    specialIndexes: {
      type: "object",
      required: ["first", "last", "retained"],
      additionalProperties: false,
      properties: {
        first: {
          type: "number",
          description: "First index",
        },
        last: {
          type: "number",
          description: "Last index",
        },
        retained: {
          type: "number",
          description: "Retained index",
        },
      },
    },
    clickableIndexes: {
      type: "array",
      items: clickableIndexesSchemaItem,
      minItems: 1,
      description:
        "Array of clickable indexes and values (e.g., [{index: 0, value: 'y1'}, {index: 1, value: 'y2'}, {index: 2, value: 'y3'}, {index: 3, value: 'y4'}, {index: 4, value: 'y5'}])",
    },
    connector: {
      ...connectorSchema,
    },
  },
  description:
    "Complete waterfall component data structure with main data, labels, comparison lines, brand images, and connector",
};
