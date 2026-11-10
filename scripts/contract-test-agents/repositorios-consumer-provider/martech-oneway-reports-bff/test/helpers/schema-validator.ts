import Ajv, { ValidateFunction } from "ajv";
import addFormats from "ajv-formats";

export class SchemaValidator {
  private ajv: Ajv;

  constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      strict: false,
      verbose: true,
    });
    addFormats(this.ajv);
  }

  validate(data: any, schema: object): { valid: boolean; errors?: string } {
    const validate: ValidateFunction = this.ajv.compile(schema);
    const valid = validate(data);

    if (!valid) {
      const errorMessages = validate.errors
        ?.map((err) => `${err.instancePath || "root"} ${err.message}`)
        .join("\n");
      return {
        valid: false,
        errors: `Schema validation failed: ${errorMessages}`,
      };
    }
    return { valid: true };
  }
  exportToMatchSchema(data: any, schema: object) {
    const result = this.validate(data, schema);
    if (!result.valid) {
      throw new Error(result.errors);
    }
  }
}
