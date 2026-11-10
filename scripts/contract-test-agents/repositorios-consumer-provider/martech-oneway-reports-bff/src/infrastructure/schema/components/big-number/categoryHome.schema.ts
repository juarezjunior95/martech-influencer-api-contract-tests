import {
  bigNumberDataSchema,
  createBigNumberCardSchema,
  createBigNumberArraySchema,
} from "./bigNumberData.schema";

export const categoryHomeSparkLineCardSchema = createBigNumberCardSchema({
  requiredFields: [
    "chartTitle",
    "chartPeriod",
    "bigNumberData",
    "chartLineData",
  ],
  dataFieldName: "bigNumberData",
  minItems: 1,
  maxItems: 1,
  additionalProperties: {
    chartTitle: {
      type: "string",
      minLength: 1,
      description: "Chart title (e.g., 'Beer Category Participation')",
    },
    chartPeriod: {
      type: "string",
      description: 'Chart period label (e.g., "Q3\'25 - R12M", "Nov\'25 YTD")',
    },
    chartLineData: {
      type: "array",
      items: { type: "number" },
      description: "Array of numeric values for sparkline chart",
    },
  },
  description:
    "Category Home SparkLine Card (BigNumber + Sparkline) for Grow/Lead the Category",
});

export const categoryHomeSparkLineArraySchema = createBigNumberArraySchema(
  categoryHomeSparkLineCardSchema,
  {
    minItems: 1,
    maxItems: 2,
    description:
      "Array of Category Home SparkLine Cards (Grow the Category and Lead the Category)",
  },
);

export const categoryHomeSparkLineSchema = {
  oneOf: [categoryHomeSparkLineArraySchema],
  description: "Category Home SparkLine main schema",
};

export { bigNumberDataSchema as categoryHomeSparkLineBigNumberDataSchema };
export { bigNumberDataSchema as categoryHomeSparkLineBigNumberDataItemSchema };
