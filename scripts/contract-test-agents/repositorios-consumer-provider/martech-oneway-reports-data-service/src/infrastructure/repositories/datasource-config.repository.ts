import { Injectable, Logger } from "@nestjs/common";
import { IDatasourceConfigRepository } from "@domain/repositories/datasource-config.repository.interface";
import { DatasourceConfig } from "@domain/entities/datasource.entity";
import path from "path";
import { FileLoaderService } from "@common/services/file-loader.service";

/**
 * Repository for loading datasource configurations from TypeScript files
 * Handles dynamic loading of datasource config files with in-memory caching
 */
@Injectable()
export class DatasourceConfigRepository implements IDatasourceConfigRepository {
  private readonly logger = new Logger(DatasourceConfigRepository.name);
  private readonly cache = new Map<string, DatasourceConfig>();

  constructor(private readonly fileLoaderService: FileLoaderService) {}

  /**
   * Gets datasource configuration by name
   * Loads from cache if available, otherwise loads from filesystem and caches it
   * @param datasourceName - Name of the datasource (e.g., "value-creation_portfolio-performance_overview_category-growth-levers_beyond-beer")
   * @returns Promise with DatasourceConfig
   */
  async getByName(datasourceName: string): Promise<DatasourceConfig> {
    return this.fileLoaderService.load<DatasourceConfig>(
      this.getConfigPath(datasourceName),
    );
  }

  /**
   * Gets the full path to a datasource config file
   * Converts underscores to slashes to build the correct path
   * @param datasourceName - The datasource name (e.g., "value-creation_portfolio-performance_overview_category-growth-levers_beyond-beer")
   * @returns Full path to the datasource config file
   */
  private getConfigPath(datasourceName: string): string {
    // Convert underscores to slashes for path construction
    const formattedPath = datasourceName.replaceAll("_", "/");

    return path.join(
      process.cwd(),
      "dist",
      "src",
      "domain",
      "config",
      "datasources",
      `${formattedPath}.datasource.js`,
    );
  }
}
