import { NotFoundException } from "@nestjs/common";
export declare class DatasourceNotFoundError extends NotFoundException {
    constructor(datasourceName: string);
}
