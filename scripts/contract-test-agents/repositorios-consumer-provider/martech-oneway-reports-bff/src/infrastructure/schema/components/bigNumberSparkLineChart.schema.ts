import { HEX_COLOR_PATTERN } from "../constants/enums";

/**
 * Schema for BigNumber trend values
 */
const TREND_VALUES = ["positive", "negative"] as const;

/**
 * Schema for BigNumber period
 * Contains label and value for period display
 */
export const bigNumberPeriodSchema = {
  type: "object",
  required: ["label", "value"],
  additionalProperties: false,
  properties: {
    label: {
      type: "string",
      description: "Period label",
    },
    value: {
      type: "string",
      description: "Period value",
    },
  },
  description: "BigNumber period structure",
};

/**
 * Schema for BigNumber value object
 * Contains value, measure, color and trend
 */
export const bigNumberValueSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      oneOf: [{ type: "string" }, { type: "number" }],
      description: "BigNumber value (string or number)",
    },
    measure: {
      type: "string",
      description: "Unit of measure (e.g., '%', 'pp')",
    },
    color: {
      type: "string",
      pattern: HEX_COLOR_PATTERN,
      description: "Color in hexadecimal format",
    },
    trend: {
      type: "string",
      enum: TREND_VALUES,
      description: "Trend direction (positive/negative)",
    },
  },
  description: "BigNumber value structure",
};

/**
 * Schema for BigNumber comparison
 * Contains number object, label and value
 */
export const bigNumberComparisonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    number: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: {
          type: "string",
          description: "Comparison number value",
        },
        measure: {
          type: "string",
          description: "Comparison unit of measure",
        },
        color: {
          type: "string",
          pattern: HEX_COLOR_PATTERN,
          description: "Color in hexadecimal format",
        },
        trend: {
          type: "string",
          enum: TREND_VALUES,
          description: "Trend direction (positive/negative)",
        },
      },
      description: "Comparison number object",
    },
    label: {
      type: "string",
      description: "Comparison label (e.g., 'vs')",
    },
    value: {
      type: "string",
      description: "Comparison value (e.g., 'LY')",
    },
  },
  description: "BigNumber comparison structure",
};

/**
 * Schema for BigNumber secondary info
 * Contains value, measure, label and period
 */
export const bigNumberSecondaryInfoSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: "string",
      description: "Secondary info value",
    },
    measure: {
      type: "string",
      description: "Secondary info unit of measure",
    },
    label: {
      type: "string",
      description: "Secondary info label (e.g., '[ Mio ]')",
    },
    period: bigNumberPeriodSchema,
  },
  description: "BigNumber secondary info structure",
};

/**
 * Schema for BigNumber demographic (audience)
 * Contains gender, age and income bracket arrays
 */
export const bigNumberDemographicSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gender: {
      type: "array",
      items: { type: "string" },
      description: "Gender demographic filter",
    },
    age: {
      type: "array",
      items: { type: "string" },
      description: "Age demographic filter",
    },
    incomeBracket: {
      type: "array",
      items: { type: "string" },
      description: "Income bracket demographic filter",
    },
  },
  description: "BigNumber demographic/audience structure",
};

/**
 * Schema for BigNumber data item
 * Contains audience, bigNumber, comparison and secondaryInfo
 */
export const bigNumberDataItemSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    audience: bigNumberDemographicSchema,
    bigNumber: bigNumberValueSchema,
    comparison: bigNumberComparisonSchema,
    secondaryInfo: bigNumberSecondaryInfoSchema,
  },
  description: "BigNumber data item structure",
};

/**
 * Schema for BigNumber SparkLine Chart Card
 * Main component schema containing chartTitle, chartPeriod, bigNumberData and chartLineData
 */
export const bigNumberSparkLineChartSchema = {
  type: "object",
  required: ["chartTitle", "chartPeriod", "bigNumberData", "chartLineData"],
  additionalProperties: false,
  properties: {
    chartTitle: {
      type: "string",
      minLength: 1,
      description: "Chart title",
    },
    chartPeriod: {
      type: "string",
      description: 'Chart period label (e.g., "Dec\'25 - YTD")',
    },
    bigNumberData: {
      type: "array",
      items: bigNumberDataItemSchema,
      minItems: 1,
      description: "Array of BigNumber data items",
    },
    chartLineData: {
      type: "array",
      items: { type: "number" },
      description: "Array of numeric values for sparkline chart",
    },
  },
  description:
    "BigNumber SparkLine Chart Card structure for Trade Execution Home",
};
