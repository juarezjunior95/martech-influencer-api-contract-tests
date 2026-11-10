import * as winston from "winston";
import { AsyncLocalStorage } from "async_hooks";
import { HeaderContext } from "@common/interfaces/header-context.interface";

// AsyncLocalStorage to store request context
export const requestContextStorage = new AsyncLocalStorage<HeaderContext>();

/**
 * Custom Winston format to add requestTraceId and country to logs
 */
export const winstonContextFormat = winston.format((info) => {
  const context = requestContextStorage.getStore();
  if (!context) {
    return info;
  }

  if (context.requestTraceId) {
    info.requestTraceId = context.requestTraceId;
  }
  if (context.country) {
    info.country = context.country;
  }

  return info;
});
