import {
  VARIATION_DIRECTIONS,
  TITLE_SIZES,
  HEX_COLOR_PATTERN,
} from "../../constants/enums";

export const bigNumberSimpleSchema = {
  type: "number",
  description: "Simple numeric value for BigNumber component",
};

export const bigNumberComplexSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: {
      type: "string",
      minLength: 1,
      maxLength: 200,
      description: "BigNumber title",
    },
    measure: {
      type: "string",
      description: "Unit of measure",
    },
    tooltipContent: {
      type: "array",
      description: "Tooltip content (HeaderContentItem[])",
      items: {
        type: "object",
      },
    },
    empty: {
      type: "boolean",
      description: "Indicates if there is no data available",
    },
    bigNumber: {
      type: "number",
      description: "Main value to be displayed",
    },
    bigNumberUnit: {
      type: "string",
      description: "Unit of measure for the main value (pp, %, hl, number)",
    },
    bigNumberDirection: {
      type: "string",
      enum: VARIATION_DIRECTIONS,
      description: "Variation direction (up/down/neutral)",
    },
    bigNumberColor: {
      type: "string",
      pattern: HEX_COLOR_PATTERN,
      description:
        "BigNumber background color in hexadecimal (used in formatters)",
    },
    variation: {
      type: "number",
      description: "Variation value",
    },
    variationMeasure: {
      type: "string",
      description: "Variation unit of measure",
    },
    variationDirection: {
      type: "string",
      description: "Variation direction (enum or hex color)",
    },
    versus: {
      type: "string",
      description: "Comparison label (vs LY, vs LQ, etc)",
    },
    total: {
      type: "number",
      description: "Total or secondary value",
    },
    totalPrefix: {
      type: "string",
      description: "Total value prefix (e.g.: '#:')",
    },
    totalMeasure: {
      type: "string",
      description: "Total unit of measure (e.g.: '[%]')",
    },
    totalLabel: {
      type: "string",
      description: "Total value label",
    },
    totalUnitOfMeasureLabel: {
      type: "string",
      description: "Total unit of measure label",
    },
    period: {
      type: "string",
      description: "Data period",
    },
    divider: {
      type: "boolean",
      description: "Shows visual divider",
    },
    titleSize: {
      type: "string",
      enum: TITLE_SIZES,
      description: "Title size",
    },
    dateRefresh: {
      type: "string",
      description: "Last update date",
    },
    lastEstimated: {
      type: "string",
      description: "Last estimated date",
    },
    unavailable: {
      type: "boolean",
      description: "Indicates if the data is unavailable",
    },
  },
  oneOf: [
    {
      not: {
        anyOf: [{ required: ["empty"] }, { required: ["unavailable"] }],
      },
    },
    {
      required: ["empty"],
      properties: {
        empty: { const: true },
      },
    },
    {
      required: ["unavailable"],
      properties: {
        unavailable: { const: true },
      },
    },
  ],
};

export const bigNumberEmptySchema = {
  type: "object",
  required: ["empty"],
  additionalProperties: false,
  properties: {
    title: {
      type: "string",
      minLength: 1,
      maxLength: 200,
    },
    empty: { type: "boolean", const: true },
  },
  description: "BigNumber empty state",
};

export const bigNumberUnavailableSchema = {
  type: "object",
  required: ["unavailable"],
  additionalProperties: false,
  properties: {
    title: {
      type: "string",
      minLength: 1,
      maxLength: 200,
    },
    unavailable: { type: "boolean", const: true },
  },
  description: "BigNumber unavailable state",
};
