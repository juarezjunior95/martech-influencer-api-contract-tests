import * as winston from "winston";
import { AsyncLocalStorage } from "async_hooks";
import { HeaderContext } from "../interfaces/header-context.interface";
export declare const requestContextStorage: AsyncLocalStorage<HeaderContext>;
export declare const winstonContextFormat: winston.Logform.FormatWrap;
