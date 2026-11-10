import { ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { Response } from "express";
export declare const INTERNAL_SERVER_ERROR_MESSAGE = "Internal server error. Please try again later. Contact support if the error persists.";
export declare class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): Response<any, Record<string, any>>;
    private extractErrorData;
}
