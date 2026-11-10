import {
  bigNumberValueSchema,
  bigNumberComparisonSchema,
  bigNumberSecondaryInfoSchema,
  bigNumberDemographicSchema,
} from "./primitives.schema";

export const bigNumberDataSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    audience: bigNumberDemographicSchema,
    bigNumber: bigNumberValueSchema,
    comparison: bigNumberComparisonSchema,
    secondaryInfo: bigNumberSecondaryInfoSchema,
  },
  description: "BigNumber data item - core reusable schema",
};

export interface BigNumberCardSchemaOptions {
  idEnum?: readonly string[];
  requiredFields?: string[];
  additionalProperties?: Record<string, unknown>;
  description?: string;
  dataFieldName?: string;
  minItems?: number;
  maxItems?: number;
  includeHasDeepDive?: boolean;
}

export const createBigNumberCardSchema = (
  options: BigNumberCardSchemaOptions = {},
) => {
  const {
    idEnum,
    requiredFields = ["bigNumberData"],
    additionalProperties = {},
    description = "BigNumber card schema",
    dataFieldName = "bigNumberData",
    minItems,
    maxItems,
    includeHasDeepDive = false,
  } = options;

  const dataArraySchema: Record<string, unknown> = {
    type: "array",
    items: bigNumberDataSchema,
    description: "Array of BigNumber data items",
  };

  if (minItems !== undefined) {
    dataArraySchema.minItems = minItems;
  }

  if (maxItems !== undefined) {
    dataArraySchema.maxItems = maxItems;
  }

  const baseProperties: Record<string, unknown> = {
    id: idEnum
      ? {
          type: "string",
          enum: idEnum,
          description: "Card identifier",
        }
      : {
          type: "string",
          description: "Card identifier",
        },
    title: {
      type: "string",
      minLength: 1,
      description: "Card title",
    },
    period: {
      type: "string",
      description: 'Formatted period string (e.g., "Q3\'25 - R12M")',
    },
    [dataFieldName]: dataArraySchema,
  };

  if (includeHasDeepDive) {
    baseProperties.hasDeepDive = {
      type: "boolean",
      description: "Indicates if the card has a deep dive feature",
    };
  }

  return {
    type: "object",
    required: requiredFields,
    additionalProperties: false,
    properties: {
      ...baseProperties,
      ...additionalProperties,
    },
    description,
  };
};

export const createBigNumberArraySchema = (
  cardSchema: ReturnType<typeof createBigNumberCardSchema>,
  options: {
    minItems?: number;
    maxItems?: number;
    description?: string;
  } = {},
) => {
  const {
    minItems,
    maxItems,
    description = "Array of BigNumber cards",
  } = options;

  const schema: Record<string, unknown> = {
    type: "array",
    items: cardSchema,
    description,
  };

  if (minItems !== undefined) {
    schema.minItems = minItems;
  }

  if (maxItems !== undefined) {
    schema.maxItems = maxItems;
  }

  return schema;
};
