import { Injectable, Logger } from "@nestjs/common";
import { EnvironmentConfigService } from "@common/config/environment-config.service";
import fs from "fs";
import path from "path";

/**
 * File Loader Service
 * Loads files from the filesystem and caches them for hot reloading
 */
@Injectable()
export class FileLoaderService {
  private readonly logger = new Logger(FileLoaderService.name);
  private readonly cache = new Map<string, unknown>();

  constructor(private readonly environmentConfig: EnvironmentConfigService) {}

  /**
   * Loads a file from the filesystem and caches it, keeping hot reloading capabilities.
   * @param filePath - Path to the file to load
   * @returns The loaded file content
   */
  async load<T>(filePath: string): Promise<T> {
    if (
      this.environmentConfig.env !== "development" &&
      this.cache.has(filePath)
    ) {
      return this.cache.get(filePath) as T;
    }

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    try {
      const content = await this.loadFileByExt<T>(filePath);
      this.cache.set(filePath, content);
      return content;
    } catch (error) {
      this.logger.error(`Failed to load file: ${filePath} - ${error.message}`);
      throw error;
    }
  }

  /**
   * Loads a file based on its extension.
   * @param filePath
   * @private
   */
  private async loadFileByExt<T>(filePath: string): Promise<T> {
    const ext = path.extname(filePath);

    switch (ext) {
      case ".ts":
      case ".js":
        const imported = await import(path.resolve(filePath));
        return (imported.default || imported) as T;

      case ".sql":
      default:
        return (await fs.promises.readFile(filePath, "utf8")) as T;
    }
  }
}
