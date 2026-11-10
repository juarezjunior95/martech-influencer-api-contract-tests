import { BadRequestException } from "@nestjs/common";
export declare class MissingRequiredFilterError extends BadRequestException {
    constructor(filterName: string, datasourceName: string);
}
