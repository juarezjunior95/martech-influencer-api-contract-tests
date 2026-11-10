import { HeaderContext } from "./header-context.interface";

/**
 * Service interface for managing header context throughout request lifecycle
 */
export interface IHeaderContextService {
  /**
   * Sets the header context for the current request
   * @param context - The header context to store
   */
  setHeaderContext(context: HeaderContext): void;

  /**
   * Gets the current header context
   * @returns The current header context or null if not set
   */
  getHeaderContext(): HeaderContext | null;

  /**
   * Gets the request trace ID from the current header context
   * @returns The request trace ID or undefined if not set
   */
  getRequestTraceId(): string | undefined;

  /**
   * Gets the country from the current header context
   * @returns The country or undefined if not set
   */
  getCountry(): string | undefined;
}
