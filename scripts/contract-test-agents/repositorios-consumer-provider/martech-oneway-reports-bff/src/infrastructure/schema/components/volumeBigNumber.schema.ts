import { UNIT_OF_MEASURE } from "../constants/enums";

export const volumeBigNumberDataItemSchema = {
  type: "object",
  required: ["bigNumber", "comparison"],
  additionalProperties: false,
  properties: {
    bigNumber: {
      type: "object",
      required: ["value", "measure"],
      additionalProperties: false,
      properties: {
        value: {
          type: "string",
          description: "Formatted numeric value (e.g., '5.2', '-22.1', '-')",
        },
        measure: {
          type: "string",
          enum: UNIT_OF_MEASURE,
          description: "Unit of measure for the big number (%, pp, etc)",
        },
        trend: {
          type: "string",
          enum: ["positive", "negative"],
          description: "Trend indicator (optional)",
        },
      },
    },
    secondaryInfo: {
      type: "object",
      required: ["value"],
      additionalProperties: false,
      properties: {
        value: {
          type: "string",
          description: "Secondary info value (e.g., '5,573.4', '-')",
        },
        label: {
          type: "string",
          description: "Label for secondary info (e.g., '[ % ]')",
        },
      },
      description:
        "Optional secondary information (only for first comparison item)",
    },
    comparison: {
      type: "object",
      required: ["value"],
      additionalProperties: false,
      properties: {
        label: {
          type: "string",
          description: "Comparison label (e.g., 'vs')",
        },
        value: {
          type: "string",
          description: "Comparison value (e.g., 'LY', 'BU')",
        },
      },
    },
  },
  description:
    "Volume Performance Tool data item format - secondaryInfo is optional",
};

export const volumeBigNumberCardSchema = {
  type: "object",
  required: ["header", "data"],
  additionalProperties: false,
  properties: {
    header: {
      type: "object",
      required: ["title", "measure"],
      additionalProperties: false,
      properties: {
        title: {
          type: "string",
          description: "Card title (e.g., 'Volume YTD', 'Volume L3M')",
        },
        measure: {
          type: "string",
          description: "Unit of measure (e.g., '[ k hl ]')",
        },
      },
    },
    data: {
      type: "array",
      items: volumeBigNumberDataItemSchema,
      description: "Array of data items (can be empty, typically 0 or 2 items)",
    },
  },
  description: "Volume Performance Tool card format",
};

export const volumeBigNumbersArraySchema = {
  type: "array",
  items: volumeBigNumberCardSchema,
  minItems: 3,
  maxItems: 3,
  description:
    "Array of 3 volume performance tool big number cards (YTD, R3M, MTH)",
};

export const volumeBigNumbersSchema = {
  oneOf: [volumeBigNumbersArraySchema],
  description:
    "Volume big numbers data - array of 3 cards with optional secondaryInfo",
};
