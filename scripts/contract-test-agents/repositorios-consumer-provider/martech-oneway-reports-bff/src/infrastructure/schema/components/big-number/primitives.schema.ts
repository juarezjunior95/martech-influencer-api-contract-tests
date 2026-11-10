import { HEX_COLOR_PATTERN, TREND_VALUES } from "../../constants/enums";

export const bigNumberDemographicSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gender: {
      type: "array",
      items: { type: "string" },
      description: "Gender filter values",
    },
    age: {
      type: "array",
      items: { type: "string" },
      description: "Age range filter values",
    },
    incomeBracket: {
      type: "array",
      items: { type: "string" },
      description: "Income bracket filter values",
    },
  },
  description: "Demographic audience segmentation",
};

export const bigNumberValueSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: ["string", "number"],
      description: "Main value to display (e.g., '21.1', 4.5, '-')",
    },
    measure: {
      type: "string",
      description: "Unit of measure (e.g., '%', 'pp', 'mm')",
    },
    color: {
      type: "string",
      pattern: HEX_COLOR_PATTERN,
      description: "Color in hexadecimal format (e.g., '#007800')",
    },
    trend: {
      type: "string",
      enum: TREND_VALUES,
      description: "Trend direction: 'positive' or 'negative'",
    },
  },
  description: "BigNumber main value display",
};

export const bigNumberPeriodSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: {
      type: "string",
      description: "Period label (e.g., 'Q3')",
    },
    value: {
      type: "string",
      description: "Period value (e.g., '2025')",
    },
  },
  description: "Period information with label and value",
};

export const bigNumberSecondaryInfoSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      description: "Secondary value (e.g., '1,234.5')",
    },
    measure: {
      type: "string",
      description: "Unit of measure (e.g., 'mm', '%')",
    },
    label: {
      type: "string",
      description: "Label for the secondary value (e.g., '[ mm ]')",
    },
    period: bigNumberPeriodSchema,
  },
  description: "Secondary information display",
};

export const bigNumberComparisonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    number: {
      ...bigNumberValueSchema,
      description: "Optional BigNumber for comparison value",
    },
    label: {
      type: "string",
      description: "Comparison label (e.g., 'vs')",
    },
    value: {
      type: "string",
      description: "Comparison value (e.g., 'LY', 'YTD')",
    },
  },
  description: "Comparison information with optional BigNumber",
};
