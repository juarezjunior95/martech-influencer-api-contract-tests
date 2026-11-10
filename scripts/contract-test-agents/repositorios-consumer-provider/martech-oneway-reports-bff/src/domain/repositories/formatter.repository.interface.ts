import { DataSource } from "@domain/entities/view.entity";

/**
 * Formatter Repository Interface
 * Manages data formatting operations
 */
export interface IFormatterRepository {
  /**
   * Formats data using a specific formatter
   * @param formatter - Path and name of the formatter to use (e.g., 'example/overview/exampleSales')
   * @param data - Array of data sources to be formatted
   * @returns Promise with the formatted data
   */
  format(formatter: string, data: DataSource[]): Promise<any>;
}
