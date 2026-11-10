import { Injectable, Logger } from "@nestjs/common";
import { IViewConfigRepository } from "@domain/repositories/view-config.repository.interface";
import { ViewConfig } from "@domain/entities/view.entity";
import * as fs from "fs";
import * as path from "path";
import { createRequire } from "module";

@Injectable()
export class ViewConfigRepository implements IViewConfigRepository {
  private readonly logger = new Logger(ViewConfigRepository.name);
  private readonly require = createRequire(__filename);
  private readonly viewsPath = path.join(
    process.cwd(),
    "dist",
    "src",
    "domain",
    "config",
    "views",
  );

  async getByName(viewName: string): Promise<ViewConfig | null> {
    try {
      viewName = this.formatViewName(viewName);
      const configPath = path.join(this.viewsPath, `${viewName}.view.js`);

      if (!fs.existsSync(configPath)) {
        this.logger.warn(`View configuration not found for: ${viewName}`);
        return null;
      }

      if (process.env.NODE_ENV === "development")
        delete this.require.cache[this.require.resolve(configPath)];

      const configData = this.require(configPath);

      const config: ViewConfig = configData.default || configData;

      return config;
    } catch (error) {
      this.logger.error(
        `Error loading view configuration for ${viewName}: ${error.message}`,
      );
      return null;
    }
  }

  /**
   * Formats the view name to be used in the file system
   * @param viewName - The view name
   * @returns The formatted view name
   */
  private formatViewName(viewName: string): string {
    return viewName.replaceAll("_", "/");
  }
}
