import { INNOVATION_CARD_IDS } from "../../constants/enums";
import {
  bigNumberDataSchema,
  createBigNumberCardSchema,
  createBigNumberArraySchema,
} from "./bigNumberData.schema";

export const innovationBigNumberDataItemSchema = bigNumberDataSchema;
export const bigNumberDataItemSchema = bigNumberDataSchema;

export const innovationBigNumberCardSchema = createBigNumberCardSchema({
  idEnum: INNOVATION_CARD_IDS,
  requiredFields: ["id", "hasDeepDive", "data"],
  dataFieldName: "data",
  includeHasDeepDive: true,
  description: "Single card in the innovation big numbers output",
});

export const innovationBigNumbersArraySchema = createBigNumberArraySchema(
  innovationBigNumberCardSchema,
  {
    minItems: 1,
    description: "Array of innovation big number cards",
  },
);

export const innovationBigNumbersSchema = {
  oneOf: [innovationBigNumbersArraySchema],
  description: "Innovation big numbers data - array of cards",
};
