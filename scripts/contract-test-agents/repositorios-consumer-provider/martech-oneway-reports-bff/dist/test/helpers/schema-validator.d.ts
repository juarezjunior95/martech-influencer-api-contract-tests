export declare class SchemaValidator {
    private ajv;
    constructor();
    validate(data: any, schema: object): {
        valid: boolean;
        errors?: string;
    };
    exportToMatchSchema(data: any, schema: object): void;
}
