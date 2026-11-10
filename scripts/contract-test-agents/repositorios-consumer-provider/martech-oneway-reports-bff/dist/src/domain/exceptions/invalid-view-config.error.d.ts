import { UnprocessableEntityException } from "@nestjs/common";
export declare class InvalidViewConfigError extends UnprocessableEntityException {
    constructor(message: string);
}
