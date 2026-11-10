import {
  bigNumberComparisonSchema,
  bigNumberSecondaryInfoSchema,
} from "./big-number";

const targetAudiencesBigNumberValueSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: {
      type: ["string", "number"],
      description: "Main value to display (e.g., '140.4', '-')",
    },
    measure: {
      type: "string",
      description: "Unit of measure (always empty string for target-audiences)",
    },
    trend: {
      type: "string",
      enum: ["positive", "negative", ""],
      description:
        "Trend direction: 'positive', 'negative', or '' (empty for zero)",
    },
  },
  description: "BigNumber value display with 3-state trend",
};

const targetAudiencesBigNumberDataItemSchemaObj = {
  type: "object",
  additionalProperties: false,
  properties: {
    bigNumber: targetAudiencesBigNumberValueSchema,
    comparison: bigNumberComparisonSchema,
    secondaryInfo: bigNumberSecondaryInfoSchema,
  },
  description: "Target Audiences BigNumber data item",
};

export const targetAudiencesBigNumberDataItemSchema =
  targetAudiencesBigNumberDataItemSchemaObj;

export const targetAudiencesSchema = {
  type: "object",
  required: ["title", "description", "period", "bigNumberData"],
  additionalProperties: false,
  properties: {
    title: {
      type: "string",
      minLength: 1,
      description: "Card title (always 'Participation index')",
    },
    description: {
      type: "string",
      description: "Card description (always 'Core Audience vs Total')",
    },
    period: {
      type: "string",
      description: 'Formatted period string (e.g., "Q4\'25 - R12M")',
    },
    bigNumberData: {
      type: "array",
      items: targetAudiencesBigNumberDataItemSchemaObj,
      minItems: 1,
      maxItems: 1,
      description: "Array with a single BigNumber data item",
    },
  },
  description: "Target Audiences Participation Index data",
};
