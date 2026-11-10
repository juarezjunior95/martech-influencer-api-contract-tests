import { NotFoundException } from "@nestjs/common";
export declare class ViewNotFoundError extends NotFoundException {
    constructor(viewName?: string);
}
