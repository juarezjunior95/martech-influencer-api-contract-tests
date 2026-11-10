import {
  bigNumberDataSchema,
  createBigNumberCardSchema,
  createBigNumberArraySchema,
} from "./bigNumberData.schema";

export const consumerBehaviorCardSchema = createBigNumberCardSchema({
  requiredFields: ["title", "period", "bigNumberData"],
  dataFieldName: "bigNumberData",
  minItems: 1,
  description: "Individual Consumer Behavior card (e.g., 'Beer Participation')",
});

export const consumerBehaviorBigNumbersArraySchema = createBigNumberArraySchema(
  consumerBehaviorCardSchema,
  {
    minItems: 1,
    maxItems: 2,
    description:
      "Array of Consumer Behavior cards (Beer and ABI Participation)",
  },
);

export const consumerBehaviorBigNumbersSchema = {
  oneOf: [consumerBehaviorBigNumbersArraySchema],
  description: "Consumer Behavior Big Numbers main schema",
};

export { bigNumberDataSchema as consumerBehaviorBigNumberDataSchema };
export { bigNumberDataSchema as consumerBehaviorBigNumberDataItemSchema };
