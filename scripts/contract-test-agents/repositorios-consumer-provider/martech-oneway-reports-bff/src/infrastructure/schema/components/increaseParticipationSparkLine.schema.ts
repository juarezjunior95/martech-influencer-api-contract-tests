export { bigNumberDataSchema as increaseParticipationBigNumberDataItemSchema } from "./big-number";

import { bigNumberDataSchema } from "./big-number";

export const increaseParticipationSparkLineSchema = {
  type: "object",
  required: ["chartTitle", "chartPeriod", "bigNumberData", "chartLineData"],
  additionalProperties: false,
  properties: {
    chartTitle: {
      type: "string",
      minLength: 1,
      description: "Chart title (e.g., 'P4W Participation')",
    },
    chartPeriod: {
      type: "string",
      description: 'Formatted period string (e.g., "Q3\'25 - R12M")',
    },
    bigNumberData: {
      type: "array",
      items: bigNumberDataSchema,
      minItems: 1,
      maxItems: 1,
      description: "Array with a single BigNumber data item",
    },
    chartLineData: {
      type: "array",
      items: { type: "number" },
      minItems: 1,
      description: "Sparkline numeric data points",
    },
  },
  description: "Increase Participation BigNumber SparkLine data",
};
