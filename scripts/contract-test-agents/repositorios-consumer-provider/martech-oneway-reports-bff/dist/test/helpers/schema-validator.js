"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaValidator = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
class SchemaValidator {
    constructor() {
        this.ajv = new ajv_1.default({
            allErrors: true,
            strict: false,
            verbose: true,
        });
        (0, ajv_formats_1.default)(this.ajv);
    }
    validate(data, schema) {
        const validate = this.ajv.compile(schema);
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
    exportToMatchSchema(data, schema) {
        const result = this.validate(data, schema);
        if (!result.valid) {
            throw new Error(result.errors);
        }
    }
}
exports.SchemaValidator = SchemaValidator;
//# sourceMappingURL=schema-validator.js.map